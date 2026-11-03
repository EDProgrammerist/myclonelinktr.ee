import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
test('touch feedback does not leave desktop hover stuck', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('.link-card').first()
  await expect(card).toBeVisible()
  await page.waitForTimeout(800)
  await card.evaluate(el => el.addEventListener('click', event => event.preventDefault()))
  const before = await card.evaluate(el => getComputedStyle(el).borderColor)
  await card.tap()
  await page.waitForTimeout(350)
  expect(await card.evaluate(el => getComputedStyle(el).borderColor)).toBe(before)
  expect(await card.locator('.link-arrow').evaluate(el => getComputedStyle(el).transform)).toBe('none')
})

test('enabling reduced motion finishes active terminal immediately', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0, { timeout: 300 })
  await expect(page.locator('.boot-lines')).toHaveText('>> developer\n>> cybersecurity\n>> always learning')
})

test('three themes are selectable and persisted without replacing content', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Matrix Green' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Cyber Blue' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Cyber Blue' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Crimson Red' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'red')
  await page.getByRole('button', { name: 'Matrix Green' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'green')
})

for (const width of [320, 375, 390, 430, 1440]) {
  test(`all themes preserve layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const geometry = () => page.locator('.avatar-ring,h1,.link-card,.terminal-footer').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().toJSON()))
    const original = await geometry()
    for (const [name, accent] of [['Cyber Blue', '#38bdf8'], ['Crimson Red', '#ff536a'], ['Matrix Green', '#00ff88']]) {
      await page.getByRole('button', { name, exact: true }).click()
      expect(await geometry()).toEqual(original)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().replace(/^#([\da-f])([\da-f])([\da-f])$/i, '#$1$1$2$2$3$3'))).toBe(accent)
      expect(await page.locator('.online').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(0, 255, 136)')
      expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0)
    }
  })

  test(`Green matches original pixels at ${width}px outside the added selector`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Original baselines captured in Chromium')
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.avatar-ring img').evaluate(img => (img as HTMLImageElement).decode())
    await page.addStyleTag({ content: '.theme-switcher { visibility: hidden !important; }' })
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${width}.png`, { maxDiffPixels: 10 })
  })
}

test('switching does not remount, restart animations, navigate, or reset scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0)
  const boot = await page.locator('.boot-lines').elementHandle()
  const heading = await page.locator('h1').elementHandle()
  await page.evaluate(() => window.scrollTo(0, 100))
  const scroll = await page.evaluate(() => scrollY)
  expect(scroll).toBeGreaterThan(0)
  for (const name of ['Cyber Blue', 'Crimson Red', 'Matrix Green']) {
    await page.getByRole('button', { name, exact: true }).dispatchEvent('click')
    expect(await page.evaluate(() => scrollY)).toBe(scroll)
    expect(await boot!.evaluate(el => el === document.querySelector('.boot-lines'))).toBe(true)
    expect(await heading!.evaluate(el => el === document.querySelector('h1'))).toBe(true)
    await expect(page.locator('.boot-lines')).toHaveText('>> developer\n>> cybersecurity\n>> always learning')
    await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0)
    expect(await page.locator('.link-card').evaluateAll(els => els.every(el => getComputedStyle(el).opacity === '1'))).toBe(true)
  }
})

test('theme changes during boot preserve progress', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toBeVisible()
  const boot = await page.locator('.boot-lines').elementHandle()
  const length = (await page.locator('.boot-lines').innerText()).length
  await page.getByRole('button', { name: 'Cyber Blue' }).click()
  expect(await boot!.evaluate(el => el === document.querySelector('.boot-lines'))).toBe(true)
  expect((await page.locator('.boot-lines').innerText()).length).toBeGreaterThanOrEqual(length)
  await page.getByRole('button', { name: 'Skip', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0)
})

test('invalid storage defaults to Green', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cyber-terminal-theme', 'invalid-value'))
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Matrix Green' })).toHaveAttribute('aria-pressed', 'true')
})

test('unavailable storage does not prevent switching', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
  })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('button', { name: 'Crimson Red' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'red')
  expect(errors).toEqual([])
})

test('saved theme is applied before the app module renders', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cyber-terminal-theme', 'red'))
  await page.route(/\/(src\/main\.tsx|assets\/index-[^/]+\.js)(\?.*)?$/, async route => {
    await new Promise(resolve => setTimeout(resolve, 700))
    await route.continue()
  })
  await page.goto('/', { waitUntil: 'commit' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'red')
  expect(await page.locator('.hub').count()).toBe(0)
  await expect(page.getByRole('button', { name: 'Crimson Red' })).toHaveAttribute('aria-pressed', 'true')
})

test('keyboard can reach and activate each selector with visible focus', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Skip to links' })).toBeAttached()
  await page.keyboard.press('Tab')
  // WebKit's native tab preference skips links, but includes buttons.
  if (browserName !== 'webkit') {
    await expect(page.locator(':focus')).toHaveText('Skip to links')
    await page.keyboard.press('Tab')
  }
  for (const name of ['Matrix Green', 'Cyber Blue', 'Crimson Red']) {
    if (name !== 'Matrix Green') await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveAttribute('aria-label', name)
    expect(await page.locator(':focus').evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid')
    await page.keyboard.press('Enter')
    await expect(page.locator(':focus')).toHaveAttribute('aria-pressed', 'true')
  }
})

test('mobile animation progresses and settles without runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await page.locator('.boot-lines').waitFor({ state: 'attached' })
  const samples: { boot: string; heading: string; opacity: number }[] = []
  for (let i = 0; i < 6; i++) {
    samples.push(await page.evaluate(() => ({
      boot: document.querySelector('.boot-lines')!.textContent!,
      heading: document.querySelector('h1 [aria-hidden]')!.textContent!,
      opacity: Number(getComputedStyle(document.querySelector('.link-card')!).opacity),
    })))
    await page.waitForTimeout(100)
  }
  expect(new Set(samples.map(s => s.boot)).size).toBeGreaterThan(1)
  expect(new Set(samples.map(s => s.heading)).size).toBeGreaterThan(1)
  expect(samples.some(s => s.opacity < 1)).toBe(true)
  await expect(page.locator('h1 [aria-hidden]')).toHaveText('Ed James')
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0)
  expect(await page.evaluate(() => document.getAnimations().some(a => a.playState === 'running'))).toBe(true)
  expect(errors).toEqual([])
})


test('animation fallback works without CSS property registration or linear easing', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(CSS, 'registerProperty', { value: undefined, configurable: true })
    const animate = Element.prototype.animate
    Element.prototype.animate = function (keyframes, options) {
      if (typeof options === 'object' && options?.easing?.startsWith('linear(')) {
        throw new TypeError('linear() easing unavailable')
      }
      return animate.call(this, keyframes, options)
    }
  })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('h1 [aria-hidden]')).toHaveText('Ed James')
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0)
  expect(await page.locator('.link-card').evaluateAll(els => els.every(el => getComputedStyle(el).opacity === '1'))).toBe(true)
  expect(errors).toEqual([])
})

test('readable text retains AA contrast in each theme', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const name of ['Matrix Green', 'Cyber Blue', 'Crimson Red']) {
    await page.getByRole('button', { name, exact: true }).click()
    const ratios = await page.evaluate(() => {
      const rgb = (value: string) => value.startsWith('#')
        ? value.slice(1, 7).match(/../g)!.map(c => parseInt(c, 16) / 255)
        : value.match(/[\d.]+/g)!.slice(0, 3).map(c => Number(c) / 255)
      const lum = (color: string) => rgb(color).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
      const root = getComputedStyle(document.documentElement)
      const pairs = [['.tagline', '--hub'], ['.introduction', '--hub'], ['.link-title', '--card-start'], ['.link-description', '--card-start'], ['.boot-terminal', '--terminal-surface'], ['.terminal-footer', '--footer-surface']]
      return pairs.map(([selector, token]) => {
        const a = lum(getComputedStyle(document.querySelector(selector)!).color)
        const b = lum(root.getPropertyValue(token).trim())
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
      })
    })
    expect(Math.min(...ratios)).toBeGreaterThanOrEqual(4.5)
  }
})

test('desktop hover animation remains unchanged', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, hasTouch: false, isMobile: false })
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173')
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0)
  const card = page.locator('.link-card').first()
  const before = await card.boundingBox()
  await card.hover()
  await page.waitForTimeout(250)
  const after = await card.boundingBox()
  expect(after!.y).toBeCloseTo(before!.y - 2, 0)
  expect(await card.locator('.link-arrow').evaluate(el => getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 3, 0)')
  await page.close()
})

test('holding a touch gives feedback and releasing clears it', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP provides real touch hold/release; WebKit tap covered separately')
  await page.goto('/')
  const card = page.locator('.link-card').first()
  await expect(page.getByRole('button', { name: 'Skip', exact: true })).toHaveCount(0)
  await card.evaluate(el => el.addEventListener('click', event => event.preventDefault()))
  const box = (await card.boundingBox())!
  const session = await page.context().newCDPSession(page)
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + 80, y: box.y + 20 }] })
  await page.waitForTimeout(250)
  expect(await card.evaluate(el => getComputedStyle(el).borderColor)).toBe('rgb(138, 255, 187)')
  expect(await card.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a)).toBeLessThan(1)
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(500)
  expect(await card.evaluate(el => getComputedStyle(el).borderColor)).toBe('rgb(0, 223, 105)')
})

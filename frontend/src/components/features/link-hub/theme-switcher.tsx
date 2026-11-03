import { useState } from 'react'

const themes = [
  { id: 'green', label: 'Matrix Green' },
  { id: 'blue', label: 'Cyber Blue' },
  { id: 'red', label: 'Crimson Red' },
] as const
type Theme = typeof themes[number]['id']

export function ThemeSwitcher() {
  const [selected, setSelected] = useState<Theme>(() => {
    const value = document.documentElement.dataset.theme
    return value === 'blue' || value === 'red' ? value : 'green'
  })

  function selectTheme(theme: Theme) {
    // Change colors at the document root. Never key/remount the animated subtree.
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-theme-changed', 'true')
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'blue' ? '#030b16' : theme === 'red' ? '#100508' : '#030b06',
    )
    setSelected(theme)
    try { localStorage.setItem('cyber-terminal-theme', theme) } catch { /* Storage may be blocked. */ }
  }

  return <div className="theme-switcher" role="group" aria-label="Color theme">
    {themes.map(theme => <button
      key={theme.id}
      type="button"
      className="theme-option"
      data-color={theme.id}
      aria-label={theme.label}
      aria-pressed={selected === theme.id}
      title={theme.label}
      onClick={() => selectTheme(theme.id)}
    ><span className="theme-swatch" aria-hidden="true" /></button>)}
  </div>
}

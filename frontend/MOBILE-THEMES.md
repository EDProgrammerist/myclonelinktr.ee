# Mobile animation fixes and additional themes

## Scope

The existing Matrix Green palette, text, destinations, layout, typography, dimensions, and responsive spacing are preserved. Green remains the first-visit default. Blue and Red are additional palettes; the only new visible UI is three compact circular selectors in the terminal header's existing top space.

`src/styles/themes.css` contains unchanged Green literals and the Cyber Blue / Crimson Red overrides. Primary accents are #38BDF8 and #FF536A. Neutral readable text remains neutral; the online status dot remains green. Existing avatar and map assets receive a CSS hue filter for Blue/Red; no image was regenerated or replaced.

## Diagnosis and fixes

The reported device is iPhone 8 Plus, iOS 16 Safari, with Reduce Motion off. The exact all-animations-missing symptom was **not reproduced on a physical iPhone**. Current WebKit and Chromium emulation both showed terminal progression, heading decryption, staggered card entrances, and ambient CSS animation. No profile entrance animation existed separately from the avatar-ring pulse; none was invented.

Confirmed defects, reproduced before editing:

1. Unconditional CSS `:hover` persisted after a touch, leaving borders and arrows in desktop hover state. Hover rules now require a fine pointer with hover capability. Desktop hover values and Motion timings are unchanged.
2. The installed Motion `useReducedMotion` hook stores only an initial state snapshot, despite its source comment promising updates. Changing the system preference did not stop the active JS typing effect. A small `useSyncExternalStore` hook now subscribes to the media query and cleans up on unmount. Card transitions also become immediate when reduced motion is enabled.
3. A real emulated touch hold did not consistently set CSS `:active`. Motion's existing press transform worked, but the color feedback did not. Touch press/release/cancel callbacks now drive a temporary data attribute. The feedback clears on release/cancel, without applying desktop hover to touch.

Compatibility work: Vite 8's default browser targets begin at Safari/iOS 16.4, while the reported device runs iOS 16. The production JS and CSS targets explicitly include Safari/iOS 16.0. The resulting CSS includes WebKit mask prefixes. This closes a build-target gap; it is not proof that it was the cause of the reported all-animations-missing symptom. The app continues to use ordinary transform/opacity animation and CSS property transitions, not animation of registered custom properties. A capability-limited test disables CSS.registerProperty and linear() easing and confirms completion without runtime errors.

Sources: [Vite 8 build options](https://v8.vite.dev/config/build-options), [Motion animation compatibility notes](https://motion.dev/docs/faqs). Tailwind v4 itself targets modern Safari; setting Vite's target does not polyfill every framework feature. The actual utilities used on this page are simple layout rules, and the new interaction code does not require those newer CSS APIs.

## Theme behavior

- `theme-switcher.tsx` owns only its selected-button state. It updates a root `data-theme` attribute, never a React key or route.
- `index.html` restores a validated `cyber-terminal-theme` localStorage value before app/styles render. Invalid values and denied storage fall back to Green. Storage failures never prevent switching.
- Color/filter transitions are 200ms and disabled by reduced-motion CSS. Existing animation instances and terminal progress survive theme changes.
- Native buttons have accessible names, aria-pressed, visible keyboard focus, distinct selected rings, and 24px targets. Changing theme does not recolor the semantic online indicator.

## Evidence and limitations

`artifacts/mobile-themes/comparison.html` displays matching before/after screenshots and the added palettes. Sizes: 320, 375, 390, 430, and 1440px. The deployed page and local pre-change source had identical link destinations, text, and card geometry at all five widths (`baseline.json`). The deployed portrait did not appear in the captured network-loaded images in this environment; local baseline captures include the unchanged portrait asset.

Automated Green screenshot comparisons hide only the new selector for the comparison. The initial comparison found five differing portrait-edge pixels on mobile and zero on desktop, without geometry/text changes. The regression threshold is ten pixels, rather than claiming every pixel is identical. After-images with the selector visible are also saved.

Browser coverage: installed Microsoft Edge (Chromium) and Playwright WebKit 27.2 with mobile/touch emulation. This is **not** physical iOS/Android testing and is **not** an iOS 16 browser engine. The exact iPhone symptom still needs verification on that device after deployment. No deployment was performed.

Tests cover theme selection/persistence, invalid/blocked storage, early theme restoration, all five layouts, unchanged geometry, no overflow, reduced motion, touch release, keyboard focus, boot continuity, stable DOM identity, retained scroll, desktop hover, text contrast, older-capability fallbacks, and animation progress/runtime errors. Text contrast is checked against conservative theme surfaces; it is not a full accessibility audit.

## Run and verify

From `frontend/`:

```powershell
npm install
npx playwright install webkit
npm run dev
```

A running server is required by the tests. Edge is used for Chromium tests; install Edge on the test machine or adjust the Playwright channel.

```powershell
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

In another terminal:

```powershell
$env:TEST_URL='http://127.0.0.1:4173'
npm test
node scripts/capture-themes.mjs
```

`artifacts/mobile-themes/tests.json` holds the latest machine-readable test result. Five WebKit screenshot checks are deliberately skipped because their baselines were recorded in Chromium; one WebKit hold test is skipped because it uses Chromium's CDP input interface. WebKit tap/release, layout, animation, and theme behavior are tested independently.

Final verification: lint and production build passed. Production-preview Playwright run: 42 passed, 6 documented browser-specific skips, 0 failures. Final production screenshots were captured after the last code change.


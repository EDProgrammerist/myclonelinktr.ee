# Cyber Terminal implementation

The supplied `design/design-ref.png` is the design authority. No new design direction was dealt. No screenshot is embedded in the application. The avatar is a separate generated bitmap; the map is a vector asset; the interface is semantic React components.

## Run

From `frontend/`:

```powershell
npm install
npm run dev
```

Added dependencies (already installed and recorded in package-lock.json):

```powershell
npm install @fontsource/space-grotesk @fontsource/jetbrains-mono
npm install -D @playwright/test
```

Motion and Lucide were already installed. React, TypeScript, Vite, ESLint, and Tailwind v4 remain in place.

```powershell
npm run lint
npm run build
npm run preview
node scripts/verify-ui.mjs
```

The UI verification defaults to a running dev server at http://127.0.0.1:5173 and uses installed Microsoft Edge through Playwright. To test preview: `$env:TEST_URL='http://127.0.0.1:4173'; node scripts/verify-ui.mjs`.

## Customize

Edit `src/lib/profile.ts` for identity, tagline, introduction, avatar, footer, and all five link destinations. Ed James is the reference identity. GitHub, LinkedIn, OWASP writeups, GitHub Explore, and hello@example.com are illustrative destinations, not verified personal accounts. Replace them before publishing. External links open in a new tab; contact opens the visitor's mail client. No backend or API integration was added.

Components are in `src/components/features/link-hub/`, composed by `src/pages/home.tsx`. Global visual tokens and responsive styles are in `src/styles/global.css`.

## Visual comparison

Open `artifacts/comparison.html` for the supplied reference beside the final 360 � 731 screenshot. Three focused visual passes were performed:

1. Static layout: matched 296px card width and 120px avatar; first card was 3px too low, body type too geometric, map/grid too prominent, document/mail icons incorrect.
2. Static refinement: moved first card to y=310, changed body type to Arial for closer proportions, refined wrapping, replaced rough map with Natural Earth geometry, softened grid.
3. Motion and responsive refinement: corrected icons and footer spacing, added Motion card entrances and interaction states, React Bits heading decryption, terminal typing/skip, blinking cursors, avatar pulse, ambient side-code motion. Fixed desktop background ending before the viewport bottom. Rechecked all requested widths and normal/reduced-motion states on production preview.

Final assessment: recognizable close composition, not pixel-perfect. Card position/width and avatar dimensions closely follow the mobile reference. Generated portrait has different hood folds and lighting; map projection/detail and circuitry differ; fonts and rasterization are approximate. Reference uses more irregular background illumination. Desktop is a centered responsive adaptation because only a mobile reference was supplied.

The Taste inspector's generic marketing-page bans conflict with this reference. Explicit exceptions cover monospace terminal text, small copy, neon shadows, gradients/grid, outlined cards, compact title/avatar, lack of extra imagery/video, and three typefaces. Its off-centre finding includes asymmetric decorative terminal/background elements; the actual hub and card stack are centered. These exceptions are fidelity decisions, not evidence of pixel perfection.

## Verification

Playwright screenshots: `artifacts/pass-1-360.png`, `pass-2-360.png`, `pass-3-320.png`, `pass-3-360.png`, `pass-3-375.png`, `pass-3-768.png`, `pass-3-1440.png`, and `pass-3-animated-360.png`.

`artifacts/verification.json` records no horizontal overflow, five minimum-44px-tall cards, loaded avatar, resolved heading, and zero running animations under reduced motion at 320/360/375/768/1440. Script additionally checks skip-to-links keyboard flow, external-link safety attributes, boot skip/completion within 2.4 seconds, hover lift, and no uncaught runtime errors. These tests check link wiring; they do not verify ownership or availability of external profiles or email delivery.

## Asset provenance

- `public/images/hooded-avatar.png`: created with the built-in Image Generation tool from the supplied reference. Prompt: standalone square faceless black hooded portrait, realistic cloth, thin lime-green rim lighting, black-green background, no UI/text/circle. The asset was copied into the project. It is an approximation, not an extracted original portrait.
- `public/images/world-map.svg`: generated from Natural Earth's public-domain 110m land geometry: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson . Rebuild with `node scripts/make-map.mjs`; source data is saved in `artifacts/land.geojson`.
- `decrypted-text.tsx`: React Bits Decrypted Text by David Haz, https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/DecryptedText/DecryptedText.tsx . Included license: `src/components/features/link-hub/REACT-BITS-LICENSE.txt` (MIT + Commons Clause).
- Locally hosted Space Grotesk and JetBrains Mono from Fontsource; package license files remain with the packages. Arial is a system font used to better match reference body proportions.

## Final visual critique

ROUND 3
Seen in one second: a compact green terminal-themed developer link hub.
Idea (one sentence): the profile's terminal prompt becomes the framing device for its identity and links.
Live thing: skippable terminal typing, one-time decryption, and responsive link hover/press behavior.
Layout words by section: hero=terminal/profile overlay / links=vertical stack / footer=terminal line.
Scores (reference-fidelity assessment): design 8 / usability 8 / creativity 6 / content 5 -> overall 7.3.
Caps applied: sample identity and destinations limit content; supplied composition limits originality. Generic Taste house-rule caps are inapplicable to explicitly requested reference features.
Top three remaining differences:
1. pass-3-360.png: avatar hood and illumination differ. Exact match needs the original portrait asset.
2. pass-3-360.png: map and circuit detail are cleaner and less irregular. Exact match needs the original background artwork; the whole reference is intentionally not used as a page background.
3. pass-3-360.png: font metrics/rasterization differ slightly. Exact matching requires the original font identification and source assets.

Final production Taste inspection: 0 FAIL / 0 WARN with the documented reference-specific exceptions. All six final inspector screenshots were opened and reviewed. Lint and production build passed. Browser interaction verification also passed against production preview.

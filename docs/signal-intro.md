# The Signal intro

The intro is isolated in `src/components/BrandIntro.tsx` and `BrandIntro.css`.
No hero, navigation, product layout or logo asset is changed.
`src/mobile/intro.css` retains the existing shared mobile brand styles only.

## Choreography

- Desktop: central point, architectural connections, convergence, approved white
  mark at 3.55s, brand at 4.7s, localized statement at 4.94s, signal expansion into
  the existing hero from 5.7–6.2s.
- Mobile: independently authored portrait SVG, curved signal from below, four
  connections, mark at 2.8s, two-line localized statement, hero reveal at 4.45–5s.
- Reduced motion: opacity-only mark and statement, followed by the hero at 1.67s.
- The logo is the existing `/images/bama-mark-white.png`, unchanged, including
  its approved bottom dot. SVG paths depict connections, not a replacement logo.

## Replay and session behavior

Development only: open `/ar?intro=replay` or `/en?intro=replay` in the Vite dev
server. This bypass is compiled out of production. Reload that URL to replay.
The normal `bama-intro-seen` session-storage flag is claimed on entry, so skipping,
reloading, switching languages and browsing products do not replay the intro.
A fresh browser session can play it again. Restricted storage skips it safely.

## Safety and accessibility

Skip and Escape start a 220ms dismissal. Keyboard focus stays within the intro,
while underlying content is inert and scrolling is locked. Cleanup restores both.
The hero loads normally underneath; the animation never awaits assets. Failed or
unready logo loading reveals the site within 1.6s. Animation initialization checks,
an independent 6.8s/5.6s watchdog, and a local error boundary fail open.
Only the existing mark is requested by the intro, with high fetch priority.
There is no video, sound, canvas, new dependency, or per-frame JavaScript rendering.

## Verification

Run a production preview and then:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/verify-intro.mjs
```

`BASE_URL`, `QA_OUTPUT`, and `QA_ENGINES=chromium,webkit` are optional overrides.
The suite checks eight requested viewport sizes, both languages, geometry,
visibility, keyboard/touch skip, session/navigation, real-time completion,
reduced motion and injected failures. It saves screenshots and JSON results.
Frame timing measures the host's Chromium/WebKit render loops; it does not
certify real iPhone/Android hardware or Safari browser-chrome behavior.

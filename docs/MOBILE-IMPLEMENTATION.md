# Dedicated mobile build

The approved mobile reference is implemented below 1024 CSS pixels. The existing desktop pages, product data, route URLs, brand colors and font families are preserved.

## Structure

- `src/mobile/MobileSite.tsx`: mobile header, native-dialog navigation, home sections, category navigation, product pages, contact selectors, footer and localized 404.
- `src/mobile/mobile.css`: scoped mobile styling, 44px minimum controls, RTL/LTR composition, safe-area handling, short/landscape layouts and reduced-motion rules.
- `src/mobile/MobileBrand.tsx`: the supplied logo's original letterforms and transparent background, rendered pure white through CSS. No recreated wordmark or logo container.
- `src/mobile/useMobileViewport.ts`: one media-query subscription, including live orientation/window changes.
- `src/components/BrandIntro.tsx`: shared session persistence with a dedicated mobile intro. Five-second mobile timer; language changes do not replay it; reduced-motion users skip it.
- `src/data/products.ts`: unchanged single source for product/category names, descriptions, availability and feature lists.
- `src/config/contact.ts`: unchanged centralized contact details. Empty channels show a localized explanation; no invented contact information or silent form submissions.

Mobile routes reuse the existing router. The desktop route component is not mounted or downloaded on mobile. The desktop hero preload is restricted to desktop widths. Mobile images use separately optimized WebP assets with explicit dimensions and lazy loading where appropriate.

## Verification

`scripts/verify-mobile.mjs` exercises 11 routes in both languages at 360, 375, 390, 393, 412 and 430 pixels in Chromium and WebKit. It also covers touch navigation, native-dialog focus restoration, category expansion, product inquiry context, use-case selection, contact placeholders, 404s, orientation, short viewports, language changes, intro dismissal/session persistence and browser errors.

Run against an existing production preview, with Playwright and its browsers available:

```sh
BASE_URL=http://127.0.0.1:4173 \
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs \
QA_OUTPUT=/tmp/bama-mobile-qa \
node scripts/verify-mobile.mjs
```

Omit `PLAYWRIGHT_MODULE` when Playwright resolves normally. Set `QA_WIDTHS=390` for a shorter journey smoke test. Test artifacts include JSON results and Arabic/English screenshots. No contact messages are sent by the tests.

Device emulation does not verify physical iPhone/Android hardware, browser chrome, real display cutouts, on-device text rendering or slow-device performance. Those require a physical-device follow-up.

## Image provenance

All existing product renders and category/use-case photos were reused, resized and encoded as mobile WebP assets. The original image files were not overwritten. The full supplied transparent logo was resized without changing its artwork; its white appearance is applied in CSS.

The mobile-only architectural image was generated with the built-in image-generation tool and saved as `public/images/mobile/architecture.webp` (860 × 1290, approximately 139 KiB). It is an illustrative smart-home environment, not a claimed completed BAMA installation. It is used for the hero, ecosystem and category preview. No generated text or interface is embedded in it.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: mobile website architectural hero and smart-home ecosystem background. Create a premium photoreal architectural photograph, portrait 1024x1536. A complete two-storey modern Saudi luxury smart home viewed from outside at a three-quarter angle, dark charcoal stone, floor-to-ceiling glass, warm subtle interior lights, deep navy blue twilight sky, trees framing roof, reflecting pool and dark terrace foreground. Composition: entire clean rectangular home occupies middle 65 percent, sky upper 15 percent, dark reflective foreground lower 20 percent. Front entry on left, glass living rooms on right, crisp roof silhouette. Color palette nearly black, deep navy, restrained electric-blue illumination tracing just the roof edge and terrace base. Calm cinematic real-estate photography matching a premium dark smart technology website, not sci-fi. No text, no logos, no icons, no diagram, no device closeups, no interface, no phone frame. Preserve realistic architecture and believable materials.

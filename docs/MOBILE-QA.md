# Mobile QA, 28 September 2026

## Scope and evidence

Production-build preview tested at `http://127.0.0.1:4173`. The full matrix covers 264 route/viewport combinations: 11 routes × 6 widths × 2 languages × 2 browser engines. Screenshots and raw test results are saved locally under `qa/mobile` and `/tmp/bama-mobile-final`; these generated artifacts are intentionally excluded from Git.

The final photo-crop and landscape safe-area polish receives an additional 390px end-to-end run in both languages and engines. Tests exercise actual touch actions, not only static DOM inspection. The React review covered hook cleanup, shared data, conditional loading, semantic controls and keyboard focus. Impeccable's adaptation guidance informed touch sizing and orientation behavior; the supplied reference controlled the visual design.

## Results

| Check | Result | Evidence / qualification |
|---|---|---|
| Mobile reference match | PASS | Manual side-by-side review of all nine compositions; corrected category height, photo crops, Arabic caption alignment, logo letterforms, anchor spacing and product CTA clearance. Not a claim of pixel-identical photographic assets. |
| Arabic mobile RTL | PASS | Right-aligned editorial text, icon/arrow composition, RTL categories/menu, isolated Latin feature values. |
| English mobile LTR | PASS | All routes, English text wrapping, left-aligned use-case labels and technical features. |
| Intro | PASS | Skip, Escape, auto-dismiss, once-per-session persistence, language switching and reduced-motion bypass. Auto-dismiss measured about 5.85 seconds including page load and exit transition. |
| Mobile navigation | PASS | Native dialog, expandable products, touch links, Escape, focus restoration, background scroll lock and both language selectors. |
| Products page | PASS | Seven category rows, current selection, six category routes and future availability distinctions. |
| Wi-Fi product | PASS | Shared description, all six features, image, breadcrumb and contextual inquiry CTA. |
| Smart Lock product | PASS | Shared description, all five features, architectural product composition and contextual inquiry CTA. |
| Smart ecosystem | PASS | Six connected category points, all six destinations tested in both languages. |
| Use cases | PASS | Four image rows, tap disclosure and inquiry-context handoff. |
| Contact | PASS | Four inquiry selectors and all three centralized contact placeholders. No messages sent or contact details invented. |
| 360px | PASS | All 11 routes, both languages, both engines. |
| 375px | PASS | All 11 routes, both languages, both engines. |
| 390px | PASS | Full routes and complete touch journeys in both engines. |
| 393px | PASS | All 11 routes, both languages, both engines. |
| 412px | PASS | All 11 routes, both languages, both engines. |
| 430px | PASS | All 11 routes, both languages, both engines. |
| iPhone/Safari physical QA | NOT VERIFIED | WebKit with iPhone 13 emulation passed. A physical iPhone running Safari was not available. |
| Android/Chrome physical QA | NOT VERIFIED | Chromium with Pixel 7 emulation passed. A physical Android device running Chrome was not available. |
| Orientation / short viewport | PASS in emulation | 844×390 landscape and 390×600 contact viewport; controls remain reachable. No form inputs require a software keyboard. Real browser chrome/cutouts still need physical verification. |
| Desktop regression | PASS | Arabic/English home, products and both details at 1366 and 1920px; 1440px before/after full-page comparison. Screenshot dimensions identical, pixel variation 0.0015% Arabic / 0.1583% English; no composition regression found. |
| Console / resources | PASS | No exceptions, console errors, failed same-origin responses or broken images in the full matrix. |
| Production build | PASS | TypeScript and Vite production build successful. |
| Lint / diff checks | PASS | Oxlint and `git diff --check` clean. |

## Accessibility and performance

- Minimum 44px interactive targets verified across the route matrix. No horizontal overflow or off-screen elements detected.
- Axe WCAG 2 A/AA scans of English home, Arabic products, Arabic Wi-Fi detail and the open menu found zero violations. Image/pseudo-element contrast checks on home and category preview required manual visual review, so this is not a blanket WCAG certification.
- Local warm-load measurement: FCP 116ms, LCP 448ms, CLS 0. These are local observations, not field-performance guarantees. A separate cold-load measurement reported CLS 0.0192.
- Mobile network inspection confirmed no desktop homepage chunk and no full-sized desktop hero request. Mobile architecture is approximately 139 KiB; Wi-Fi and lock WebP renders approximately 33 and 29 KiB, compared with 704 and 468 KiB originals.
- No deployment, real-device or production-field performance claims are inferred from local tests. Git and Vercel release status are reported separately after release verification.

## Remaining external inputs

Official WhatsApp, phone and email values are still empty in the centralized configuration, as required by the brief. Physical Safari/Chrome testing, real Dynamic Island/browser bar behavior and low-end-device performance remain follow-up checks, not passed tests.

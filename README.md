# BAMA Smart Solution

Production React and TypeScript website for BAMA Smart Solution, a Saudi smart-technology brand focused on networking, smart access, and an expandable connected-space ecosystem.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Routes

- `/en` and `/ar`
- `/en/products` and `/ar/products`
- `/en/products/wifi-7-be5010` and `/ar/products/wifi-7-be5010`
- `/en/products/smart-lock-3d` and `/ar/products/smart-lock-3d`
- Localized 404 routes

## Content architecture

- Product records: `src/data/products.ts`
- Contact channels: `src/config/contact.ts`
- Brand and site settings: `src/config/site.ts`
- Bilingual editorial copy: `src/content.ts`
- Design context: `PRODUCT.md` and `DESIGN.md`

New products can be added without changing the page architecture. Each record supports bilingual names and descriptions, images, features, specifications, status, featured state, and display order.

## Company information still required

Add the official WhatsApp number, phone number, and email address in `src/config/contact.ts`. Set `VITE_SITE_URL` to the final production origin for canonical and alternate-language metadata. The sitemap generator accepts `SITE_URL`, `VITE_SITE_URL`, or Vercel's production URL environment variable.

## Assets

The supplied approved logo is preserved at `public/images/bama-logo-approved-source.png`. The transparent production logo and favicon are derived from that approved mark. The architectural hero, use-case panorama, Wi-Fi access point, and smart-lock visuals were generated specifically for this website and are stored locally under `public/images`.

## Deployment

`vercel.json` provides the SPA rewrite required for direct route access. If this repository is already linked to Vercel, pushing the `main` branch can update the existing project without creating a duplicate.

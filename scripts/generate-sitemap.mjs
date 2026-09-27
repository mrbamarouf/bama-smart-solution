import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const rawOrigin = process.env.SITE_URL ?? process.env.VITE_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL

if (!rawOrigin) {
  console.log('Sitemap skipped: set SITE_URL or VITE_SITE_URL when the production domain is known.')
  process.exit(0)
}

const origin = rawOrigin.startsWith('http') ? rawOrigin : `https://${rawOrigin}`
const base = origin.replace(/\/$/, '')
const localizedPaths = [
  '',
  '/products',
  '/products/wifi-7-be5010',
  '/products/smart-lock-3d',
]

const urls = localizedPaths.flatMap((path) => ['en', 'ar'].map((language) => `${base}/${language}${path}`))
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`

writeFileSync(resolve('public/sitemap.xml'), sitemap)
writeFileSync(resolve('public/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`)
console.log(`Sitemap generated for ${base}`)

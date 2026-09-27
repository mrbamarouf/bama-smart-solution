import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

// PLAYWRIGHT_MODULE can point to an existing Playwright installation.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.BASE_URL || 'http://127.0.0.1:5173'
const output = process.env.QA_OUTPUT || 'qa/desktop-index'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
const geometry = {}
const results = []

try {
  for (const language of ['ar', 'en']) {
    for (const route of ['', '/products']) {
      await page.goto(`${base}/${language}${route}`)
      await page.waitForLoadState('networkidle')
      await page.evaluate(() => document.fonts.ready)
      const sections = page.locator(route ? '.category-world' : '.solution-world')
      assert.equal(await sections.count(), route ? 6 : 4)
      for (let index = 0; index < await sections.count(); index++) {
        const section = sections.nth(index)
        await section.scrollIntoViewIfNeeded()
        const result = await section.evaluate((element, language) => {
          const content = element.querySelector('.desktop-section-content')
          const number = content.querySelector('.desktop-section-index')
          const title = content.querySelector('h2, h3')
          const style = getComputedStyle(number)
          const rect = node => node.getBoundingClientRect()
          const edge = language === 'ar' ? 'right' : 'left'
          const icon = content.querySelector(':scope > svg')
          const badge = content.querySelector('.availability')
          const glyph = number.querySelector('bdi')
          return {
            text: number.textContent,
            position: style.position,
            offsets: [style.top, style.right, style.bottom, style.left],
            edgeError: Math.abs(rect(glyph)[edge] - rect(content)[edge]),
            titleEdgeError: Math.abs(rect(title)[edge] - rect(content)[edge]),
            numberBeforeTitle: rect(number).bottom < rect(title).top,
            numberBeforeStatus: rect(number).bottom <= rect(badge).top,
            iconGap: icon ? rect(icon).top - rect(number).bottom : null,
            firstChild: content.firstElementChild === number || content.firstElementChild.contains(number),
            direction: getComputedStyle(content).direction,
            containsCopy: !!content.querySelector('p') && !!content.querySelector('ul'),
          }
        }, language)
        assert.equal(result.text, String(index + 1).padStart(2, '0'))
        assert.equal(result.position, 'static')
        assert.deepEqual(result.offsets, ['auto', 'auto', 'auto', 'auto'])
        assert.ok(result.edgeError < 1, JSON.stringify(result))
        assert.ok(result.titleEdgeError < 1)
        assert.ok(result.numberBeforeTitle && result.numberBeforeStatus && result.firstChild && result.containsCopy)
        assert.equal(result.direction, language === 'ar' ? 'rtl' : 'ltr')
        if (!route) assert.equal(result.iconGap, 24)
        results.push({ language, route, ...result })
        await section.screenshot({ path: `${output}/after-${language}-${route ? 'category-' : ''}${result.text}.png` })
      }
      geometry[`${language}${route}`] = await page.locator('.solution-world, .product-showcase, .category-world').evaluateAll(elements => elements.map(element => ({
        className: element.className,
        rect: [element.getBoundingClientRect().width, element.getBoundingClientRect().height],
        images: [...element.querySelectorAll('img')].map(image => ({
          src: image.getAttribute('src'),
          width: image.getBoundingClientRect().width,
          height: image.getBoundingClientRect().height,
        })),
      })))
      if (!route) {
        assert.ok(await page.locator('.product-count').evaluateAll(numbers => numbers.every(number =>
          number.closest('.product-showcase-copy') && getComputedStyle(number).position === 'static')))
      }
    }
  }
  await fs.writeFile(`${output}/after-geometry.json`, JSON.stringify(geometry, null, 2))
  await fs.writeFile(`${output}/alignment-results.json`, JSON.stringify(results, null, 2))
  const baseline = `${output}/before-geometry.json`
  try {
    const before = JSON.parse(await fs.readFile(baseline, 'utf8'))
    assert.deepEqual(geometry, before, 'Approved image and section sizes must not change')
    console.log('PASS: all approved image and section sizes are unchanged')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  await page.setViewportSize({ width: 390, height: 844 })
  for (const language of ['ar', 'en']) {
    await page.goto(`${base}/${language}`)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('.desktop-section-content').count(), 0)
    await page.screenshot({ path: `${output}/mobile-after-${language}.png`, fullPage: true })
  }
  assert.deepEqual(errors, [])
  console.log(`PASS: ${results.length} Arabic/English content indices at 1440px; normal flow, correct content edge, correct order; no browser errors`)
} finally {
  await browser.close()
}

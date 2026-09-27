/** Intro-only QA. Uses browser-engine emulation, not physical-device certification.
 * PLAYWRIGHT_MODULE: existing installation; BASE_URL: dev/preview/live site.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const { chromium, webkit, devices } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.BASE_URL || 'http://127.0.0.1:5174'
const output = process.env.QA_OUTPUT || 'qa/signal-intro/verification'
const engines = process.env.QA_ENGINES?.split(',') || ['chromium', 'webkit']
const sizes = [[1366, 768], [1440, 900], [1920, 1080], [360, 800], [375, 812], [390, 844], [393, 852], [430, 932]]
const results = []
const errors = []
await fs.mkdir(output, { recursive: true })
const record = (test, details = {}) => { results.push({ test, status: 'PASS', ...details }); console.log('PASS', test, JSON.stringify(details)) }
const observe = page => {
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
}
const seek = (page, time) => page.locator('.signal-intro').evaluate((element, time) => {
  for (const animation of element.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = time }
}, time)
const cleanExit = async page => {
  await page.waitForSelector('.signal-intro', { state: 'detached', timeout: 7500 })
  assert.equal(await page.evaluate(() => document.querySelectorAll('[inert]').length), 0)
  assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
}

for (const engine of engines) {
  const browser = await ({ chromium, webkit }[engine]).launch()
  try {
    for (const [width, height] of sizes) {
      const mobile = width < 1024
      for (const language of ['ar', 'en']) {
        const context = await browser.newContext({
          ...(mobile ? devices[engine === 'webkit' ? 'iPhone 13' : 'Pixel 7'] : {}),
          viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'no-preference',
        })
        const page = await context.newPage()
        observe(page)
        await page.goto(`${base}/${language}`)
        await page.waitForSelector('.signal-intro')
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => document.fonts.ready)
        const intro = page.locator('.signal-intro')
        assert.equal(await intro.getAttribute('data-composition'), mobile ? 'mobile' : 'desktop')
        await seek(page, 100)
        assert.equal(await page.locator('.signal-logo').evaluate(el => getComputedStyle(el).opacity), '0')
        assert.equal(await page.locator('.signal-statement').evaluate(el => getComputedStyle(el).opacity), '0')
        assert.equal(await page.locator('.signal-veil').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(2, 8, 18)')
        await seek(page, mobile ? 4300 : 5600)
        const layout = await intro.evaluate(element => {
          const rect = selector => { const r = element.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right } }
          const image = element.querySelector('.signal-logo')
          return {
            logo: rect('.signal-logo'), identity: rect('.signal-identity'), skip: rect('.signal-skip'),
            statement: element.querySelector('.signal-statement').textContent,
            lineBreaks: element.querySelectorAll('.signal-statement br').length,
            opacity: Number(getComputedStyle(image).opacity),
            statementOpacity: Number(getComputedStyle(element.querySelector('.signal-statement')).opacity),
            brandOpacity: Number(getComputedStyle(element.querySelector('.signal-brand')).opacity),
            src: image.getAttribute('src'), complete: image.complete && image.naturalWidth === 512,
            preserveAspect: element.querySelector('svg').getAttribute('preserveAspectRatio'),
            audio: element.querySelectorAll('video,audio,canvas').length,
          }
        })
        assert.equal(layout.src, '/images/bama-mark-white.png')
        assert.ok(layout.complete && layout.opacity > 0.98)
        assert.ok(layout.statementOpacity > 0.98 && layout.brandOpacity > 0.98, 'Brand and localized statement must actually be visible')
        assert.ok(Math.abs(layout.logo.x + layout.logo.width / 2 - width / 2) < 1)
        assert.ok(Math.abs(layout.logo.width - layout.logo.height) < 1)
        assert.ok(layout.identity.x >= 0 && layout.identity.right <= width)
        assert.ok(layout.identity.bottom < layout.skip.y)
        assert.ok(layout.skip.bottom <= height - 24 && layout.skip.height >= 44)
        assert.equal(layout.preserveAspect, 'xMidYMid meet')
        assert.equal(layout.lineBreaks, mobile ? 1 : 0)
        assert.equal(layout.audio, 0)
        assert.ok(language === 'ar' ? layout.statement.includes('بمستقبل أكثر ذكاءً') && !layout.statement.includes('CONNECTING') : layout.statement.includes('SMARTER TOMORROW') && !/[\u0600-\u06ff]/.test(layout.statement))
        if (mobile) assert.ok(Math.abs(layout.skip.x + layout.skip.width / 2 - width / 2) < 1)
        else assert.ok(language === 'ar' ? layout.skip.x < 100 : layout.skip.right > width - 100)
        await page.screenshot({ path: `${output}/${engine}-${language}-${width}.png` })
        await page.keyboard.press('Tab')
        assert.equal(await page.locator('.signal-skip').evaluate(el => el === document.activeElement), true)
        const start = Date.now()
        if (mobile) await page.locator('.signal-skip').tap()
        else await page.locator('.signal-skip').click()
        await cleanExit(page)
        assert.ok(Date.now() - start < 1600, 'Skip must dismiss promptly')
        assert.equal(await page.evaluate(() => sessionStorage.getItem('bama-intro-seen')), 'true')
        assert.equal(await page.locator(mobile ? '.m-hero' : '.hero').isVisible(), true)
        const languageLink = mobile ? '.m-header .m-language a:not([aria-current="true"])' : '.language-switch'
        await page.locator(languageLink).click()
        await page.waitForURL(`**/${language === 'ar' ? 'en' : 'ar'}`)
        assert.equal(await intro.count(), 0)
        await page.goto(`${base}/${language}/products`)
        assert.equal(await intro.count(), 0)
        await page.goto(`${base}/${language}/products/wifi-7-be5010`)
        assert.equal(await intro.count(), 0)
        await page.goto(`${base}/${language}`)
        await page.reload()
        assert.equal(await intro.count(), 0)
        record(`${engine} ${language} ${width}x${height}`, { composition: mobile ? 'portrait' : 'desktop', checks: 'logo, geometry, localized copy, keyboard/touch skip, session, language, products, return, reload' })
        await context.close()
      }
    }

    // Real-time sequence and frame sampling, independent of screenshot seeking.
    for (const mobile of [false, true]) {
      const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 } })
      observe(page)
      await page.addInitScript(() => {
        window.__introFrames = []
        window.__introLongTasks = []
        let previous = 0
        const sample = time => {
          if (previous && document.querySelector('.signal-intro')) window.__introFrames.push(time - previous)
          previous = time
          requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
        if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
          new PerformanceObserver(list => window.__introLongTasks.push(...list.getEntries().map(e => e.duration))).observe({ type: 'longtask', buffered: true })
        }
      })
      await page.goto(`${base}/en`)
      await page.waitForSelector('.signal-intro')
      const started = Date.now()
      await page.waitForSelector('.signal-intro[data-phase="leaving"]', { timeout: 7000 })
      const transition = await page.locator('.signal-veil').evaluate(el => ({ animation: getComputedStyle(el).animationName, background: getComputedStyle(el.parentElement).backgroundColor }))
      assert.equal(transition.animation, 'signal-veil-out')
      assert.equal(transition.background, 'rgba(0, 0, 0, 0)')
      await cleanExit(page)
      const elapsed = Date.now() - started
      assert.ok(elapsed >= (mobile ? 4500 : 5600) && elapsed < (mobile ? 5900 : 7000), `Unexpected duration ${elapsed}`)
      const performance = await page.evaluate(() => {
        const frames = window.__introFrames.sort((a, b) => a - b)
        return { frames: frames.length, medianMs: frames[Math.floor(frames.length / 2)], p95Ms: frames[Math.floor(frames.length * .95)], over50ms: frames.filter(t => t > 50).length, longTasks: window.__introLongTasks }
      })
      assert.ok(performance.frames > 200 && performance.p95Ms <= 34, 'Browser frame pacing regressed')
      record(`${engine} ${mobile ? 'mobile' : 'desktop'} real-time`, { elapsed, performance, note: 'host browser measurement, not a physical phone benchmark' })
      await page.close()
    }

    for (const mobile of [false, true]) {
      const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, reducedMotion: 'reduce' })
      observe(page)
      await page.goto(`${base}/ar`)
      await page.waitForSelector('.signal-intro[data-reduced="true"]')
      assert.equal(await page.locator('.signal-field').isVisible(), false)
      assert.equal(await page.locator('.signal-logo').evaluate(el => getComputedStyle(el).animationName), 'signal-copy-in')
      await page.waitForTimeout(1050)
      await page.screenshot({ path: `${output}/${engine}-reduced-${mobile ? 'mobile' : 'desktop'}.png` })
      await cleanExit(page)
      record(`${engine} reduced motion ${mobile ? 'mobile' : 'desktop'}`, { checks: 'opacity-only logo, statement, no traveling signals, automatic hero reveal' })
      await page.close()
    }

    // Failure injection does not add expected resource errors to clean-run logs.
    for (const failure of ['logo-error', 'logo-slow', 'initialization', 'storage']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
      if (failure === 'logo-error') await page.route('**/bama-mark-white.png', route => route.abort())
      if (failure === 'logo-slow') await page.route('**/bama-mark-white.png', () => {})
      if (failure === 'initialization') await page.addInitScript(() => {
        const original = window.getComputedStyle
        window.getComputedStyle = function(element, pseudo) {
          const style = original.call(this, element, pseudo)
          return element.classList.contains('signal-logo') ? new Proxy(style, { get: (target, key) => key === 'animationName' ? 'none' : Reflect.get(target, key) }) : style
        }
      })
      if (failure === 'storage') await page.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage unavailable') } }) })
      await page.goto(`${base}/en`, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('.m-hero')
      await page.waitForSelector('.signal-intro', { state: 'detached', timeout: 2200 })
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
      record(`${engine} fail-open ${failure}`)
      await page.close()
    }
  } finally { await browser.close() }
}
await fs.writeFile(`${output}/results.json`, JSON.stringify({ results, errors }, null, 2))
assert.deepEqual(errors, [], 'Clean intro journeys must not log browser errors')
console.log(`PASS ${results.length} intro checks; no browser errors`)

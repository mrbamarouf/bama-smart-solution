/** Run against a running production preview. No messages or inquiries are sent.
 * PLAYWRIGHT_MODULE can point to an existing Playwright installation.
 * BASE_URL defaults to http://127.0.0.1:5173. Screenshots/results go to QA_OUTPUT.
 */
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const { chromium, webkit, devices } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
const output = process.env.QA_OUTPUT || "/tmp/bama-mobile-qa";
await mkdir(output, { recursive: true });
const results = [];
const errors = [];
const openedBrowsers = [];
const widths = process.env.QA_WIDTHS?.split(',').map(Number) ?? [360, 375, 390, 393, 412, 430];
const categorySlugs = [
  "networking",
  "smart-access",
  "smart-security",
  "smart-home",
  "smart-sensors",
  "connected-devices",
];
const paths = [
  "",
  "/products",
  ...categorySlugs.map((slug) => `/products/${slug}`),
  "/products/wifi-7-be5010",
  "/products/smart-lock-3d",
  "/not-a-real-page",
];
const record = (test, detail = "") => {
  results.push({ test, status: "PASS", detail });
  console.log("PASS", test, detail);
};
const ready = async (page) => {
  await page.waitForSelector(".mobile-site");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
};
const go = async (page, route) => {
  await page.goto(`${base}/${route}`);
  await ready(page);
};
const observe = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      new URL(response.url()).origin === new URL(base).origin
    )
      errors.push(`${response.status()} ${response.url()}`);
  });
};
const layout = async (page) => {
  const issues = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const elements = [...document.querySelectorAll(".mobile-site *")]
      .filter((element) => {
        const style = getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          element.closest("dialog:not([open])")
        )
          return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -1 || rect.right > viewport + 1);
      })
      .map((element) => `${element.tagName}.${element.className}`);
    const brokenImages = [...document.images]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.src);
    const targets = [
      ...document.querySelectorAll(".mobile-site a,.mobile-site button"),
    ]
      .filter((element) => {
        if (element.closest("dialog:not([open])")) return false;
        const r = element.getBoundingClientRect();
        return r.width > 0 && (r.width < 43 || r.height < 43);
      })
      .map(
        (element) =>
          `${element.textContent.trim()}: ${element.getBoundingClientRect().width}×${element.getBoundingClientRect().height}`,
      );
    return {
      overflow: document.documentElement.scrollWidth > viewport,
      elements,
      brokenImages,
      targets,
    };
  });
  assert.deepEqual(
    issues,
    { overflow: false, elements: [], brokenImages: [], targets: [] },
    `${page.url()}: ${JSON.stringify(issues)}`,
  );
};

try {
  for (const [engineName, engine, device] of [
    ["chromium", chromium, devices["Pixel 7"]],
    ["webkit", webkit, devices["iPhone 13"]],
  ]) {
    const browser = await engine.launch();
    openedBrowsers.push(browser);
    const context = await browser.newContext({
      ...device,
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    observe(page);
    for (const language of ["ar", "en"]) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 844 });
        for (const route of paths) {
          await go(page, language + route);
          await layout(page);
          assert.equal(
            await page.locator("html").getAttribute("dir"),
            language === "ar" ? "rtl" : "ltr",
          );
          assert.equal(await page.locator("h1").count(), 1);
          if (route.includes("wifi-7-be5010"))
            assert.equal(await page.locator(".m-features li").count(), 6);
          if (route.includes("smart-lock-3d"))
            assert.equal(await page.locator(".m-features li").count(), 5);
        }
        record(
          `${engineName} ${language} ${width}px`,
          `${paths.length} routes: no overflow, missing images, undersized targets or direction errors`,
        );
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await go(page, language);
      const openName = language === "ar" ? "فتح القائمة" : "Open menu";
      await page.getByRole("button", { name: openName }).tap();
      assert.equal(
        await page.locator("dialog").evaluate((element) => element.open),
        true,
      );
      assert.equal(
        await page.evaluate(() => document.body.style.overflow),
        "hidden",
      );
      await page.locator(".m-menu-link[aria-expanded]").tap();
      assert.equal(await page.locator(".m-menu-products a").count(), 7);
      await page.locator(".m-menu-products a").nth(1).tap();
      await page.waitForURL(`**/${language}/products/networking`);
      assert.equal(
        await page.locator("dialog").evaluate((element) => element.open),
        false,
      );
      assert.notEqual(
        await page.evaluate(() => document.body.style.overflow),
        "hidden",
      );
      await page.locator(".m-category-content .m-product-teaser").tap();
      await page.waitForURL("**/products/wifi-7-be5010");
      await page.locator(".m-product-cta a").tap();
      await page.waitForURL("**#contact");
      await page.waitForSelector("#contact .m-notice");
      assert.match(
        await page.locator("#contact .m-notice").innerText(),
        /Wi-Fi 7 BE5010/,
      );
      for (let i = 0; i < 4; i++) {
        await page.locator(".m-inquiries button").nth(i).tap();
        assert.equal(
          await page
            .locator(".m-inquiries button")
            .nth(i)
            .getAttribute("aria-pressed"),
          "true",
        );
      }
      for (let i = 0; i < 3; i++) {
        await page.locator("#contact .m-channel button").nth(i).tap();
        assert.equal(
          await page.locator("#contact .m-channels [role=status]").count(),
          1,
        );
      }
      for (let i = 0; i < 4; i++) {
        await page.locator(".m-space>button").nth(i).tap();
        assert.equal(await page.locator(`#m-space-${i}`).count(), 1);
      }
      await page.locator("#m-space-3 a").tap();
      await page.waitForURL("**space=3**");
      await page.waitForSelector('.m-inquiries button:nth-child(3)[aria-pressed="true"]');
      assert.equal(
        await page
          .locator(".m-inquiries button")
          .nth(2)
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.locator(".m-footer>a").tap();
      await page.waitForURL(`**/${language}`);
      await page
        .locator(".m-header .m-language a")
        .filter({ hasText: language === "ar" ? "EN" : "AR" })
        .tap();
      await page.waitForURL(`**/${language === "ar" ? "en" : "ar"}`);
      assert.equal(await page.locator(".m-intro").count(), 0);
      record(
        `${engineName} ${language} touch journeys`,
        "menu, categories, product inquiry, four contact selectors, three placeholders, four use cases, footer and language switch",
      );
      await page.setViewportSize({ width: 844, height: 390 });
      await go(page, language);
      await layout(page);
      await page.getByRole("button", { name: openName }).tap();
      await page.locator(".m-menu-bottom .m-action").tap();
      assert.equal(
        await page.locator("dialog").evaluate((element) => element.open),
        false,
      );
      record(
        `${engineName} ${language} landscape`,
        "844×390, scrollable menu and working solution link",
      );
      await page.setViewportSize({ width: 390, height: 600 });
      await go(page, `${language}#contact`);
      await layout(page);
      record(
        `${engineName} ${language} short viewport`,
        "390×600; contact controls remain reachable; no text inputs/keyboard dependency",
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const language of ["ar", "en"]) {
      for (const [name, route] of [
        ["hero", ""],
        ["products", "/products"],
        ["wifi", "/products/wifi-7-be5010"],
        ["lock", "/products/smart-lock-3d"],
        ["ecosystem", "#ecosystem"],
        ["use-cases", "#use-cases"],
        ["contact", "#contact"],
      ]) {
        await go(page, language + route);
        if (route.startsWith("#"))
          await page
            .locator(route)
            .evaluate((element) =>
              element.scrollIntoView({ behavior: "instant" }),
            );
        await page.screenshot({
          path: path.join(output, `${engineName}-${language}-${name}.png`),
        });
      }
      await go(page, language);
      await page.locator(".m-header .m-icon-button").tap();
      await page.screenshot({
        path: path.join(output, `${engineName}-${language}-menu.png`),
      });
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => document.activeElement === document.querySelector('.m-header .m-icon-button'));
      assert.equal(
        await page.locator("dialog").evaluate((element) => element.open),
        false,
      );
      assert.equal(
        await page
          .locator(".m-header .m-icon-button")
          .evaluate((element) => document.activeElement === element),
        true,
      );
    }
    await context.close();
    const introContext = await browser.newContext({
      ...device,
      viewport: { width: 390, height: 844 },
    });
    const intro = await introContext.newPage();
    observe(intro);
    await intro.goto(`${base}/ar`);
    await intro.waitForSelector(".m-intro");
    await intro.evaluate(() => document.fonts.ready);
    await intro.screenshot({
      path: path.join(output, `${engineName}-ar-intro.png`),
    });
    await intro.getByRole("button", { name: "تخطي المقدمة" }).tap();
    await intro.waitForSelector(".m-intro", { state: "detached" });
    assert.equal(
      await intro.evaluate(() => sessionStorage.getItem("bama-intro-seen")),
      "true",
    );
    await intro.locator(".m-header .m-language a").first().tap();
    await intro.waitForURL("**/en");
    assert.equal(await intro.locator(".m-intro").count(), 0);
    await intro.reload();
    assert.equal(await intro.locator(".m-intro").count(), 0);
    await intro.evaluate(() => sessionStorage.removeItem("bama-intro-seen"));
    const start = Date.now();
    await intro.reload();
    await intro.waitForSelector(".m-intro");
    await intro.waitForSelector(".m-intro", {
      state: "detached",
      timeout: 7500,
    });
    const duration = Date.now() - start;
    assert(duration >= 4800 && duration < 7500);
    record(
      `${engineName} intro`,
      `skip, session persistence, language switch and auto-dismiss (${duration}ms) verified`,
    );
    await browser.close();
  }
  assert.deepEqual(errors, [], "Browser or resource errors");
  record(
    "Console and resources",
    "No browser exceptions, console errors or failed same-origin responses",
  );
} catch (error) {
  results.push({
    test: "Stopped on failure",
    status: "FAIL",
    detail: error.stack,
  });
  console.error(error);
  process.exitCode = 1;
} finally {
  await Promise.all(openedBrowsers.map(browser => browser.close()));
  await writeFile(
    path.join(output, "results.json"),
    JSON.stringify(
      { base, date: new Date().toISOString(), results, errors },
      null,
      2,
    ),
  );
}

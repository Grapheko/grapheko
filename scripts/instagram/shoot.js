const { chromium } = require('playwright')
const D = __dirname + '/' // usage : node shoot.js (rend carousel-*.html en JPEG 1080 × 1350)
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 })
  await p.goto('file://' + D + process.argv[2] || 'carousel-2026-11-per.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800)
  for (let i = 1; i <= 7; i++) await p.locator('#s' + i).screenshot({ path: `${D}grapheko-per-${i}.jpg`, type: 'jpeg', quality: 92 })
  await b.close()
})()

// Rend des SVG en PNG avec la police Bricolage Grotesque chargée depuis grapheko.fr
// Usage : NL_DIR=dossier node render.js nom1 nom2
const { chromium } = require('playwright')
const fs = require('fs')
const D = (process.env.NL_DIR || __dirname + '/out') + '/'
const files = process.argv.slice(2) // noms des SVG sans extension, rendus en PNG avec la police du site
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 1 })
  await p.goto('https://grapheko.fr/about', { waitUntil: 'load' }); await p.waitForTimeout(1500)
  await p.evaluate(() => { for (const el of [...document.body.children]) el.style.display = 'none' })
  for (const f of files) {
    const svg = fs.readFileSync(D + f + '.svg', 'utf8')
    await p.evaluate((svg) => { document.getElementById('ch')?.remove(); const d = document.createElement('div'); d.id = 'ch'; d.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;line-height:0'; d.innerHTML = svg; document.body.appendChild(d) }, svg)
    await p.waitForTimeout(200)
    await p.locator('#ch svg').screenshot({ path: D + f + '.png' })
  }
  await b.close()
})()

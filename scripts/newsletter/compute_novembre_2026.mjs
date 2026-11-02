// Calculs des éditions de novembre 2026 (exemple) : npx tsx scripts/newsletter/compute_novembre_2026.mjs
// Historiques : curl https://grapheko.fr/api/history/<actif> -o $NL_DIR/<actif>.json
import fs from 'fs'
import { backtestDca, feesImpact } from '../../lib/finance.js'
import { perSaving, marginalRate, incomeTax } from '../../lib/tax.js'
const D = (process.env.NL_DIR || new URL('./out/', import.meta.url).pathname).replace(/\/?$/, '/')
const out = {}
// 1. PER : économie d'un versement de 3 000 € selon le revenu imposable (personne seule)
out.per = [15000, 22000, 30000, 40000, 60000, 90000, 150000, 200000].map((income) => {
  const r = perSaving({ income, parts: 1, situation: 'single', isolated: false, payment: 3000, ceiling: 100000 })
  return { income, saving: r.saving, tmi: Math.round(marginalRate(income, 1) * 100), before: r.before }
})
// 2. DCA MSCI World 100 €/mois sur 10 ans
const msci = JSON.parse(fs.readFileSync(D + 'msci-world.json')).points
const dca = backtestDca(msci, { start: '2016-11', amount: 100 })
out.msci = { from: dca.from, to: dca.to, invested: dca.invested, value: Math.round(dca.value), perf: dca.perfPct, worstDd: dca.worstDrawdown, underwater: dca.monthsUnderwater, lump: Math.round(dca.lumpSumValue), months: dca.months,
  yearly: dca.rows.filter((r) => r.m.endsWith('-12') || r.m === dca.to).map((r) => ({ m: r.m, invested: r.invested, value: Math.round(r.value) })) }
// creux : pire écart valeur/versé
let worst = null; dca.rows.forEach((r) => { const g = r.value / r.invested - 1; if (!worst || g < worst.g) worst = { m: r.m, g, value: r.value, invested: r.invested } }); out.msci.worstVsInvested = worst
// pire baisse 2020 et 2022
const rowAt = (m) => dca.rows.find((r) => r.m === m)
out.msci.covid = [rowAt('2020-01'), rowAt('2020-03')].map((r) => r && { m: r.m, value: Math.round(r.value), invested: r.invested })
// 3. Frais 200 €/mois, 6 %, 30 ans
const f = feesImpact({ capital: 0, monthly: 200, ratePct: 6, years: 30, feesA: 0.2, feesB: 2 })
out.fees = { invested: f.a.invested, a: Math.round(f.a.value), b: Math.round(f.b.value), gap: Math.round(f.gap), rows: f.a.rows.map((r, i) => ({ y: r.year, a: Math.round(r.value), b: Math.round(f.b.rows[i].value), inv: r.invested })) }
// 4. S&P 500 en euros : sommet 2007
const sp = JSON.parse(fs.readFileSync(D + 'sp-500.json')).points
const y07 = sp.filter((p) => p.m >= '2006-01' && p.m <= '2008-12')
const peak = y07.reduce((a, b) => (b.close > a.close ? b : a))
const dsp = backtestDca(sp, { start: peak.m, amount: 100, end: sp.at(-1).m })
// lump : même total que 10 ans de DCA ? -> montant fixe 12 000 € investi au sommet vs 100 €/mois pendant 10 ans (120 versements) puis conservé
const n = 120
const series = sp.filter((p) => p.m >= peak.m)
let units = 0; series.slice(0, n).forEach((p) => (units += 100 / p.close))
const last = sp.at(-1)
const lumpUnits = 12000 / peak.close
// valeur au fil du temps
const rows = series.map((p, i) => { return { m: p.m } })
// recovery month for lump
const rec = series.find((p, i) => i > 0 && p.close >= peak.close)
// minimum after peak
const trough = series.slice(0, 40).reduce((a, b) => (b.close < a.close ? b : a))
// DCA value when lump recovered and dca break-even month
let u = 0, inv = 0, dcaBE = null
const path = series.map((p, i) => { if (i < n) { u += 100 / p.close; inv += 100 } const v = u * p.close; if (!dcaBE && i > 6 && v >= inv) dcaBE = p.m; return { m: p.m, dca: Math.round(v), dcaInv: inv, lump: Math.round(lumpUnits * p.close) } })
out.sp = { peak, trough, troughPct: (trough.close / peak.close - 1) * 100, recovery: rec?.m, dcaBreakEven: dcaBE, last, lumpNow: Math.round(lumpUnits * last.close), dcaNow: Math.round(u * last.close),
  y10: path[n - 1], path: path.filter((r, i) => i % 6 === 0 || i === path.length - 1) }
fs.writeFileSync(D + 'data.json', JSON.stringify(out, null, 1))
console.log(JSON.stringify({ per: out.per, msci: { ...out.msci, yearly: undefined }, fees: { ...out.fees, rows: undefined }, sp: { ...out.sp, path: undefined } }, null, 1))

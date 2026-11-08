// Calculs des éditions de décembre 2026 : NL_DIR=dossier node scripts/newsletter/compute_decembre_2026.mjs
// Aucun historique de cours : tout sort des fonctions du site (lib/lep.js, lib/tax.js, lib/finance.js).
import fs from 'fs'
import { lepCeiling, yearlyInterest, LEP_RATE, LIVRET_A_RATE } from '../../lib/lep.js'
import { incomeTax, marginalRate, flatTaxVsScale, partsFor } from '../../lib/tax.js'
import { compound } from '../../lib/finance.js'
const D = (process.env.NL_DIR || new URL('./out/', import.meta.url).pathname).replace(/\/?$/, '/')
fs.mkdirSync(D, { recursive: true })
const out = {}

// 1. LEP : plafonds 2026 selon le foyer, et intérêts d'un an LEP / Livret A
out.lep = {
  households: [
    { label: 'Seul', parts: partsFor({ situation: 'single' }) },
    { label: 'Seul, 1 enfant', parts: partsFor({ situation: 'single', children: 1, isolated: true }) },
    { label: 'Couple', parts: partsFor({ situation: 'couple' }) },
    { label: 'Couple, 1 enfant', parts: partsFor({ situation: 'couple', children: 1 }) },
    { label: 'Couple, 2 enfants', parts: partsFor({ situation: 'couple', children: 2 }) },
    { label: 'Couple, 3 enfants', parts: partsFor({ situation: 'couple', children: 3 }) },
  ].map((h) => ({ ...h, ceiling: lepCeiling(h.parts) })),
  rates: { lep: LEP_RATE, livretA: LIVRET_A_RATE },
  interest: [1000, 3000, 5000, 10000].map((a) => ({ amount: a, lep: yearlyInterest(a, LEP_RATE), livretA: yearlyInterest(a, LIVRET_A_RATE) })),
}

// 2. Tranche marginale et taux moyen, personne seule
out.rates = [15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000, 150000].map((income) => {
  const tax = incomeTax(income, 1)
  return { income, tax, avg: tax / income, tmi: marginalRate(income, 1) }
})

// 3. Commencer à 25 ou à 35 ans : 100 € par mois jusqu'à 65 ans, 5 % par an
const early = compound({ capital: 0, monthly: 100, ratePct: 5, years: 40 })
const late = compound({ capital: 0, monthly: 100, ratePct: 5, years: 30 })
const late150 = compound({ capital: 0, monthly: 150, ratePct: 5, years: 30 })
out.early = {
  early: { invested: early.invested, value: Math.round(early.value) },
  late: { invested: late.invested, value: Math.round(late.value) },
  late150: { invested: late150.invested, value: Math.round(late150.value) },
  // valeur selon l'âge, de 25 à 65 ans
  rows: early.rows.map((r) => ({ age: 25 + r.year, early: Math.round(r.value), late: r.year >= 10 ? Math.round(late.rows[r.year - 10].value) : 0 })),
  firstTenYears: { invested: 12000, value: Math.round(compound({ capital: 0, monthly: 100, ratePct: 5, years: 10 }).value) },
}

// 4. Flat tax ou barème : 1 000 € de dividendes, personne seule
out.flat = [10000, 15000, 20000, 25000, 30000, 40000, 60000, 100000].map((income) => {
  const r = flatTaxVsScale({ income, parts: 1, situation: 'single', isolated: false, dividends: 1000, interest: 0, gains: 0 })
  return { income, pfu: Math.round(r.pfu.total), scale: Math.round(r.scale.total), best: r.best, tmi: Math.round(r.tmi * 100) }
})
out.flatInterest = [20000, 30000].map((income) => {
  const r = flatTaxVsScale({ income, parts: 1, situation: 'single', isolated: false, dividends: 0, interest: 1000, gains: 0 })
  return { income, pfu: Math.round(r.pfu.total), scale: Math.round(r.scale.total), best: r.best }
})

fs.writeFileSync(D + 'data-decembre.json', JSON.stringify(out, null, 1))
console.log(JSON.stringify(out, (k, v) => (k === 'rows' ? undefined : v), 1))

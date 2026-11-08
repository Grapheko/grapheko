// Tests des calculs fiscaux (barème 2026, revenus 2025).
// Les valeurs attendues sont calculées à la main à partir du barème officiel :
// si une constante de lib/tax.js change, ces tests doivent être revus en même temps.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  BRACKETS, PER_MIN, PER_MAX,
  incomeTax, taxDetail, marginalRate, netSalary, partsFor,
  perCeilingEstimate, perSaving, perExitTax, perCurve, flatTaxVsScale,
} from '../lib/tax.js'

test('barème 2026 : seuils et taux des tranches', () => {
  assert.deepEqual(BRACKETS.map(([h]) => h), [11600, 29579, 84577, 181917, Infinity])
  assert.deepEqual(BRACKETS.map(([, r]) => r), [0, 0.11, 0.30, 0.41, 0.45])
})

test('impôt nul sous la première tranche', () => {
  assert.equal(incomeTax(0, 1), 0)
  assert.equal(incomeTax(11600, 1), 0)
  assert.equal(incomeTax(-500, 1), 0)
})

test('célibataire, 30 000 € : 2 104 € (pas de décote)', () => {
  // 17 979 × 11 % + 421 × 30 % = 2 103,99
  assert.deepEqual(taxDetail(30000, 1), { brut: 2104, decote: 0, net: 2104, capped: false })
})

test('célibataire, 20 000 € : décote appliquée', () => {
  // 8 400 × 11 % = 924 ; décote = 897 − 45,25 % × 924 = 478,89 ; net = 445,11
  assert.deepEqual(taxDetail(20000, 1), { brut: 924, decote: 479, net: 445, capped: false })
})

test('couple avec 2 enfants, 80 000 € : plafonnement du quotient familial', () => {
  // 3 parts : 4 972 € ; 2 parts : 10 207,98 € − 2 × 1 807 € = 6 593,98 € → plafonné
  const d = taxDetail(80000, 3, 'couple')
  assert.equal(d.net, 6594)
  assert.equal(d.capped, true)
})

test('parent isolé, 1 enfant, 40 000 € : plafond spécifique non atteint, décote', () => {
  // 2 parts : 1 848 € ; 1 part : 5 103,99 € − 4 262 € = 841,99 € → non plafonné
  // décote = 897 − 45,25 % × 1 848 = 60,78
  assert.deepEqual(taxDetail(40000, 2, 'single', true), { brut: 1848, decote: 61, net: 1787, capped: false })
})

test('la décote ne rend jamais l’impôt négatif', () => {
  for (let r = 0; r <= 40000; r += 250) {
    assert.ok(incomeTax(r, 1) >= 0)
    assert.ok(incomeTax(r, 2, 'couple') >= 0)
  }
})

test('l’impôt ne baisse jamais quand le revenu augmente', () => {
  const cases = [[1, 'single', false], [2, 'couple', false], [3, 'couple', false], [2, 'single', true], [4, 'couple', false]]
  for (const [parts, situation, isolated] of cases) {
    let prev = 0
    for (let r = 0; r <= 400000; r += 500) {
      const t = incomeTax(r, parts, situation, isolated)
      assert.ok(t >= prev, `${parts} parts ${situation} : ${r} € → ${t} < ${prev}`)
      prev = t
    }
  }
})

test('changer de tranche ne fait jamais baisser le revenu après impôt', () => {
  const cases = [[1, 'single', false], [2, 'couple', false], [3, 'couple', false], [2, 'single', true]]
  for (const [parts, situation, isolated] of cases) {
    let prev = -Infinity
    for (let r = 0; r <= 250000; r += 100) {
      const net = r - incomeTax(r, parts, situation, isolated)
      assert.ok(net >= prev - 1, `${parts} parts ${situation} : ${r} €`) // 1 € de tolérance pour les arrondis
      prev = net
    }
  }
})

test('taux marginal', () => {
  assert.equal(marginalRate(11000, 1), 0)
  assert.equal(marginalRate(20000, 1), 0.11)
  assert.equal(marginalRate(30000, 1), 0.30)
  assert.equal(marginalRate(100000, 1), 0.41)
  assert.equal(marginalRate(200000, 1), 0.45)
  assert.equal(marginalRate(60000, 2), 0.30)
})

test('déduction forfaitaire de 10 % (minimum 509 €, maximum 14 555 €)', () => {
  assert.equal(netSalary(1000), 491)
  assert.equal(netSalary(40000), 36000)
  assert.equal(netSalary(200000), 185445)
  assert.equal(netSalary(0), 0)
})

test('nombre de parts', () => {
  assert.equal(partsFor({ situation: 'single' }), 1)
  assert.equal(partsFor({ situation: 'couple' }), 2)
  assert.equal(partsFor({ situation: 'single', children: 1 }), 1.5)
  assert.equal(partsFor({ situation: 'single', children: 1, isolated: true }), 2)
  assert.equal(partsFor({ situation: 'couple', children: 2 }), 3)
  assert.equal(partsFor({ situation: 'couple', children: 3 }), 4)
  assert.equal(partsFor({ situation: 'couple', children: 1, isolated: true }), 2.5) // case T réservée aux personnes seules
})

test('PER : plafonds 2026 (PASS 2025 = 47 100 €)', () => {
  assert.equal(PER_MIN, 4710)
  assert.equal(PER_MAX, 37680)
  assert.equal(perCeilingEstimate(30000), 4710)
  assert.equal(perCeilingEstimate(100000), 10000)
  assert.equal(perCeilingEstimate(1000000), 37680)
})

test('PER : 5 000 € versés à 30 % de TMI font économiser 1 500 €', () => {
  const r = perSaving({ income: 50000, parts: 1, situation: 'single', payment: 5000, ceiling: 5000 })
  assert.equal(r.before, 8104)
  assert.equal(r.after, 6604)
  assert.equal(r.saving, 1500)
  assert.equal(r.netCost, 3500)
  assert.equal(r.effectiveRate, 0.3)
  assert.equal(r.tmi, 0.3)
  assert.equal(r.excess, 0)
})

test('PER : la part au-dessus du plafond n’est pas déduite', () => {
  const r = perSaving({ income: 50000, parts: 1, situation: 'single', payment: 8000, ceiling: 5000 })
  assert.equal(r.deductible, 5000)
  assert.equal(r.excess, 3000)
  assert.equal(r.saving, 1500)
})

test('PER : impôt à la sortie sur tout le versement', () => {
  assert.equal(perExitTax(1000, 0.11), 110)
  assert.equal(perExitTax(-10, 0.3), 0)
})

test('PER : la courbe d’économie est croissante et part de 0', () => {
  const pts = perCurve({ income: 60000, parts: 1, situation: 'single', ceiling: 6000, max: 10000 })
  assert.equal(pts[0].saving, 0)
  for (let i = 1; i < pts.length; i++) assert.ok(pts[i].saving >= pts[i - 1].saving)
})

test('flat tax : 31,4 % (12,8 % + 18,6 %)', () => {
  const r = flatTaxVsScale({ income: 50000, parts: 1, situation: 'single', dividends: 0, interest: 1000, gains: 0 })
  assert.equal(r.pfu.ir, 128)
  assert.equal(Math.round(r.social * 100) / 100, 186)
  assert.equal(Math.round(r.pfu.rate * 1000) / 1000, 0.314)
})

test('barème plus avantageux pour des dividendes à faible TMI', () => {
  // 1 000 € de dividendes, 20 000 € de revenus : 600 € imposables au barème
  // IR : 541 − 445 = 96 € ; CSG déductible : 445 − 434 = 11 € ; total 96 + 186 − 11 = 271 € < 314 €
  const r = flatTaxVsScale({ income: 20000, parts: 1, situation: 'single', dividends: 1000, interest: 0, gains: 0 })
  assert.equal(r.scale.taxable, 600)
  assert.equal(r.scale.ir, 96)
  assert.equal(r.scale.csgRelief, 11)
  assert.equal(Math.round(r.scale.total), 271)
  assert.equal(r.best, 'bareme')
})

test('flat tax plus avantageuse à 41 % de TMI', () => {
  const r = flatTaxVsScale({ income: 100000, parts: 1, situation: 'single', dividends: 10000, interest: 0, gains: 0 })
  assert.equal(r.best, 'pfu')
  assert.equal(r.tmi, 0.41)
})

test('aucun revenu du capital : pas de recommandation', () => {
  const r = flatTaxVsScale({ income: 30000, parts: 1, situation: 'single', dividends: 0, interest: 0, gains: 0 })
  assert.equal(r.best, null)
  assert.equal(r.pfu.rate, 0)
})

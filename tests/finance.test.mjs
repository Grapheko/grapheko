// Tests des simulateurs non fiscaux : DCA, investissement unique, intérêts composés, frais, rendement réel.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { backtestDca, backtestLump, compound, feesImpact, realReturn } from '../lib/finance.js'

const close = (a, b) => Math.abs(a - b) < 0.01

// Série fictive : 100, 50, 100 (un creux au milieu)
const pts = [
  { m: '2024-01', close: 100 },
  { m: '2024-02', close: 50 },
  { m: '2024-03', close: 100 },
]

test('DCA : achète plus de parts quand le prix baisse', () => {
  const r = backtestDca(pts, { start: '2024-01', amount: 100 })
  // parts : 1 + 2 + 1 = 4, investi 300 €, valeur finale 400 €
  assert.equal(r.invested, 300)
  assert.ok(close(r.value, 400))
  assert.ok(close(r.avgCost, 75))
  assert.ok(close(r.lumpSumValue, 300)) // 300 € investis au départ à 100 € → 3 parts → 300 €
  assert.equal(r.months, 3)
})

test('DCA : frais d’achat déduits de chaque versement', () => {
  const r = backtestDca(pts, { start: '2024-01', amount: 100, feePct: 1 })
  assert.ok(close(r.value, 396))
})

test('DCA trimestriel : un achat tous les 3 mois', () => {
  const r = backtestDca(pts, { start: '2024-01', amount: 100, everyMonths: 3 })
  assert.equal(r.invested, 100)
})

test('DCA et investissement unique : null si moins de 2 points', () => {
  assert.equal(backtestDca(pts, { start: '2024-03', amount: 100 }), null)
  assert.equal(backtestLump(pts, { start: '2024-03', amount: 100 }), null)
})

test('investissement unique : creux, perte maximale et rendement annuel', () => {
  const r = backtestLump(pts, { start: '2024-01', amount: 1000 })
  assert.ok(close(r.value, 1000))
  assert.ok(close(r.worstDrawdown, -50))
  assert.equal(r.lowMonth, '2024-02')
  assert.equal(r.monthsUnderwater, 1)
  assert.equal(r.cagrPct, null) // moins de 12 mois écoulés
})

test('investissement unique : rendement annuel moyen sur 2 ans', () => {
  const series = Array.from({ length: 25 }, (_, i) => ({ m: `x${String(i).padStart(2, '0')}`, close: 100 * 1.21 ** (i / 24) }))
  const r = backtestLump(series, { start: 'x00', amount: 1000 })
  assert.ok(close(r.cagrPct, 10))
})

test('intérêts composés : 1 000 € à 5 % pendant 10 ans', () => {
  const r = compound({ capital: 1000, monthly: 0, ratePct: 5, years: 10 })
  assert.ok(close(r.value, 1628.89))
  assert.equal(r.rows.length, 11)
})

test('intérêts composés : versements sans rendement', () => {
  const r = compound({ capital: 0, monthly: 100, ratePct: 0, years: 2 })
  assert.equal(r.invested, 2400)
  assert.ok(close(r.value, 2400))
  assert.ok(close(r.interests, 0))
})

test('frais : 1 % de frais en plus coûte toujours quelque chose', () => {
  const r = feesImpact({ capital: 10000, monthly: 100, ratePct: 6, years: 20, feesA: 0.2, feesB: 1.2 })
  assert.ok(r.gap > 0)
})

test('rendement réel : nul quand le taux égale l’inflation', () => {
  const r = realReturn({ capital: 1000, ratePct: 2, inflationPct: 2, years: 10 })
  assert.ok(close(r.realRate, 0))
  assert.ok(close(r.real, 1000))
})

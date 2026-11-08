// Tests du test d'éligibilité LEP. Plafonds 2026 (service-public.gouv.fr, fiche F2367).
// À revoir en janvier avec les plafonds de l'année (voir lib/lep.js).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ZONES, lepCeiling, lepEligibility, yearlyInterest, LEP_RATE, LIVRET_A_RATE, LEP_MAX_DEPOSIT } from '../lib/lep.js'

test('tables complètes : 21 valeurs (1 à 6 parts, par quart) et croissantes', () => {
  for (const [name, z] of Object.entries(ZONES)) {
    assert.equal(z.table.length, 21, name)
    for (let i = 1; i < z.table.length; i++) assert.ok(z.table[i] > z.table[i - 1], `${name} index ${i}`)
  }
})

test('plafonds 2026 en métropole', () => {
  assert.equal(lepCeiling(1), 23028)
  assert.equal(lepCeiling(1.25), 26103)
  assert.equal(lepCeiling(1.5), 29177)
  assert.equal(lepCeiling(2), 35326)
  assert.equal(lepCeiling(3), 47624)
  assert.equal(lepCeiling(6), 84518)
})

test('plafonds des autres zones pour 1 part', () => {
  assert.equal(lepCeiling(1, 'antilles'), 27251)
  assert.equal(lepCeiling(1, 'guyane'), 28489)
  assert.equal(lepCeiling(1, 'inconnue'), 23028) // zone inconnue → métropole
})

test('au-delà de 6 parts : 6 149 € par demi-part et le quart de la zone', () => {
  assert.equal(lepCeiling(6.25), 84518 + 3075)
  assert.equal(lepCeiling(6.5), 84518 + 6149)
  assert.equal(lepCeiling(7), 84518 + 2 * 6149)
})

test('éligible au plafond pile (« ne doivent pas dépasser »)', () => {
  assert.equal(lepEligibility({ latest: 23028, parts: 1, zone: 'metropole' }).eligible, true)
  assert.equal(lepEligibility({ latest: 23029, parts: 1, zone: 'metropole' }).eligible, false)
})

test('l’avant-dernier avis suffit', () => {
  const r = lepEligibility({ latest: 30000, previous: 20000, parts: 1, zone: 'metropole' })
  assert.equal(r.latestOk, false)
  assert.equal(r.previousOk, true)
  assert.equal(r.eligible, true)
})

test('rattaché au foyer de ses parents : non éligible', () => {
  assert.equal(lepEligibility({ latest: 10000, parts: 1, zone: 'metropole', attached: true }).eligible, false)
})

test('taux en vigueur et intérêts annuels', () => {
  assert.ok(LEP_RATE > LIVRET_A_RATE)
  assert.equal(LEP_MAX_DEPOSIT, 10000)
  assert.equal(Math.round(yearlyInterest(10000, LEP_RATE)), 250)
  assert.equal(yearlyInterest(-5, LEP_RATE), 0)
})

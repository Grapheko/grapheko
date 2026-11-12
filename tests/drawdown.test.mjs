import { test } from 'node:test'
import assert from 'node:assert/strict'
import { drawdownEpisodes } from '../lib/drawdown.js'

const pts = (closes) => closes.map((close, i) => ({ m: `2020-${String(i + 1).padStart(2, '0')}`, close }))

test('repère sommet, creux, baisse et rattrapage', () => {
  const r = drawdownEpisodes(pts([100, 120, 90, 60, 100, 125, 110, 118]), { min: -5 })
  assert.equal(r.episodes.length, 2)
  const [a, b] = r.episodes
  assert.equal(a.peak, '2020-02'); assert.equal(a.trough, '2020-04'); assert.equal(a.drop, -50)
  assert.equal(a.recovered, '2020-06'); assert.equal(a.monthsToRecover, 4); assert.equal(a.monthsToTrough, 2)
  assert.equal(b.recovered, null) // baisse en cours
  assert.ok(Math.abs(r.fromPeak - (118 / 125 - 1) * 100) < 1e-9)
})

test('ignore les baisses sous le seuil et sans baisse', () => {
  assert.equal(drawdownEpisodes(pts([100, 95, 101]), { min: -10 }).episodes.length, 0)
  assert.equal(drawdownEpisodes(pts([1, 2, 3])).fromPeak, 0)
})

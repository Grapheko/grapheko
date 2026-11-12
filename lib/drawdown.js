// Épisodes de baisse sur clôtures mensuelles : du sommet au creux, puis retour au sommet.
// Un épisode compte s'il dépasse `min` % (négatif). Triés du plus fort au plus faible.
// `recovered` : mois où la clôture a retrouvé le sommet (null si pas encore).
export function drawdownEpisodes(points, { min = -10, limit = 5 } = {}) {
  if (!points?.length) return { episodes: [], fromPeak: 0, peak: null }
  const episodes = []
  let peak = points[0].close
  let peakM = points[0].m
  let cur = null
  points.forEach((p, i) => {
    if (p.close >= peak) {
      if (cur) { cur.recovered = p.m; cur.monthsToRecover = i - cur.peakIdx; episodes.push(cur); cur = null }
      peak = p.close; peakM = p.m
      return
    }
    const dd = (p.close / peak - 1) * 100
    if (!cur) cur = { peak: peakM, peakIdx: i - 1, trough: p.m, troughIdx: i, drop: dd, recovered: null, monthsToRecover: null }
    else if (dd < cur.drop) { cur.trough = p.m; cur.troughIdx = i; cur.drop = dd }
  })
  if (cur) episodes.push(cur)
  const last = points[points.length - 1]
  const kept = episodes
    .filter((e) => e.drop <= min)
    .sort((a, b) => a.drop - b.drop)
    .slice(0, limit)
    .map(({ peakIdx, troughIdx, ...e }) => ({ ...e, monthsToTrough: troughIdx - peakIdx }))
  return { episodes: kept, fromPeak: (last.close / peak - 1) * 100, peak: peakM, lastMonth: last.m }
}

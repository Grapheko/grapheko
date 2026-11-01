// Préparation des données de marché pour les pages (côté serveur, getStaticProps)
import { ASSETS } from './assets'
import { getMonthlyHistory, historyStats } from './history'

export const REVALIDATE = 43200 // 12 h

export async function getMarketsRows() {
  const histories = await Promise.all(ASSETS.map((a) => getMonthlyHistory(a.slug)))
  return ASSETS.map((a, i) => {
    const h = histories[i]
    return {
      slug: a.slug,
      name: a.name,
      kind: a.kind,
      featured: a.featured !== false,
      stats: h ? historyStats(h.points) : null,
      spark: h ? h.points.slice(-60).map((p) => p.close) : null,
      demo: !!h?.demo,
    }
  })
}

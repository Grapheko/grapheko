import { getMonthlyHistory } from '../../../lib/history'
import { getAsset } from '../../../lib/assets'

export default async function handler(req, res) {
  const { slug } = req.query
  if (!getAsset(slug)) return res.status(404).json({ error: 'Actif inconnu' })
  const data = await getMonthlyHistory(slug)
  if (!data) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(503).json({ error: 'Historique indisponible pour le moment' })
  }
  // Cache CDN Vercel : 12 h, puis resservi pendant la mise à jour
  res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=604800')
  return res.status(200).json(data)
}

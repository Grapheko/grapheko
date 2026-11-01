// /calendrier.ics (réécrit vers /api/calendrier) : flux d'abonnement complet.
// /api/calendrier?id=<événement> : un seul événement, à importer dans son agenda.
import { EVENTS, getEvent, toIcs } from '../../lib/content/calendar'

export default function handler(req, res) {
  const one = req.query.id ? getEvent(String(req.query.id)) : null
  if (req.query.id && (!one || !one.confirmed)) {
    res.status(404).json({ error: 'Événement introuvable ou date non confirmée' })
    return
  }
  const body = toIcs(one ? [one] : EVENTS, one ? { name: one.title } : undefined)
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  if (one) res.setHeader('Content-Disposition', `attachment; filename="grapheko-${one.id}.ics"`)
  res.status(200).send(body)
}

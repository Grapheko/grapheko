// Inscription à la newsletter (Brevo).
// Si BREVO_DOI_TEMPLATE_ID est défini, inscription en double opt-in : Brevo envoie un
// e-mail de confirmation et le contact n'entre dans la liste qu'après le clic.
import { rateLimited } from '../../lib/rateLimit'

const LIST_ID = 3
const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/
const cleanText = (v, max) => String(v || '').replace(/[<>"\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, prenom, source, website } = req.body || {}

  // Champ piège anti-robot : rempli = robot, on fait comme si tout allait bien
  if (website) return res.status(200).json({ success: true })
  if (rateLimited(req, 'subscribe', { max: 5, windowMs: 10 * 60 * 1000 })) {
    return res.status(429).json({ error: 'Trop de tentatives, réessaie dans quelques minutes.' })
  }

  const mail = String(email || '').toLowerCase().trim()
  if (mail.length > 254 || !EMAIL_RE.test(mail)) return res.status(400).json({ error: 'Email invalide' })
  if (!process.env.BREVO_API_KEY) return res.status(503).json({ error: 'Service indisponible' })

  const attributes = { PRENOM: cleanText(prenom, 40), SOURCE: `grapheko-${cleanText(source, 40).replace(/[^a-z0-9_-]/gi, '') || 'site'}` }
  const doi = Number(process.env.BREVO_DOI_TEMPLATE_ID) || null
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY }

  const direct = () => fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: mail, attributes, listIds: [LIST_ID], updateEnabled: true }),
  })

  try {
    let pending = Boolean(doi)
    let response = doi
      ? await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: mail, attributes, includeListIds: [LIST_ID], templateId: doi, redirectionUrl: 'https://grapheko.fr/newsletter?confirmation=ok' }),
      })
      : await direct()
    // Modèle de confirmation refusé par Brevo (inactif, sans tag « optin »…) : on ne bloque
    // pas le visiteur, on l'inscrit directement et on le signale dans les journaux.
    if (doi && response.status === 400) {
      const err = await response.clone().json().catch(() => ({}))
      if (err.code === 'invalid_parameter' && /template/i.test(err.message || '')) {
        console.error('subscribe brevo DOI indisponible, inscription directe :', err.message)
        response = await direct()
        pending = false
      }
    }
    if (response.status === 201 || response.status === 204) return res.status(200).json({ success: true, pending })
    const data = await response.json().catch(() => ({}))
    if (data.code === 'duplicate_parameter') return res.status(200).json({ success: true, pending })
    console.error('subscribe brevo', response.status, JSON.stringify(data).slice(0, 300))
    return res.status(502).json({ error: 'Erreur du service d’envoi' })
  } catch {
    return res.status(502).json({ error: 'Erreur serveur' })
  }
}

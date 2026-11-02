// Envoi du formulaire de contact par e-mail via l'API transactionnelle Brevo.
// Variables Vercel requises : BREVO_API_KEY, CONTACT_SENDER (adresse expéditrice
// validée dans Brevo), CONTACT_TO (destinataire, par défaut contact@grapheko.fr).
import { rateLimited } from '../../lib/rateLimit'

const SUBJECTS = ['Partenariat', 'Presse', 'Question sur un contenu', 'Signaler une erreur', 'Autre']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, name, subject, message, website } = req.body || {}

  // Champ piège anti-robot : rempli = robot, on fait comme si tout allait bien
  if (website) return res.status(200).json({ success: true })

  if (rateLimited(req, 'contact', { max: 3, windowMs: 10 * 60 * 1000 })) return res.status(429).json({ error: 'rate' })
  if (!email || String(email).length > 254 || !/^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(String(email).trim())) return res.status(400).json({ error: 'email' })
  if (!message || String(message).trim().length < 10) return res.status(400).json({ error: 'message' })
  if (!process.env.BREVO_API_KEY || !process.env.CONTACT_SENDER) return res.status(503).json({ error: 'config' })

  const safeSubject = SUBJECTS.includes(subject) ? subject : 'Autre'
  const escape = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'api-key': process.env.BREVO_API_KEY },
      body: JSON.stringify({
        sender: { email: process.env.CONTACT_SENDER, name: 'Formulaire Grapheko' },
        to: [{ email: process.env.CONTACT_TO || 'contact@grapheko.fr' }],
        replyTo: { email: String(email).trim(), name: String(name || '').replace(/[<>"\r\n]/g, '').slice(0, 80) || undefined },
        subject: `[Grapheko] ${safeSubject}`,
        htmlContent: `<p><strong>De :</strong> ${escape(name || '')} &lt;${escape(email)}&gt;</p><p><strong>Sujet :</strong> ${safeSubject}</p><p>${escape(message).slice(0, 5000).replace(/\n/g, '<br>')}</p>`,
      }),
    })
    if (!r.ok) {
      // On journalise le message de Brevo (code et explication), jamais la clé
      const body = await r.text().catch(() => '')
      throw new Error(`${r.status} ${body.slice(0, 300)}`)
    }
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('contact error', e.message)
    return res.status(502).json({ error: 'send' })
  }
}

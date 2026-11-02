// Envoi automatique de la newsletter du dimanche (tâche planifiée Vercel, voir vercel.json).
// Le jour d'une édition (lib/content/newsletters.js), crée la campagne dans Brevo
// sur la liste Grapheko Weekly et l'envoie. Ne fait rien les autres jours.
//
// Protégée par CRON_SECRET (Vercel l'envoie dans l'en-tête Authorization).
// Paramètres manuels, toujours avec l'en-tête :
//   ?date=AAAA-MM-JJ        traiter une autre date que celle du jour
//   ?mode=preview           renvoie le HTML de l'e-mail, sans rien envoyer
//   ?mode=test              crée un brouillon « [TEST] » et l'envoie à NEWSLETTER_TEST_EMAIL
import { getNewsletter } from '../../../lib/content/newsletters'
import { newsletterHtml } from '../../../lib/newsletterHtml'
import { todayParis } from '../../../lib/content/calendar'

const LIST_ID = 3
const SENDER = { name: 'Gauthier de Grapheko', email: 'admin@grapheko.fr' }
const API = 'https://api.brevo.com/v3'

async function brevo(path, { method = 'GET', body } = {}) {
  const r = await fetch(API + path, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`Brevo ${method} ${path} → ${r.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : {}
}

// Une campagne de ce nom existe-t-elle déjà ? (évite un double envoi si la tâche est relancée)
async function alreadyCreated(name) {
  const { campaigns = [] } = await brevo('/emailCampaigns?limit=100&offset=0&sort=desc')
  return campaigns.find((c) => c.name === name) || null
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(req.query.date || '')) ? String(req.query.date) : todayParis()
  const mode = ['preview', 'test'].includes(req.query.mode) ? req.query.mode : 'send'
  const n = getNewsletter(date)
  if (!n) return res.status(200).json({ ok: true, date, action: 'aucune édition ce jour' })

  const html = newsletterHtml(n)
  if (mode === 'preview') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(200).send(html)
  }
  if (!process.env.BREVO_API_KEY) return res.status(503).json({ error: 'BREVO_API_KEY manquante' })

  const name = mode === 'test' ? `[TEST] Newsletter ${date}` : `Newsletter ${date}`
  try {
    const existing = await alreadyCreated(name)
    if (existing && mode === 'send') {
      return res.status(200).json({ ok: true, date, action: 'déjà créée, rien à faire', campaignId: existing.id, status: existing.status })
    }
    const content = { subject: n.subject, previewText: n.preheader, sender: SENDER, replyTo: SENDER.email, htmlContent: html }
    // Un brouillon de test déjà créé est mis à jour avec la dernière version de l'édition
    if (existing && mode === 'test') await brevo(`/emailCampaigns/${existing.id}`, { method: 'PUT', body: content })
    const campaign = existing || await brevo('/emailCampaigns', {
      method: 'POST',
      body: { name, ...content, recipients: { listIds: [LIST_ID] }, inlineImageActivation: false },
    })
    if (mode === 'test') {
      const to = (process.env.NEWSLETTER_TEST_EMAIL || SENDER.email).split(',').map((s) => s.trim()).filter(Boolean)
      await brevo(`/emailCampaigns/${campaign.id}/sendTest`, { method: 'POST', body: { emailTo: to } })
      return res.status(200).json({ ok: true, date, action: 'test envoyé', campaignId: campaign.id, to })
    }
    await brevo(`/emailCampaigns/${campaign.id}/sendNow`, { method: 'POST' })
    console.log('newsletter envoyée', date, campaign.id)
    return res.status(200).json({ ok: true, date, action: 'envoyée', campaignId: campaign.id })
  } catch (e) {
    console.error('newsletter', date, e.message)
    return res.status(502).json({ ok: false, date, error: e.message })
  }
}

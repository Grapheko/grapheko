// Contrôle quotidien du site (tâche planifiée Vercel, voir vercel.json).
// Vérifie les données de marché et la newsletter, et envoie un e-mail s'il y a un problème.
// Ne touche à aucune donnée : uniquement des lectures, plus l'e-mail d'alerte.
// Signale aussi à IndexNow (Bing) les pages modifiées la veille ou le jour même (date du sitemap).
//
// Protégée par CRON_SECRET (Vercel l'envoie dans l'en-tête Authorization).
// Sur une version d'essai Vercel, sans CRON_SECRET : contrôle à blanc, sans e-mail.
//   ?mode=test-alerte       envoie un e-mail d'alerte d'essai, sans lancer les contrôles
//   ?mode=indexnow-tout     envoie toutes les URL du sitemap à IndexNow, sans lancer les contrôles
import { ASSETS } from '../../../lib/assets'
import { getMonthlyHistory } from '../../../lib/history'
import { NEWSLETTERS } from '../../../lib/content/newsletters'
import { todayParis } from '../../../lib/content/calendar'
import { allUrls, recentlyChanged, submitIndexNow } from '../../../lib/indexnow'

export const config = { maxDuration: 60 }

const SITE = 'https://grapheko.fr'
const API = 'https://api.brevo.com/v3'
const LIST_ID = 3
const NEWSLETTER_SENDER = 'admin@grapheko.fr'
const CAMPAIGN_OK = ['sent', 'in_process', 'queued']
const BATCH = 5 // requêtes groupées, pour ne pas saturer Yahoo Finance

const monthIndex = (m) => parseInt(m.slice(0, 4), 10) * 12 + parseInt(m.slice(5), 10)
const addDays = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10)
const escapeHtml = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

async function brevo(path) {
  const r = await fetch(API + path, {
    headers: { Accept: 'application/json', 'api-key': process.env.BREVO_API_KEY },
    signal: AbortSignal.timeout(10000),
  })
  const text = await r.text()
  if (!r.ok) throw new Error(`${r.status} ${text.slice(0, 160)}`)
  return text ? JSON.parse(text) : {}
}

// Historiques : disponibles, et clôturés il y a au plus deux mois
async function checkHistories(today, problems) {
  const now = monthIndex(today.slice(0, 7))
  for (let i = 0; i < ASSETS.length; i += BATCH) {
    const batch = ASSETS.slice(i, i + BATCH)
    const results = await Promise.all(batch.map((a) => getMonthlyHistory(a.slug)))
    results.forEach((h, k) => {
      const a = batch[k]
      if (!h?.points?.length) problems.push(`Historique indisponible : ${a.name} (/marches/${a.slug}).`)
      else if (now - monthIndex(h.points[h.points.length - 1].m) > 2) problems.push(`Historique périmé : ${a.name}, dernière clôture ${h.points[h.points.length - 1].m}.`)
    })
  }
}

// Bandeau : indices et or en différé
async function checkTicker(problems) {
  try {
    const r = await fetch(`${SITE}/api/ticker`, { signal: AbortSignal.timeout(15000) })
    if (!r.ok) throw new Error(String(r.status))
    const { data = [] } = await r.json()
    const missing = data.filter((d) => d.price == null).map((d) => d.name)
    if (!data.length) problems.push('Bandeau des cours : aucune donnée.')
    if (missing.length) problems.push(`Bandeau des cours : pas de prix pour ${missing.join(', ')}.`)
  } catch (e) {
    problems.push(`Bandeau des cours indisponible (${e.message}).`)
  }
}

// Newsletter : accès Brevo, édition de la semaine, envoi du jour
async function checkNewsletter(today, problems) {
  const ready = NEWSLETTERS.filter((n) => n.ready)
  const next = ready.filter((n) => n.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1))[0]
  const facts = { nextEdition: next?.date || null }

  const dow = new Date(`${today}T12:00:00Z`).getUTCDay()
  const daysToSunday = (7 - dow) % 7
  const sunday = addDays(today, daysToSunday)
  if (daysToSunday <= 3 && !ready.some((n) => n.date === sunday)) problems.push(`Newsletter : aucune édition prête pour le dimanche ${sunday}.`)

  if (next?.image) {
    try {
      const r = await fetch(SITE + next.image, { method: 'HEAD', signal: AbortSignal.timeout(10000) })
      if (!r.ok) problems.push(`Newsletter ${next.date} : image introuvable (${next.image}, ${r.status}).`)
    } catch (e) {
      problems.push(`Newsletter ${next.date} : image injoignable (${e.message}).`)
    }
  }

  if (!process.env.BREVO_API_KEY) {
    problems.push('Newsletter : BREVO_API_KEY manquante.')
    return facts
  }

  // Le même appel que l'envoi du dimanche : il échoue si la clé n'a pas le droit de gérer les campagnes
  let campaigns = null
  try {
    campaigns = (await brevo('/emailCampaigns?limit=100&offset=0&sort=desc')).campaigns || []
    facts.campaignsAccess = true
  } catch (e) {
    facts.campaignsAccess = false
    problems.push(`Newsletter : Brevo refuse l'accès aux campagnes (${e.message}). L'envoi du dimanche échouera.`)
  }

  try {
    const list = await brevo(`/contacts/lists/${LIST_ID}`)
    facts.listFound = true
    facts.subscribers = list.totalSubscribers ?? list.uniqueSubscribers ?? null
  } catch (e) {
    problems.push(`Newsletter : liste Brevo n°${LIST_ID} inaccessible (${e.message}).`)
  }

  try {
    const { senders = [] } = await brevo('/senders')
    const sender = senders.find((s) => s.email === NEWSLETTER_SENDER)
    facts.senderActive = sender ? !!sender.active : false
    if (!sender?.active) problems.push(`Newsletter : expéditeur ${NEWSLETTER_SENDER} absent ou inactif dans Brevo.`)
  } catch (e) {
    // Une clé peut gérer les campagnes sans avoir accès à la liste des expéditeurs
    facts.senderActive = null
    facts.senderNote = `non vérifiable (${e.message.slice(0, 60)})`
  }

  const edition = ready.find((n) => n.date === today)
  if (edition && campaigns) {
    const campaign = campaigns.find((c) => c.name === `Newsletter ${today}`)
    facts.todayCampaign = campaign?.status || null
    if (!campaign) problems.push(`Newsletter ${today} : la campagne du jour n'a pas été créée.`)
    else if (!CAMPAIGN_OK.includes(campaign.status)) problems.push(`Newsletter ${today} : campagne n°${campaign.id} au statut « ${campaign.status} ».`)
  }
  return facts
}

// IndexNow : pages dont la date du sitemap est d'hier ou d'aujourd'hui
async function pingIndexNow(today, problems) {
  const urls = recentlyChanged(today, 1)
  try {
    return { urls, ...(await submitIndexNow(urls)) }
  } catch (e) {
    problems.push(`IndexNow : envoi refusé (${e.message}).`)
    return { urls, sent: 0, error: e.message }
  }
}

async function sendAlert(subject, lines) {
  const to = (process.env.ALERT_EMAIL || process.env.NEWSLETTER_TEST_EMAIL || process.env.CONTACT_TO || 'contact@grapheko.fr')
    .split(',').map((s) => s.trim()).filter(Boolean).map((email) => ({ email }))
  const r = await fetch(`${API}/smtp/email`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: JSON.stringify({
      sender: { email: NEWSLETTER_SENDER, name: 'Surveillance Grapheko' },
      to,
      subject,
      htmlContent: `<p>Le contrôle quotidien de grapheko.fr a relevé :</p><ul>${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul><p>Détails : Vercel, projet grapheko-8bjw, onglet Logs.</p>`,
    }),
    signal: AbortSignal.timeout(10000),
  })
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 160)}`)
  return to.length
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const secret = process.env.CRON_SECRET
  const authorized = !!secret && req.headers.authorization === `Bearer ${secret}`
  const dryRun = !authorized && process.env.VERCEL_ENV === 'preview'
  if (!authorized && !dryRun) return res.status(401).json({ error: 'Non autorisé' })

  if (req.query.mode === 'test-alerte') {
    try {
      const recipients = await sendAlert('[Grapheko] Essai de l’alerte', ['Ceci est un essai : aucun problème à traiter.'])
      return res.status(200).json({ ok: true, action: 'alerte d’essai acceptée par Brevo', recipients })
    } catch (e) {
      console.error('[health] alerte d’essai', e.message)
      return res.status(502).json({ ok: false, error: e.message })
    }
  }

  const today = todayParis()

  if (req.query.mode === 'indexnow-tout') {
    if (dryRun) return res.status(200).json({ ok: true, dryRun, wouldSend: allUrls(today).length })
    try {
      return res.status(200).json({ ok: true, ...(await submitIndexNow(allUrls(today))) })
    } catch (e) {
      console.error('[health] indexnow', e.message)
      return res.status(502).json({ ok: false, error: e.message })
    }
  }

  const problems = []
  await checkHistories(today, problems)
  await checkTicker(problems)
  const newsletter = await checkNewsletter(today, problems)
  // Production uniquement : une version d'essai ne doit pas annoncer d'URL aux moteurs
  const indexnow = process.env.VERCEL_ENV === 'production' ? await pingIndexNow(today, problems) : { skipped: true }

  problems.forEach((p) => console.error('[health]', p))
  let alert = 'aucune'
  if (problems.length && !dryRun) {
    try {
      await sendAlert(`[Grapheko] Alerte : ${problems.length} problème${problems.length > 1 ? 's' : ''} détecté${problems.length > 1 ? 's' : ''}`, problems)
      alert = 'envoyée'
    } catch (e) {
      // Si Brevo est lui-même en panne, il ne reste que le journal Vercel
      alert = 'échec'
      console.error('[health] alerte non envoyée', e.message)
    }
  } else if (problems.length) {
    alert = 'contrôle à blanc, non envoyée'
  }

  return res.status(200).json({ ok: problems.length === 0, today, dryRun, problems, newsletter, indexnow, alert })
}

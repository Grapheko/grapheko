// ══════════════════════════════════════════════════════════════
// API Route : /api/ticker — indices et or, en DIFFÉRÉ d'au moins 15 minutes
//
// Les cryptos ne passent pas par ici : elles arrivent en temps réel dans le
// navigateur depuis les flux publics des plateformes (lib/liveCrypto.js).
//
// Pour les indices, le droit d'afficher du temps réel est payant (licences
// des bourses). On n'affiche donc que des cours vieux d'au moins 15 minutes,
// avec leur heure exacte. Aucune clé API nécessaire.
// ══════════════════════════════════════════════════════════════
import { ASSETS } from '../../lib/assets'

const DELAY_MS = 15 * 60 * 1000
const TTL = 60_000
const UA = 'Mozilla/5.0 (compatible; GraphekoBot/1.0; +https://grapheko.fr)'
let cache = { data: null, at: 0 }

const DELAYED = ASSETS.filter((a) => a.live?.type === 'delayed')

async function chart(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=5m`
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`${res.status} ${symbol}`)
  const r = (await res.json())?.chart?.result?.[0]
  if (!r) throw new Error(`vide ${symbol}`)
  return r
}

// Dernier cours connu datant d'au moins 15 minutes
function delayedQuote(r, now) {
  const ts = r.timestamp || []
  const closes = r.indicators?.quote?.[0]?.close || []
  const limit = (now - DELAY_MS) / 1000
  for (let i = ts.length - 1; i >= 0; i--) {
    if (ts[i] <= limit && Number.isFinite(closes[i])) return { price: closes[i], time: ts[i] * 1000 }
  }
  // Marché fermé toute la journée (ou aucune bougie assez ancienne) : dernière clôture connue
  const prev = r.meta?.chartPreviousClose
  return Number.isFinite(prev) ? { price: prev, time: null, closed: true } : null
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const now = Date.now()
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

  if (cache.data && now - cache.at < TTL) return res.status(200).json({ data: cache.data, cached: true })

  const needsFx = DELAYED.some((a) => a.live.toEur)
  const [fxRes, ...results] = await Promise.allSettled([
    needsFx ? chart('EURUSD=X') : Promise.resolve(null),
    ...DELAYED.map((a) => chart(a.live.yahoo)),
  ])
  const eurUsd = fxRes.status === 'fulfilled' && fxRes.value ? delayedQuote(fxRes.value, now)?.price : null

  const data = DELAYED.map((a, i) => {
    const base = { slug: a.slug, name: a.short, kind: 'delayed', price: null, changePct: null, time: null, unit: a.live.toEur ? '€' : 'pts' }
    const r = results[i]
    if (r.status !== 'fulfilled') return base
    const q = delayedQuote(r.value, now)
    const prevClose = r.value.meta?.chartPreviousClose
    if (!q) return base
    if (a.live.toEur && !eurUsd) return base
    const fx = a.live.toEur ? eurUsd : 1
    return {
      ...base,
      price: Math.round((q.price / fx) * 100) / 100,
      changePct: !q.closed && Number.isFinite(prevClose) ? Math.round((q.price / prevClose - 1) * 10000) / 100 : null,
      time: q.time,
    }
  })

  if (data.some((d) => d.price != null)) cache = { data, at: now }
  return res.status(200).json({ data, cached: false })
}

// ══════════════════════════════════════════════════════════════
// API Route : /api/ticker — cours en direct via Finnhub
// La clé doit être définie dans Vercel : FINNHUB_KEY (jamais dans le code).
// Cache serveur : 60 secondes. Sans données, on affiche "—" (jamais de faux cours).
// ══════════════════════════════════════════════════════════════
import { ASSETS } from '../../lib/assets'

const FINNHUB_KEY = process.env.FINNHUB_KEY
const BASE = 'https://finnhub.io/api/v1'
const TTL = 60_000
let cache = { data: null, at: 0 }

const SYMBOLS = ASSETS.filter((a) => a.finnhub)

const fetchQuote = async (symbol) => {
  const res = await fetch(`${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`, {
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) return null
  const q = await res.json()
  return q?.c > 0 ? q : null
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const now = Date.now()

  if (cache.data && now - cache.at < TTL) {
    return res.status(200).json({ data: cache.data, cached: true, nextRefresh: Math.round((TTL - (now - cache.at)) / 1000) })
  }

  const empty = SYMBOLS.map((a) => ({ slug: a.slug, name: a.short, price: null, changePct: null, live: false }))
  if (!FINNHUB_KEY) return res.status(200).json({ data: empty, fallback: true, reason: 'FINNHUB_KEY manquante' })

  try {
    let eurUsd = null
    const fx = await fetchQuote('OANDA:EUR_USD').catch(() => null)
    if (fx?.c > 0) eurUsd = fx.c

    const quotes = await Promise.allSettled(SYMBOLS.map((a) => fetchQuote(a.finnhub)))
    const data = SYMBOLS.map((a, i) => {
      const q = quotes[i].status === 'fulfilled' ? quotes[i].value : null
      if (!q) return empty[i]
      // Conversion en euros des actifs cotés en dollars (cryptos en USDT ≈ USD)
      const needsFx = a.currency === 'USD' && a.kind !== 'bourse'
      if (needsFx && !eurUsd) return empty[i]
      const price = needsFx ? q.c / eurUsd : q.c
      return {
        slug: a.slug,
        name: a.short,
        price: Math.round(price * 100) / 100,
        unit: needsFx ? '€' : a.currency === 'USD' ? 'pts ($)' : 'pts',
        changePct: Number.isFinite(q.dp) ? Math.round(q.dp * 100) / 100 : null,
        live: true,
      }
    })

    cache = { data, at: now }
    return res.status(200).json({ data, cached: false, timestamp: new Date().toISOString(), nextRefresh: 60 })
  } catch (error) {
    console.error('Ticker error:', error)
    return res.status(200).json({ data: empty, fallback: true })
  }
}

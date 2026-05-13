// ══════════════════════════════════════════════════════════════
// API Route : /api/ticker
// Fetch les cours en temps réel via Alpha Vantage
// Cache serveur 60s pour préserver les quotas (25 appels/jour free tier)
// GTM event : tracker_data_refresh
// ══════════════════════════════════════════════════════════════

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'ZZHXXRP7HIXZ4Y6M'

// ── Symboles à fetcher ──────────────────────────────────────
const SYMBOLS = {
  // Crypto (Alpha Vantage CURRENCY_EXCHANGE_RATE)
  crypto: [
    { key: 'BTC/EUR', from: 'BTC', to: 'EUR', label: 'BTC/EUR', type: 'crypto' },
    { key: 'ETH/EUR', from: 'ETH', to: 'EUR', label: 'ETH/EUR', type: 'crypto' },
  ],
  // Forex (Alpha Vantage CURRENCY_EXCHANGE_RATE)
  forex: [
    { key: 'EUR/USD', from: 'EUR', to: 'USD', label: 'EUR/USD', type: 'forex' },
  ],
}

// ── Données de fallback statiques ──────────────────────────
const FALLBACK_DATA = [
  { name: 'CAC 40', val: '7 842', change: '+2.41%', changeRaw: 2.41, dir: 'up' },
  { name: 'BTC/EUR', val: '61 240', change: '+3.12%', changeRaw: 3.12, dir: 'up' },
  { name: 'ETH/EUR', val: '3 180', change: '+0.44%', changeRaw: 0.44, dir: 'flat' },
  { name: 'GOLD', val: '2 340$', change: '+0.82%', changeRaw: 0.82, dir: 'up' },
  { name: 'EUR/USD', val: '1.0842', change: '-0.31%', changeRaw: -0.31, dir: 'down' },
  { name: 'OAT 10Y', val: '3.12%', change: '-0.08%', changeRaw: -0.08, dir: 'down' },
  { name: 'INFL FR', val: '2.10%', change: '-0.10%', changeRaw: -0.10, dir: 'down' },
  { name: 'S&P 500', val: '5 204', change: '+1.18%', changeRaw: 1.18, dir: 'up' },
]

// ── Cache mémoire serveur ───────────────────────────────────
let cache = {
  data: null,
  timestamp: 0,
  TTL: 60 * 1000, // 60 secondes
}

// ── Formatage des valeurs ───────────────────────────────────
const formatVal = (val, type) => {
  const num = parseFloat(val)
  if (isNaN(num)) return val
  if (type === 'crypto') {
    return num > 1000
      ? num.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
      : num.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
  }
  if (type === 'forex') {
    return num.toFixed(4)
  }
  return num.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
}

const getDir = (change) => {
  if (change > 0.1) return 'up'
  if (change < -0.1) return 'down'
  return 'flat'
}

// ── Fetch crypto/forex via Alpha Vantage ────────────────────
const fetchExchangeRate = async (from, to) => {
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${ALPHA_VANTAGE_KEY}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  const data = await res.json()
  const rate = data?.['Realtime Currency Exchange Rate']
  if (!rate) return null
  return {
    rate: parseFloat(rate['5. Exchange Rate']),
    from: rate['1. From_Currency Code'],
    to: rate['3. To_Currency Code'],
  }
}

// ── Handler principal ───────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Retourne le cache si encore valide
  const now = Date.now()
  if (cache.data && now - cache.timestamp < cache.TTL) {
    return res.status(200).json({
      data: cache.data,
      cached: true,
      nextRefresh: Math.round((cache.TTL - (now - cache.timestamp)) / 1000),
    })
  }

  try {
    // Fetch BTC/EUR et ETH/EUR et EUR/USD en parallèle
    const [btcEur, ethEur, eurUsd] = await Promise.allSettled([
      fetchExchangeRate('BTC', 'EUR'),
      fetchExchangeRate('ETH', 'EUR'),
      fetchExchangeRate('EUR', 'USD'),
    ])

    const tickerData = [...FALLBACK_DATA]

    // Mise à jour BTC/EUR
    if (btcEur.status === 'fulfilled' && btcEur.value) {
      const idx = tickerData.findIndex(t => t.name === 'BTC/EUR')
      if (idx !== -1) {
        const rate = btcEur.value.rate
        tickerData[idx] = {
          name: 'BTC/EUR',
          val: formatVal(rate, 'crypto'),
          change: '—',
          changeRaw: 0,
          dir: 'flat',
          live: true,
        }
      }
    }

    // Mise à jour ETH/EUR
    if (ethEur.status === 'fulfilled' && ethEur.value) {
      const idx = tickerData.findIndex(t => t.name === 'ETH/EUR')
      if (idx !== -1) {
        const rate = ethEur.value.rate
        tickerData[idx] = {
          name: 'ETH/EUR',
          val: formatVal(rate, 'crypto'),
          change: '—',
          changeRaw: 0,
          dir: 'flat',
          live: true,
        }
      }
    }

    // Mise à jour EUR/USD
    if (eurUsd.status === 'fulfilled' && eurUsd.value) {
      const idx = tickerData.findIndex(t => t.name === 'EUR/USD')
      if (idx !== -1) {
        const rate = eurUsd.value.rate
        tickerData[idx] = {
          name: 'EUR/USD',
          val: formatVal(rate, 'forex'),
          change: tickerData[idx].change, // Alpha Vantage ne donne pas le % sur forex
          changeRaw: tickerData[idx].changeRaw,
          dir: tickerData[idx].dir,
          live: true,
        }
      }
    }

    // Mise en cache
    cache.data = tickerData
    cache.timestamp = now

    return res.status(200).json({
      data: tickerData,
      cached: false,
      timestamp: new Date().toISOString(),
      nextRefresh: 60,
    })

  } catch (error) {
    console.error('Ticker API error:', error)

    // Retourne les données de fallback en cas d'erreur
    return res.status(200).json({
      data: FALLBACK_DATA,
      cached: false,
      fallback: true,
      error: error.message,
    })
  }
}

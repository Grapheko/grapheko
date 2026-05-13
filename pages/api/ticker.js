// ══════════════════════════════════════════════════════════════
// API Route : /api/ticker
// Provider : Finnhub (60 req/min free tier)
// Symboles : BTC/ETH/BNB/SOL en EUR + CAC40/SP500/Nasdaq + Gold
// Cache serveur : 60 secondes
// ══════════════════════════════════════════════════════════════

const FINNHUB_KEY = process.env.FINNHUB_KEY || 'd824ho1r01qtiq8uit8gd824ho1r01qtiq8uit90'
const BASE = 'https://finnhub.io/api/v1'

// ── Symboles à fetcher ──────────────────────────────────────
const SYMBOLS = [
  // Crypto via Binance (EUR pairs)
  { key: 'BTC/EUR',  type: 'crypto',  symbol: 'BINANCE:BTCEUR',  label: 'BTC/EUR',  decimals: 0 },
  { key: 'ETH/EUR',  type: 'crypto',  symbol: 'BINANCE:ETHEUR',  label: 'ETH/EUR',  decimals: 0 },
  { key: 'BNB/EUR',  type: 'crypto',  symbol: 'BINANCE:BNBEUR',  label: 'BNB/EUR',  decimals: 2 },
  { key: 'SOL/EUR',  type: 'crypto',  symbol: 'BINANCE:SOLEUR',  label: 'SOL/EUR',  decimals: 2 },
  // Indices boursiers
  { key: 'CAC_40',   type: 'index',   symbol: '^FCHI',           label: 'CAC 40',   decimals: 0 },
  { key: 'SP500',    type: 'index',   symbol: '^GSPC',           label: 'S&P 500',  decimals: 0 },
  { key: 'NASDAQ',   type: 'index',   symbol: '^IXIC',           label: 'NASDAQ',   decimals: 0 },
  // Matières premières
  { key: 'GOLD',     type: 'forex',   symbol: 'OANDA:XAU_EUR',   label: 'GOLD/EUR', decimals: 0 },
]

// ── Données fallback statiques ──────────────────────────────
const FALLBACK = [
  { name: 'BTC/EUR',  val: '61 240', change: '+3.12%', changeRaw: 3.12,  dir: 'up'   },
  { name: 'ETH/EUR',  val: '2 890',  change: '+1.44%', changeRaw: 1.44,  dir: 'up'   },
  { name: 'BNB/EUR',  val: '548',    change: '+0.82%', changeRaw: 0.82,  dir: 'up'   },
  { name: 'SOL/EUR',  val: '134',    change: '-0.31%', changeRaw: -0.31, dir: 'down' },
  { name: 'CAC 40',   val: '7 842',  change: '+2.41%', changeRaw: 2.41,  dir: 'up'   },
  { name: 'S&P 500',  val: '5 204',  change: '+1.18%', changeRaw: 1.18,  dir: 'up'   },
  { name: 'NASDAQ',   val: '18 340', change: '+0.94%', changeRaw: 0.94,  dir: 'up'   },
  { name: 'GOLD/EUR', val: '2 164',  change: '+0.62%', changeRaw: 0.62,  dir: 'up'   },
]

// ── Cache mémoire serveur ───────────────────────────────────
let cache = { data: null, timestamp: 0, TTL: 60_000 }

// ── Formatage ───────────────────────────────────────────────
const fmt = (val, decimals) => {
  if (!val || isNaN(val)) return '—'
  return parseFloat(val).toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

const getDir = (pct) => {
  if (pct > 0.05) return 'up'
  if (pct < -0.05) return 'down'
  return 'flat'
}

// ── Fetch un symbole via Finnhub /quote ─────────────────────
const fetchQuote = async (symbol) => {
  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) return null
  const data = await res.json()
  // Finnhub retourne { c: current, d: change, dp: changePct, h, l, o, pc }
  if (!data || !data.c || data.c === 0) return null
  return {
    price: data.c,
    change: data.d,
    changePct: data.dp,
    prevClose: data.pc,
  }
}

// ── Fetch crypto via Finnhub /crypto/candle ─────────────────
const fetchCrypto = async (symbol) => {
  const now = Math.floor(Date.now() / 1000)
  const from = now - 3600 // 1h de données
  const url = `${BASE}/crypto/candle?symbol=${encodeURIComponent(symbol)}&resolution=60&from=${from}&to=${now}&token=${FINNHUB_KEY}`
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) return null
  const data = await res.json()
  if (!data || data.s !== 'ok' || !data.c || data.c.length === 0) return null

  const current = data.c[data.c.length - 1]
  const open = data.o[0]
  const changePct = open ? ((current - open) / open) * 100 : 0

  return {
    price: current,
    change: current - open,
    changePct,
    prevClose: open,
  }
}

// ── Handler principal ───────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  // Cache valide ?
  const now = Date.now()
  if (cache.data && now - cache.timestamp < cache.TTL) {
    return res.status(200).json({
      data: cache.data,
      cached: true,
      nextRefresh: Math.round((cache.TTL - (now - cache.timestamp)) / 1000),
    })
  }

  try {
    // Fetch tous les symboles en parallèle
    const results = await Promise.allSettled(
      SYMBOLS.map(async (s) => {
        const quote = s.type === 'crypto'
          ? await fetchCrypto(s.symbol)
          : await fetchQuote(s.symbol)

        if (!quote) return { ...FALLBACK.find(f => f.name === s.label), live: false }

        const changePct = quote.changePct ?? 0
        return {
          name: s.label,
          val: fmt(quote.price, s.decimals),
          change: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`,
          changeRaw: changePct,
          dir: getDir(changePct),
          live: true,
        }
      })
    )

    const tickerData = results.map((r, i) =>
      r.status === 'fulfilled' && r.value
        ? r.value
        : { ...FALLBACK[i], live: false }
    )

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
    console.error('Ticker error:', error)
    return res.status(200).json({
      data: FALLBACK,
      cached: false,
      fallback: true,
    })
  }
}

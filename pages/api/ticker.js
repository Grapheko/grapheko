// ══════════════════════════════════════════════════════════════
// API Route : /api/ticker — Finnhub
// Stratégie : fetch USDT pairs + taux EUR/USD → conversion EUR
// Cache serveur : 60 secondes
// ══════════════════════════════════════════════════════════════
 
const FINNHUB_KEY = process.env.FINNHUB_KEY || 'd824ho1r01qtiq8uit8gd824ho1r01qtiq8uit90'
const BASE = 'https://finnhub.io/api/v1'
 
const CRYPTO_SYMBOLS = [
  { label: 'BTC/EUR', symbol: 'BINANCE:BTCUSDT', decimals: 0 },
  { label: 'ETH/EUR', symbol: 'BINANCE:ETHUSDT', decimals: 0 },
  { label: 'BNB/EUR', symbol: 'BINANCE:BNBUSDT', decimals: 1 },
  { label: 'SOL/EUR', symbol: 'BINANCE:SOLUSDT', decimals: 2 },
]
 
const INDEX_SYMBOLS = [
  { label: 'CAC 40',  symbol: '^FCHI', decimals: 0 },
  { label: 'S&P 500', symbol: '^GSPC', decimals: 0 },
  { label: 'NASDAQ',  symbol: '^IXIC', decimals: 0 },
]
 
const FALLBACK = [
  { name: 'BTC/EUR',  val: '74 200', change: '—', changeRaw: 0, dir: 'flat', live: false },
  { name: 'ETH/EUR',  val: '1 780',  change: '—', changeRaw: 0, dir: 'flat', live: false },
  { name: 'BNB/EUR',  val: '580',    change: '—', changeRaw: 0, dir: 'flat', live: false },
  { name: 'SOL/EUR',  val: '145',    change: '—', changeRaw: 0, dir: 'flat', live: false },
  { name: 'CAC 40',   val: '7 842',  change: '—', changeRaw: 0, dir: 'flat', live: false },
  { name: 'S&P 500',  val: '5 650',  change: '—', changeRaw: 0, dir: 'flat', live: false },
  { name: 'NASDAQ',   val: '17 930', change: '—', changeRaw: 0, dir: 'flat', live: false },
  { name: 'GOLD/EUR', val: '3 020',  change: '—', changeRaw: 0, dir: 'flat', live: false },
]
 
let cache = { data: null, timestamp: 0, TTL: 60_000 }
 
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
 
const fetchQuote = async (symbol) => {
  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) return null
  const data = await res.json()
  if (!data?.c || data.c === 0) return null
  return data
}
 
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
 
  const now = Date.now()
  if (cache.data && now - cache.timestamp < cache.TTL) {
    return res.status(200).json({
      data: cache.data,
      cached: true,
      nextRefresh: Math.round((cache.TTL - (now - cache.timestamp)) / 1000),
    })
  }
 
  try {
    // Fetch taux EUR/USD pour conversion
    let eurUsdRate = 1.08
    try {
      const fx = await fetchQuote('OANDA:EUR_USD')
      if (fx?.c > 0) eurUsdRate = fx.c
    } catch {}
    const usdToEur = 1 / eurUsdRate
 
    // Fetch tout en parallèle
    const [cryptoResults, indexResults, goldResult] = await Promise.all([
      Promise.allSettled(CRYPTO_SYMBOLS.map(s => fetchQuote(s.symbol))),
      Promise.allSettled(INDEX_SYMBOLS.map(s => fetchQuote(s.symbol))),
      fetchQuote('OANDA:XAU_USD').catch(() => null),
    ])
 
    const tickerData = []
 
    // Cryptos → conversion USD→EUR
    CRYPTO_SYMBOLS.forEach((s, i) => {
      const r = cryptoResults[i]
      if (r.status === 'fulfilled' && r.value) {
        const q = r.value
        const priceEur = q.c * usdToEur
        const changePct = q.dp ?? 0
        tickerData.push({
          name: s.label,
          val: fmt(priceEur, s.decimals),
          change: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`,
          changeRaw: changePct,
          dir: getDir(changePct),
          live: true,
        })
      } else {
        tickerData.push({ ...FALLBACK[i] })
      }
    })
 
    // Indices (déjà en devise locale)
    INDEX_SYMBOLS.forEach((s, i) => {
      const r = indexResults[i]
      if (r.status === 'fulfilled' && r.value) {
        const q = r.value
        const changePct = q.dp ?? 0
        tickerData.push({
          name: s.label,
          val: fmt(q.c, s.decimals),
          change: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`,
          changeRaw: changePct,
          dir: getDir(changePct),
          live: true,
        })
      } else {
        tickerData.push({ ...FALLBACK[4 + i] })
      }
    })
 
    // Gold → EUR
    if (goldResult?.c > 0) {
      const priceEur = goldResult.c * usdToEur
      const changePct = goldResult.dp ?? 0
      tickerData.push({
        name: 'GOLD/EUR',
        val: fmt(priceEur, 0),
        change: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`,
        changeRaw: changePct,
        dir: getDir(changePct),
        live: true,
      })
    } else {
      tickerData.push({ ...FALLBACK[7] })
    }
 
    cache.data = tickerData
    cache.timestamp = now
 
    return res.status(200).json({
      data: tickerData,
      cached: false,
      timestamp: new Date().toISOString(),
      eurUsdRate,
      nextRefresh: 60,
    })
 
  } catch (error) {
    console.error('Ticker error:', error)
    return res.status(200).json({ data: FALLBACK, cached: false, fallback: true })
  }
}
 

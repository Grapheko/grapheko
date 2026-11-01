// ══════════════════════════════════════════════════════════════
// Historique mensuel des cours, en euros. Côté serveur uniquement.
//
// Sources gratuites, sans clé :
//   1. Yahoo Finance (API chart, intervalle mensuel)
//   2. Binance (data-api.binance.vision) en secours pour les cryptos
// Les cours en dollars sont convertis avec le taux EUR/USD de fin de mois.
//
// Aucune donnée inventée : si les sources échouent, on renvoie null
// et l'interface affiche un état d'erreur explicite.
// ══════════════════════════════════════════════════════════════
import { getAsset } from './assets'

const UA = 'Mozilla/5.0 (compatible; GraphekoBot/1.0; +https://grapheko.fr)'
const TTL = 12 * 60 * 60 * 1000 // 12 h
const memo = new Map()

const monthKey = (ms) => {
  const d = new Date(ms)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

// Garde la dernière valeur connue de chaque mois
const byMonth = (points) => {
  const map = new Map()
  for (const p of points) if (Number.isFinite(p.close) && p.close > 0) map.set(p.m, p.close)
  return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([m, close]) => ({ m, close }))
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function yahooMonthly(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=max&interval=1mo&includePrePost=false&events=`
  const json = await fetchJson(url)
  const r = json?.chart?.result?.[0]
  const ts = r?.timestamp || []
  const closes = r?.indicators?.quote?.[0]?.close || []
  const points = byMonth(ts.map((t, i) => ({ m: monthKey(t * 1000), close: closes[i] })))
  if (points.length < 12) throw new Error(`Yahoo: historique insuffisant pour ${symbol}`)
  return points
}

async function binanceMonthly(symbol) {
  const url = `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=1M&limit=1000`
  const rows = await fetchJson(url)
  const points = byMonth(rows.map((k) => ({ m: monthKey(k[0]), close: parseFloat(k[4]) })))
  if (points.length < 12) throw new Error(`Binance: historique insuffisant pour ${symbol}`)
  return points
}

async function cached(key, loader) {
  const hit = memo.get(key)
  if (hit && Date.now() - hit.at < TTL) return hit.data
  const data = await loader()
  memo.set(key, { at: Date.now(), data })
  return data
}

const eurUsd = () => cached('fx:EURUSD', () => yahooMonthly('EURUSD=X'))

// Données de démonstration, UNIQUEMENT pour le développement local sans réseau
// (GRAPHEKO_DEMO_DATA=1). Elles sont signalées comme non réelles dans l'interface.
function demoHistory(slug) {
  let seed = [...slug].reduce((a, c) => a + c.charCodeAt(0), 0)
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  const vol = getAsset(slug).kind === 'crypto' ? 0.16 : 0.045
  const points = []
  let v = 100
  for (let y = 2012; y <= 2026; y++) {
    for (let mo = 1; mo <= 12; mo++) {
      if (y === 2026 && mo > 10) break
      v *= 1 + 0.008 + (rand() - 0.5) * 2 * vol
      points.push({ m: `${y}-${String(mo).padStart(2, '0')}`, close: Math.round(v * 100) / 100 })
    }
  }
  return { slug, currency: 'EUR', points, source: 'Données de démonstration, non réelles', demo: true, updatedAt: new Date().toISOString() }
}

// Renvoie { slug, currency:'EUR', points:[{m:'2018-01', close}], source, updatedAt } ou null
export async function getMonthlyHistory(slug) {
  const asset = getAsset(slug)
  if (!asset) return null
  if (process.env.GRAPHEKO_DEMO_DATA === '1' && process.env.NODE_ENV !== 'production') return demoHistory(slug)

  try {
    return await cached(`hist:${slug}`, async () => {
      let raw = null
      let source = null
      const errors = []

      try { raw = await yahooMonthly(asset.yahoo); source = 'Yahoo Finance' } catch (e) { errors.push(e.message) }
      if (!raw && asset.binance) {
        try { raw = await binanceMonthly(asset.binance); source = 'Binance' } catch (e) { errors.push(e.message) }
      }
      if (!raw) throw new Error(errors.join(' | '))

      let points = raw
      if (asset.currency === 'USD') {
        const fx = await eurUsd()
        const fxMap = new Map(fx.map((p) => [p.m, p.close]))
        points = raw
          .filter((p) => fxMap.has(p.m))
          .map((p) => ({ m: p.m, close: p.close / fxMap.get(p.m) }))
        source += ' · taux EUR/USD Yahoo Finance'
      }

      points = points.map((p) => ({ m: p.m, close: Math.round(p.close * 100) / 100 }))
      return { slug, currency: 'EUR', points, source, updatedAt: new Date().toISOString() }
    })
  } catch (e) {
    console.error(`[history] ${slug}:`, e.message)
    return null
  }
}

// Statistiques simples à partir de l'historique mensuel
export function historyStats(points) {
  if (!points?.length) return null
  const last = points[points.length - 1]
  const perf = (months) => {
    const ref = points[points.length - 1 - months]
    return ref ? (last.close / ref.close - 1) * 100 : null
  }
  let peak = 0
  let peakM = null
  let maxDd = 0
  let ddPeak = null
  let ddTrough = null
  for (const p of points) {
    if (p.close > peak) { peak = p.close; peakM = p.m }
    const dd = (p.close / peak - 1) * 100
    if (dd < maxDd) { maxDd = dd; ddPeak = peakM; ddTrough = p.m }
  }
  return {
    last: last.close,
    lastMonth: last.m,
    first: points[0].m,
    perf1y: perf(12),
    perf5y: perf(60),
    perf10y: perf(120),
    maxDrawdown: maxDd,
    drawdownFrom: ddPeak,
    drawdownTo: ddTrough,
  }
}

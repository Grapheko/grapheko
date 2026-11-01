// ══════════════════════════════════════════════════════════════
// API Route : /api/crypto-top — les 10 premières cryptos par capitalisation
//
// Classement : CoinGecko (données de marché, attribution affichée sur le site).
// Exclus : stablecoins (USDT, USDC…), jetons « emballés » ou de staking
// (WBTC, stETH…) qui dupliquent un autre actif, et tout ce qui n'a pas de paire
// USDT sur Binance (sinon pas de cours en temps réel à afficher).
// Mis en cache 6 h : le classement bouge peu à l'échelle d'une journée.
// ══════════════════════════════════════════════════════════════

const TTL = 6 * 60 * 60 * 1000
const UA = 'Mozilla/5.0 (compatible; GraphekoBot/1.0; +https://grapheko.fr)'
let cache = { data: null, at: 0 }

// Liste de secours si les sources ne répondent pas (grandes capitalisations stables)
const FALLBACK = [
  ['BTC', 'Bitcoin'], ['ETH', 'Ethereum'], ['XRP', 'XRP'], ['BNB', 'BNB'], ['SOL', 'Solana'],
  ['TRX', 'TRON'], ['DOGE', 'Dogecoin'], ['ADA', 'Cardano'], ['LINK', 'Chainlink'], ['AVAX', 'Avalanche'],
].map(([symbol, name], i) => ({ rank: i + 1, symbol, name, pair: `${symbol}USDT` }))

const STABLE = /^(usdt|usdc|dai|usde|usds|fdusd|pyusd|tusd|usdd|usd0|usdx|rlusd|usd1|gho|frax|eurc|eurs|xaut|paxg|bsc-usd|buidl|usyc|usdtb)$/i
const WRAPPED = /^(steth|wsteth|wbtc|weth|wbeth|weeth|reth|ezeth|rseth|cbbtc|cbeth|lbtc|solvbtc|tbtc|btcb|jitosol|msol|bnsol|jupsol|wtrx|wbnb)$/i

async function json(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(10000) })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400')
  const now = Date.now()
  if (cache.data && now - cache.at < TTL) return res.status(200).json({ data: cache.data, source: 'CoinGecko', cached: true })

  try {
    const [markets, prices] = await Promise.all([
      json('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=50&page=1'),
      json('https://data-api.binance.vision/api/v3/ticker/price'),
    ])
    const pairs = new Set(prices.map((p) => p.symbol))
    const top = []
    for (const c of markets) {
      const sym = String(c.symbol || '').toUpperCase()
      if (STABLE.test(c.symbol) || WRAPPED.test(c.symbol) || /wrapped|staked|bridged/i.test(c.name)) continue
      if (!pairs.has(`${sym}USDT`)) continue
      if (top.some((t) => t.symbol === sym)) continue
      top.push({ rank: top.length + 1, symbol: sym, name: c.name, pair: `${sym}USDT`, marketCapRank: c.market_cap_rank })
      if (top.length === 10) break
    }
    if (top.length < 10) throw new Error('classement incomplet')
    cache = { data: top, at: now }
    return res.status(200).json({ data: top, source: 'CoinGecko', cached: false })
  } catch (e) {
    console.error('[crypto-top]', e.message)
    return res.status(200).json({ data: cache.data || FALLBACK, source: cache.data ? 'CoinGecko' : 'liste de secours', fallback: true })
  }
}

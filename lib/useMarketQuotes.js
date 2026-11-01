// Assemble les cours affichés par le bandeau et les fiches marché :
// top 10 crypto en temps réel (flux navigateur) + indices et or en différé (/api/ticker).
import { useEffect, useState } from 'react'
import { ASSETS } from './assets'
import { useLiveCrypto } from './liveCrypto'
import { trackTickerRefresh } from './gtm'

const ASSET_CRYPTOS = ASSETS.filter((a) => a.live?.type === 'crypto')
const DELAYED_ASSETS = ASSETS.filter((a) => a.live?.type === 'delayed')

// ── Classement top 10 (chargé une fois par visite) ───────────
let topCache = null
let topPromise = null
const loadTop = () => {
  if (!topPromise) {
    topPromise = fetch('/api/crypto-top')
      .then((r) => r.json())
      .then((j) => (topCache = { list: j.data || [], source: j.source }))
      .catch(() => (topCache = { list: [], source: null }))
  }
  return topPromise
}

function useTop() {
  const [top, setTop] = useState(topCache)
  useEffect(() => { if (!topCache) loadTop().then(setTop) }, [])
  return top
}

// ── Indices différés (rafraîchis chaque minute) ──────────────
let delayedCache = null
const delayedListeners = new Set()
let timer = null
let delayedUsers = 0

async function loadDelayed() {
  try {
    const json = await (await fetch('/api/ticker')).json()
    delayedCache = json.data || []
    const ok = delayedCache.filter((d) => d.price != null).map((d) => d.name)
    if (ok.length && !json.cached) trackTickerRefresh(ok.join(','))
  } catch {
    delayedCache = delayedCache || []
  }
  delayedListeners.forEach((fn) => fn(delayedCache))
}

function useDelayed() {
  const [data, setData] = useState(delayedCache)
  useEffect(() => {
    delayedListeners.add(setData)
    delayedUsers++
    if (!timer) { loadDelayed(); timer = setInterval(loadDelayed, 60_000) }
    else if (delayedCache) setData(delayedCache)
    return () => {
      delayedListeners.delete(setData)
      delayedUsers--
      if (delayedUsers === 0) { clearInterval(timer); timer = null }
    }
  }, [])
  return data
}

export function useMarketQuotes() {
  const top = useTop()
  const delayed = useDelayed()
  const topList = top?.list || []
  const symbols = [...new Set([...topList.map((t) => t.symbol), ...ASSET_CRYPTOS.map((a) => a.live.symbol)])]
  const { quotes } = useLiveCrypto(top ? symbols : [])

  const cryptoItem = (symbol, name) => {
    const asset = ASSET_CRYPTOS.find((a) => a.live.symbol === symbol)
    const q = quotes[symbol]
    return { key: symbol, slug: asset?.slug || null, name: symbol, fullName: name, mode: 'live', price: q?.price ?? null, changePct: q?.changePct ?? null, unit: '€', source: q?.source }
  }

  const delayedItems = DELAYED_ASSETS.map((a) => {
    const d = delayed?.find((x) => x.slug === a.slug)
    return { key: a.slug, slug: a.slug, name: a.short, mode: 'delayed', price: d?.price ?? null, changePct: d?.changePct ?? null, unit: d?.unit || 'pts', time: d?.time ?? null }
  })

  // Bandeau : top 10 crypto puis indices
  const items = [...topList.map((t) => cryptoItem(t.symbol, t.name)), ...delayedItems]

  // Fiches marché : recherche par slug (y compris une crypto sortie du top 10)
  const bySlug = (slug) => {
    const asset = ASSETS.find((a) => a.slug === slug)
    if (!asset?.live) return null
    return asset.live.type === 'crypto' ? cryptoItem(asset.live.symbol, asset.name) : delayedItems.find((d) => d.slug === slug)
  }

  return { items, bySlug, rankingSource: top?.source, loaded: delayed !== null || Object.keys(quotes).length > 0 }
}

export const timeFr = (ms) => (ms ? new Date(ms).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }) : null)

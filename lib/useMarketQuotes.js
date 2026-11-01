// Assemble les cours affichés par le ticker et les fiches marché :
// cryptos en temps réel (flux navigateur) + indices et or en différé (/api/ticker).
import { useEffect, useState } from 'react'
import { ASSETS } from './assets'
import { useLiveCrypto } from './liveCrypto'
import { trackTickerRefresh } from './gtm'

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
  const { quotes } = useLiveCrypto()
  const delayed = useDelayed()
  const items = ASSETS.filter((a) => a.live).map((a) => {
    if (a.live.type === 'crypto') {
      const q = quotes[a.slug]
      return { slug: a.slug, name: a.short, mode: 'live', price: q?.price ?? null, changePct: q?.changePct ?? null, unit: '€', source: q?.source }
    }
    const d = delayed?.find((x) => x.slug === a.slug)
    return { slug: a.slug, name: a.short, mode: 'delayed', price: d?.price ?? null, changePct: d?.changePct ?? null, unit: d?.unit || 'pts', time: d?.time ?? null }
  })
  return { items, loaded: delayed !== null || Object.keys(quotes).length > 0 }
}

export const timeFr = (ms) => (ms ? new Date(ms).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }) : null)

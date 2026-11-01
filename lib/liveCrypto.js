// ══════════════════════════════════════════════════════════════
// Cours crypto en temps réel, directement dans le navigateur.
// Source principale : flux public Binance (data-stream.binance.vision)
// Secours automatique : flux public Coinbase Exchange.
// Pas de clé, pas de serveur. Une seule connexion partagée par toute la page.
// ══════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react'
import { ASSETS } from './assets'
import { gEvent } from './gtm'

const CRYPTOS = ASSETS.filter((a) => a.live?.type === 'crypto')
const quotes = {} // slug → { price, open24h, changePct, time, source }
const listeners = new Set()
let ws = null
let source = null
let users = 0
let stale = null
let retry = 0
let reported = false

const emit = () => {
  // Regroupe les mises à jour : au plus une par seconde côté interface
  if (emit.t) return
  emit.t = setTimeout(() => { emit.t = null; listeners.forEach((fn) => fn({ ...quotes })) }, 1000)
}

const update = (slug, price, open24h, src) => {
  if (!Number.isFinite(price)) return
  quotes[slug] = { price, open24h, changePct: open24h ? (price / open24h - 1) * 100 : null, time: Date.now(), source: src }
  if (!reported) {
    reported = true
    gEvent('tracker_data_refresh', { symbols_refreshed: CRYPTOS.map((c) => c.short).join(','), data_source: src, data_mode: 'temps_reel' })
  }
  emit()
}

function connectBinance() {
  source = 'Binance'
  const streams = CRYPTOS.map((c) => `${c.live.binance.toLowerCase()}@miniTicker`).join('/')
  ws = new WebSocket(`wss://data-stream.binance.vision/stream?streams=${streams}`)
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data)?.data
    const asset = CRYPTOS.find((c) => c.live.binance === d?.s)
    if (asset) update(asset.slug, parseFloat(d.c), parseFloat(d.o), 'Binance')
  }
  watchdog(connectCoinbase)
}

function connectCoinbase() {
  source = 'Coinbase'
  ws = new WebSocket('wss://ws-feed.exchange.coinbase.com')
  ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', product_ids: CRYPTOS.map((c) => c.live.coinbase), channels: ['ticker'] }))
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data)
    if (d.type !== 'ticker') return
    const asset = CRYPTOS.find((c) => c.live.coinbase === d.product_id)
    if (asset) update(asset.slug, parseFloat(d.price), parseFloat(d.open_24h), 'Coinbase')
  }
  watchdog(connectBinance)
}

// Si aucun cours n'arrive en 10 s, ou si la connexion tombe, on bascule sur l'autre source
function watchdog(fallback) {
  const current = ws
  const switchTo = () => {
    if (current !== ws || users === 0) return
    clearTimeout(stale)
    try { current.close() } catch {}
    retry++
    setTimeout(() => users > 0 && fallback(), Math.min(30000, 1000 * retry))
  }
  clearTimeout(stale)
  stale = setTimeout(() => { if (!Object.keys(quotes).length) switchTo() }, 10000)
  current.onopen = current.onopen || (() => {})
  current.onerror = switchTo
  current.onclose = () => { if (current === ws && users > 0) switchTo() }
  const onmsg = current.onmessage
  current.onmessage = (e) => { retry = 0; onmsg(e) }
}

function start() {
  if (typeof window === 'undefined' || ws) return
  connectBinance()
}

function stop() {
  clearTimeout(stale)
  const old = ws
  ws = null
  try { old?.close() } catch {}
}

// Coupe le flux quand l'onglet est masqué (économie de batterie et de données)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else if (users > 0) start()
  })
}

export function useLiveCrypto() {
  const [state, setState] = useState(() => ({ ...quotes }))
  useEffect(() => {
    listeners.add(setState)
    users++
    start()
    return () => {
      listeners.delete(setState)
      users--
      if (users === 0) stop()
    }
  }, [])
  return { quotes: state, source }
}

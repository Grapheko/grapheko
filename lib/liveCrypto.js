// ══════════════════════════════════════════════════════════════
// Cours crypto en temps réel, directement dans le navigateur.
//
// Source : flux publics Binance (paires en USDT), convertis en euros avec la
// paire EUR/USDT, elle aussi en temps réel. Toutes les grandes cryptos ont une
// paire USDT, ce qui n'est pas le cas des paires en euros.
// Hôte principal : data-stream.binance.vision ; secours : stream.binance.com.
// Pas de clé, pas de serveur. Une seule connexion partagée par toute la page.
// ══════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react'
import { gEvent } from './gtm'

const HOSTS = ['wss://data-stream.binance.vision', 'wss://stream.binance.com:9443']
const FX = 'EURUSDT'

const raw = {} // paire → { c, o } (dernier prix et prix d'il y a 24 h, en USDT)
const listeners = new Set()
const wanted = new Set() // symboles demandés par la page, ex. 'BTC'
let ws = null
let host = 0
let users = 0
let stale = null
let retry = 0
let reported = false
let subscribed = ''

// Prix en euros et variation sur 24 h en euros (tient compte du change EUR/USD)
function toQuotes() {
  const fx = raw[FX]
  const out = {}
  if (!fx) return out
  wanted.forEach((sym) => {
    const r = raw[`${sym}USDT`]
    if (!r) return
    const price = r.c / fx.c
    const open = r.o / fx.o
    out[sym] = { price, changePct: (price / open - 1) * 100, source: 'Binance' }
  })
  return out
}

let lastEmit = 0
function flush() {
  emit.t = null
  lastEmit = Date.now()
  const q = toQuotes()
  listeners.forEach((fn) => fn(q))
  if (!reported && Object.keys(q).length) {
    reported = true
    gEvent('tracker_data_refresh', { symbols_refreshed: Object.keys(q).join(','), data_source: 'Binance', data_mode: 'temps_reel' })
  }
}

// Au plus une mise à jour par seconde côté interface, mais la première part tout de suite
const emit = () => {
  if (emit.t) return
  const wait = Math.max(0, 1000 - (Date.now() - lastEmit))
  if (wait === 0) flush()
  else emit.t = setTimeout(flush, wait)
}

// Photo instantanée des cours (API REST publique), pour ne pas attendre
// le premier message du flux : affichage en quelques centaines de ms.
const SNAPSHOT_URL = 'https://data-api.binance.vision/api/v3/ticker/24hr'
const snapshotDone = new Set()
async function snapshot() {
  const pairs = [FX, ...[...wanted].map((s) => `${s}USDT`)].filter((p) => !snapshotDone.has(p) && !raw[p])
  if (!pairs.length) return
  pairs.forEach((p) => snapshotDone.add(p))
  try {
    const url = `${SNAPSHOT_URL}?type=MINI&symbols=${encodeURIComponent(JSON.stringify(pairs))}`
    const rows = await (await fetch(url, { signal: AbortSignal.timeout(4000) })).json()
    if (!Array.isArray(rows)) return
    rows.forEach((r) => {
      // Le flux temps réel a priorité s'il est déjà arrivé
      if (!raw[r.symbol]) raw[r.symbol] = { c: parseFloat(r.lastPrice), o: parseFloat(r.openPrice) }
    })
    emit()
  } catch {
    // Paire inconnue ou réseau : le flux temps réel prendra le relais
  }
}

const streamsKey = () => [FX, ...[...wanted].sort().map((s) => `${s}USDT`)].map((p) => `${p.toLowerCase()}@miniTicker`).join('/')

function connect() {
  subscribed = streamsKey()
  const socket = new WebSocket(`${HOSTS[host]}/stream?streams=${subscribed}`)
  ws = socket
  socket.onmessage = (e) => {
    retry = 0
    const d = JSON.parse(e.data)?.data
    if (!d?.s) return
    raw[d.s] = { c: parseFloat(d.c), o: parseFloat(d.o) }
    emit()
  }
  const fail = () => {
    if (socket !== ws || users === 0) return
    clearTimeout(stale)
    try { socket.close() } catch {}
    ws = null
    host = (host + 1) % HOSTS.length // on alterne entre les deux hôtes
    retry++
    setTimeout(() => users > 0 && !ws && connect(), Math.min(30000, 1000 * retry))
  }
  socket.onerror = fail
  socket.onclose = fail
  clearTimeout(stale)
  stale = setTimeout(() => { if (!raw[FX]) fail() }, 10000)
}

function restart() {
  stop()
  if (users > 0 && wanted.size) { snapshot(); connect() }
}

function stop() {
  clearTimeout(stale)
  const old = ws
  ws = null
  try { old?.close() } catch {}
}

if (typeof document !== 'undefined') {
  // Coupe le flux quand l'onglet est masqué (batterie et données)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else if (users > 0 && !ws) connect()
  })
}

// symbols : liste de tickers, ex. ['BTC', 'ETH']
export function useLiveCrypto(symbols = []) {
  const key = symbols.join(',')
  const [state, setState] = useState(() => toQuotes())

  useEffect(() => {
    listeners.add(setState)
    users++
    return () => {
      listeners.delete(setState)
      users--
      if (users === 0) stop()
    }
  }, [])

  // Ajoute les symboles demandés ; reconnecte seulement si la liste a changé
  useEffect(() => {
    if (!key) return
    key.split(',').forEach((s) => wanted.add(s))
    if (streamsKey() !== subscribed || !ws) restart()
  }, [key])

  return { quotes: state }
}

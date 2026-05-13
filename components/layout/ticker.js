import { useState, useEffect, useCallback } from 'react'
import { trackTickerRefresh } from '../../lib/gtm'

// ── Indicateur "LIVE" ───────────────────────────────────────
function LiveDot({ live }) {
  if (!live) return null
  return (
    <span style={{
      display: 'inline-block',
      width: '5px', height: '5px',
      background: '#00FF88',
      borderRadius: '50%',
      marginRight: '4px',
      boxShadow: '0 0 4px #00FF88',
      animation: 'pulse-dot 2s infinite',
    }} />
  )
}

export default function Ticker() {
  const [items, setItems] = useState([
    { name: 'CAC 40', val: '—', change: '—', dir: 'flat' },
    { name: 'BTC/EUR', val: '—', change: '—', dir: 'flat' },
    { name: 'ETH/EUR', val: '—', change: '—', dir: 'flat' },
    { name: 'GOLD', val: '—', change: '—', dir: 'flat' },
    { name: 'EUR/USD', val: '—', change: '—', dir: 'flat' },
    { name: 'OAT 10Y', val: '—', change: '—', dir: 'flat' },
    { name: 'INFL FR', val: '—', change: '—', dir: 'flat' },
    { name: 'S&P 500', val: '—', change: '—', dir: 'flat' },
  ])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [countdown, setCountdown] = useState(60)

  // ── Fetch les données ─────────────────────────────────────
  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch('/api/ticker')
      const json = await res.json()

      if (json.data) {
        setItems(json.data)
        setIsLive(!json.fallback)
        setLastUpdate(new Date())
        setCountdown(json.nextRefresh || 60)

        // GTM event
        const liveSymbols = json.data.filter(d => d.live).map(d => d.name)
        if (liveSymbols.length > 0) {
          trackTickerRefresh(liveSymbols.join(','))
        }
      }
    } catch (err) {
      console.warn('Ticker fetch failed:', err)
    }
  }, [])

  // ── Premier chargement ────────────────────────────────────
  useEffect(() => {
    fetchTicker()
  }, [fetchTicker])

  // ── Refresh toutes les 60 secondes ───────────────────────
  useEffect(() => {
    const interval = setInterval(fetchTicker, 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchTicker])

  // ── Countdown visuel ──────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 60))
    }, 1000)
    return () => clearInterval(timer)
  }, [lastUpdate])

  return (
    <>
      <div style={{
        position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 49,
        overflow: 'hidden', height: '32px',
        display: 'flex', alignItems: 'center',
        background: 'var(--surface)',
        borderBottom: '0.5px solid var(--border)',
      }}>
        {/* Badge LIVE */}
        <div style={{
          position: 'absolute', left: 0, zIndex: 2,
          height: '100%',
          display: 'flex', alignItems: 'center',
          padding: '0 12px',
          background: isLive ? 'rgba(0,255,136,.08)' : 'var(--surface2)',
          borderRight: '0.5px solid var(--border)',
          gap: '6px',
          flexShrink: 0,
        }}>
          <LiveDot live={isLive} />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '9px',
            color: isLive ? 'var(--neon)' : 'var(--text-secondary)',
            letterSpacing: '.08em',
            whiteSpace: 'nowrap',
          }}>
            {isLive ? 'LIVE' : 'DELAYED'}
          </span>
        </div>

        {/* Track défilant */}
        <div style={{
          display: 'flex',
          marginLeft: '72px', // espace pour le badge LIVE
          animation: 'ticker 40s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {[...items, ...items].map((t, i) => (
            <div key={i} style={{
              fontFamily: 'var(--mono)', fontSize: '11px',
              padding: '0 28px',
              display: 'flex', alignItems: 'center', gap: '6px',
              borderRight: '0.5px solid var(--border)',
              whiteSpace: 'nowrap',
            }}>
              {t.live && <LiveDot live />}
              <span style={{ color: 'var(--text-secondary)' }}>{t.name}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.val}</span>
              <span style={{
                color: t.dir === 'up' ? 'var(--neon)' : t.dir === 'down' ? 'var(--red)' : 'var(--yellow)',
              }}>
                {t.dir === 'up' ? '▲' : t.dir === 'down' ? '▼' : '◆'} {t.change}
              </span>
            </div>
          ))}
        </div>

        {/* Countdown refresh */}
        <div style={{
          position: 'absolute', right: 0, zIndex: 2,
          height: '100%',
          display: 'flex', alignItems: 'center',
          padding: '0 10px',
          background: 'var(--surface2)',
          borderLeft: '0.5px solid var(--border)',
          gap: '4px',
          cursor: 'pointer',
        }} onClick={fetchTicker} title="Actualiser">
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '9px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}>
            ⟳ {countdown}s
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #00FF88; }
          50% { opacity: .6; box-shadow: 0 0 8px #00FF88; }
        }
      `}</style>
    </>
  )
}

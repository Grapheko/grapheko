import { useId, useMemo, useRef, useState, useEffect } from 'react'
import s from './LineChart.module.css'

// Graphique en courbes responsive, sans dépendance.
// series : [{ key, label, color, values:number[], dashed?, area? }]
// labels : étiquettes de l'axe X (même longueur que values)
export default function LineChart({
  series,
  labels,
  height = 360,
  formatY = (v) => v,
  formatX = (v) => v,
  formatTooltip,
  ticksX = 5,
  ariaLabel = 'Graphique',
  animateKey,
  minZero = false,
}) {
  const id = useId().replace(/:/g, '')
  const W = 1000
  const H = height
  const PAD = { t: 16, b: 8 }
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null)
  const [drawn, setDrawn] = useState(false)

  const n = labels.length
  const { min, max } = useMemo(() => {
    const all = series.flatMap((se) => se.values).filter(Number.isFinite)
    let lo = Math.min(...all)
    let hi = Math.max(...all)
    if (minZero) lo = Math.min(0, lo)
    const span = hi - lo || 1
    return { min: lo - (minZero ? 0 : span * 0.06), max: hi + span * 0.08 }
  }, [series, minZero])

  const x = (i) => (n <= 1 ? 0 : (i / (n - 1)) * W)
  const y = (v) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b)

  const paths = useMemo(
    () =>
      series.map((se) => {
        const d = se.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ')
        // Remplissage uniquement pour les séries marquées area: true
        const fill = se.area ? `${d} L${W},${H} L0,${H} Z` : null
        return { ...se, d, fill }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, min, max, n, H]
  )

  // Graduations « rondes » (1, 2, 2,5 ou 5 × 10^n) pour des montants lisibles
  const yTicks = useMemo(() => {
    const raw = (max - min) / 5
    if (!(raw > 0)) return []
    const mag = 10 ** Math.floor(Math.log10(raw))
    const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((k) => k >= raw)
    const out = []
    for (let v = Math.ceil(min / step) * step; v < max; v += step) if (v > min + step * 0.15) out.push(Number(v.toPrecision(12)))
    return out
  }, [min, max])

  const xTickIdx = useMemo(() => {
    if (n < 2) return [0]
    const count = Math.min(ticksX, n)
    return Array.from({ length: count }, (_, i) => Math.round((i / (count - 1)) * (n - 1)))
  }, [n, ticksX])

  // Animation de tracé à chaque nouvelle donnée
  useEffect(() => {
    setDrawn(false)
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)))
    return () => cancelAnimationFrame(r)
  }, [animateKey])

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setHover(Math.round(ratio * (n - 1)))
  }

  const onKey = (e) => {
    if (e.key === 'ArrowRight') setHover((h) => Math.min(n - 1, (h ?? n - 1) + 1))
    if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? n - 1) - 1))
    if (e.key === 'Escape') setHover(null)
  }

  const hx = hover != null ? (x(hover) / W) * 100 : null

  return (
    <figure className={s.figure}>
      <div
        ref={wrapRef}
        className={s.plot}
        style={{ height: H }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        onKeyDown={onKey}
        onFocus={() => setHover(n - 1)}
        onBlur={() => setHover(null)}
        tabIndex={0}
        role="img"
        aria-label={ariaLabel}
      >
        {yTicks.map((v) => (
          <div key={v} className={s.gridY} style={{ top: y(v) }}>
            <span>{formatY(v)}</span>
          </div>
        ))}

        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} aria-hidden="true">
          <defs>
            <clipPath id={`clip-${id}`}>
              <rect x="0" y="0" width={W} height={H} className={`${s.clipRect} ${drawn ? s.drawn : ''}`} />
            </clipPath>
            {paths.map((p) => (
              <linearGradient key={p.key} id={`g-${id}-${p.key}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={p.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={p.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          <g clipPath={`url(#clip-${id})`}>
            {paths.map((p) => p.fill && <path key={`a-${p.key}`} d={p.fill} fill={`url(#g-${id}-${p.key})`} />)}
            {paths.map((p) => (
              <path
                key={p.key}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={p.width || 2.5}
                strokeDasharray={p.dashed ? '6 6' : undefined}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}
          </g>
        </svg>

        {hover != null && (
          <>
            <div className={s.cursor} style={{ left: `${hx}%` }} />
            {paths.map((p) => (
              <div key={p.key} className={s.point} style={{ left: `${hx}%`, top: y(p.values[hover]), background: p.color }} />
            ))}
            <div className={`${s.tip} ${hx > 60 ? s.tipLeft : ''}`} style={{ left: `${hx}%` }}>
              <strong>{formatX(labels[hover])}</strong>
              {paths.map((p) => (
                <span key={p.key} className={s.tipRow}>
                  <i style={{ background: p.color }} />
                  {p.label}
                  <b className="num">{(formatTooltip || formatY)(p.values[hover], p.key)}</b>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={s.axisX} aria-hidden="true">
        {xTickIdx.map((i, k) => (
          <span key={i} style={{ left: `${(x(i) / W) * 100}%` }} className={k === 0 ? s.first : k === xTickIdx.length - 1 ? s.last : ''}>
            {formatX(labels[i])}
          </span>
        ))}
      </div>

      {series.length > 1 && (
        <figcaption className={s.legend}>
          {series.map((se) => (
            <span key={se.key}><i style={{ background: se.color, opacity: se.dashed ? 0.6 : 1 }} />{se.label}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

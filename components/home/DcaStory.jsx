import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useScrollFx, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '../../lib/motion'
import { backtestDca } from '../../lib/finance'
import { eur, pct, monthLabel } from '../../lib/format'
import { trackCTAClick } from '../../lib/gtm'
import s from './DcaStory.module.css'

const AMOUNT = 50
const START = '2015-01'

// Section épinglée : le scroll fait avancer le temps, mois après mois,
// sur un vrai historique (MSCI World en euros).
export default function DcaStory({ history }) {
  const ref = useRef(null)
  const clipRef = useRef(null)
  const tipRef = useRef(null)
  const barRef = useRef(null)
  const result = useMemo(() => (history?.points ? backtestDca(history.points, { start: START, amount: AMOUNT }) : null), [history])
  const rows = result?.rows || []
  const [idx, setIdx] = useState(rows.length ? rows.length - 1 : 0)

  const W = 1000
  const H = 420
  const max = rows.length ? Math.max(...rows.map((r) => Math.max(r.value, r.invested))) * 1.06 : 1
  const x = (i) => (i / Math.max(1, rows.length - 1)) * W
  const y = (v) => H - (v / max) * H
  const valuePath = rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r.value).toFixed(1)}`).join(' ')
  const investedPath = rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r.invested).toFixed(1)}`).join(' ')
  const area = valuePath ? `${valuePath} L${W},${H} L0,${H} Z` : ''

  // Courbe, point et jauge sont écrits directement, à la même image et sans
  // passer par React : le point reste exactement au bout du tracé, même en
  // scroll rapide. Entre deux mois, il glisse le long du segment de la courbe.
  const paint = (progress) => {
    if (!rows.length || !clipRef.current || !tipRef.current || !barRef.current) return
    const pos = progress * (rows.length - 1)
    const a = rows[Math.floor(pos)]
    const b = rows[Math.ceil(pos)]
    const value = a.value + (b.value - a.value) * (pos - Math.floor(pos))
    clipRef.current.style.transform = `scaleX(${Math.max(0.002, progress)})`
    tipRef.current.style.left = `${progress * 100}%`
    tipRef.current.style.top = `${(y(value) / H) * 100}%`
    barRef.current.style.transform = `scaleX(${progress})`
  }

  // Sans animation : on garde le résultat final, déjà rendu côté serveur
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return
    setIdx(0)
    paint(0)
  }, [rows.length])

  useScrollFx(ref, (root) => {
    if (!rows.length) return
    const update = (self) => {
      paint(self.progress)
      setIdx(Math.round(self.progress * (rows.length - 1)))
    }
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: '+=220%',
      pin: root.querySelector('[data-pin]'),
      pinSpacing: true,
      scrub: true,
      onUpdate: update,
    })
    update(st) // Page rechargée au milieu de la section
  }, [rows.length])

  if (!rows.length) return null

  const r = rows[idx]
  const gain = r.value - r.invested
  // État final : ces styles ne changent jamais pour React, qui n'écrase donc pas paint()
  const end = rows[rows.length - 1]
  const progress = idx / Math.max(1, rows.length - 1)

  return (
    <section ref={ref} className={`${s.story} theme-encre`} aria-labelledby="story-title">
      <div data-pin className={s.pin}>
        <div className={`wrap ${s.grid}`}>
          <div className={s.text}>
            <h2 id="story-title" className={s.title}>
              {AMOUNT} € par mois sur le MSCI World, depuis {monthLabel(START, true)}.
            </h2>
            <p className={s.date}><span className="num">{monthLabel(r.m, true)}</span></p>
            <dl className={s.figures}>
              <div>
                <dt>Versé</dt>
                <dd className="figure num">{eur(r.invested)}</dd>
              </div>
              <div>
                <dt>Valeur du portefeuille</dt>
                <dd className={`figure num ${s.value}`}>{eur(r.value)}</dd>
              </div>
              <div>
                <dt>Plus ou moins-value</dt>
                <dd className={`figure num ${gain >= 0 ? 'up' : 'down'}`}>{gain >= 0 ? '+' : ''}{eur(gain)} <span className={s.pct}>{pct((r.value / r.invested - 1) * 100)}</span></dd>
              </div>
            </dl>
            <p className={s.note}>
              Calcul sur les clôtures mensuelles de l’ETF iShares MSCI World converties en euros, hors dividendes et hors frais.
              Les performances passées ne préjugent pas des performances futures.
            </p>
            <Link href="/simulateurs/dca/msci-world" className="btn btn--plein" onClick={() => trackCTAClick('simulateur_dca', 'home_story')}>
              Refaire le calcul avec tes montants
            </Link>
          </div>

          <div className={s.viz} aria-hidden="true">
            <div className={s.chart}>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg}>
                <defs>
                  <clipPath id="story-clip">
                    <rect ref={clipRef} x="0" y="0" width={W} height={H} style={{ transformOrigin: '0 0' }} />
                  </clipPath>
                  <linearGradient id="story-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8C93FF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8C93FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g clipPath="url(#story-clip)">
                  <path d={investedPath} fill="none" stroke="rgba(231,234,227,.4)" strokeWidth="2" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
                  <path d={area} fill="url(#story-grad)" />
                  <path d={valuePath} fill="none" stroke="#8C93FF" strokeWidth="3.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </g>
              </svg>
              <span ref={tipRef} className={s.tip} style={{ left: '100%', top: `${(y(end.value) / H) * 100}%` }} />
              <div className={s.legend}>
                <span><i className={s.legendValue} />Valeur du portefeuille</span>
                <span><i className={s.legendInvested} />Total versé</span>
              </div>
            </div>
            <div className={s.gauge}>
              <p className={s.gaugeHead}>
                <span>{monthLabel(rows[0].m)}</span>
                <strong className="num">{Math.round(progress * 100)} %</strong>
                <span>{monthLabel(rows[rows.length - 1].m)}</span>
              </p>
              <span className={s.gaugeTrack}><span ref={barRef} className={s.gaugeBar} /></span>
            </div>
          </div>
        </div>
        <p className={s.hint} aria-hidden="true">Fais défiler pour avancer dans le temps</p>
      </div>
    </section>
  )
}

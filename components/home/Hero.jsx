import { useRef, useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useScrollFx, gsap } from '../../lib/motion'
import { trackCTAClick } from '../../lib/gtm'
import s from './Hero.module.css'

// Courbe de secours (forme dessinée à la main) si l'historique est indisponible
const FALLBACK = [12, 14, 13, 18, 17, 22, 20, 26, 31, 27, 24, 33, 38, 36, 44, 41, 49, 55, 50, 58, 64, 61, 70, 76]

function buildPath(values, w, h) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - ((v - min) / (max - min)) * h * 0.92 - h * 0.04])
  return { d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' '), end: pts[pts.length - 1] }
}

export default function Hero({ curve, curveLabel }) {
  const ref = useRef(null)
  const curveRef = useRef(null)
  // Le tracé est calculé à la taille réelle en pixels : le trait garde
  // une épaisseur constante et l'animation du tracé reste exacte.
  const [size, setSize] = useState({ w: 1600, h: 380 })
  useEffect(() => {
    const el = curveRef.current
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width)
      const h = Math.round(e.contentRect.height)
      setSize((prev) => (Math.abs(prev.w - w) > 40 || Math.abs(prev.h - h) > 30 ? { w, h } : prev))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const W = size.w
  const H = size.h
  const values = curve?.length > 12 ? curve : FALLBACK
  const { d, end } = useMemo(() => buildPath(values, W, H), [values, W, H])

  useScrollFx(ref, (root) => {
    const path = root.querySelector('[data-curve]')
    const dot = root.querySelector('[data-dot]')
    const len = path.getTotalLength()
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    gsap.set(dot, { scale: 0, transformOrigin: 'center' })

    // 1. Ouverture : titre puis tracé partiel de la courbe
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
    intro
      .from(root.querySelectorAll('[data-hero-line] > span'), { yPercent: 110, duration: 1.2, stagger: 0.08 })
      .from(root.querySelectorAll('[data-hero-fade]'), { opacity: 0, y: 16, duration: 0.9, stagger: 0.08 }, '-=0.8')
      .to(path, { strokeDashoffset: len * 0.62, duration: 1.8, ease: 'power3.inOut' }, '-=1.1')

    // 2. Au scroll : la courbe finit de se dessiner, le titre s'écarte
    gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
    })
      .fromTo(path, { strokeDashoffset: len * 0.62 }, { strokeDashoffset: 0, ease: 'none' }, 0)
      .to(dot, { scale: 1, ease: 'back.out(3)', duration: 0.15 }, 0.85)
      .to(root.querySelector('[data-hero-title]'), { yPercent: -18, opacity: 0.15, ease: 'none' }, 0)
  }, [d])

  return (
    <section ref={ref} className={s.hero}>
      <div className={`wrap ${s.inner}`}>
        <h1 className={s.title} data-hero-title>
          <span className={s.line} data-hero-line><span>Ton argent</span></span>
          <span className={s.line} data-hero-line><span>a une courbe.</span></span>
          <span className={`${s.line} ${s.lineSoft}`} data-hero-line><span>Apprends à la lire.</span></span>
        </h1>
        <div className={s.side}>
          <p className={s.lede} data-hero-fade>
            Des simulateurs branchés sur de vrais historiques de marché, des cours en direct et des explications sans jargon,
            pour comprendre la Bourse, la crypto et l’épargne avant d’y mettre un euro.
          </p>
          <div className={s.actions} data-hero-fade>
            <Link href="/simulateurs/dca/msci-world" className="btn btn--plein" onClick={() => trackCTAClick('simulateur_dca', 'hero')}>
              Tester le simulateur DCA
            </Link>
            <Link href="/glossaire" className="btn" onClick={() => trackCTAClick('glossaire', 'hero')}>
              Ouvrir le glossaire
            </Link>
          </div>
        </div>
      </div>

      <div className={s.curveWrap} aria-hidden="true" ref={curveRef}>
        <svg viewBox={`0 0 ${W} ${H}`} className={s.curve}>
          <path data-curve d={d} fill="none" stroke="var(--outremer)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <span data-dot className={s.dot} style={{ left: `${(end[0] / W) * 100}%`, top: `${(end[1] / H) * 100}%` }} />
      </div>
      {curveLabel && <p className={s.caption} data-hero-fade>{curveLabel}</p>}
    </section>
  )
}

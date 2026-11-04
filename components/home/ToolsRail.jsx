import { fr } from '../../lib/format'
import { useRef } from 'react'
import Link from 'next/link'
import { useScrollFx, gsap } from '../../lib/motion'
import { TOOLS } from '../../lib/content/tools'
import { trackClick } from '../../lib/gtm'
import ToolVisual from '../ui/ToolVisual'
import s from './ToolsRail.module.css'

// Sur grand écran, la section s'épingle et les simulateurs défilent
// horizontalement au rythme de la molette.
export default function ToolsRail() {
  const ref = useRef(null)

  useScrollFx(ref, (root) => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 980px)', () => {
      const track = root.querySelector('[data-track]')
      // La dernière carte s'arrête à une marge du bord, comme la première
      const distance = () => track.scrollWidth - track.clientWidth + parseFloat(getComputedStyle(track).paddingRight)
      const cards = [...track.children]
      const bar = root.querySelector('[data-rail-bar]')
      const count = root.querySelector('[data-rail-count]')
      // La jauge suit le défilement lissé, donc ce qui est réellement à l'écran
      let tween = null
      const updateGauge = () => {
        if (!tween) return // ScrollTrigger peut rafraîchir pendant sa création
        bar.style.transform = `scaleX(${tween.progress()})`
        const seen = cards.filter((c) => c.getBoundingClientRect().right <= window.innerWidth + 1).length
        count.textContent = `${Math.max(1, seen)} / ${cards.length}`
      }
      tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        onUpdate: updateGauge,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: updateGauge,
        },
      })
      updateGauge()
      root.querySelectorAll('[data-tool-visual]').forEach((v) => {
        gsap.from(v, {
          scale: 0.86, rotate: -3, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className={s.rail} aria-labelledby="tools-title">
      <div className={s.inner}>
        <div className={`wrap ${s.head}`}>
          <h2 id="tools-title" data-reveal-lines>Six questions, six simulateurs.</h2>
          <Link href="/simulateurs" className="link-arrow">Tous les simulateurs</Link>
        </div>
        <div className={s.track} data-track>
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={t.href}
              className={s.card}
              style={{ background: t.tone }}
              onClick={() => trackClick(t.slug, 'home_outils', 'simulateur')}
            >
              <span className={s.name}>{t.name}</span>
              <h3 className={s.q}>{fr(t.title)}</h3>
              <div className={s.visual} data-tool-visual><ToolVisual kind={t.visual} /></div>
              <p className={s.text}>{t.text}</p>
              <span className={s.go}>Ouvrir le simulateur</span>
            </Link>
          ))}
        </div>
        <div className={`wrap ${s.gauge}`} aria-hidden="true">
          <p className={s.gaugeHead}>
            <span>Fais défiler pour tous les voir</span>
            <strong data-rail-count className="num" />
          </p>
          <span className={s.gaugeTrack}><span data-rail-bar className={s.gaugeBar} /></span>
        </div>
      </div>
    </section>
  )
}

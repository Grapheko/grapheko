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
      const distance = () => track.scrollWidth - track.clientWidth
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })
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
          <h2 id="tools-title" data-reveal-lines>Quatre questions, quatre simulateurs.</h2>
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
              <h3 className={s.q}>{t.title}</h3>
              <div className={s.visual} data-tool-visual><ToolVisual kind={t.visual} /></div>
              <p className={s.text}>{t.text}</p>
              <span className={s.go}>Ouvrir le simulateur</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

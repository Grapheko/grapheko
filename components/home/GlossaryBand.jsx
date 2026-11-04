import { useRef } from 'react'
import Link from 'next/link'
import { useScrollFx, gsap } from '../../lib/motion'
import { TERMS } from '../../lib/content/glossary'
import s from './GlossaryBand.module.css'

// Deux rangées de termes qui glissent en sens inverse au rythme du scroll
export default function GlossaryBand() {
  const ref = useRef(null)
  const half = Math.ceil(TERMS.length / 2)
  const rows = [TERMS.slice(0, half), TERMS.slice(half)]

  useScrollFx(ref, (root) => {
    // Distance en pixels, et non en % de la rangée : la vitesse ne change pas
    // quand le glossaire s'allonge. La vitesse est exprimée en pixels parcourus
    // par pixel de scroll.
    const travel = () => (window.innerWidth < 860 ? 2 : 3.2) * (root.offsetHeight + window.innerHeight)
    root.querySelectorAll('[data-row]').forEach((row, i) => {
      gsap.fromTo(row, { x: () => (i ? -travel() : 0) }, {
        x: () => (i ? 0 : -travel()),
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.4, invalidateOnRefresh: true },
      })
    })
  }, [])

  return (
    <section ref={ref} className={s.band} aria-labelledby="glossary-title">
      <div className={`wrap ${s.head}`}>
        <h2 id="glossary-title" data-reveal-lines>{TERMS.length} mots pour ne plus décrocher.</h2>
        <p className="lede">Flat tax, drawdown, staking, PER… Chaque terme expliqué simplement, avec ses chiffres à jour et les notions qui vont avec.</p>
      </div>
      <div className={s.rows}>
        {rows.map((row, i) => (
          <div key={i} className={s.row} data-row>
            {[...row, ...row].map((t, k) => (
              <Link key={`${t.slug}-${k}`} href={`/glossaire/${t.slug}`} className={`${s.term} ${k % 3 === 1 ? s.alt : ''}`} tabIndex={k >= row.length ? -1 : 0} aria-hidden={k >= row.length}>
                {t.term}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="wrap">
        <Link href="/glossaire" className="btn">Parcourir le glossaire</Link>
      </div>
    </section>
  )
}

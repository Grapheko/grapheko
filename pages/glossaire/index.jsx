import { useMemo, useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro from '../../components/ui/PageIntro'
import { CATEGORIES, termsSorted } from '../../lib/content/glossary'
import { trackGlossarySearch, trackClick } from '../../lib/gtm'
import s from '../../styles/Glossary.module.css'

const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Glossaire({ terms }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('tout')
  const timer = useRef()

  const filtered = useMemo(() => {
    const nq = norm(q.trim())
    return terms.filter((t) => (cat === 'tout' || t.cat === cat) && (!nq || norm(t.term).includes(nq) || norm(t.short).includes(nq)))
  }, [terms, q, cat])

  // Mesure des recherches, une fois la saisie terminée
  useEffect(() => {
    clearTimeout(timer.current)
    if (q.trim().length >= 2) timer.current = setTimeout(() => trackGlossarySearch(q.trim(), filtered.length), 1200)
    return () => clearTimeout(timer.current)
  }, [q, filtered.length])

  const groups = useMemo(() => {
    const map = new Map()
    filtered.forEach((t) => {
      const letter = norm(t.term[0]).toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter).push(t)
    })
    return [...map.entries()]
  }, [filtered])

  return (
    <>
      <Seo
        title="Glossaire de la finance et de la crypto"
        description={`${terms.length} définitions claires : ETF, PEA, flat tax, drawdown, staking, inflation… avec les chiffres à jour et les notions liées.`}
      />
      <PageIntro
        crumbs={[{ label: 'Glossaire' }]}
        title="Les mots de l’argent, sans le jargon."
        lede="Chaque définition tient en une phrase, puis va un peu plus loin. Les chiffres réglementaires sont à jour au 1er novembre 2026."
        wide
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <div className={s.toolbar}>
          <div className="field" style={{ flex: '1 1 320px' }}>
            <label htmlFor="glossary-search">Chercher un terme</label>
            <input id="glossary-search" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Exemple : flat tax, staking, ETF" autoComplete="off" />
          </div>
          <div className="segmented" role="group" aria-label="Filtrer par thème">
            {[['tout', 'Tout'], ...Object.entries(CATEGORIES)].map(([k, label]) => (
              <button key={k} type="button" aria-pressed={cat === k} onClick={() => { setCat(k); trackClick(`filtre_${k}`, 'glossaire', 'filtre', k) }}>{label}</button>
            ))}
          </div>
        </div>

        <p className={s.count} aria-live="polite">{filtered.length} terme{filtered.length > 1 ? 's' : ''}</p>

        {filtered.length === 0 && (
          <div className={s.empty}>
            <p>Aucun terme ne correspond à « {q} ». Essaie un mot plus court, ou propose-le nous : on l’ajoutera.</p>
            <Link href="/contact" className="btn">Proposer un terme</Link>
          </div>
        )}

        {groups.map(([letter, list]) => (
          <section key={letter} className={s.group} aria-label={`Lettre ${letter}`}>
            <h2 className={s.letter} aria-hidden="true">{letter}</h2>
            <ul className={s.terms}>
              {list.map((t) => (
                <li key={t.slug}>
                  <Link href={`/glossaire/${t.slug}`} className={s.term}>
                    <span className={s.termName}>{t.term}</span>
                    <span className={s.termShort}>{t.short}</span>
                    <span className={`tag ${s.termCat}`}>{CATEGORIES[t.cat]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}

export async function getStaticProps() {
  const terms = termsSorted().map(({ slug, term, short, cat }) => ({ slug, term, short, cat }))
  return { props: { terms } }
}

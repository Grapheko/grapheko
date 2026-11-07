import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import Faq from '../../components/ui/Faq'
import ContentBlock from '../../components/ui/ContentBlock'
import NewsletterForm from '../../components/ui/NewsletterForm'
import { faqJsonLd } from '../../lib/faq'
import { VERSUS, getVersus } from '../../lib/content/versus'
import { CAT_LABEL, dateFr } from '../../lib/content/articles'
import { getTerm } from '../../lib/content/glossary'
import { fr } from '../../lib/format'
import s from '../../styles/Versus.module.css'
import b from '../../styles/Blog.module.css'

export default function Versus({ v, termA, termB, others }) {
  const crumbs = [{ href: '/comparer', label: 'Comparer' }, { label: v.short }]
  const [labelA, labelB] = v.labels
  return (
    <>
      <Seo
        title={v.title}
        description={v.description}
        jsonLd={[
          crumbsJsonLd(crumbs),
          {
            '@context': 'https://schema.org', '@type': 'Article', headline: v.title, description: v.description,
            datePublished: v.date, dateModified: v.updated, inLanguage: 'fr-FR',
            author: { '@type': 'Organization', name: 'Grapheko' }, publisher: { '@type': 'Organization', name: 'Grapheko' },
            mainEntityOfPage: `https://grapheko.fr/comparer/${v.slug}`,
            about: [termA, termB].filter(Boolean).map((t) => ({ '@type': 'DefinedTerm', name: t.term, url: `https://grapheko.fr/glossaire/${t.slug}` })),
          },
          faqJsonLd(v.faq || []),
        ].filter(Boolean)}
      />
      <PageIntro crumbs={crumbs} title={v.title} lede={v.intro} wide>
        <p className={b.articleMeta}>
          <span className={`tag tag--${v.cat}`}>{CAT_LABEL[v.cat]}</span>
          <span>Mis à jour le {dateFr(v.updated)}</span>
        </p>
        <p className={s.verdict}>{fr(v.verdict)}</p>
      </PageIntro>

      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <figure className={s.compare}>
          <div className={s.compareScroll} tabIndex={0} role="region" aria-label={`Tableau comparatif : ${v.short}`}>
            <table className={s.compareTable}>
              <thead><tr>{v.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>
                {v.rows.map((row) => (
                  <tr key={row[0]}>{row.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{fr(c)}</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
          {v.rowsNote && <figcaption className={s.compareNote}>{fr(v.rowsNote)}</figcaption>}
        </figure>

        <div className={s.choose}>
          <section className={s.chooseCard} aria-labelledby="choix-a">
            <h2 id="choix-a">{labelA}</h2>
            <ul>{v.chooseA.map((t) => <li key={t}>{fr(t)}</li>)}</ul>
          </section>
          <section className={s.chooseCard} aria-labelledby="choix-b">
            <h2 id="choix-b">{labelB}</h2>
            <ul>{v.chooseB.map((t) => <li key={t}>{fr(t)}</li>)}</ul>
          </section>
        </div>

        <div className={b.articleGrid}>
          <article className="prose">
            {v.blocks.map((blk, i) => <ContentBlock key={i} b={blk} slug={v.slug} />)}
            <Faq items={v.faq} />
            <p className={b.disclaimer}>
              Cette page a une vocation pédagogique et ne constitue pas un conseil en investissement personnalisé.
              Investir comporte un risque de perte en capital.
            </p>
          </article>
          <aside className={b.side}>
            <div>
              <p className={b.sideLabel}>Les définitions</p>
              <ul className={b.sideTerms}>
                {[termA, termB].filter(Boolean).map((t) => <li key={t.slug}><Link href={`/glossaire/${t.slug}`}>{t.term}</Link></li>)}
              </ul>
            </div>
            {others.length > 0 && (
              <div>
                <p className={b.sideLabel}>Autres face-à-face</p>
                <ul className={b.sideTerms}>
                  {others.map((o) => <li key={o.slug}><Link href={`/comparer/${o.slug}`}>{o.short}</Link></li>)}
                </ul>
              </div>
            )}
          </aside>
        </div>

        <section className={`theme-encre ${b.nl}`} aria-labelledby="nl-comparer">
          <h2 id="nl-comparer">Recevoir le prochain guide dimanche.</h2>
          <NewsletterForm location={`comparer_${v.slug}`} compact />
        </section>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: VERSUS.map((v) => ({ params: { slug: v.slug } })), fallback: false }
}

const pickTerm = (slug) => {
  const t = getTerm(slug)
  return t ? { slug: t.slug, term: t.term } : null
}

export async function getStaticProps({ params }) {
  const v = getVersus(params.slug)
  const others = VERSUS.filter((o) => o.slug !== v.slug).map(({ slug, short }) => ({ slug, short }))
  return { props: { v, termA: pickTerm(v.a), termB: pickTerm(v.b), others, tracking: { article_category: v.cat } } }
}

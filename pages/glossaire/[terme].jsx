import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import NewsletterForm from '../../components/ui/NewsletterForm'
import { TERMS, getTerm, CATEGORIES } from '../../lib/content/glossary'
import { ARTICLES } from '../../lib/content/articles'
import { versusForTerm } from '../../lib/content/versus'
import { fr } from '../../lib/format'
import s from '../../styles/Glossary.module.css'

// Simulateurs à proposer selon le terme
const TOOL_FOR = {
  dca: { href: '/simulateurs/dca/msci-world', label: 'Simuler un DCA sur le MSCI World' },
  'interets-composes': { href: '/simulateurs/interets-composes', label: 'Simuler des intérêts composés' },
  cagr: { href: '/simulateurs/interets-composes', label: 'Simuler des intérêts composés' },
  ter: { href: '/simulateurs/frais', label: 'Calculer le coût des frais' },
  etf: { href: '/simulateurs/frais', label: 'Calculer le coût des frais' },
  inflation: { href: '/simulateurs/rendement-reel', label: 'Calculer un rendement réel' },
  'rendement-reel': { href: '/simulateurs/rendement-reel', label: 'Calculer un rendement réel' },
  'livret-a': { href: '/simulateurs/rendement-reel', label: 'Le Livret A face à l’inflation' },
  volatilite: { href: '/simulateurs/dca/bitcoin', label: 'Voir la volatilité du Bitcoin en DCA' },
  drawdown: { href: '/marches', label: 'Les pires baisses des grands marchés' },
  'plan-epargne-retraite': { href: '/simulateurs/per', label: 'Calculer l’économie d’impôt d’un versement PER' },
  tmi: { href: '/simulateurs/per', label: 'Voir ce que ta tranche change sur un versement PER' },
  lep: { href: '/simulateurs/eligibilite-lep', label: 'Tester ton éligibilité au LEP' },
  'flat-tax': { href: '/simulateurs/flat-tax-ou-bareme', label: 'Comparer flat tax et barème' },
  'bareme-progressif': { href: '/simulateurs/flat-tax-ou-bareme', label: 'Comparer flat tax et barème' },
  dividende: { href: '/simulateurs/flat-tax-ou-bareme', label: 'Calculer l’impôt sur tes dividendes' },
  'prelevements-sociaux': { href: '/simulateurs/flat-tax-ou-bareme', label: 'Comparer flat tax et barème' },
}

export default function Terme({ term, related, articles, versus }) {
  const crumbs = [{ href: '/glossaire', label: 'Glossaire' }, { label: term.term }]
  const tool = TOOL_FOR[term.slug]
  return (
    <>
      <Seo
        title={`${term.term} : définition simple`}
        description={term.short}
        jsonLd={[
          crumbsJsonLd(crumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: term.term,
            description: term.short,
            inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Glossaire Grapheko', url: 'https://grapheko.fr/glossaire' },
            url: `https://grapheko.fr/glossaire/${term.slug}`,
          },
        ]}
      />
      <PageIntro crumbs={crumbs} title={term.term} wide>
        <p className={s.cat}>{CATEGORIES[term.cat]}</p>
      </PageIntro>
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <div className={s.def}>
          <article>
            <p className={s.short}>{fr(term.short)}</p>
            <div className="prose">{term.body.map((p) => <p key={p.slice(0, 24)}>{fr(p)}</p>)}</div>
            {tool && <Link href={tool.href} className="btn btn--plein" style={{ marginTop: 8 }}>{tool.label}</Link>}
          </article>
          <aside className={s.aside}>
            {related.length > 0 && (
              <>
                <h2>Notions liées</h2>
                <ul>
                  {related.map((r) => (
                    <li key={r.slug}><Link href={`/glossaire/${r.slug}`}><strong>{r.term}</strong><span>{r.short}</span></Link></li>
                  ))}
                </ul>
              </>
            )}
            {versus.length > 0 && (
              <>
                <h2>Face à face</h2>
                <ul>
                  {versus.map((v) => <li key={v.slug}><Link href={`/comparer/${v.slug}`}><strong>{fr(v.title)}</strong></Link></li>)}
                </ul>
              </>
            )}
            {articles.length > 0 && (
              <>
                <h2>Pour aller plus loin</h2>
                <ul>
                  {articles.map((a) => <li key={a.slug}><Link href={`/blog/${a.slug}`}><strong>{fr(a.title)}</strong></Link></li>)}
                </ul>
              </>
            )}
          </aside>
        </div>
        <section className={`theme-encre ${s.nl}`} aria-labelledby="nl-term">
          <h2 id="nl-term">Un terme, un graphique, chaque dimanche.</h2>
          <NewsletterForm location={`glossaire_${term.slug}`} compact />
        </section>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: TERMS.map((t) => ({ params: { terme: t.slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const term = getTerm(params.terme)
  const related = term.related.map(getTerm).filter(Boolean).map(({ slug, term: name, short }) => ({ slug, term: name, short }))
  const articles = ARTICLES.filter((a) => a.terms.includes(term.slug)).map(({ slug, title }) => ({ slug, title }))
  const versus = versusForTerm(term.slug).map(({ slug, title }) => ({ slug, title }))
  return { props: { term, related, articles, versus, tracking: { glossary_term: term.slug } } }
}

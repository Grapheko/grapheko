import Link from 'next/link'
import Seo from '../components/layout/Seo'
import Hero from '../components/home/Hero'
import DcaStory from '../components/home/DcaStory'
import ToolsRail from '../components/home/ToolsRail'
import GlossaryBand from '../components/home/GlossaryBand'
import MarketsTable from '../components/ui/MarketsTable'
import NewsletterForm from '../components/ui/NewsletterForm'
import { ARTICLES, CAT_LABEL, dateFr } from '../lib/content/articles'
import { getMonthlyHistory } from '../lib/history'
import { getMarketsRows, REVALIDATE } from '../lib/marketData'
import { trackArticleClick, trackCTAClick } from '../lib/gtm'
import { fr } from '../lib/format'
import s from '../styles/Home.module.css'

export default function Home({ msci, markets }) {
  const curve = msci?.points?.map((p) => p.close)
  const demo = msci?.demo || markets.some((m) => m.demo)
  return (
    <>
      <Seo
        title={null}
        description="Simulateurs sur données réelles, cours en direct et glossaire sans jargon pour comprendre la Bourse, la crypto et l’épargne."
        jsonLd={[
          { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Grapheko', url: 'https://grapheko.fr', inLanguage: 'fr-FR', description: 'Média éducatif sur la Bourse, la crypto et l’épargne : simulateurs sur données réelles, fiches marché et glossaire.' },
          { '@context': 'https://schema.org', '@type': 'Organization', name: 'Grapheko', url: 'https://grapheko.fr', logo: 'https://grapheko.fr/icon-512.png', email: 'contact@grapheko.fr' },
        ]}
      />

      {demo && <p className={s.demo}>Données de démonstration (développement local) : les chiffres affichés ne sont pas réels.</p>}

      <Hero curve={curve} curveLabel={curve ? `La courbe : MSCI World en euros, depuis ${msci.points[0].m.slice(0, 4)}` : null} />

      <DcaStory history={msci} />

      <ToolsRail />

      <section className={`section ${s.markets}`} aria-labelledby="markets-title">
        <div className="wrap">
          <div className={s.sectionHead}>
            <h2 id="markets-title" data-reveal-lines>Les marchés, sans le bruit.</h2>
            <p className="lede">Performance sur un an et cinq ans, et la pire baisse jamais traversée. Trois chiffres pour situer un actif avant d’y penser.</p>
          </div>
          <MarketsTable rows={markets} location="home_marches" />
          <Link href="/marches" className="btn" style={{ marginTop: 32 }}>Voir tous les marchés</Link>
        </div>
      </section>

      <GlossaryBand />

      <section className={`section ${s.learnSection}`} aria-labelledby="learn-title">
        <div className={`wrap ${s.learn}`}>
          <Link href="/quiz/profil-investisseur" className={s.quiz} onClick={() => trackCTAClick('quiz', 'home')}>
            <h2 id="learn-title" className={s.quizTitle}>Quel investisseur es-tu ?</h2>
            <p>Sept questions sur ton horizon, ton épargne et ta réaction face à une baisse. Le résultat te dit par où commencer, pas quoi acheter.</p>
            <span className={s.quizGo}>Faire le quiz</span>
          </Link>
          <div className={s.articles}>
            <h2 className={s.articlesTitle}>Derniers articles</h2>
            <ul>
              {ARTICLES.slice(0, 4).map((a) => (
                <li key={a.slug}>
                  <Link href={`/blog/${a.slug}`} className={s.article} onClick={() => trackArticleClick(a.title, a.cat)}>
                    <span className={`tag tag--${a.cat}`}>{CAT_LABEL[a.cat]}</span>
                    <span className={s.articleTitle}>{fr(a.title)}</span>
                    <span className={s.articleMeta}>Mis à jour le {dateFr(a.updated)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/blog" className="link-arrow">Tous les articles</Link>
          </div>
        </div>
      </section>

      <section className={`section theme-encre ${s.newsletter}`} aria-labelledby="nl-title">
        <div className={`wrap ${s.nlGrid}`}>
          <h2 id="nl-title" data-reveal-lines>Une courbe expliquée, chaque dimanche.</h2>
          <div>
            <p className="lede" style={{ marginBottom: 28 }}>Un graphique, ce qu’il montre et ce qu’il ne montre pas. Cinq minutes de lecture, sans conseil déguisé.</p>
            <NewsletterForm location="home_newsletter" />
          </div>
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  const [msci, allMarkets] = await Promise.all([getMonthlyHistory('msci-world'), getMarketsRows()])
  // L'accueil montre une sélection ; la liste complète est sur /marches
  const markets = allMarkets.filter((m) => m.featured)
  return {
    props: { msci: msci || null, markets, tracking: { page_template: 'home' } },
    // Sans données (source indisponible), nouvel essai dans 5 minutes
    revalidate: msci && markets.every((m) => m.stats) ? REVALIDATE : 300,
  }
}

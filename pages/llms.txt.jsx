// /llms.txt : résumé du site pour les moteurs de réponse (ChatGPT, Perplexity, Claude…).
// Format proposé sur llmstxt.org : titre, résumé, puis listes de liens commentés.
import { ASSETS } from '../lib/assets'
import { TERMS } from '../lib/content/glossary'
import { ARTICLES } from '../lib/content/articles'
import { QUIZZES } from '../lib/content/quizzes'

const SITE = 'https://grapheko.fr'

function build() {
  return `# Grapheko

> Média éducatif français sur la Bourse, la crypto et l’épargne. Simulateurs sur données de marché réelles converties en euros, fiches marché avec performances et pires baisses historiques, glossaire avec chiffres réglementaires à jour (France, 2026). Aucun conseil en investissement personnalisé.

Les chiffres des fiches et simulateurs sont recalculés automatiquement à partir des clôtures mensuelles. Les indices sont des indices de prix (hors dividendes). Les cryptos du bandeau sont en temps réel ; les indices et l’or sont différés d’au moins 15 minutes.

## Simulateurs
- [Simulateur DCA rétroactif](${SITE}/simulateurs/dca/msci-world): rejoue un investissement mensuel sur de vrais cours historiques
- [Intérêts composés](${SITE}/simulateurs/interets-composes): capital futur avec versements mensuels
- [Coût des frais](${SITE}/simulateurs/frais): écart en euros entre deux niveaux de frais annuels
- [Rendement réel](${SITE}/simulateurs/rendement-reel): placement face à l’inflation

## Marchés (performances en euros, pire baisse historique, FAQ chiffrée)
${ASSETS.map((a) => `- [${a.name}](${SITE}/marches/${a.slug}): ${a.intro.split('. ')[0]}.`).join('\n')}

## Glossaire
${TERMS.map((t) => `- [${t.term}](${SITE}/glossaire/${t.slug}): ${t.short}`).join('\n')}

## Comparatifs
- [Courtiers PEA : frais de courtage comparés](${SITE}/comparatifs/courtiers-pea): Bourse Direct, BoursoBank, Fortuneo, Trade Republic, grilles officielles vérifiées, calculateur du coût annuel
- [Banques en ligne et néobanques](${SITE}/comparatifs/banques-en-ligne): BoursoBank, Fortuneo, Hello bank!, Monabanq, N26, Revolut, Nickel, Trade Republic, frais et conditions vérifiés

## Quiz
${QUIZZES.map((q) => `- [${q.title}](${SITE}/quiz/${q.slug}): ${q.teaser}`).join('\n')}

## Articles
${ARTICLES.map((a) => `- [${a.title}](${SITE}/blog/${a.slug}): ${a.description}`).join('\n')}

## Optional
- [Mentions légales](${SITE}/mentions-legales)
- [Contact](${SITE}/contact)
`
}

export default function Llms() { return null }

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(build())
  res.end()
  return { props: {} }
}

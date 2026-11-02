// Sitemap généré à partir du contenu : toute nouvelle page de catalogue y apparaît automatiquement.
import { ASSETS } from '../lib/assets'
import { TERMS } from '../lib/content/glossary'
import { ARTICLES } from '../lib/content/articles'

const SITE = 'https://grapheko.fr'
const TODAY = new Date().toISOString().slice(0, 10)

const STATIC = [
  ['/', '1.0'], ['/simulateurs', '0.9'], ['/simulateurs/interets-composes', '0.8'], ['/simulateurs/frais', '0.8'],
  ['/simulateurs/rendement-reel', '0.8'], ['/simulateurs/per', '0.8'], ['/simulateurs/flat-tax-ou-bareme', '0.8'], ['/marches', '0.8'], ['/glossaire', '0.8'], ['/blog', '0.8'],
  ['/quiz', '0.7'], ['/quiz/profil-investisseur', '0.7'], ['/quiz/crypto', '0.7'], ['/quiz/bourse-debutant', '0.7'], ['/calendrier', '0.7'], ['/comparatifs', '0.5'], ['/comparatifs/courtiers-pea', '0.8'], ['/comparatifs/banques-en-ligne', '0.8'], ['/newsletter', '0.6'], ['/about', '0.4'], ['/contact', '0.3'],
]

function build() {
  const urls = [
    ...STATIC.map(([u, p]) => ({ u, p, d: TODAY })),
    ...ASSETS.flatMap((a) => [{ u: `/simulateurs/dca/${a.slug}`, p: '0.8', d: TODAY }, { u: `/marches/${a.slug}`, p: '0.7', d: TODAY }]),
    ...TERMS.map((t) => ({ u: `/glossaire/${t.slug}`, p: '0.6', d: '2026-11-01' })),
    ...ARTICLES.map((a) => ({ u: `/blog/${a.slug}`, p: '0.7', d: a.updated })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((x) => `  <url><loc>${SITE}${x.u === '/' ? '' : x.u}</loc><lastmod>${x.d}</lastmod><priority>${x.p}</priority></url>`).join('\n')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(build())
  res.end()
  return { props: {} }
}

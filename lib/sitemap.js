// Liste des URL du site, avec leur date de dernière modification réelle.
// Sert au sitemap (/sitemap.xml) et à l'envoi IndexNow (lib/indexnow.js).
//
// La date (lastmod) doit changer seulement quand le contenu de la page change vraiment :
// si elle change tous les jours, Google et Bing finissent par l'ignorer.
// → Quand tu modifies le contenu d'une page de STATIC, mets sa date à jour ici.
// Articles : champ `updated` dans lib/content/articles.js. Pages « X ou Y » : lib/content/versus.js.
import { ASSETS } from './assets'
import { TERMS } from './content/glossary'
import { ARTICLES } from './content/articles'
import { VERSUS, versusForTerm } from './content/versus'
import { todayParis } from './content/calendar'

export const SITE = 'https://grapheko.fr'

// [chemin, priorité, date de dernière modification du contenu]
const STATIC = [
  ['/', '1.0', '2026-11-07'],
  ['/simulateurs', '0.9', '2026-11-07'],
  ['/simulateurs/interets-composes', '0.8', '2026-11-01'],
  ['/simulateurs/frais', '0.8', '2026-11-02'],
  ['/simulateurs/rendement-reel', '0.8', '2026-11-01'],
  ['/simulateurs/per', '0.8', '2026-11-04'],
  ['/simulateurs/flat-tax-ou-bareme', '0.8', '2026-11-02'],
  ['/simulateurs/eligibilite-lep', '0.8', '2026-11-04'],
  ['/marches', '0.8', '2026-11-01'],
  ['/glossaire', '0.8', '2026-11-04'],
  ['/blog', '0.8', '2026-11-07'],
  ['/comparer', '0.7', '2026-11-08'],
  ['/quiz', '0.7', '2026-11-04'],
  ['/quiz/profil-investisseur', '0.7', '2026-11-04'],
  ['/quiz/crypto', '0.7', '2026-11-04'],
  ['/quiz/bourse-debutant', '0.7', '2026-11-04'],
  ['/calendrier', '0.7', '2026-11-07'],
  ['/comparatifs', '0.5', '2026-11-08'],
  ['/comparatifs/assurance-vie', '0.8', '2026-11-08'],
  ['/comparatifs/plateformes-crypto', '0.8', '2026-11-08'],
  ['/integrer', '0.4', '2026-11-08'],
  ['/comparatifs/courtiers-pea', '0.8', '2026-11-04'],
  ['/comparatifs/banques-en-ligne', '0.8', '2026-11-04'],
  ['/newsletter', '0.6', '2026-11-02'],
  ['/about', '0.4', '2026-11-01'],
  ['/contact', '0.3', '2026-11-02'],
]

// Fiches marché et simulateurs DCA : gabarit modifié le 1er novembre 2026 (actifs ajoutés ensuite : champ `added`),
// chiffres recalculés à chaque nouvelle clôture mensuelle → premier jour du mois en cours.
const ASSET_PAGES_DATE = '2026-11-01'
const GLOSSARY_DATE = '2026-11-01'
const LUMP_DATE = '2026-11-07' // mise en ligne du simulateur d'investissement unique

const latest = (a, b) => (a > b ? a : b)

export function sitemapUrls(today = todayParis()) {
  const assetDate = latest(ASSET_PAGES_DATE, `${today.slice(0, 7)}-01`)
  const urls = [
    ...STATIC.map(([path, priority, lastmod]) => ({ path, priority, lastmod })),
    ...ASSETS.flatMap((a) => {
      const d = latest(assetDate, a.added || '')
      return [
        { path: `/simulateurs/dca/${a.slug}`, priority: '0.8', lastmod: d },
        { path: `/marches/${a.slug}`, priority: '0.7', lastmod: d },
        { path: `/simulateurs/si-j-avais-investi/${a.slug}`, priority: '0.8', lastmod: latest(d, LUMP_DATE) },
      ]
    }),
    // Une page de terme change aussi quand un face-à-face qui la concerne est ajouté ou modifié
    ...TERMS.map((t) => ({ path: `/glossaire/${t.slug}`, priority: '0.6', lastmod: versusForTerm(t.slug).reduce((d, v) => latest(d, v.updated), GLOSSARY_DATE) })),
    ...ARTICLES.map((a) => ({ path: `/blog/${a.slug}`, priority: '0.7', lastmod: a.updated })),
    ...VERSUS.map((v) => ({ path: `/comparer/${v.slug}`, priority: '0.7', lastmod: v.updated })),
  ]
  return urls.map((u) => ({ ...u, loc: SITE + (u.path === '/' ? '' : u.path) }))
}

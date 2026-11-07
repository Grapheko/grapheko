// Données structurées communes (schema.org).
// Les simulateurs sont décrits comme des applications web gratuites : ça n'affiche pas
// d'extrait enrichi chez Google (il faudrait des avis), mais ça dit clairement aux moteurs,
// et aux moteurs de réponse, que la page est un outil de calcul et pas un article.
const SITE = 'https://grapheko.fr'

const publisher = { '@type': 'Organization', name: 'Grapheko', url: SITE }

export const toolJsonLd = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name,
  description,
  url: SITE + path,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Tous (navigateur web)',
  inLanguage: 'fr-FR',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  publisher,
})

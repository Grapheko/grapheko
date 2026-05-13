// Ce fichier génère automatiquement le sitemap.xml
// Accessible sur https://grapheko.fr/sitemap.xml

const SITE_URL = 'https://grapheko.fr'

const PAGES = [
  { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-05-10' },
  { url: '/blog', priority: '0.9', changefreq: 'weekly', lastmod: '2026-05-10' },
  { url: '/blog/bourse-debutant-2026', priority: '0.8', changefreq: 'monthly', lastmod: '2026-05-10' },
  { url: '/blog/bitcoin-metriques-onchain', priority: '0.8', changefreq: 'monthly', lastmod: '2026-05-08' },
  { url: '/blog/ethereum-2026', priority: '0.8', changefreq: 'monthly', lastmod: '2026-05-06' },
  { url: '/blog/pea-cto-assurance-vie', priority: '0.8', changefreq: 'monthly', lastmod: '2026-05-04' },
  { url: '/blog/etf-debutant', priority: '0.8', changefreq: 'monthly', lastmod: '2026-05-02' },
  { url: '/ressources', priority: '0.7', changefreq: 'monthly', lastmod: '2026-05-10' },
  { url: '/newsletter', priority: '0.7', changefreq: 'monthly', lastmod: '2026-05-10' },
  { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: '2026-05-10' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly', lastmod: '2026-05-10' },
  { url: '/calculateur-interets-composes', priority: '0.9', changefreq: 'monthly', lastmod: '2026-05-13' },
]

function generateSitemap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

export default function Sitemap() {
  return null
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSitemap(PAGES)
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

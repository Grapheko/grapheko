// Sitemap généré à partir du contenu : toute nouvelle page de catalogue y apparaît automatiquement.
// Liste des URL et dates de modification : lib/sitemap.js.
import { sitemapUrls } from '../lib/sitemap'

function build() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls().map((x) => `  <url><loc>${x.loc}</loc><lastmod>${x.lastmod}</lastmod><priority>${x.priority}</priority></url>`).join('\n')}
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

import Head from 'next/head'
import { useRouter } from 'next/router'

const SITE = 'https://grapheko.fr'

export default function Seo({ title, description, jsonLd, noindex = false, image }) {
  const { asPath } = useRouter()
  // À la génération statique, l'accueil a pour chemin « /index » : on le ramène à « / »
  const path = asPath.split('?')[0].split('#')[0].replace(/\/index$/, '') || '/'
  const fullTitle = title ? `${title} | Grapheko` : 'Grapheko · Comprendre l’argent par les données'
  const url = SITE + (path === '/' ? '' : path)
  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="Grapheko" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image || `${SITE}/og.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      {noindex && <meta name="robots" content="noindex" />}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      )}
    </Head>
  )
}

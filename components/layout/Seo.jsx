import Head from 'next/head'
import { useRouter } from 'next/router'

const SITE = 'https://grapheko.fr'

export default function Seo({ title, description, jsonLd, noindex = false, image }) {
  const { asPath } = useRouter()
  const path = asPath.split('?')[0].split('#')[0]
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
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {noindex && <meta name="robots" content="noindex" />}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </Head>
  )
}

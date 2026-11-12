/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // Une seule adresse officielle : www → domaine nu (cohérent avec les canonical)
      { source: '/:path*', has: [{ type: 'host', value: 'www.grapheko.fr' }], destination: 'https://grapheko.fr/:path*', permanent: true },
      // Anciennes adresses de la V1 (conserve le référencement acquis)
      { source: '/calculateur-interets-composes', destination: '/simulateurs/interets-composes', permanent: true },
      { source: '/ressources', destination: '/simulateurs', permanent: true },
      // L'accueil n'a qu'une adresse : /index renvoie vers /
      { source: '/index', destination: '/', permanent: true },
    ]
  },
  async rewrites() {
    // Flux d'abonnement agenda (webcal://grapheko.fr/calendrier.ics)
    return [{ source: '/calendrier.ics', destination: '/api/calendrier' }]
  },
  async headers() {
    return [
      // Polices versionnées dans leur nom de fichier : cache d'un an
      { source: '/fonts/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
        ],
      },
      // Interdit l'affichage dans un cadre externe, sauf pour les simulateurs intégrables
      { source: '/((?!integrer/).*)', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
      { source: '/integrer/:outil', headers: [{ key: 'Content-Security-Policy', value: 'frame-ancestors *' }] },
    ]
  },
}

module.exports = nextConfig

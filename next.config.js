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
    ]
  },
  async rewrites() {
    // Flux d'abonnement agenda (webcal://grapheko.fr/calendrier.ics)
    return [{ source: '/calendrier.ics', destination: '/api/calendrier' }]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import Cursor from '../components/ui/Cursor'
import Nav from '../components/layout/Nav'
import { pageView } from '../lib/gtm'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  // ── Fire page.display à chaque changement de route ──
  useEffect(() => {
    // Premier chargement
    pageView(router.pathname, document.title)

    // Navigations suivantes
    const handleRouteChange = (url) => {
      // Petit délai pour que document.title soit à jour
      setTimeout(() => pageView(url, document.title), 100)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router])

  return (
    <>
      <Cursor />
      <Nav />
      <Component {...pageProps} />
    </>
  )
}

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import Cursor from '../components/ui/Cursor'
import Nav from '../components/layout/Nav'
import { pageView } from '../lib/gtm'
 
export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isFirstRender = useRef(true)
 
  useEffect(() => {
    // On ignore le premier rendu — GTM s'en charge via son initialisation
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
 
    // On fire page.display uniquement sur les navigations suivantes
    const handleRouteChange = (url) => {
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
 

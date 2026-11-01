import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource-variable/geist/index.css'
import '../styles/globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ConsentBanner from '../components/layout/ConsentBanner'
import { pageView, initTimeOnPage } from '../lib/gtm'
import { initSmoothScroll, initReveals, scrollToTop, ScrollTrigger } from '../lib/motion'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  // Défilement fluide (une seule fois)
  useEffect(() => initSmoothScroll(), [])

  // Page vue + temps passé + révélations, à chaque page
  // (la clé ignore la query string : un simulateur qui met à jour l'URL ne compte pas comme une nouvelle page)
  const pageKey = router.asPath.split('?')[0].split('#')[0]
  useEffect(() => {
    // Les pages peuvent transmettre des paramètres de tracking via pageProps.tracking
    const t = setTimeout(() => pageView(pageKey, document.title, pageProps.tracking || {}), 60)
    const clearTimers = initTimeOnPage(document.title)
    const cleanReveals = initReveals(document.getElementById('contenu') || document)
    return () => { clearTimeout(t); clearTimers(); cleanReveals() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey])

  useEffect(() => {
    const onDone = (url, { shallow } = {}) => {
      if (shallow) return
      scrollToTop()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    router.events.on('routeChangeComplete', onDone)
    return () => router.events.off('routeChangeComplete', onDone)
  }, [router])

  return (
    <>
      <Header />
      <main id="contenu">
        <Component {...pageProps} />
      </main>
      <Footer />
      <ConsentBanner />
    </>
  )
}

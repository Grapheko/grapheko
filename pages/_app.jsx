import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/fonts.css'
import '../styles/globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ConsentBanner from '../components/layout/ConsentBanner'
import { pageView, initTimeOnPage } from '../lib/gtm'
import { GRANTED_EVENT } from '../lib/consent'

// Animations (GSAP, défilement fluide) chargées à la première interaction (défilement,
// toucher, clic, clavier), ou au plus tard 6 s après l'affichage : elles ne pèsent plus
// sur le chargement de chaque page. Les animations sont liées au défilement, rien ne se perd.
const WAKE_EVENTS = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown']
let motionPromise = null
let motion = null
const loadMotion = () => (motionPromise ||= new Promise((resolve) => {
  let started = false
  const go = () => {
    if (started) return
    started = true
    WAKE_EVENTS.forEach((e) => window.removeEventListener(e, go))
    clearTimeout(timer)
    import('../lib/motion').then((m) => { motion = m; resolve(m) })
  }
  WAKE_EVENTS.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }))
  const timer = setTimeout(go, 6000)
}))

export default function App({ Component, pageProps }) {
  const router = useRouter()

  // Défilement fluide (une seule fois)
  useEffect(() => {
    let alive = true
    let cleanup = () => {}
    loadMotion().then((m) => { if (alive) cleanup = m.initSmoothScroll() })
    return () => { alive = false; cleanup() }
  }, [])

  // Page vue + temps passé + révélations, à chaque page
  // (la clé ignore la query string : un simulateur qui met à jour l'URL ne compte pas comme une nouvelle page)
  const pageKey = router.asPath.split('?')[0].split('#')[0]
  useEffect(() => {
    // Les pages peuvent transmettre des paramètres de tracking via pageProps.tracking
    const t = setTimeout(() => pageView(pageKey, document.title, pageProps.tracking || {}), 60)
    const clearTimers = initTimeOnPage(document.title)
    let alive = true
    let cleanReveals = () => {}
    // Module encore absent : il arrivera après l'affichage, on ne cache pas ce qui est déjà à l'écran
    const skipInView = !motion
    loadMotion().then((m) => {
      if (alive) cleanReveals = m.initReveals(document.getElementById('contenu') || document, { skipInView })
    })
    // Premier accord sur cette page : GTM vient d'être chargé, on compte la page en cours
    const onGranted = () => pageView(pageKey, document.title, pageProps.tracking || {})
    window.addEventListener(GRANTED_EVENT, onGranted)
    return () => { alive = false; clearTimeout(t); clearTimers(); cleanReveals(); window.removeEventListener(GRANTED_EVENT, onGranted) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey])

  useEffect(() => {
    const onDone = (url, { shallow } = {}) => {
      if (shallow) return
      if (!motion) { window.scrollTo(0, 0); return }
      motion.scrollToTop()
      requestAnimationFrame(() => motion.ScrollTrigger.refresh())
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

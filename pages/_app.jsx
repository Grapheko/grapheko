import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import Cursor from '../components/ui/Cursor'
import Nav from '../components/layout/Nav'
import Ticker from '../components/layout/Ticker'
import { pageView } from '../lib/gtm'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
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
      <Ticker />
      <Component {...pageProps} />
    </>
  )
}

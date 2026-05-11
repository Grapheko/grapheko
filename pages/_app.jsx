import '../styles/globals.css'
import Cursor from '../components/ui/Cursor'
import Nav from '../components/layout/Nav'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Cursor />
      <Nav />
      <Component {...pageProps} />
    </>
  )
}

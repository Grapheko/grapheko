import '../styles/globals.css'
import Cursor from '../components/ui/Cursor'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Cursor />
      <Component {...pageProps} />
    </>
  )
}

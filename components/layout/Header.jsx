import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Logo from '../ui/Logo'
import { trackClick } from '../../lib/gtm'
import { useMarketQuotes } from '../../lib/useMarketQuotes'
import { priceFmt, pct, dirClass } from '../../lib/format'
import s from './Header.module.css'

export const NAV = [
  { href: '/simulateurs', label: 'Simulateurs' },
  { href: '/marches', label: 'Marchés' },
  { href: '/glossaire', label: 'Glossaire' },
  { href: '/blog', label: 'Articles' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/comparatifs', label: 'Comparatifs' },
  { href: '/calendrier', label: 'Calendrier' },
]

function Ticker() {
  const { items, loaded } = useMarketQuotes()
  const anyLive = items.some((i) => i.mode === 'live' && i.price != null)
  const anyDelayed = items.some((i) => i.mode === 'delayed' && i.price != null)
  const status = anyLive && anyDelayed ? 'Top 10 crypto en direct, indices différés' : anyLive ? 'Crypto en direct' : anyDelayed ? 'Cours différés' : loaded ? 'Cours indisponibles' : 'Chargement des cours'

  return (
    <div className={s.ticker} aria-label="Cours des marchés">
      <Link href="/marches#sources" className={s.status} title="Top 10 crypto par capitalisation (classement CoinGecko), cours en temps réel. Indices et or différés d’au moins 15 minutes.">
        <span className={anyLive ? s.dotLive : s.dot} aria-hidden="true" />
        {status}
      </Link>
      <div className={s.track}>
        <div className={s.marquee}>
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1} className={s.list}>
              {items.map((t) => {
                const inner = (
                  <>
                    {t.mode === 'live' && t.price != null && <span className={s.liveMark} />}
                    <span className={s.name}>{t.name}</span>
                    <span className="num">{t.price != null ? `${priceFmt(t.price)}${t.unit === '€' ? '\u00a0€' : ''}` : '—'}</span>
                    <span className={`num ${dirClass(t.changePct)}`}>{t.changePct != null ? pct(t.changePct, 2) : ''}</span>
                  </>
                )
                return (
                  <li key={t.key}>
                    {t.slug
                      ? <Link href={`/marches/${t.slug}`} tabIndex={k === 1 ? -1 : 0} className={s.item}>{inner}</Link>
                      : <span className={s.item} title={t.fullName}>{inner}</span>}
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setOpen(false), [router.asPath])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  // Se cache en descendant, réapparaît en remontant
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240)
        lastY = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href) => (href === '/' ? router.pathname === '/' : router.pathname.startsWith(href.split('/').slice(0, 2).join('/')))

  return (
    <>
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <header className={`${s.header} ${hidden && !open ? s.hidden : ''} ${scrolled ? s.scrolled : ''}`}>
        <Ticker />
        <div className={s.bar}>
          <Link href="/" className={s.logo} aria-label="Grapheko, accueil" onClick={() => setOpen(false)}>
            <Logo size={24} />
          </Link>
          <nav className={s.nav} aria-label="Navigation principale">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className={`${s.link} ${isActive(l.href) ? s.active : ''}`} aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/newsletter" className={`btn btn--plein ${s.cta}`} onClick={() => trackClick('newsletter', 'header', 'cta')}>
            Recevoir la newsletter
          </Link>
          <button className={s.burger} aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(!open)}>
            <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
            <span className={`${s.burgerLine} ${s.top} ${open ? s.open : ''}`} />
            <span className={`${s.burgerLine} ${s.bottom} ${open ? s.open : ''}`} />
          </button>
        </div>
      </header>

      <div id="menu-mobile" className={`${s.mobile} ${open ? s.mobileOpen : ''}`} aria-hidden={!open}>
        <nav aria-label="Menu mobile">
          {[{ href: '/', label: 'Accueil' }, ...NAV, { href: '/newsletter', label: 'Newsletter' }].map((l, i) => (
            <Link key={l.href} href={l.href} tabIndex={open ? 0 : -1} className={`${s.mobileLink} ${isActive(l.href) ? s.mobileActive : ''}`} aria-current={isActive(l.href) ? 'page' : undefined} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

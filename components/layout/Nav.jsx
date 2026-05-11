import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const LINKS = [
  { href: '/', label: './home' },
  { href: '/blog', label: './blog' },
  { href: '/ressources', label: './ressources' },
  { href: '/newsletter', label: './newsletter' },
  { href: '/about', label: './about' },
  { href: '/contact', label: './contact' },
]

const BREADCRUMB_LABELS = {
  '': 'home',
  'blog': 'blog',
  'ressources': 'ressources',
  'newsletter': 'newsletter',
  'about': 'about',
  'contact': 'contact',
  'mentions-legales': 'mentions-legales',
  'bourse-debutant-2026': 'bourse-debutant-2026',
  'bitcoin-metriques-onchain': 'bitcoin-metriques-onchain',
  'ethereum-2026': 'ethereum-2026',
  'pea-cto-assurance-vie': 'pea-cto-assurance-vie',
  'etf-debutant': 'etf-debutant',
}

export default function Nav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Ferme le menu au changement de page
  useEffect(() => {
    setOpen(false)
  }, [router.pathname])

  // Bloque le scroll quand menu ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Fil d'Ariane
  const pathParts = router.pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    { href: '/', label: 'grapheko' },
    ...pathParts.map((part, i) => ({
      href: '/' + pathParts.slice(0, i + 1).join('/'),
      label: BREADCRUMB_LABELS[part] || part,
    }))
  ]

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/'
    return router.pathname.startsWith(href)
  }

  return (
    <>
      {/* ── NAV PRINCIPALE ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,8,8,.95)', backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid var(--border)',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 500,
          color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.5px',
          flexShrink: 0,
        }}>
          <span style={{ color: 'var(--neon)' }}>{'>'}</span>graph
          <span style={{ color: 'var(--neon)' }}>eko</span>
          <span style={{
            display: 'inline-block', width: '2px', height: '14px',
            background: 'var(--neon)', verticalAlign: 'middle', marginLeft: '1px',
            animation: 'blink 1s step-end infinite',
          }} />
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="nav-desktop">
          {LINKS.filter(l => l.href !== '/').map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--mono)', fontSize: '12px',
              color: isActive(href) ? 'var(--neon)' : 'var(--text-secondary)',
              textDecoration: 'none', transition: 'color .2s',
              ...(href === '/contact' ? {
                border: '0.5px solid var(--neon)',
                padding: '6px 14px', borderRadius: '4px', color: 'var(--neon)',
              } : {}),
            }}>{label}</Link>
          ))}
        </div>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="nav-burger"
          style={{
            display: 'none',
            background: 'transparent', border: 'none',
            padding: '8px', cursor: 'none',
            flexDirection: 'column', gap: '5px', alignItems: 'center',
          }}
        >
          <span style={{
            display: 'block', width: '22px', height: '1.5px',
            background: open ? 'var(--neon)' : 'var(--text-primary)',
            transition: 'transform .25s, opacity .25s',
            transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '22px', height: '1.5px',
            background: open ? 'var(--neon)' : 'var(--text-primary)',
            transition: 'opacity .25s',
            opacity: open ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '22px', height: '1.5px',
            background: open ? 'var(--neon)' : 'var(--text-primary)',
            transition: 'transform .25s, opacity .25s',
            transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* ── MENU MOBILE OVERLAY ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 49,
        background: 'rgba(8,8,8,.98)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column',
        padding: '80px 32px 48px',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
      }} className="nav-mobile-overlay">

        {/* Boot message */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '11px', color: '#1A3A2A',
          marginBottom: '40px', lineHeight: 2,
        }}>
          <div>$ navigation.sh --open</div>
          <div style={{ color: 'var(--neon)' }}>[ ✓ ] Menu chargé.</div>
        </div>

        {/* Links mobile */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {LINKS.map(({ href, label }, i) => (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--mono)',
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: 500,
              letterSpacing: '-0.5px',
              color: isActive(href) ? 'var(--neon)' : 'var(--text-primary)',
              textDecoration: 'none',
              padding: '12px 0',
              borderBottom: '0.5px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'color .2s',
              animationDelay: `${i * 0.05}s`,
            }}>
              <span>{label}</span>
              {isActive(href) && (
                <span style={{ fontSize: '12px', color: 'var(--neon)' }}>◆</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer mobile menu */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '11px', color: '#333',
          marginTop: '32px', lineHeight: 1.8,
        }}>
          <div>grapheko.fr · contact@grapheko.fr</div>
          <div style={{ color: '#1A3A2A' }}>© 2026 grapheko — All rights reserved</div>
        </div>
      </div>

      {/* ── FIL D'ARIANE ── */}
      {router.pathname !== '/' && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 48,
          background: 'var(--surface2)',
          borderBottom: '0.5px solid var(--border)',
          padding: '0 24px', height: '32px',
          display: 'flex', alignItems: 'center', gap: '0',
          overflowX: 'auto',
        }} className="breadcrumb-bar">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} style={{
              display: 'flex', alignItems: 'center', gap: '0',
              whiteSpace: 'nowrap',
            }}>
              {i > 0 && (
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '11px',
                  color: 'var(--border2)', margin: '0 6px',
                }}>/</span>
              )}
              <Link href={crumb.href} style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                color: i === breadcrumbs.length - 1 ? 'var(--neon)' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color .2s',
              }}>
                {crumb.label}
              </Link>
            </span>
          ))}
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
          .breadcrumb-bar { padding: 0 16px !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-overlay { display: none !important; }
          .nav-burger { display: none !important; }
          nav { padding: 0 48px !important; }
        }
        .breadcrumb-bar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}

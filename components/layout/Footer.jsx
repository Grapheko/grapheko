import Link from 'next/link'
import { openConsentSettings } from '../../lib/consent'
import { ASSETS } from '../../lib/assets'
import s from './Footer.module.css'

const COLS = [
  {
    title: 'Simulateurs',
    links: [
      { href: '/simulateurs/dca/bitcoin', label: 'DCA rétroactif' },
      { href: '/simulateurs/interets-composes', label: 'Intérêts composés' },
      { href: '/simulateurs/frais', label: 'Coût des frais' },
      { href: '/simulateurs/rendement-reel', label: 'Rendement réel' },
    ],
  },
  { title: 'Marchés', links: ASSETS.filter((a) => a.featured !== false).slice(0, 5).map((a) => ({ href: `/marches/${a.slug}`, label: a.name })) },
  {
    title: 'Apprendre',
    links: [
      { href: '/glossaire', label: 'Glossaire' },
      { href: '/blog', label: 'Articles' },
      { href: '/quiz', label: 'Quiz' },
      { href: '/calendrier', label: 'Calendrier fiscal' },
      { href: '/comparatifs', label: 'Comparatifs' },
    ],
  },
  {
    title: 'Grapheko',
    links: [
      { href: '/about', label: 'À propos' },
      { href: '/contact', label: 'Contact' },
      { href: '/newsletter', label: 'Newsletter' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className={`${s.footer} theme-encre`}>
      <div className="wrap">
        <div className={s.cols}>
          {COLS.map((c) => (
            <div key={c.title}>
              <h2 className={s.colTitle}>{c.title}</h2>
              <ul>
                {c.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className={s.link}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className={s.disclaimer}>
          Grapheko est un média éducatif. Les contenus et simulateurs ne constituent pas un conseil en investissement personnalisé.
          Les performances passées ne préjugent pas des performances futures. Investir comporte un risque de perte en capital.
        </p>

        <div className={s.legal}>
          <span>© {new Date().getFullYear()} Grapheko</span>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité et cookies</Link>
          <button onClick={openConsentSettings}>Gérer les cookies</button>
        </div>
      </div>
      <div className={s.wordmark} aria-hidden="true">grapheko</div>
    </footer>
  )
}

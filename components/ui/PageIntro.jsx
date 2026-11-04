import Link from 'next/link'
import { fr } from '../../lib/format'
import s from './PageIntro.module.css'

// En-tête des pages intérieures : fil d'Ariane, titre, chapeau
export default function PageIntro({ crumbs = [], title, lede, children, wide = false }) {
  return (
    <header className={`wrap ${s.intro} ${wide ? s.wide : ''}`}>
      {crumbs.length > 0 && (
        <nav aria-label="Fil d’Ariane" className={s.crumbs}>
          <ol>
            <li><Link href="/">Accueil</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.href || c.label}>
                {c.href && i < crumbs.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{fr(c.label)}</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className={s.title} data-reveal-lines>{fr(title)}</h1>
      {lede && <p className={s.lede}>{fr(lede)}</p>}
      {children}
    </header>
  )
}

export const crumbsJsonLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ href: '/', label: 'Accueil' }, ...crumbs].map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.label, item: c.href ? `https://grapheko.fr${c.href}` : undefined,
  })),
})

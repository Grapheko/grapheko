// Bloc de contenu rédigé (articles, pages « X ou Y ») : titres, paragraphes, listes, tableaux, liens, sources.
import Link from 'next/link'
import { trackClick, trackOutboundClick } from '../../lib/gtm'
import { fr } from '../../lib/format'
import s from '../../styles/Blog.module.css'

export default function ContentBlock({ b, slug }) {
  if (b.t === 'h2') return <h2>{fr(b.text)}</h2>
  if (b.t === 'h3') return <h3>{fr(b.text)}</h3>
  if (b.t === 'quote') return <blockquote>{fr(b.text)}</blockquote>
  if (b.t === 'ul') return <ul>{b.items.map((i) => <li key={i.slice(0, 30)}>{fr(i)}</li>)}</ul>
  if (b.t === 'table') {
    return (
      <figure className={s.tableBlock}>
        <figcaption className={s.tableCaption}>{b.caption}</figcaption>
        <div className={s.tableScroll} tabIndex={0} role="region" aria-label={b.caption}>
          <table className={s.table}>
            <thead><tr>{b.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((row) => (
                <tr key={row[0]}>{row.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
        {b.note && <p className={s.tableNote}>{fr(b.note)}</p>}
      </figure>
    )
  }
  if (b.t === 'actions') {
    return (
      <p className={s.actions}>
        {b.items.map((a) => (
          <Link key={a.href} href={a.href} className="btn" onClick={() => trackClick('lien_article', 'article', slug, a.href)}>{a.label}</Link>
        ))}
      </p>
    )
  }
  if (b.t === 'sources') {
    return (
      <ul className={s.sources}>
        {b.items.map((a) => (
          <li key={a.href}><a href={a.href} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick(a.href, a.label)}>{a.label}</a></li>
        ))}
      </ul>
    )
  }
  return <p>{fr(b.text)}</p>
}

import { fr } from '../../lib/format'
import s from './Faq.module.css'

export default function Faq({ items, title = 'Questions fréquentes' }) {
  if (!items?.length) return null
  return (
    <section className={s.faq} aria-labelledby="faq-title">
      <h2 id="faq-title" className={s.title}>{title}</h2>
      <div className={s.list}>
        {items.map((i) => (
          <details key={i.q} className={s.item}>
            <summary>{fr(i.q)}</summary>
            <p>{fr(i.a)}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

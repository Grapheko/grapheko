import Link from 'next/link'
import { pct, priceFmt, dirClass, monthLabel } from '../../lib/format'
import { KIND_LABEL } from '../../lib/assets'
import { trackClick } from '../../lib/gtm'
import s from './MarketsTable.module.css'

function Sparkline({ values }) {
  if (!values?.length) return <span className="faint">—</span>
  const W = 140
  const H = 40
  const min = Math.min(...values)
  const max = Math.max(...values)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * W).toFixed(1)},${(H - ((v - min) / (max - min || 1)) * (H - 4) - 2).toFixed(1)}`).join(' ')
  const up = values[values.length - 1] >= values[0]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={s.spark} aria-hidden="true">
      <path d={d} fill="none" stroke={up ? 'var(--hausse)' : 'var(--baisse)'} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

// rows : [{ slug, name, kind, stats, spark }]
export default function MarketsTable({ rows, location = 'marches' }) {
  const lastMonth = rows.find((r) => r.stats)?.stats.lastMonth
  return (
    <div className={s.wrap}>
      <table className={s.table}>
        <caption className="sr-only">Performance des marchés suivis par Grapheko, en euros</caption>
        <thead>
          <tr>
            <th scope="col">Actif</th>
            <th scope="col" className={s.hideSm}>Courbe sur 5 ans</th>
            <th scope="col" className={s.right}>Clôture</th>
            <th scope="col" className={s.right}>1 an</th>
            <th scope="col" className={`${s.right} ${s.hideSm}`}>5 ans</th>
            <th scope="col" className={`${s.right} ${s.hideMd}`}>Pire baisse</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.slug}>
              <th scope="row">
                <Link href={`/marches/${r.slug}`} className={s.name} onClick={() => trackClick(r.slug, location, 'actif')}>
                  {r.name}
                  <span className={s.kind}>{KIND_LABEL[r.kind]}</span>
                </Link>
              </th>
              <td className={s.hideSm}><Sparkline values={r.spark} /></td>
              <td className={`${s.right} num`}>{r.stats ? `${priceFmt(r.stats.last)} €` : '—'}</td>
              <td className={`${s.right} num ${dirClass(r.stats?.perf1y)}`}>{pct(r.stats?.perf1y, 1)}</td>
              <td className={`${s.right} num ${s.hideSm} ${dirClass(r.stats?.perf5y)}`}>{pct(r.stats?.perf5y, 0)}</td>
              <td className={`${s.right} num ${s.hideMd} down`}>{pct(r.stats?.maxDrawdown, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={s.foot}>
        Clôtures mensuelles en euros{lastMonth ? `, dernière clôture : ${monthLabel(lastMonth, true)}` : ''}. Indices hors dividendes.
        La pire baisse est mesurée d’un plus haut au plus bas suivant, sur tout l’historique disponible.
      </p>
    </div>
  )
}

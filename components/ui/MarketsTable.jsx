import Link from 'next/link'
import { pct, dirClass, monthLabel } from '../../lib/format'
import { kindLabel, closeText } from '../../lib/assets'
import { trackClick } from '../../lib/gtm'
import s from './MarketsTable.module.css'

// ['a', 'b', 'c'] → « a, b et c »
const listFr = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`)

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

// rows : [{ slug, name, kind, index, proxy, nativeClose, stats, spark }]
export default function MarketsTable({ rows, location = 'marches' }) {
  const lastMonth = rows.find((r) => r.stats)?.stats.lastMonth
  // Actifs boursiers dont l'historique commence après la crise de 2008 : leur pire baisse l'ignore
  const after2008 = rows.filter((r) => r.kind === 'bourse' && r.stats && Number(r.stats.first.slice(0, 4)) > 2008)
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
                  <span className={s.kind}>{kindLabel(r)}</span>
                </Link>
              </th>
              <td className={s.hideSm}><Sparkline values={r.spark} /></td>
              <td className={`${s.right} num`}>{r.stats ? closeText(r, r.stats.last, r.nativeClose) : '—'}</td>
              <td className={`${s.right} num ${dirClass(r.stats?.perf1y)}`}>{pct(r.stats?.perf1y, 1)}</td>
              <td className={`${s.right} num ${s.hideSm} ${dirClass(r.stats?.perf5y)}`}>{pct(r.stats?.perf5y, 0)}</td>
              <td className={`${s.right} ${s.hideMd}`}>
                <span className="num down">{pct(r.stats?.maxDrawdown, 0)}</span>
                {r.stats && <span className={s.since}>depuis {r.stats.first.slice(0, 4)}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={s.foot}>
        Clôtures mensuelles{lastMonth ? ` (dernière : ${monthLabel(lastMonth, true)})` : ''} : en points dans leur devise de cotation pour les indices, en euros pour les autres actifs.
        Performances et baisses calculées en euros, indices hors dividendes.
      </p>
      <p className={s.foot}>
        La pire baisse est mesurée d’un plus haut au plus bas suivant, depuis l’année indiquée. Les historiques n’ont pas la même durée :
        deux pires baisses ne se comparent que sur la même période.
        {after2008.length > 0 && ` La crise de 2008 n’entre pas dans la pire baisse de ${listFr(after2008.map((r) => `${r.name} (${r.proxy ? `via l’ETF ${r.proxy}, ` : ''}historique depuis ${r.stats.first.slice(0, 4)})`))}.`}
      </p>
    </div>
  )
}

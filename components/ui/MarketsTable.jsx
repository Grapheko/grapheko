import { useMemo, useState } from 'react'
import Link from 'next/link'
import { pct, dirClass, monthLabel } from '../../lib/format'
import { kindLabel, closeText } from '../../lib/assets'
import { trackClick } from '../../lib/gtm'
import s from './MarketsTable.module.css'

// ['a', 'b', 'c'] → « a, b et c »
const listFr = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`)

// Familles d'actifs pour les filtres
const FILTERS = [
  { key: 'tous', label: 'Tous' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'indices', label: 'Indices' },
  { key: 'actions', label: 'Actions' },
  { key: 'matieres', label: 'Matières premières' },
]
const family = (r) => (r.kind === 'crypto' ? 'crypto' : r.kind === 'matiere' ? 'matieres' : r.index || r.proxy ? 'indices' : 'actions')

// Colonnes triables. first = sens du premier clic : meilleure performance d'abord,
// pire baisse la plus forte d'abord. Troisième clic : retour à l'ordre du catalogue.
const SORTS = {
  perf1y: { label: '1 an', first: 'desc' },
  perf5y: { label: '5 ans', first: 'desc' },
  maxDrawdown: { label: 'Pire baisse', first: 'asc' },
}

function sortRows(rows, sort) {
  if (!sort) return rows
  const val = (r) => r.stats?.[sort.key]
  return [...rows].sort((a, b) => {
    const va = val(a)
    const vb = val(b)
    if (!Number.isFinite(va)) return Number.isFinite(vb) ? 1 : 0
    if (!Number.isFinite(vb)) return -1
    return sort.dir === 'asc' ? va - vb : vb - va
  })
}

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
// controls : affiche les filtres par famille et le tri par colonne (page /marches)
export default function MarketsTable({ rows, location = 'marches', controls = false }) {
  const [filter, setFilter] = useState('tous')
  const [sort, setSort] = useState(null) // { key, dir }

  const counts = useMemo(() => rows.reduce((acc, r) => ({ ...acc, [family(r)]: (acc[family(r)] || 0) + 1 }), { tous: rows.length }), [rows])
  const visible = useMemo(
    () => sortRows(filter === 'tous' ? rows : rows.filter((r) => family(r) === filter), sort),
    [rows, filter, sort],
  )

  const lastMonth = rows.find((r) => r.stats)?.stats.lastMonth
  // Actifs boursiers dont l'historique commence après la crise de 2008 : leur pire baisse l'ignore
  const after2008 = visible.filter((r) => r.kind === 'bourse' && r.stats && Number(r.stats.first.slice(0, 4)) > 2008)

  const chooseFilter = (key) => {
    if (key === filter) return
    setFilter(key)
    trackClick(`filtre_${key}`, location, 'filtre', key)
  }

  const toggleSort = (key) => {
    const { first } = SORTS[key]
    let next
    if (sort?.key !== key) next = { key, dir: first }
    else if (sort.dir === first) next = { key, dir: first === 'asc' ? 'desc' : 'asc' }
    else next = null
    setSort(next)
    trackClick(`tri_${key}`, location, 'tri', next ? next.dir : 'defaut')
  }

  const sortHead = (key, className) => {
    const label = SORTS[key].label
    if (!controls) return <th scope="col" className={className}>{label}</th>
    const dir = sort?.key === key ? sort.dir : null
    return (
      <th scope="col" className={className} aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}>
        <button type="button" className={`${s.sortBtn} ${dir ? s.sortActive : ''}`} onClick={() => toggleSort(key)}>
          {label}
          <span className={s.arrow} aria-hidden="true">{dir === 'asc' ? '↑' : dir === 'desc' ? '↓' : '↕'}</span>
        </button>
      </th>
    )
  }

  return (
    <div className={s.wrap}>
      {controls && (
        <div className={s.controls}>
          <div className="segmented" role="group" aria-label="Filtrer par type d’actif">
            {FILTERS.filter((f) => counts[f.key]).map((f) => (
              <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => chooseFilter(f.key)}>
                {f.label} <span className={s.count}>{counts[f.key]}</span>
              </button>
            ))}
          </div>
          <p className={s.status} aria-live="polite">
            {visible.length} actif{visible.length > 1 ? 's' : ''}
            {sort ? `, triés par ${SORTS[sort.key].label.toLowerCase()} (${sort.key === 'maxDrawdown'
              ? (sort.dir === 'asc' ? 'plus forte baisse d’abord' : 'plus faible baisse d’abord')
              : (sort.dir === 'desc' ? 'meilleure performance d’abord' : 'moins bonne performance d’abord')})` : ''}
          </p>
        </div>
      )}
      <table className={s.table}>
        <caption className="sr-only">Performance des marchés suivis par Grapheko, en euros{controls ? '. Les en-têtes 1 an, 5 ans et pire baisse permettent de trier le tableau.' : ''}</caption>
        <thead>
          <tr>
            <th scope="col">Actif</th>
            <th scope="col" className={s.hideSm}>Courbe sur 5 ans</th>
            <th scope="col" className={s.right}>Clôture</th>
            {sortHead('perf1y', s.right)}
            {sortHead('perf5y', `${s.right} ${s.hideSm}`)}
            {sortHead('maxDrawdown', `${s.right} ${s.hideMd}`)}
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
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

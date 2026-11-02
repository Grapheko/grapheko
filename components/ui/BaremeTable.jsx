import { BRACKETS, QF_CAP_PER_HALF, DECOTE } from '../../lib/tax'
import { eur, num } from '../../lib/format'
import s from './BaremeTable.module.css'

// Barème de l'impôt sur le revenu utilisé par les simulateurs fiscaux,
// avec la tranche du foyer mise en évidence.
export default function BaremeTable({ tmi, parts = 1, note }) {
  const rows = BRACKETS.map(([high, rate], i) => ({ low: i === 0 ? 0 : BRACKETS[i - 1][0], high, rate }))
  const foyer = parts !== 1
  return (
    <section className={s.box} aria-labelledby="bareme-title">
      <div className={s.head}>
        <h2 id="bareme-title" className={s.title}>Le barème utilisé</h2>
        <p className={s.sub}>
          Impôt 2026 sur les revenus 2025, fixé par la loi de finances pour 2026 (tranches relevées de 0,9 %).
        </p>
      </div>
      <table className={s.table}>
        <thead>
          <tr>
            <th scope="col">Revenu imposable par part</th>
            {foyer && <th scope="col">Pour ton foyer ({num(parts, 1).replace(',0', '')} parts)</th>}
            <th scope="col">Taux</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const mine = tmi === r.rate
            return (
              <tr key={r.rate} className={mine ? s.mine : ''} aria-current={mine ? 'true' : undefined}>
                <td>{range(r.low, r.high, 1)}</td>
                {foyer && <td>{range(r.low, r.high, parts)}</td>}
                <td className={s.rate}>
                  {num(r.rate * 100)} %{mine && <span className={s.badge}>Ta tranche</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className={s.foot}>
        Avantage du quotient familial plafonné à {eur(QF_CAP_PER_HALF)} par demi-part supplémentaire. Décote si l’impôt brut est inférieur à {eur(DECOTE.single.threshold)} (personne seule)
        ou {eur(DECOTE.couple.threshold)} (couple) : {eur(DECOTE.single.base)} ou {eur(DECOTE.couple.base)} moins {num(DECOTE.rate * 100, 2)} % de l’impôt.
        {note ? ` ${note}` : ''}{' '}
        <a href="https://entreprendre.service-public.gouv.fr/actualites/A18045" target="_blank" rel="noopener noreferrer">Source : service-public.gouv.fr</a>
      </p>
    </section>
  )
}

// Lignes du barème pour le PDF : [tranche par part, taux, est la tranche du foyer]
export function baremeRows(tmi) {
  return BRACKETS.map(([high, rate], i) => {
    const low = i === 0 ? 0 : BRACKETS[i - 1][0]
    return [`${range(low, high, 1)} par part`, `${num(rate * 100)} %`, tmi === rate]
  })
}

function range(low, high, k) {
  if (high === Infinity) return `Plus de ${eur(Math.round(low * k))}`
  if (low === 0) return `Jusqu’à ${eur(Math.round(high * k))}`
  return `De ${eur(Math.round(low * k) + 1)} à ${eur(Math.round(high * k))}`
}

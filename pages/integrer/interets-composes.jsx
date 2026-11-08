import { useMemo } from 'react'
import EmbedShell from '../../components/embed/EmbedShell'
import LineChart from '../../components/ui/LineChart'
import RangeField from '../../components/ui/RangeField'
import Counter from '../../components/ui/Counter'
import { compound } from '../../lib/finance'
import { eur, num } from '../../lib/format'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Embed.module.css'

// Version intégrable du simulateur d'intérêts composés. Valeurs de départ
// réglables par l'adresse : ?capital=1000&mensuel=150&taux=5&duree=20
export default function InteretsComposesEmbed() {
  const [st, set] = useToolState('integration_interets_composes', { capital: 1000, mensuel: 150, taux: 5, duree: 20 })
  const r = useMemo(() => compound({ capital: st.capital, monthly: st.mensuel, ratePct: st.taux, years: st.duree }), [st])

  return (
    <EmbedShell
      tool="interets-composes"
      title="Simulateur d’intérêts composés"
      fullPath="/simulateurs/interets-composes"
      cta={{ question: 'Investir chaque mois, mais où ?', label: 'Comparer les frais des courtiers PEA', href: '/comparatifs/courtiers-pea' }}
    >
      <div>
        <h1 className={s.title}>Combien vaudra ton épargne ?</h1>
        <p className={s.lede}>Les gains produisent eux-mêmes des gains : règle les curseurs pour voir l’effet du temps.</p>
      </div>
      <form className={s.grid} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
        <RangeField label="Capital de départ" value={st.capital} onChange={set('capital')} min={0} max={100000} step={500} suffix="€" />
        <RangeField label="Versement mensuel" value={st.mensuel} onChange={set('mensuel')} min={0} max={3000} step={10} suffix="€" />
        <RangeField label="Rendement annuel" value={st.taux} onChange={set('taux')} min={0} max={12} step={0.1} suffix="%" />
        <RangeField label="Durée" value={st.duree} onChange={set('duree')} min={1} max={50} step={1} suffix="ans" />
      </form>
      <dl className={s.kpis} aria-live="polite">
        <div className={`${s.kpi} ${s.kpiMain}`}>
          <dt>Capital dans {st.duree} ans</dt>
          <dd><Counter value={r.value} format={(v) => eur(v)} /></dd>
        </div>
        <div className={s.kpi}>
          <dt>Total versé</dt>
          <dd><Counter value={r.invested} format={(v) => eur(v)} /></dd>
        </div>
        <div className={s.kpi}>
          <dt>Intérêts gagnés</dt>
          <dd className="up"><Counter value={r.interests} format={(v) => `+${eur(v)}`} /></dd>
        </div>
      </dl>
      <div className={s.chart}>
        <LineChart
          animateKey={`${st.duree}`}
          labels={r.rows.map((row) => row.year)}
          series={[
            { key: 'value', label: 'Capital total', color: 'var(--outremer)', values: r.rows.map((row) => row.value), area: true },
            { key: 'invested', label: 'Total versé', color: 'var(--encre)', values: r.rows.map((row) => row.invested), dashed: true, width: 2 },
          ]}
          formatX={(y) => `${y} an${y > 1 ? 's' : ''}`}
          formatY={(v) => (v >= 10000 ? `${num(v / 1000, 0)} k€` : eur(v))}
          formatTooltip={(v) => eur(v)}
          minZero
          ariaLabel="Évolution du capital et du total versé"
        />
      </div>
      <p className={s.note}>Rendement constant, versements en fin de mois, sans frais ni fiscalité. En réalité, le rendement varie chaque année et peut être négatif.</p>
    </EmbedShell>
  )
}

InteretsComposesEmbed.bare = true

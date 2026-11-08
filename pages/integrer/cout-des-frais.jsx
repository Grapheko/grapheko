import { useMemo } from 'react'
import EmbedShell from '../../components/embed/EmbedShell'
import LineChart from '../../components/ui/LineChart'
import RangeField from '../../components/ui/RangeField'
import Counter from '../../components/ui/Counter'
import { feesImpact } from '../../lib/finance'
import { eur, num, pct } from '../../lib/format'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Embed.module.css'

// Version intégrable du simulateur du coût des frais. Valeurs de départ
// réglables par l'adresse : ?mensuel=200&taux=6&duree=30&fraisA=0.2&fraisB=2
export default function CoutDesFraisEmbed() {
  const [st, set] = useToolState('integration_cout_frais', { capital: 0, mensuel: 200, taux: 6, duree: 30, fraisA: 0.2, fraisB: 2 })
  const r = useMemo(
    () => feesImpact({ capital: st.capital, monthly: st.mensuel, ratePct: st.taux, years: st.duree, feesA: st.fraisA, feesB: st.fraisB }),
    [st]
  )

  return (
    <EmbedShell
      tool="cout-des-frais"
      title="Simulateur du coût des frais"
      fullPath="/simulateurs/frais"
      cta={{ question: 'Les frais de ton contrat sont-ils trop élevés ?', label: 'Comparer les assurances-vie en ligne', href: '/comparatifs/assurance-vie' }}
    >
      <div>
        <h1 className={s.title}>Combien te coûtent les frais ?</h1>
        <p className={s.lede}>Les frais se composent comme les gains : compare deux niveaux de frais annuels sur la durée.</p>
      </div>
      <form className={s.grid} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
        <RangeField label="Versement mensuel" value={st.mensuel} onChange={set('mensuel')} min={0} max={3000} step={10} suffix="€" />
        <RangeField label="Durée" value={st.duree} onChange={set('duree')} min={1} max={50} step={1} suffix="ans" />
        <RangeField label="Frais annuels, option A" value={st.fraisA} onChange={set('fraisA')} min={0} max={4} step={0.05} suffix="%" />
        <RangeField label="Frais annuels, option B" value={st.fraisB} onChange={set('fraisB')} min={0} max={4} step={0.05} suffix="%" />
      </form>
      <dl className={s.kpis} aria-live="polite">
        <div className={`${s.kpi} ${s.kpiMain}`}>
          <dt>Écart au bout de {st.duree} ans</dt>
          <dd><Counter value={r.gap} format={(v) => eur(v)} /></dd>
        </div>
        <div className={s.kpi}>
          <dt>Option A ({pct(st.fraisA, 2, false)})</dt>
          <dd><Counter value={r.a.value} format={(v) => eur(v)} /></dd>
        </div>
        <div className={s.kpi}>
          <dt>Option B ({pct(st.fraisB, 2, false)})</dt>
          <dd><Counter value={r.b.value} format={(v) => eur(v)} /></dd>
        </div>
      </dl>
      <div className={s.chart}>
        <LineChart
          animateKey={`${st.duree}`}
          labels={r.a.rows.map((row) => row.year)}
          series={[
            { key: 'a', label: `Frais de ${pct(st.fraisA, 2, false)}`, color: 'var(--outremer)', values: r.a.rows.map((row) => row.value), area: true },
            { key: 'b', label: `Frais de ${pct(st.fraisB, 2, false)}`, color: 'var(--baisse)', values: r.b.rows.map((row) => row.value) },
            { key: 'inv', label: 'Total versé', color: 'var(--encre)', values: r.a.rows.map((row) => row.invested), dashed: true, width: 2 },
          ]}
          formatX={(y) => `${y} an${y > 1 ? 's' : ''}`}
          formatY={(v) => (v >= 10000 ? `${num(v / 1000, 0)} k€` : eur(v))}
          formatTooltip={(v) => eur(v)}
          minZero
          ariaLabel="Comparaison du capital avec deux niveaux de frais"
        />
      </div>
      <p className={s.note}>Rendement de {pct(st.taux, 1, false)} par an avant frais, constant, versements en fin de mois, hors fiscalité.</p>
    </EmbedShell>
  )
}

CoutDesFraisEmbed.bare = true

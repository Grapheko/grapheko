import { useMemo } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import { toolJsonLd } from '../../lib/jsonld'
import LineChart from '../../components/ui/LineChart'
import RangeField from '../../components/ui/RangeField'
import Counter from '../../components/ui/Counter'
import ShareButton from '../../components/ui/ShareButton'
import { feesImpact } from '../../lib/finance'
import { eur, num, pct } from '../../lib/format'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Tool.module.css'

const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: 'Coût des frais' }]

export default function Frais() {
  const [st, set] = useToolState('cout_frais', { capital: 0, mensuel: 200, taux: 6, duree: 30, fraisA: 0.2, fraisB: 2 })
  const r = useMemo(
    () => feesImpact({ capital: st.capital, monthly: st.mensuel, ratePct: st.taux, years: st.duree, feesA: st.fraisA, feesB: st.fraisB }),
    [st]
  )
  const gapPct = r.a.value > 0 ? (r.gap / r.a.value) * 100 : 0

  return (
    <>
      <Seo
        title="Simulateur du coût des frais de gestion"
        description="Compare deux niveaux de frais annuels (ETF, fonds, assurance-vie) et vois l’écart en euros sur 10, 20 ou 30 ans."
        jsonLd={[crumbsJsonLd(crumbs), toolJsonLd({ name: 'Simulateur du coût des frais de gestion', description: 'Compare deux niveaux de frais annuels et vois l’écart en euros sur 10, 20 ou 30 ans.', path: '/simulateurs/frais' })]}
      />
      <PageIntro
        crumbs={crumbs}
        title="Combien te coûtent vraiment les frais ?"
        lede="Un ou deux pourcents par an semblent peu. Mais les frais se composent comme les gains : sur une longue durée, l’écart devient considérable."
        wide
      />
      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
            <h2>Ton placement</h2>
            <RangeField label="Capital de départ" value={st.capital} onChange={set('capital')} min={0} max={100000} step={500} suffix="€" />
            <RangeField label="Versement mensuel" value={st.mensuel} onChange={set('mensuel')} min={0} max={3000} step={10} suffix="€" />
            <RangeField label="Rendement annuel avant frais" value={st.taux} onChange={set('taux')} min={0} max={12} step={0.1} suffix="%" />
            <RangeField label="Durée" value={st.duree} onChange={set('duree')} min={1} max={50} step={1} suffix="ans" />
            <hr className="rule" />
            <RangeField label="Frais annuels, option A" value={st.fraisA} onChange={set('fraisA')} min={0} max={4} step={0.05} suffix="%" hint="Exemple : un ETF indiciel." />
            <RangeField label="Frais annuels, option B" value={st.fraisB} onChange={set('fraisB')} min={0} max={4} step={0.05} suffix="%" hint="Exemple : un fonds géré activement." />
          </form>

          <div className={s.results} aria-live="polite">
            <dl className={s.kpis}>
              <div className={`${s.kpi} ${s.kpiMain}`}>
                <dt>Écart au bout de {st.duree} ans</dt>
                <dd className="figure"><Counter value={r.gap} format={(v) => eur(v)} /><span className={s.sub} style={{ color: '#BDBFD6' }}>{num(gapPct, 0)} % du capital de l’option A</span></dd>
              </div>
              <div className={s.kpi}>
                <dt>Option A ({pct(st.fraisA, 2, false)} / an)</dt>
                <dd className="figure"><Counter value={r.a.value} format={(v) => eur(v)} /></dd>
              </div>
              <div className={s.kpi}>
                <dt>Option B ({pct(st.fraisB, 2, false)} / an)</dt>
                <dd className="figure"><Counter value={r.b.value} format={(v) => eur(v)} /></dd>
              </div>
            </dl>

            <div className={s.chartPanel}>
              <h2 className={s.chartTitle}>Le même placement, avec deux niveaux de frais</h2>
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

            <div className={s.reading}>
              <div>
                <h3>Où trouver les frais d’un fonds ?</h3>
                <p>Dans son document d’informations clés (DIC), à la ligne des frais courants. Pour un ETF, on parle aussi de TER. <Link href="/glossaire/ter">Comprendre le TER</Link>.</p>
              </div>
              <div>
                <h3>Les frais ne sont pas les seuls coûts</h3>
                <p>S’y ajoutent les frais de courtage, de tenue de compte, de change, et sur une assurance-vie les frais de gestion du contrat.</p>
              </div>
            </div>

            <div className={s.actions}>
              <ShareButton toolName="cout_frais" />
              <Link className="btn" href="/integrer">Intégrer ce simulateur à ton site</Link>
              <Link className="btn" href="/comparer/etf-ou-fonds-actif">ETF ou fonds actif ?</Link>
            </div>

            <p className={s.method}>
              <strong>Méthode.</strong> Les frais annuels sont déduits du rendement annuel, converti en taux mensuel équivalent. Versements en fin de mois, sans fiscalité.
              Outil pédagogique, pas un conseil en investissement.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'cout_frais' } } }
}

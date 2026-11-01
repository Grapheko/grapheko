import { useMemo } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import LineChart from '../../components/ui/LineChart'
import RangeField from '../../components/ui/RangeField'
import Counter from '../../components/ui/Counter'
import ShareButton from '../../components/ui/ShareButton'
import { compound } from '../../lib/finance'
import { eur, num, pct } from '../../lib/format'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Tool.module.css'

const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: 'Intérêts composés' }]

export default function InteretsComposes() {
  const [st, set] = useToolState('interets_composes', { capital: 1000, mensuel: 150, taux: 5, duree: 20 })
  const r = useMemo(() => compound({ capital: st.capital, monthly: st.mensuel, ratePct: st.taux, years: st.duree }), [st])
  const share = r.value > 0 ? (r.interests / r.value) * 100 : 0
  const half = r.rows.findIndex((row) => row.value - row.invested >= row.invested)

  return (
    <>
      <Seo
        title="Simulateur d’intérêts composés"
        description="Calcule la valeur future de ton épargne avec un capital de départ, un versement mensuel et un taux annuel. Graphique année par année."
        jsonLd={crumbsJsonLd(crumbs)}
      />
      <PageIntro
        crumbs={crumbs}
        title="Combien vaudra ton épargne dans 20 ans ?"
        lede="Les gains produisent eux-mêmes des gains. Règle les curseurs pour voir quelle part du capital final vient de tes versements, et quelle part vient du temps."
        wide
      />
      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
            <h2>Tes hypothèses</h2>
            <RangeField label="Capital de départ" value={st.capital} onChange={set('capital')} min={0} max={100000} step={500} suffix="€" />
            <RangeField label="Versement mensuel" value={st.mensuel} onChange={set('mensuel')} min={0} max={3000} step={10} suffix="€" />
            <RangeField label="Rendement annuel" value={st.taux} onChange={set('taux')} min={0} max={12} step={0.1} suffix="%" hint="Hypothèse constante. Les marchés réels varient fortement d’une année à l’autre." />
            <RangeField label="Durée" value={st.duree} onChange={set('duree')} min={1} max={50} step={1} suffix="ans" />
          </form>

          <div className={s.results} aria-live="polite">
            <dl className={s.kpis}>
              <div className={`${s.kpi} ${s.kpiMain}`}>
                <dt>Capital dans {st.duree} ans</dt>
                <dd className="figure"><Counter value={r.value} format={(v) => eur(v)} /></dd>
              </div>
              <div className={s.kpi}>
                <dt>Total versé</dt>
                <dd className="figure"><Counter value={r.invested} format={(v) => eur(v)} /></dd>
              </div>
              <div className={s.kpi}>
                <dt>Intérêts gagnés</dt>
                <dd className="figure up"><Counter value={r.interests} format={(v) => `+${eur(v)}`} /><span className={s.sub}>{num(share, 0)} % du capital final</span></dd>
              </div>
            </dl>

            <div className={s.chartPanel}>
              <h2 className={s.chartTitle}>Versements et intérêts, année par année</h2>
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

            <div className={s.reading}>
              <div>
                <h3>{half > 0 ? `Les intérêts dépassent tes versements après ${half} ans` : 'Les versements restent majoritaires'}</h3>
                <p>{half > 0 ? 'À partir de ce moment, ton argent gagne plus chaque année par lui-même que par ce que tu ajoutes.' : 'Sur cette durée et à ce taux, la majeure partie du capital vient de ce que tu verses. Allonge la durée pour voir l’effet s’inverser.'}</p>
              </div>
              <div>
                <h3>Rendement réel : pense à l’inflation</h3>
                <p>Avec {pct(st.taux, 1, false)} de rendement et 2 % d’inflation, le gain de pouvoir d’achat est d’environ {pct(((1 + st.taux / 100) / 1.02 - 1) * 100, 1, false)} par an. <Link href="/simulateurs/rendement-reel">Simuler le rendement réel</Link>.</p>
              </div>
            </div>

            <div className={s.actions}>
              <ShareButton toolName="interets_composes" />
              <Link href="/simulateurs/frais" className="btn">Voir l’effet des frais</Link>
            </div>

            <p className={s.method}>
              <strong>Méthode.</strong> Taux annuel converti en taux mensuel équivalent, versements en fin de mois, sans frais ni fiscalité.
              Un rendement constant est une simplification : en réalité, il varie chaque année et peut être négatif. Outil pédagogique, pas un conseil en investissement.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'interets_composes' } } }
}

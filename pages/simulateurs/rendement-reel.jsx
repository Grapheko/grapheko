import { useMemo } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import LineChart from '../../components/ui/LineChart'
import RangeField from '../../components/ui/RangeField'
import Counter from '../../components/ui/Counter'
import ShareButton from '../../components/ui/ShareButton'
import { realReturn } from '../../lib/finance'
import { eur, num, pct } from '../../lib/format'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Tool.module.css'

const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: 'Rendement réel' }]
const LIVRET_A = 1.7 // taux en vigueur depuis le 1er août 2026

export default function RendementReel() {
  const [st, set] = useToolState('rendement_reel', { capital: 10000, taux: LIVRET_A, inflation: 2, duree: 10 })
  const r = useMemo(() => realReturn({ capital: st.capital, ratePct: st.taux, inflationPct: st.inflation, years: st.duree }), [st])
  const loss = r.real < st.capital

  return (
    <>
      <Seo
        title="Rendement réel : ton épargne bat-elle l’inflation ?"
        description="Compare le taux de ton livret ou de ton placement à l’inflation et vois ce que vaut vraiment ton épargne en pouvoir d’achat."
        jsonLd={crumbsJsonLd(crumbs)}
      />
      <PageIntro
        crumbs={crumbs}
        title="Ton livret te fait-il perdre de l’argent ?"
        lede="Un solde qui augmente ne veut pas dire que tu t’enrichis. Ce qui compte, c’est ce que ton épargne permet d’acheter, une fois l’inflation déduite."
        wide
      />
      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
            <h2>Ton épargne</h2>
            <RangeField label="Montant placé" value={st.capital} onChange={set('capital')} min={100} max={100000} step={100} suffix="€" />
            <RangeField label="Taux du placement" value={st.taux} onChange={set('taux')} min={0} max={10} step={0.05} suffix="%" hint={`Le Livret A rapporte ${num(LIVRET_A, 1)} % depuis le 1er août 2026.`} />
            <RangeField label="Inflation annuelle" value={st.inflation} onChange={set('inflation')} min={0} max={10} step={0.1} suffix="%" hint="Hypothèse moyenne sur la durée. L’objectif de la BCE est de 2 %." />
            <RangeField label="Durée" value={st.duree} onChange={set('duree')} min={1} max={40} step={1} suffix="ans" />
          </form>

          <div className={s.results} aria-live="polite">
            <dl className={s.kpis}>
              <div className={`${s.kpi} ${s.kpiMain}`}>
                <dt>Pouvoir d’achat dans {st.duree} ans</dt>
                <dd className="figure"><Counter value={r.real} format={(v) => eur(v)} /><span className={s.sub} style={{ color: loss ? '#FF8B73' : '#5FD39A' }}>en euros d’aujourd’hui</span></dd>
              </div>
              <div className={s.kpi}>
                <dt>Solde affiché</dt>
                <dd className="figure"><Counter value={r.nominal} format={(v) => eur(v)} /></dd>
              </div>
              <div className={s.kpi}>
                <dt>Rendement réel annuel</dt>
                <dd className={`figure ${r.realRate >= 0 ? 'up' : 'down'}`}>{pct(r.realRate, 2)}</dd>
              </div>
            </dl>

            <div className={s.chartPanel}>
              <h2 className={s.chartTitle}>Ce que tu vois, et ce que ça vaut vraiment</h2>
              <LineChart
                animateKey={`${st.duree}`}
                labels={r.rows.map((row) => row.year)}
                series={[
                  { key: 'nominal', label: 'Solde affiché', color: 'var(--encre)', values: r.rows.map((row) => row.nominal), dashed: true, width: 2 },
                  { key: 'real', label: 'Pouvoir d’achat', color: loss ? 'var(--baisse)' : 'var(--outremer)', values: r.rows.map((row) => row.real), area: true },
                ]}
                formatX={(y) => `${y} an${y > 1 ? 's' : ''}`}
                formatY={(v) => eur(v)}
                ariaLabel="Solde nominal et pouvoir d’achat au fil des années"
              />
            </div>

            <div className={s.reading}>
              <div>
                <h3>{loss ? `Tu perds ${eur(st.capital - r.real)} de pouvoir d’achat` : `Tu gagnes ${eur(r.real - st.capital)} de pouvoir d’achat`}</h3>
                <p>Calculé en euros d’aujourd’hui : c’est ce que ton épargne permettra réellement d’acheter, si l’inflation reste à {pct(st.inflation, 1, false)} par an en moyenne.</p>
              </div>
              <div>
                <h3>Le livret reste utile</h3>
                <p>Disponible à tout moment et sans risque de perte en capital, il est fait pour l’épargne de précaution. <Link href="/glossaire/livret-a">Le Livret A en détail</Link>.</p>
              </div>
            </div>

            <div className={s.actions}>
              <ShareButton toolName="rendement_reel" />
            </div>

            <p className={s.method}>
              <strong>Méthode.</strong> Rendement réel = (1 + taux) / (1 + inflation) − 1, appliqué chaque année à taux constants. Intérêts capitalisés annuellement, sans fiscalité
              (le Livret A est exonéré d’impôt et de prélèvements sociaux). Outil pédagogique, pas un conseil en investissement.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'rendement_reel' } } }
}

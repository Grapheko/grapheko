import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Seo from '../../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../../components/ui/PageIntro'
import LineChart from '../../../components/ui/LineChart'
import RangeField from '../../../components/ui/RangeField'
import Counter from '../../../components/ui/Counter'
import ShareButton from '../../../components/ui/ShareButton'
import { ASSETS, getAsset } from '../../../lib/assets'
import { getMonthlyHistory } from '../../../lib/history'
import { REVALIDATE } from '../../../lib/marketData'
import { backtestDca } from '../../../lib/finance'
import { eur, pct, num, monthLabel, priceFmt } from '../../../lib/format'
import { useToolState } from '../../../lib/useToolState'
import { getTerm } from '../../../lib/content/glossary'
import s from '../../../styles/Tool.module.css'

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function DcaPage({ asset, initialHistory }) {
  const [history, setHistory] = useState(initialHistory)
  const [loading, setLoading] = useState(!initialHistory)

  // Si la page a été générée sans données, nouvel essai côté navigateur
  useEffect(() => {
    setHistory(initialHistory)
    if (initialHistory) { setLoading(false); return }
    setLoading(true)
    fetch(`/api/history/${asset.slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setHistory(d))
      .catch(() => setHistory(null))
      .finally(() => setLoading(false))
  }, [asset.slug, initialHistory])

  const points = history?.points || []
  const firstYear = points.length ? parseInt(points[0].m.slice(0, 4), 10) : 2015
  const lastM = points.length ? points[points.length - 1].m : null
  const lastYear = lastM ? parseInt(lastM.slice(0, 4), 10) : 2026
  const defaultStartYear = Math.max(firstYear + (points[0]?.m.slice(5) === '01' ? 0 : 1), asset.kind === 'crypto' ? 2018 : 2015)

  const [st, set] = useToolState(`dca_${asset.slug}`, {
    montant: 100,
    annee: defaultStartYear,
    mois: 1,
    frequence: 1,
    frais: asset.kind === 'crypto' ? 1 : 0.2,
  })

  const startKey = `${st.annee}-${String(st.mois).padStart(2, '0')}`
  const result = useMemo(
    () => (points.length ? backtestDca(points, { start: startKey, amount: st.montant, everyMonths: st.frequence, feePct: st.frais }) : null),
    [points, startKey, st.montant, st.frequence, st.frais]
  )

  const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: `DCA ${asset.name}` }]
  const years = []
  for (let y = firstYear; y <= lastYear - 1; y++) years.push(y)
  const freqLabel = st.frequence === 1 ? 'par mois' : 'par trimestre'

  return (
    <>
      <Seo
        title={`Simulateur DCA ${asset.name} : et si tu avais investi chaque mois ?`}
        description={`Calcule ce qu’aurait rapporté un investissement régulier sur ${asset.name}, mois par mois, à partir des vrais cours historiques en euros.`}
        jsonLd={crumbsJsonLd(crumbs)}
      />
      <PageIntro
        crumbs={crumbs}
        title={`Et si tu avais investi chaque mois sur ${asset.name} ?`}
        lede={`Choisis un montant et une date de départ : le simulateur rejoue chaque achat sur les vrais cours mensuels de ${asset.name}, convertis en euros.`}
        wide
      >
        <nav aria-label="Choisir un autre actif" className={s.assetPicker} style={{ marginTop: 28 }}>
          {ASSETS.map((a) => (
            <Link key={a.slug} href={`/simulateurs/dca/${a.slug}`} aria-current={a.slug === asset.slug ? 'page' : undefined} scroll={false}>
              {a.name}
            </Link>
          ))}
        </nav>
      </PageIntro>

      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
            <h2>Ton investissement</h2>
            <RangeField label="Montant à chaque achat" value={st.montant} onChange={set('montant')} min={10} max={2000} step={10} suffix="€" />
            <div className="field">
              <span id="lbl-start" style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Premier achat</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <select className="select" aria-label="Mois du premier achat" value={st.mois} onChange={(e) => set('mois')(parseInt(e.target.value, 10))}>
                  {MOIS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <select className="select" aria-label="Année du premier achat" value={st.annee} onChange={(e) => set('annee')(parseInt(e.target.value, 10))}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {points.length > 0 && <span className="hint">Historique disponible depuis {monthLabel(points[0].m, true)}.</span>}
            </div>
            <div className="field">
              <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Fréquence</span>
              <div className="segmented" role="group" aria-label="Fréquence des achats">
                <button type="button" aria-pressed={st.frequence === 1} onClick={() => set('frequence')(1)}>Chaque mois</button>
                <button type="button" aria-pressed={st.frequence === 3} onClick={() => set('frequence')(3)}>Chaque trimestre</button>
              </div>
            </div>
            <RangeField label="Frais à chaque achat" value={st.frais} onChange={set('frais')} min={0} max={3} step={0.1} suffix="%" hint="Courtage et frais de change, en % du montant acheté." />
          </form>

          <div className={s.results} aria-live="polite">
            {loading && <div className="panel"><p className="muted">Chargement de l’historique de {asset.name}…</p></div>}

            {!loading && !result && (
              <div className={s.error} role="alert">
                <h2>L’historique de {asset.name} n’a pas pu être chargé</h2>
                <p className="muted">La source de données ne répond pas pour le moment. Recharge la page dans quelques minutes, ou essaie un autre actif.</p>
              </div>
            )}

            {result && (
              <>
                <dl className={s.kpis}>
                  <div className={`${s.kpi} ${s.kpiMain}`}>
                    <dt>Valeur en {monthLabel(result.to, true)}</dt>
                    <dd className="figure"><Counter value={result.value} format={(v) => eur(v)} /></dd>
                  </div>
                  <div className={s.kpi}>
                    <dt>Total versé</dt>
                    <dd className="figure"><Counter value={result.invested} format={(v) => eur(v)} /></dd>
                  </div>
                  <div className={s.kpi}>
                    <dt>{result.gain >= 0 ? 'Plus-value' : 'Moins-value'}</dt>
                    <dd className={`figure ${result.gain >= 0 ? 'up' : 'down'}`}>
                      <Counter value={result.gain} format={(v) => `${v >= 0 ? '+' : ''}${eur(v)}`} />
                      <span className={s.sub}>{pct(result.perfPct)}</span>
                    </dd>
                  </div>
                </dl>

                <div className={s.chartPanel}>
                  <h2 className={s.chartTitle}>
                    {eur(st.montant)} {freqLabel} depuis {monthLabel(result.from, true)}
                  </h2>
                  <LineChart
                    animateKey={`${asset.slug}-${startKey}`}
                    labels={result.rows.map((r) => r.m)}
                    series={[
                      { key: 'value', label: 'Valeur du portefeuille', color: 'var(--outremer)', values: result.rows.map((r) => r.value), area: true },
                      { key: 'invested', label: 'Total versé', color: 'var(--encre)', values: result.rows.map((r) => r.invested), dashed: true, width: 2 },
                    ]}
                    formatY={(v) => (v >= 10000 ? `${num(v / 1000, 0)} k€` : eur(v))}
                    formatTooltip={(v) => eur(v)}
                    formatX={(m) => monthLabel(m)}
                    minZero
                    ariaLabel={`Évolution d’un investissement de ${st.montant} € ${freqLabel} sur ${asset.name}`}
                  />
                </div>

                <div className={s.reading}>
                  <div>
                    <h3>Prix de revient moyen : {priceFmt(result.avgCost)} €</h3>
                    <p>Dernier cours mensuel : {priceFmt(result.lastPrice)} €. En achetant à intervalles réguliers, tu as acheté plus de parts quand le prix était bas, et moins quand il était haut.</p>
                  </div>
                  <div>
                    <h3>Pire baisse du portefeuille : {pct(result.worstDrawdown, 0)}</h3>
                    <p>La plus forte chute de la valeur entre un sommet et le creux suivant. C’est ce qu’il aurait fallu supporter sans vendre.</p>
                  </div>
                  <div>
                    <h3>{result.monthsUnderwater} mois sur {result.months} en moins-value</h3>
                    <p>Le nombre de clôtures mensuelles où le portefeuille valait moins que le total versé.</p>
                  </div>
                  <div>
                    <h3>Tout investir au départ : {eur(result.lumpSumValue)}</h3>
                    <p>Ce qu’aurait donné le même total ({eur(result.invested)}) investi en une seule fois en {monthLabel(result.from, true)}. Ni l’une ni l’autre méthode ne gagne à tous les coups.</p>
                  </div>
                </div>

                <div className={s.actions}>
                  <ShareButton toolName={`dca_${asset.slug}`} />
                  <Link href={`/marches/${asset.slug}`} className="btn">Voir la fiche {asset.name}</Link>
                </div>

                <p className={s.method}>
                  <strong>Méthode.</strong> Un achat à chaque clôture mensuelle (ou un mois sur trois), frais déduits du montant investi.
                  {' '}{asset.note} Pas de fiscalité appliquée. Source : {history?.source}.
                  {history?.demo && <strong> Attention : données de démonstration, non réelles.</strong>}
                  {' '}Les performances passées ne préjugent pas des performances futures. Ce calcul est un outil pédagogique, pas un conseil en investissement.
                </p>
              </>
            )}
          </div>
        </div>

        <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="about-asset">
          <div className="grid-12">
            <div style={{ gridColumn: 'span 12' }} className="prose">
              <h2 id="about-asset">{asset.name} en bref</h2>
              <p>{asset.intro}</p>
              <ul>{asset.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          </div>
          <h3 style={{ fontSize: 'var(--fs-md)', margin: '24px 0 12px' }}>Les notions liées</h3>
          <div className={s.chips}>
            {['dca', ...asset.related.filter((r) => r !== 'dca')].map((slug) => {
              const t = getTerm(slug)
              return t ? <Link key={slug} href={`/glossaire/${slug}`} className={s.chip}>{t.term}</Link> : null
            })}
          </div>
        </section>
      </div>
    </>
  )
}

// Remonte le composant à chaque changement d'actif (état et tracking propres)
export default function DcaRoute(props) {
  return <DcaPage key={props.asset.slug} {...props} />
}

export async function getStaticPaths() {
  return { paths: ASSETS.map((a) => ({ params: { actif: a.slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const asset = getAsset(params.actif)
  const history = await getMonthlyHistory(asset.slug)
  return {
    props: {
      asset,
      initialHistory: history,
      tracking: { asset: asset.slug, tool_name: `dca_${asset.slug}` },
    },
    revalidate: history ? REVALIDATE : 300,
  }
}

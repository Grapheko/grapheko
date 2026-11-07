import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Seo from '../../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../../components/ui/PageIntro'
import { toolJsonLd } from '../../../lib/jsonld'
import LineChart from '../../../components/ui/LineChart'
import RangeField from '../../../components/ui/RangeField'
import Counter from '../../../components/ui/Counter'
import ShareButton from '../../../components/ui/ShareButton'
import Faq from '../../../components/ui/Faq'
import { ASSETS, getAsset } from '../../../lib/assets'
import { getMonthlyHistory } from '../../../lib/history'
import { REVALIDATE } from '../../../lib/marketData'
import { lumpTable, lumpFaq, faqJsonLd } from '../../../lib/faq'
import { backtestLump } from '../../../lib/finance'
import { eur, pct, num, monthLabel, priceFmt, dirClass } from '../../../lib/format'
import { useToolState } from '../../../lib/useToolState'
import { getTerm } from '../../../lib/content/glossary'
import s from '../../../styles/Tool.module.css'

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function LumpPage({ asset, initialHistory, table, faq, defaultStart }) {
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

  const [st, set] = useToolState(`unique_${asset.slug}`, {
    montant: 1000,
    annee: defaultStart.year,
    mois: defaultStart.month,
    frais: asset.kind === 'crypto' ? 1 : 0.2,
  })

  const startKey = `${st.annee}-${String(st.mois).padStart(2, '0')}`
  const result = useMemo(
    () => (points.length ? backtestLump(points, { start: startKey, amount: st.montant, feePct: st.frais }) : null),
    [points, startKey, st.montant, st.frais]
  )

  const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: `1 000 € sur ${asset.name}` }]
  const years = []
  for (let y = firstYear; y <= lastYear; y++) years.push(y)

  return (
    <>
      <Seo
        title={`Et si tu avais investi 1 000 € sur ${asset.name} ?`}
        description={`Ce que vaudrait aujourd’hui un investissement unique sur ${asset.name}, selon la date d’achat : valeur, rendement annuel et pire baisse, calculés sur les vrais cours en euros.`}
        jsonLd={[
          crumbsJsonLd(crumbs),
          toolJsonLd({ name: `Simulateur d’investissement unique sur ${asset.name}`, description: `Calcule ce que vaudrait aujourd’hui une somme investie en une fois sur ${asset.name}, à partir des cours mensuels en euros.`, path: `/simulateurs/si-j-avais-investi/${asset.slug}` }),
          faqJsonLd(faq),
        ].filter(Boolean)}
      />
      <PageIntro
        crumbs={crumbs}
        title={`Et si tu avais investi 1 000 € sur ${asset.name} ?`}
        lede={`Choisis une somme et une date d’achat : le simulateur calcule ce qu’elle vaudrait aujourd’hui, à partir des cours mensuels de ${asset.name} convertis en euros.`}
        wide
      >
        <nav aria-label="Choisir un autre actif" className={s.assetPicker} style={{ marginTop: 28 }}>
          {ASSETS.map((a) => (
            <Link key={a.slug} href={`/simulateurs/si-j-avais-investi/${a.slug}`} aria-current={a.slug === asset.slug ? 'page' : undefined} scroll={false}>
              {a.name}
            </Link>
          ))}
        </nav>
      </PageIntro>

      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
            <h2>Ton investissement</h2>
            <RangeField label="Somme investie" value={st.montant} onChange={set('montant')} min={100} max={50000} step={100} suffix="€" />
            <div className="field">
              <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600 }}>Date d’achat</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <select className="select" aria-label="Mois d’achat" value={st.mois} onChange={(e) => set('mois')(parseInt(e.target.value, 10))}>
                  {MOIS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <select className="select" aria-label="Année d’achat" value={st.annee} onChange={(e) => set('annee')(parseInt(e.target.value, 10))}>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {points.length > 0 && <span className="hint">Historique disponible de {monthLabel(points[0].m, true)} à {monthLabel(lastM, true)}.</span>}
            </div>
            <RangeField label="Frais à l’achat" value={st.frais} onChange={set('frais')} min={0} max={3} step={0.1} suffix="%" hint="Courtage et frais de change, en % de la somme investie." />
          </form>

          <div className={s.results} aria-live="polite">
            {loading && <div className="panel"><p className="muted">Chargement de l’historique de {asset.name}…</p></div>}

            {!loading && !result && (
              <div className={s.error} role="alert">
                <h2>{points.length ? 'Cette date est trop récente' : `L’historique de ${asset.name} n’a pas pu être chargé`}</h2>
                <p className="muted">
                  {points.length
                    ? `Choisis une date d’achat antérieure à ${monthLabel(lastM, true)} : il faut au moins deux clôtures mensuelles pour mesurer une évolution.`
                    : 'La source de données ne répond pas pour le moment. Recharge la page dans quelques minutes, ou essaie un autre actif.'}
                </p>
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
                    <dt>{result.gain >= 0 ? 'Plus-value' : 'Moins-value'}</dt>
                    <dd className={`figure ${result.gain >= 0 ? 'up' : 'down'}`}>
                      <Counter value={result.gain} format={(v) => `${v >= 0 ? '+' : ''}${eur(v)}`} />
                      <span className={s.sub}>{pct(result.perfPct)}</span>
                    </dd>
                  </div>
                  <div className={s.kpi}>
                    <dt>Rendement annuel moyen</dt>
                    <dd className={`figure ${dirClass(result.cagrPct)}`}>
                      {result.cagrPct != null ? pct(result.cagrPct) : '—'}
                      <span className={s.sub}>{result.cagrPct != null ? `sur ${num(result.elapsed / 12, 1)} ans` : 'moins d’un an'}</span>
                    </dd>
                  </div>
                </dl>

                <div className={s.chartPanel}>
                  <h2 className={s.chartTitle}>{eur(st.montant)} investis en {monthLabel(result.from, true)}</h2>
                  <LineChart
                    animateKey={`${asset.slug}-${startKey}`}
                    labels={result.rows.map((r) => r.m)}
                    series={[
                      { key: 'value', label: 'Valeur de l’investissement', color: 'var(--outremer)', values: result.rows.map((r) => r.value), area: true },
                      { key: 'invested', label: 'Somme investie', color: 'var(--encre)', values: result.rows.map((r) => r.invested), dashed: true, width: 2 },
                    ]}
                    formatY={(v) => (v >= 10000 ? `${num(v / 1000, 0)} k€` : eur(v))}
                    formatTooltip={(v) => eur(v)}
                    formatX={(m) => monthLabel(m)}
                    minZero
                    ariaLabel={`Évolution de ${st.montant} € investis sur ${asset.name} en ${monthLabel(result.from, true)}`}
                  />
                </div>

                <div className={s.reading}>
                  <div>
                    <h3>Au plus bas : {eur(result.lowValue)}</h3>
                    <p>En {monthLabel(result.lowMonth, true)}, la valeur était à son point le plus bas sur la période. {result.lowValue < st.montant ? 'Vendre ce mois-là aurait transformé une baisse temporaire en perte réelle.' : 'L’investissement n’est jamais repassé sous la somme de départ.'}</p>
                  </div>
                  <div>
                    <h3>Pire baisse : {pct(result.worstDrawdown, 0)}</h3>
                    <p>La plus forte chute de la valeur entre un sommet et le creux suivant, en clôtures mensuelles. C’est ce qu’il aurait fallu supporter sans vendre.</p>
                  </div>
                  <div>
                    <h3>{result.monthsUnderwater} mois sur {result.months} sous la mise de départ</h3>
                    <p>Le nombre de clôtures mensuelles où l’investissement valait moins que la somme placée.</p>
                  </div>
                  <div>
                    <h3>Cours d’achat : {priceFmt(result.buyPrice)} €</h3>
                    <p>Dernier cours mensuel : {priceFmt(result.lastPrice)} €. Investir en une fois expose entièrement au prix du jour d’achat : c’est ce que le DCA cherche à lisser.</p>
                  </div>
                </div>

                <div className={s.actions}>
                  <ShareButton toolName={`unique_${asset.slug}`} />
                  <Link href={`/simulateurs/dca/${asset.slug}`} className="btn">Comparer avec un achat chaque mois</Link>
                  <Link href={`/marches/${asset.slug}`} className="btn">Voir la fiche {asset.name}</Link>
                </div>

                <p className={s.method}>
                  <strong>Méthode.</strong> Un achat unique à la clôture du mois choisi, frais déduits de la somme investie, puis la valeur à chaque clôture mensuelle.
                  {' '}{asset.note} Pas de fiscalité appliquée{asset.kind === 'bourse' ? ', dividendes non réinvestis' : ''}. Source : {history?.source}.
                  {history?.demo && <strong> Attention : données de démonstration, non réelles.</strong>}
                  {' '}Les performances passées ne préjugent pas des performances futures. Ce calcul est un outil pédagogique, pas un conseil en investissement.
                </p>
              </>
            )}
          </div>
        </div>

        {table.length > 0 && (
          <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="lump-table">
            <div className="prose" style={{ maxWidth: 'none' }}>
              <h2 id="lump-table">1 000 € investis sur {asset.name} : ce qu’ils valent selon la date</h2>
              <p>Valeur à fin {monthLabel(table[0].to, true)} d’un achat unique de 1 000 €, hors frais et fiscalité.</p>
            </div>
            <div className={s.histScroll} tabIndex={0} role="region" aria-label={`1 000 € investis sur ${asset.name} selon la date d’achat`}>
              <table className={s.histTable}>
                <thead>
                  <tr>{['Achat', 'Valeur aujourd’hui', 'Évolution', 'Par an en moyenne', 'Pire baisse'].map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {table.map((t) => (
                    <tr key={t.years}>
                      <th scope="row">Il y a {t.years} an{t.years > 1 ? 's' : ''} <span>({monthLabel(t.from)})</span></th>
                      <td className={s.histValue}>{eur(t.value)}</td>
                      <td className={dirClass(t.perfPct)}>{pct(t.perfPct, 0)}</td>
                      <td>{t.years > 1 && t.cagrPct != null ? pct(t.cagrPct) : '—'}</td>
                      <td className="down">{pct(t.worstDrawdown, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="about-asset">
          <div className="prose">
            <h2 id="about-asset">{asset.name} en bref</h2>
            <p>{asset.intro}</p>
            <ul>{asset.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <h3 style={{ fontSize: 'var(--fs-md)', margin: '24px 0 12px' }}>Les notions liées</h3>
          <div className={s.chips}>
            {['dca', 'drawdown', 'cagr', ...asset.related.filter((r) => !['dca', 'drawdown', 'cagr'].includes(r))].map((slug) => {
              const t = getTerm(slug)
              return t ? <Link key={slug} href={`/glossaire/${slug}`} className={s.chip}>{t.term}</Link> : null
            })}
          </div>
          <Faq items={faq} title={`1 000 € sur ${asset.name} : questions fréquentes`} />
        </section>
      </div>
    </>
  )
}

// Remonte le composant à chaque changement d'actif (état et tracking propres)
export default function LumpRoute(props) {
  return <LumpPage key={props.asset.slug} {...props} />
}

export async function getStaticPaths() {
  return { paths: ASSETS.map((a) => ({ params: { actif: a.slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const asset = getAsset(params.actif)
  const history = await getMonthlyHistory(asset.slug)
  const table = lumpTable(history)
  // Date d'achat par défaut : il y a 5 ans, ou le début de l'historique s'il est plus court
  const p = history?.points || []
  const startM = p.length ? p[Math.max(0, p.length - 61)].m : `${new Date().getFullYear() - 5}-01`
  return {
    props: {
      asset,
      initialHistory: history,
      table,
      faq: lumpFaq(asset, history, table),
      defaultStart: { year: parseInt(startM.slice(0, 4), 10), month: parseInt(startM.slice(5), 10) },
      tracking: { asset: asset.slug, tool_name: `unique_${asset.slug}` },
    },
    revalidate: history ? REVALIDATE : 300,
  }
}

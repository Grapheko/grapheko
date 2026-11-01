import { useMemo, useState } from 'react'
import { useMarketQuotes, timeFr } from '../../lib/useMarketQuotes'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import LineChart from '../../components/ui/LineChart'
import { ASSETS, getAsset, KIND_LABEL } from '../../lib/assets'
import { getMonthlyHistory, historyStats } from '../../lib/history'
import { REVALIDATE } from '../../lib/marketData'
import { getTerm } from '../../lib/content/glossary'
import { pct, priceFmt, monthLabel, dirClass } from '../../lib/format'
import { trackClick } from '../../lib/gtm'
import s from '../../styles/Tool.module.css'
import m from '../../styles/Market.module.css'

const RANGES = [
  { key: '12', label: '1 an', months: 12 },
  { key: '60', label: '5 ans', months: 60 },
  { key: '120', label: '10 ans', months: 120 },
  { key: 'max', label: 'Tout', months: Infinity },
]

function LiveQuote({ slug }) {
  const { bySlug } = useMarketQuotes()
  const q = bySlug(slug)
  if (!q || q.price == null) return null
  const label = q.mode === 'live'
    ? `En temps réel (${q.source || 'Binance'})`
    : q.time ? `Différé, cours de ${timeFr(q.time)}` : 'Dernière clôture'
  return (
    <p className={m.live}>
      <span className={q.mode === 'live' ? m.dot : m.dotDelayed} aria-hidden="true" />
      {label} : <strong className="num">{priceFmt(q.price)} {q.unit}</strong>
      {q.changePct != null && <span className={`num ${dirClass(q.changePct)}`}>{pct(q.changePct, 2)} {q.mode === 'live' ? 'sur 24 h' : 'sur la séance'}</span>}
    </p>
  )
}

function MarketPage({ asset, history, stats }) {
  const [range, setRange] = useState('60')
  const points = history?.points || []
  const visible = useMemo(() => {
    const r = RANGES.find((x) => x.key === range)
    return r.months === Infinity ? points : points.slice(-(r.months + 1))
  }, [points, range])
  const crumbs = [{ href: '/marches', label: 'Marchés' }, { label: asset.name }]
  const others = ASSETS.filter((a) => a.slug !== asset.slug)

  return (
    <>
      <Seo
        title={`${asset.name} : cours, performance et pire baisse en euros`}
        description={`${asset.name} en euros : performance sur 1, 5 et 10 ans, pire baisse historique et graphique des clôtures mensuelles. ${asset.intro.slice(0, 90)}…`}
        jsonLd={crumbsJsonLd(crumbs)}
      />
      <PageIntro crumbs={crumbs} title={asset.name} lede={asset.intro}>
        <p className={m.kind}>{KIND_LABEL[asset.kind]}</p>
        <LiveQuote slug={asset.slug} />
      </PageIntro>

      <div className={`wrap ${s.more}`}>
        {!stats && (
          <div className={s.error} role="alert">
            <h2>L’historique de {asset.name} n’a pas pu être chargé</h2>
            <p className="muted">La source de données ne répond pas pour le moment. Réessaie dans quelques minutes.</p>
          </div>
        )}

        {stats && (
          <>
            <dl className={m.stats}>
              <div><dt>Clôture de {monthLabel(stats.lastMonth, true)}</dt><dd className="figure num">{priceFmt(stats.last)} €</dd></div>
              <div><dt>Sur 1 an</dt><dd className={`figure num ${dirClass(stats.perf1y)}`}>{pct(stats.perf1y, 1)}</dd></div>
              <div><dt>Sur 5 ans</dt><dd className={`figure num ${dirClass(stats.perf5y)}`}>{pct(stats.perf5y, 0)}</dd></div>
              <div><dt>Sur 10 ans</dt><dd className={`figure num ${dirClass(stats.perf10y)}`}>{pct(stats.perf10y, 0)}</dd></div>
              <div><dt>Pire baisse depuis {stats.first.slice(0, 4)}</dt><dd className="figure num down">{pct(stats.maxDrawdown, 0)}</dd></div>
            </dl>

            <div className={s.chartPanel}>
              <div className={m.chartHead}>
                <h2 className={s.chartTitle} style={{ margin: 0 }}>Clôtures mensuelles en euros</h2>
                <div className="segmented" role="group" aria-label="Période affichée">
                  {RANGES.map((r) => (
                    <button key={r.key} type="button" aria-pressed={range === r.key} onClick={() => { setRange(r.key); trackClick(`periode_${r.key}`, 'fiche_actif', asset.slug) }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <LineChart
                animateKey={range}
                labels={visible.map((p) => p.m)}
                series={[{ key: 'close', label: asset.name, color: 'var(--outremer)', values: visible.map((p) => p.close), area: true }]}
                formatX={(mm) => monthLabel(mm)}
                formatY={(v) => `${priceFmt(v)} €`}
                ariaLabel={`Cours mensuel de ${asset.name} en euros`}
              />
            </div>
            <p className={s.method} style={{ marginTop: 16 }}>
              {asset.note} Source : {history.source}.{history.demo && <strong> Données de démonstration, non réelles.</strong>} Les performances passées ne préjugent pas des performances futures.
            </p>
          </>
        )}

        <div className={m.split}>
          <section className="prose" aria-labelledby="points">
            <h2 id="points">À savoir avant d’y penser</h2>
            <ul>{asset.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
          <aside className={m.cta}>
            <h2>Et si tu avais investi chaque mois ?</h2>
            <p>Rejoue un investissement régulier sur {asset.name}, avec ton montant et ta date de départ.</p>
            <Link href={`/simulateurs/dca/${asset.slug}`} className="btn btn--plein" onClick={() => trackClick('simulateur_dca', 'fiche_actif', asset.slug)}>
              Simuler un DCA sur {asset.name}
            </Link>
          </aside>
        </div>

        <h2 className={m.subTitle}>Les notions liées</h2>
        <div className={s.chips}>
          {asset.related.map((slug) => {
            const t = getTerm(slug)
            return t ? <Link key={slug} href={`/glossaire/${slug}`} className={s.chip}>{t.term}</Link> : null
          })}
        </div>

        <h2 className={m.subTitle}>Les autres marchés</h2>
        <div className={s.chips}>
          {others.map((a) => <Link key={a.slug} href={`/marches/${a.slug}`} className={s.chip}>{a.name}</Link>)}
        </div>
      </div>
    </>
  )
}

export default function MarketRoute(props) {
  return <MarketPage key={props.asset.slug} {...props} />
}

export async function getStaticPaths() {
  return { paths: ASSETS.map((a) => ({ params: { actif: a.slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const asset = getAsset(params.actif)
  const history = await getMonthlyHistory(asset.slug)
  return {
    props: { asset, history, stats: history ? historyStats(history.points) : null, tracking: { asset: asset.slug } },
    revalidate: history ? REVALIDATE : 300,
  }
}

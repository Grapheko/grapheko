import Head from 'next/head'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { gEvent } from '../lib/gtm'

// ── Calcul mois par mois ────────────────────────────────────
function calcMonthly({ capital, monthly, rate, years }) {
  const r = rate / 100 / 12
  const months = years * 12
  const rows = []
  let balance = capital
  let totalInvested = capital

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + r) + monthly
    totalInvested += monthly
    const interests = balance - totalInvested

    if (m % 12 === 0 || m === months) {
      rows.push({
        month: m,
        year: Math.ceil(m / 12),
        balance: Math.round(balance),
        invested: Math.round(totalInvested),
        interests: Math.round(interests),
        interestPct: totalInvested > 0 ? ((interests / totalInvested) * 100).toFixed(1) : '0',
      })
    }
  }
  return rows
}

// ── Graphique SVG ───────────────────────────────────────────
function Chart({ data }) {
  if (!data.length) return null
  const W = 800, H = 280, PAD = { top: 20, right: 20, bottom: 40, left: 70 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const maxVal = Math.max(...data.map(d => d.balance)) * 1.05

  const xScale = (i) => PAD.left + (i / (data.length - 1)) * innerW
  const yScale = (v) => PAD.top + innerH - (v / maxVal) * innerH

  const balancePath = data.map((d, i) => (i === 0 ? 'M' : 'L') + xScale(i).toFixed(1) + ',' + yScale(d.balance).toFixed(1)).join(' ')
  const investedPath = data.map((d, i) => (i === 0 ? 'M' : 'L') + xScale(i).toFixed(1) + ',' + yScale(d.invested).toFixed(1)).join(' ')

  const interestAreaPath = [
    ...data.map((d, i) => (i === 0 ? 'M' : 'L') + xScale(i).toFixed(1) + ',' + yScale(d.balance).toFixed(1)),
    ...data.slice().reverse().map((d, i) => 'L' + xScale(data.length - 1 - i).toFixed(1) + ',' + yScale(d.invested).toFixed(1)),
    'Z'
  ].join(' ')

  const investedAreaPath = investedPath + ' L' + xScale(data.length - 1).toFixed(1) + ',' + yScale(0).toFixed(1) + ' L' + xScale(0).toFixed(1) + ',' + yScale(0).toFixed(1) + ' Z'

  const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((maxVal / 5) * i))
  const fmtK = (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k€` : `${v}€`

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '300px', display: 'block' }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)} stroke="#1E1E1E" strokeWidth="1" />
            <text x={PAD.left - 8} y={yScale(v) + 4} textAnchor="end" style={{ fontFamily: 'var(--mono)', fontSize: '10px', fill: '#444' }}>{fmtK(v)}</text>
          </g>
        ))}
        {data.map((d, i) => (
          i % Math.ceil(data.length / 8) === 0 || i === data.length - 1 ? (
            <text key={i} x={xScale(i)} y={H - PAD.bottom + 20} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: '10px', fill: '#444' }}>{d.year}a</text>
          ) : null
        ))}
        <path d={investedAreaPath} fill="rgba(0,194,255,0.07)" />
        <path d={interestAreaPath} fill="rgba(0,255,136,0.1)" />
        <path d={investedPath} fill="none" stroke="#00C2FF" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
        <path d={balancePath} fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" />
        <circle cx={xScale(data.length - 1)} cy={yScale(data[data.length - 1].balance)} r="5" fill="#00FF88" style={{ filter: 'drop-shadow(0 0 6px #00FF88)' }} />
        <g transform={`translate(${PAD.left + 10}, ${PAD.top + 10})`}>
          <rect x="0" y="2" width="16" height="8" fill="rgba(0,255,136,0.15)" rx="1"/>
          <line x1="0" y1="6" x2="16" y2="6" stroke="#00FF88" strokeWidth="2" />
          <text x="22" y="10" style={{ fontFamily: 'var(--mono)', fontSize: '10px', fill: '#666' }}>Capital total</text>
          <rect x="130" y="2" width="16" height="8" fill="rgba(0,194,255,0.15)" rx="1"/>
          <line x1="130" y1="6" x2="146" y2="6" stroke="#00C2FF" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="152" y="10" style={{ fontFamily: 'var(--mono)', fontSize: '10px', fill: '#666' }}>Versements cumulés</text>
        </g>
      </svg>
    </div>
  )
}

// ── Page principale ─────────────────────────────────────────
export default function CalculateurInteretsComposes() {
  const [capital, setCapital] = useState(5000)
  const [monthly, setMonthly] = useState(300)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [activeTab, setActiveTab] = useState('graph')

  const data = useMemo(() => calcMonthly({ capital, monthly, rate, years }), [capital, monthly, rate, years])
  const last = data[data.length - 1] || { balance: 0, invested: 0, interests: 0 }

  const trackCalc = () => gEvent('calculator_use', {
    calculator_type: 'interets_composes',
    capital, monthly, rate, years,
    result: last.balance,
    page_source: '/calculateur-interets-composes',
  })

  // Structured data JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculateur d\'intérêts composés — Grapheko',
    description: 'Calculez vos intérêts composés gratuitement. Simulez l\'évolution de votre épargne mois par mois avec versements mensuels.',
    url: 'https://grapheko.fr/calculateur-interets-composes',
    applicationCategory: 'FinanceApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    provider: { '@type': 'Organization', name: 'Grapheko', url: 'https://grapheko.fr' },
  }

  return (
    <>
      <Head>
        <title>Calculateur d'intérêts composés — Simulation gratuite | Grapheko</title>
        <meta name="description" content="Calculez vos intérêts composés gratuitement. Simulez l'évolution de votre épargne avec versements mensuels, graphique et tableau année par année. La magie des intérêts composés en quelques secondes." />
        <meta name="keywords" content="calculateur intérêts composés, calcul intérêts composés, intérêts composés, simulateur épargne, simulation investissement, règle des 72, rendement composé" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/calculateur-interets-composes" />
        {/* Open Graph */}
        <meta property="og:title" content="Calculateur d'intérêts composés — Grapheko" />
        <meta property="og:description" content="Simulez l'évolution de votre épargne avec la puissance des intérêts composés. Graphique, tableau annuel et simulation mois par mois." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://grapheko.fr/calculateur-interets-composes" />
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* HERO SEO */}
      <section style={{ padding: '100px 24px 48px', borderBottom: '0.5px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#1A3A2A', marginBottom: '16px' }}>
            <span style={{ color: 'var(--neon)' }}>[ ✓ ]</span> calculateur.sh --mode=interets_composes
          </div>
          <h1 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(24px,4vw,44px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '16px' }}>
            Calculateur d'<span style={{ color: 'var(--neon)', fontFamily: 'var(--mono)' }}>intérêts composés</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '600px' }}>
            Simulez la croissance de votre épargne grâce aux intérêts composés. Entrez votre capital initial, vos versements mensuels et votre taux de rendement — et visualisez l'évolution année par année.
          </p>
          {/* Pills SEO */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Calcul intérêts composés', 'Simulation épargne', 'Gratuit', 'Mois par mois'].map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)', border: '0.5px solid var(--border2)', padding: '4px 10px', borderRadius: '4px' }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATEUR */}
      <section style={{ padding: '48px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header visible uniquement en impression */}
          <div className="print-header" style={{ display: 'none', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #00AA55' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#000', marginBottom: '4px' }}>
              Simulation d'intérêts composés — Grapheko
            </div>
            <div style={{ fontSize: '12px', color: '#555' }}>
              Généré le {new Date().toLocaleDateString('fr-FR')} · grapheko.fr/calculateur-interets-composes
            </div>
          </div>
          <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '48px' }}>

            {/* Titlebar */}
            <div style={{ background: 'var(--surface2)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#333', margin: '0 auto' }}>interets_composes.sh</span>
            </div>

            {/* Paramètres */}
            <div style={{ padding: '28px', borderBottom: '0.5px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#1A3A2A', marginBottom: '20px' }}>// Paramètres du calcul :</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' }}>
                {[
                  { label: 'Capital initial (€)', val: capital, set: setCapital, min: 0, max: 1000000, step: 100 },
                  { label: 'Versement mensuel (€)', val: monthly, set: setMonthly, min: 0, max: 10000, step: 50 },
                  { label: 'Taux de rendement annuel (%)', val: rate, set: setRate, min: 0, max: 30, step: 0.5 },
                  { label: 'Durée (années)', val: years, set: setYears, min: 1, max: 50, step: 1 },
                ].map(({ label, val, set, min, max, step }) => (
                  <div key={label}>
                    <label style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '.08em', display: 'block', marginBottom: '8px' }}>{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="range" min={min} max={max} step={step} value={val}
                        onChange={e => { set(parseFloat(e.target.value)); trackCalc() }}
                        style={{ flex: 1, accentColor: 'var(--neon)', height: '4px' }} />
                      <input type="number" value={val} min={min} max={max} step={step}
                        onChange={e => { set(parseFloat(e.target.value) || 0); trackCalc() }}
                        style={{ width: '80px', background: 'var(--void)', border: '0.5px solid var(--border2)', borderRadius: '4px', padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', borderBottom: '0.5px solid var(--border)' }}>
              {[
                { label: 'CAPITAL FINAL', val: `${last.balance.toLocaleString('fr-FR')} €`, color: 'var(--neon)', big: true },
                { label: 'VERSEMENTS TOTAUX', val: `${last.invested.toLocaleString('fr-FR')} €`, color: 'var(--blue)' },
                { label: 'INTÉRÊTS GÉNÉRÉS', val: `${last.interests.toLocaleString('fr-FR')} €`, color: 'var(--yellow)' },
                { label: 'MULTIPLICATION', val: `×${last.invested > 0 ? (last.balance / last.invested).toFixed(2) : '—'}`, color: 'var(--neon)' },
              ].map((k, i) => (
                <div key={k.label} style={{ padding: '20px 24px', borderRight: i < 3 ? '0.5px solid var(--border)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '.08em', marginBottom: '8px' }}>{k.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: k.big ? '22px' : '18px', fontWeight: 600, color: k.color }}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px', borderBottom: '0.5px solid var(--border)', background: 'var(--surface2)', gap: '8px' }}>
              <button
                onClick={() => {
                  gEvent('calculator_use', { calculator_type: 'export_pdf', capital, monthly, rate, years })
                  window.print()
                }}
                style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--neon)', background: 'transparent', border: '0.5px solid var(--neon)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ↓ Exporter en PDF
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)' }}>
              {[['graph', '📈 Graphique'], ['table', '📋 Année par année']].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  fontFamily: 'var(--mono)', fontSize: '11px', padding: '12px 20px',
                  background: activeTab === id ? 'var(--neon-ghost)' : 'transparent',
                  color: activeTab === id ? 'var(--neon)' : 'var(--text-secondary)',
                  border: 'none', borderBottom: activeTab === id ? '2px solid var(--neon)' : '2px solid transparent',
                  cursor: 'pointer',
                }}>{label}</button>
              ))}
            </div>

            {/* Tab Graphique */}
            {activeTab === 'graph' && (
              <div style={{ padding: '28px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  // Évolution du capital sur {years} ans · Zone verte = intérêts · Zone bleue = versements
                </div>
                <Chart data={data} />
              </div>
            )}

            {/* Tab Tableau */}
            {activeTab === 'table' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)' }}>
                      {['Année', 'Capital total', 'Versements cumulés', 'Intérêts composés', '% de gains'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '10px', letterSpacing: '.08em', borderBottom: '0.5px solid var(--border)', fontWeight: 400 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={row.year} style={{ borderBottom: '0.5px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                        <td style={{ padding: '10px 16px', color: 'var(--neon)', textAlign: 'right' }}>AN {row.year}</td>
                        <td style={{ padding: '10px 16px', color: 'var(--text-primary)', textAlign: 'right', fontWeight: 500 }}>{row.balance.toLocaleString('fr-FR')} €</td>
                        <td style={{ padding: '10px 16px', color: 'var(--blue)', textAlign: 'right' }}>{row.invested.toLocaleString('fr-FR')} €</td>
                        <td style={{ padding: '10px 16px', color: 'var(--yellow)', textAlign: 'right' }}>{row.interests.toLocaleString('fr-FR')} €</td>
                        <td style={{ padding: '10px 16px', color: 'var(--neon)', textAlign: 'right' }}>+{row.interestPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── CONTENU SEO ── */}
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>

            <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', paddingTop: '32px', borderTop: '0.5px solid var(--border)' }}>
              Qu'est-ce que les intérêts composés ?
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
              Les <strong style={{ color: 'var(--text-primary)' }}>intérêts composés</strong> sont les intérêts calculés non seulement sur le capital initial, mais aussi sur les intérêts déjà accumulés. C'est le principe fondamental de la croissance exponentielle en finance : vos gains génèrent eux-mêmes des gains.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
              Albert Einstein aurait qualifié les intérêts composés de "huitième merveille du monde". Que la citation soit vraie ou non, elle illustre parfaitement pourquoi le <strong style={{ color: 'var(--text-primary)' }}>calcul des intérêts composés</strong> est au cœur de toute stratégie d'investissement à long terme.
            </p>

            <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
              La formule de calcul des intérêts composés
            </h2>
            <div style={{ background: 'var(--surface)', border: '0.5px solid var(--neon)', borderRadius: '8px', padding: '20px 24px', marginBottom: '24px', fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--neon)', textAlign: 'center', letterSpacing: '.05em' }}>
              C = K × (1 + t)ⁿ
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '8px' }}>
              Où : <strong style={{ color: 'var(--text-primary)' }}>C</strong> = capital final · <strong style={{ color: 'var(--text-primary)' }}>K</strong> = capital initial · <strong style={{ color: 'var(--text-primary)' }}>t</strong> = taux d'intérêt par période · <strong style={{ color: 'var(--text-primary)' }}>n</strong> = nombre de périodes
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
              Notre calculateur intègre également les <strong style={{ color: 'var(--text-primary)' }}>versements mensuels réguliers</strong>, ce qui correspond à la réalité d'un investisseur qui épargne chaque mois (DCA — Dollar Cost Averaging).
            </p>

            <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
              La règle des 72 — estimer le doublement de capital
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
              La <strong style={{ color: 'var(--text-primary)' }}>règle des 72</strong> permet d'estimer rapidement le temps nécessaire pour doubler un capital avec des intérêts composés : divisez 72 par le taux de rendement annuel.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '32px' }}>
              {[
                { rate: '4%', years: '18 ans' },
                { rate: '6%', years: '12 ans' },
                { rate: '7%', years: '10 ans' },
                { rate: '10%', years: '7 ans' },
              ].map(({ rate, years }) => (
                <div key={rate} style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 500, color: 'var(--neon)', marginBottom: '4px' }}>{rate}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>→ doublement en</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{years}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Pourquoi commencer à investir tôt ?
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
              Le temps est le facteur le plus puissant des intérêts composés. 200 € investis par mois pendant 30 ans à 7% produisent <strong style={{ color: 'var(--neon)' }}>244 000 €</strong>, dont 172 000 € d'intérêts composés. Les mêmes versements sur seulement 20 ans produisent 104 000 € — soit 140 000 € de moins pour 24 000 € de versements en moins. Chaque année compte énormément.
            </p>

            {/* CTA */}
            <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,var(--neon),transparent)' }} />
              <div style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {'>'} Prêt à investir ? <span style={{ color: 'var(--neon)' }}>Grapheko</span> décrypte la finance par la data.
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Nos guides pour débutants, analyses et newsletter hebdo — tout est gratuit.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/blog/etf-debutant" className="btn-primary">./guide ETF débutant →</Link>
                <Link href="/newsletter" className="btn-secondary">./newsletter gratuite</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '0.5px solid var(--border)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', position: 'relative', zIndex: 1 }}>
        <Link href="/" style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text-primary)', textDecoration: 'none' }}>{'>'} graph<span style={{ color: 'var(--neon)' }}>eko</span>_</Link>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[['./blog', '/blog'], ['./ressources', '/ressources'], ['./newsletter', '/newsletter'], ['./contact', '/contact']].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#333', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#222' }}>© 2026 <span style={{ color: 'var(--neon)' }}>grapheko</span></span>
      </footer>

      <style jsx global>{`
        @media (min-width: 768px) {
          nav { padding: 0 48px !important; }
          section { padding-left: 48px !important; padding-right: 48px !important; }
          footer { padding: 32px 48px !important; }
        }
        input[type="range"] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: var(--border2); outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--neon); cursor: pointer; box-shadow: 0 0 6px rgba(0,255,136,.5); }

        @media print {
          * { cursor: auto !important; }
          nav, footer, .no-print, button { display: none !important; }
          body { background: white !important; color: #000 !important; }
          body::before, body::after { display: none !important; }
          section { padding: 0 !important; }
          .print-header { display: block !important; }
          [style*="background: var(--surface)"],
          [style*="background: var(--surface2)"],
          [style*="background: var(--void)"] {
            background: #f8f8f8 !important;
            border-color: #ddd !important;
          }
          [style*="color: var(--neon)"] { color: #00AA55 !important; }
          [style*="color: var(--text-primary)"] { color: #000 !important; }
          [style*="color: var(--text-secondary)"] { color: #555 !important; }
          [style*="color: var(--blue)"] { color: #0066CC !important; }
          [style*="color: var(--yellow)"] { color: #886600 !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          td, th { border: 1px solid #ddd !important; padding: 6px 10px !important; color: #000 !important; }
          svg text { fill: #333 !important; }
          svg line { stroke: #ccc !important; }
          svg path[stroke="#00FF88"] { stroke: #00AA55 !important; }
          svg path[fill*="0,255,136"] { fill: rgba(0,180,100,0.1) !important; }
          svg path[fill*="0,194,255"] { fill: rgba(0,100,200,0.07) !important; }
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
        }
      `}</style>
    </>
  )
}

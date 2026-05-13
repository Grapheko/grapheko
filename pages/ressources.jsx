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
    const interestThisMonth = balance * r
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

// ── Calcul fiscal PEA vs CTO ────────────────────────────────
function calcFiscal({ balance, invested, years }) {
  const gains = balance - invested
  if (gains <= 0) return { pea: balance, cto: balance, peaTax: 0, ctoTax: 0 }

  // PEA : 17.2% après 5 ans / 30% avant
  const peaRate = years >= 5 ? 0.172 : 0.30
  const peaTax = Math.round(gains * peaRate)

  // CTO : flat tax 31,4%
  const ctoTax = Math.round(gains * 0.30)

  return {
    pea: balance - peaTax,
    cto: balance - ctoTax,
    peaTax,
    ctoTax,
    diff: ctoTax - peaTax,
  }
}

// ── Graphique SVG ───────────────────────────────────────────
function Chart({ data, showPea }) {
  if (!data.length) return null

  const W = 800, H = 280, PAD = { top: 20, right: 20, bottom: 40, left: 70 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const maxVal = Math.max(...data.map(d => d.balance)) * 1.05
  const minVal = 0

  const xScale = (i) => PAD.left + (i / (data.length - 1)) * innerW
  const yScale = (v) => PAD.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH

  const balancePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(d.balance).toFixed(1)}`).join(' ')
  const investedPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(d.invested).toFixed(1)}`).join(' ')

  // Zone intérêts (entre balance et invested) — vert
  const interestAreaPath = [
    ...data.map((d, i) => (i === 0 ? 'M' : 'L') + xScale(i).toFixed(1) + ',' + yScale(d.balance).toFixed(1)),
    ...data.slice().reverse().map((d, i) => 'L' + xScale(data.length - 1 - i).toFixed(1) + ',' + yScale(d.invested).toFixed(1)),
    'Z'
  ].join(' ')

  // Zone versements (du bas jusqu'à invested) — bleu
  const investedAreaPath = investedPath + ' L' + xScale(data.length - 1).toFixed(1) + ',' + yScale(0).toFixed(1) + ' L' + xScale(0).toFixed(1) + ',' + yScale(0).toFixed(1) + ' Z'

  // Y ticks
  const yTicks = 5
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxVal / yTicks) * i))

  const fmtK = (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k€` : `${v}€`

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '300px', display: 'block' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid horizontale */}
        {yTickVals.map(v => (
          <g key={v}>
            <line
              x1={PAD.left} y1={yScale(v)}
              x2={W - PAD.right} y2={yScale(v)}
              stroke="#1E1E1E" strokeWidth="1"
            />
            <text
              x={PAD.left - 8} y={yScale(v) + 4}
              textAnchor="end"
              style={{ fontFamily: 'var(--mono)', fontSize: '10px', fill: '#444' }}
            >
              {fmtK(v)}
            </text>
          </g>
        ))}

        {/* Labels X (années) */}
        {data.map((d, i) => (
          i % Math.ceil(data.length / 8) === 0 || i === data.length - 1 ? (
            <text
              key={i}
              x={xScale(i)} y={H - PAD.bottom + 20}
              textAnchor="middle"
              style={{ fontFamily: 'var(--mono)', fontSize: '10px', fill: '#444' }}
            >
              {d.year}a
            </text>
          ) : null
        ))}

        {/* Zone versements — bleu */}
        <path d={investedAreaPath} fill="rgba(0,194,255,0.07)" />
        {/* Zone intérêts — vert */}
        <path d={interestAreaPath} fill="rgba(0,255,136,0.1)" />

        {/* Ligne investissements */}
        <path d={investedPath} fill="none" stroke="#00C2FF" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.6" />

        {/* Ligne balance principale */}
        <path d={balancePath} fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" />

        {/* Point final */}
        {data.length > 0 && (
          <circle
            cx={xScale(data.length - 1)}
            cy={yScale(data[data.length - 1].balance)}
            r="5" fill="#00FF88"
            style={{ filter: 'drop-shadow(0 0 6px #00FF88)' }}
          />
        )}

        {/* Légende — placée sous le graphique bien séparée */}
        <g transform={`translate(${PAD.left}, ${H - 4})`}>
          <rect x="0" y="-10" width="14" height="6" fill="rgba(0,255,136,0.2)" rx="1"/>
          <line x1="0" y1="-7" x2="14" y2="-7" stroke="#00FF88" strokeWidth="2"/>
          <text x="18" y="-3" style={{ fontFamily: 'var(--mono)', fontSize: '9px', fill: '#555' }}>Capital total (intérêts inclus)</text>
          <rect x="200" y="-10" width="14" height="6" fill="rgba(0,194,255,0.15)" rx="1"/>
          <line x1="200" y1="-7" x2="214" y2="-7" stroke="#00C2FF" strokeWidth="1.5" strokeDasharray="4,3"/>
          <text x="218" y="-3" style={{ fontFamily: 'var(--mono)', fontSize: '9px', fill: '#555' }}>Versements cumulés</text>
        </g>
      </svg>
    </div>
  )
}

export default function Ressources() {
  const [capital, setCapital] = useState(5000)
  const [monthly, setMonthly] = useState(300)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [activeTab, setActiveTab] = useState('graph') // graph | table | fiscal
  const [showAll, setShowAll] = useState(false)

  const data = useMemo(() => calcMonthly({ capital, monthly, rate, years }), [capital, monthly, rate, years])
  const last = data[data.length - 1] || { balance: 0, invested: 0, interests: 0 }
  const fiscal = useMemo(() => calcFiscal({ balance: last.balance, invested: last.invested, years }), [last, years])

  const displayData = showAll ? data : data.slice(-Math.min(10, data.length))

  const trackCalc = () => gEvent('calculator_use', {
    calculator_type: 'pea_cto_simulator',
    capital, monthly, rate, years,
    result: last.balance,
  })

  return (
    <>
      <Head>
        <title>Ressources — Grapheko | Guides, outils & calculateurs</title>
        <meta name="description" content="Simulateur PEA vs CTO, calculateur d'intérêts composés, guides débutants et lexique finance & crypto — par Grapheko." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/ressources" />
      </Head>

      {/* HEADER */}
      <div style={{ padding: '80px 24px 40px', borderBottom: '0.5px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#1A3A2A', marginBottom: '16px' }}>
          <span style={{ color: 'var(--neon)' }}>[ ✓ ]</span> ressources.sh --load guides tools calculateur
        </div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(28px,5vw,56px)', fontWeight: 500, letterSpacing: '-2px', lineHeight: 1, marginBottom: '12px' }}>
          <span style={{ color: 'var(--neon)' }}>{'>'}</span>./ressources
          <span style={{ display: 'inline-block', width: '6px', height: 'clamp(24px,4.5vw,50px)', background: 'var(--neon)', verticalAlign: 'middle', marginLeft: '3px', animation: 'blink 1s step-end infinite', borderRadius: '1px' }} />
        </h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ color: '#1A3A2A', marginRight: '8px' }}>//</span>Guides · Calculateur · Simulateur PEA vs CTO · Lexique
        </p>
      </div>

      <section style={{ padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── GUIDES ── */}
        <div className="section-label">GUIDES ESSENTIELS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px', marginBottom: '60px' }}>
          {[
            { num: '[01]', title: 'Investir en bourse pour débutant', desc: 'Du compte épargne aux ETF — tout pour commencer intelligemment.', stats: [['8', 'chapitres'], ['45', 'min'], ['100%', 'gratuit']], color: 'var(--neon)', href: '/blog/etf-debutant' },
            { num: '[02]', title: 'Comprendre la crypto en 2026', desc: 'Bitcoin, Ethereum, DeFi — on démystifie l\'écosystème crypto.', stats: [['6', 'chapitres'], ['30', 'min'], ['100%', 'gratuit']], color: 'var(--yellow)', href: '/blog/ethereum-2026' },
            { num: '[03]', title: 'Lire les données économiques', desc: 'PIB, inflation, taux directeurs — interpréter les chiffres macro.', stats: [['5', 'chapitres'], ['25', 'min'], ['100%', 'gratuit']], color: 'var(--blue)', href: '/blog' },
          ].map(r => (
            <Link key={r.num} href={r.href} style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '28px', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: r.color, letterSpacing: '.1em', marginBottom: '16px' }}>{r.num} // GUIDE</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.3 }}>{r.title}</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>{r.desc}</p>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {r.stats.map(([val, label]) => (
                  <div key={label} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: r.color, marginBottom: '2px' }}>{val}</span>{label}
                  </div>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: r.color }}>./lire_le_guide →</span>
            </Link>
          ))}
        </div>

        {/* ── CALCULATEUR PRINCIPAL ── */}
        <div className="section-label" id="outils">SIMULATEUR — ÉPARGNE & INVESTISSEMENT</div>

        <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
          {/* Titlebar terminal */}
          <div style={{ background: 'var(--surface2)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '0.5px solid var(--border)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#333', margin: '0 auto' }}>investment_simulator.sh</span>
          </div>

          {/* Paramètres */}
          <div style={{ padding: '28px', borderBottom: '0.5px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#1A3A2A', marginBottom: '20px' }}>// Renseigne tes paramètres :</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' }}>
              {[
                { label: 'Capital initial', unit: '€', val: capital, set: setCapital, min: 0, max: 1000000, step: 100 },
                { label: 'Versement mensuel', unit: '€', val: monthly, set: setMonthly, min: 0, max: 10000, step: 50 },
                { label: 'Taux de rendement', unit: '%', val: rate, set: setRate, min: 0, max: 30, step: 0.5 },
                { label: 'Durée', unit: 'ans', val: years, set: setYears, min: 1, max: 50, step: 1 },
              ].map(({ label, unit, val, set, min, max, step }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <label style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '.08em' }}>{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number" value={val} min={min} max={max} step={step}
                        onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= min && v <= max) { set(v); trackCalc() } }}
                        style={{ width: '80px', background: 'var(--void)', border: '0.5px solid var(--neon)', borderRadius: '4px', padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500, color: 'var(--neon)', outline: 'none', textAlign: 'right' }}
                      />
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{unit}</span>
                    </div>
                  </div>
                  <input
                    type="range" min={min} max={max} step={step} value={val}
                    onChange={e => { set(parseFloat(e.target.value)); trackCalc() }}
                    style={{ width: '100%', accentColor: 'var(--neon)', height: '4px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '9px', color: '#333', marginTop: '4px' }}>
                    <span>{min}{unit}</span>
                    <span>{max.toLocaleString('fr-FR')}{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs résultats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', borderBottom: '0.5px solid var(--border)' }}>
            {[
              { label: 'CAPITAL FINAL', val: `${last.balance.toLocaleString('fr-FR')} €`, color: 'var(--neon)', big: true },
              { label: 'VERSEMENTS TOTAUX', val: `${last.invested.toLocaleString('fr-FR')} €`, color: 'var(--blue)' },
              { label: 'INTÉRÊTS GÉNÉRÉS', val: `${last.interests.toLocaleString('fr-FR')} €`, color: 'var(--yellow)' },
              { label: 'MULTIPLE', val: `×${last.invested > 0 ? (last.balance / last.invested).toFixed(2) : '—'}`, color: 'var(--neon)' },
            ].map(k => (
              <div key={k.label} style={{ padding: '20px 24px', borderRight: '0.5px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '.1em', marginBottom: '8px' }}>{k.label}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: k.big ? '24px' : '20px', fontWeight: 600, color: k.color, lineHeight: 1 }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)' }}>
            {[['graph', '📈 Graphique'], ['table', '📋 Année par année'], ['fiscal', '🏛️ PEA vs CTO']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                fontFamily: 'var(--mono)', fontSize: '11px', padding: '12px 20px',
                background: activeTab === id ? 'var(--neon-ghost)' : 'transparent',
                color: activeTab === id ? 'var(--neon)' : 'var(--text-secondary)',
                border: 'none', borderBottom: activeTab === id ? '2px solid var(--neon)' : '2px solid transparent',
                cursor: 'pointer', transition: 'all .2s',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab : Graphique */}
          {activeTab === 'graph' && (
            <div style={{ padding: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                // Évolution du capital sur {years} ans
              </div>
              <Chart data={data} />
              <div style={{ marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '11px', color: '#333', textAlign: 'center' }}>
                La zone verte représente les intérêts composés · La ligne bleue représente tes versements cumulés
              </div>
            </div>
          )}

          {/* Tab : Tableau année par année */}
          {activeTab === 'table' && (
            <div style={{ padding: '0' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface2)' }}>
                      {['Année', 'Capital total', 'Versements cumulés', 'Intérêts', '% gains'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '10px', letterSpacing: '.08em', borderBottom: '0.5px solid var(--border)', fontWeight: 400 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(showAll ? data : data).map((row, i) => (
                      <tr key={row.year} style={{ borderBottom: '0.5px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                        <td style={{ padding: '10px 16px', color: 'var(--neon)', textAlign: 'right' }}>AN {row.year}</td>
                        <td style={{ padding: '10px 16px', color: 'var(--text-primary)', textAlign: 'right', fontWeight: 500 }}>{row.balance.toLocaleString('fr-FR')} €</td>
                        <td style={{ padding: '10px 16px', color: 'var(--blue)', textAlign: 'right' }}>{row.invested.toLocaleString('fr-FR')} €</td>
                        <td style={{ padding: '10px 16px', color: 'var(--yellow)', textAlign: 'right' }}>{row.interests.toLocaleString('fr-FR')} €</td>
                        <td style={{ padding: '10px 16px', color: row.interests > 0 ? 'var(--neon)' : 'var(--text-secondary)', textAlign: 'right' }}>+{row.interestPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab : PEA vs CTO */}
          {activeTab === 'fiscal' && (
            <div style={{ padding: '28px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                // Comparaison fiscale après {years} ans — Capital brut : {last.balance.toLocaleString('fr-FR')} €
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px', marginBottom: '24px' }}>
                {/* PEA */}
                <div style={{ background: 'rgba(0,255,136,.06)', border: '0.5px solid var(--neon)', borderRadius: '8px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--neon)' }} />
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--neon)', letterSpacing: '.1em', marginBottom: '16px' }}>// PEA {years >= 5 ? '(>5 ans ✓)' : '(<5 ans ⚠)'}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '32px', fontWeight: 600, color: 'var(--neon)', marginBottom: '8px' }}>{fiscal.pea?.toLocaleString('fr-FR')} €</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Impôts : {fiscal.peaTax?.toLocaleString('fr-FR')} €</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>Taux effectif : {years >= 5 ? '18.6%' : '31,4%'} ({years >= 5 ? 'PS uniquement, IR exonéré' : 'IR 12,8% + PS 18,6%'})</div>
                </div>

                {/* CTO */}
                <div style={{ background: 'rgba(0,194,255,.04)', border: '0.5px solid var(--blue)', borderRadius: '8px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--blue)' }} />
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--blue)', letterSpacing: '.1em', marginBottom: '16px' }}>// CTO (flat tax 31,4%)</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '32px', fontWeight: 600, color: 'var(--blue)', marginBottom: '8px' }}>{fiscal.cto?.toLocaleString('fr-FR')} €</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Impôts : {fiscal.ctoTax?.toLocaleString('fr-FR')} €</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>Taux effectif : 31,4% (flat tax)</div>
                </div>
              </div>

              {/* Avantage PEA */}
              {fiscal.diff > 0 && (
                <div style={{ background: 'var(--void)', border: '0.5px solid var(--neon)', borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    💡 Avantage PEA sur {years} ans :
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '20px', fontWeight: 600, color: 'var(--neon)' }}>
                    +{fiscal.diff?.toLocaleString('fr-FR')} € économisés
                  </span>
                </div>
              )}

              <div style={{ marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '10px', color: '#333', lineHeight: 1.8 }}>
                // Hypothèses : PEA après 5 ans = exonération IR, uniquement PS 18.6% · CTO = flat tax 31,4% · Calcul simplifié, hors CSG déductible et abattements éventuels · Ne constitue pas un conseil fiscal.
              </div>
            </div>
          )}
        </div>

        {/* ── LEXIQUE ── */}
        <div className="section-label" id="lexique" style={{ marginTop: '60px' }}>LEXIQUE FINANCE & CRYPTO</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '12px' }}>
          {[
            { letter: 'A–C', terms: 'Actif · Bear market · Beta · Capitalisation · Coupon' },
            { letter: 'D–F', terms: 'DeFi · Dividende · ETF · Euro Stoxx · Frais de gestion' },
            { letter: 'G–L', terms: 'Gearing · Growth · Hedge · Indice · Liquidité · Levier' },
            { letter: 'M–P', terms: 'Market cap · MVRV · NFT · On-chain · PEA · PER · Put' },
            { letter: 'Q–S', terms: 'Quantitative easing · Ratio Sharpe · ROI · SOPR · Staking' },
            { letter: 'T–Z', terms: 'Taux directeur · TVL · Volatilité · Volume · Wallet · Yield' },
          ].map(({ letter, terms }) => (
            <div key={letter} style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 500, color: 'var(--neon)', marginBottom: '8px', lineHeight: 1 }}>{letter}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{terms}</div>
            </div>
          ))}
        </div>
      </section>

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
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 768px) {
          nav { padding: 0 48px !important; }
          section { padding-left: 48px !important; padding-right: 48px !important; }
          footer { padding: 32px 48px !important; }
        }
        input[type="range"] {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
          background: var(--border2);
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--neon);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(0,255,136,.5);
        }
      `}</style>
    </>
  )
}

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { gEvent } from '../lib/gtm'

export default function Ressources() {
  const [capital, setCapital] = useState(1000)
  const [monthly, setMonthly] = useState(200)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)

  const calculate = () => {
    const r = rate / 100 / 12
    const n = years * 12
    const futureCapital = capital * Math.pow(1 + r, n)
    const futureMonthly = M => M * (Math.pow(1 + r, n) - 1) / r
    const total = Math.round(futureCapital + futureMonthly(monthly))
    const invested = Math.round(capital + monthly * n)
    gEvent('calculator_use', { calculator_type: 'compound_interest', years, rate, result: total })
    return { total, invested, interests: total - invested }
  }

  const result = calculate()

  return (
    <>
      <Head>
        <title>Ressources — Grapheko | Guides, outils & calculateurs</title>
        <meta name="description" content="Guides débutants, lexique finance & crypto, calculateurs et outils gratuits — par Grapheko." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/ressources" />
      </Head>

      <div style={{padding:'80px 24px 40px',borderBottom:'0.5px solid var(--border)',position:'relative',zIndex:1}}>
        <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#1A3A2A',marginBottom:'16px'}}><span style={{color:'var(--neon)'}}>[ ✓ ]</span> ressources.sh --load guides tools lexique</div>
        <h1 style={{fontFamily:'var(--mono)',fontSize:'clamp(28px,5vw,56px)',fontWeight:500,letterSpacing:'-2px',lineHeight:1,marginBottom:'12px'}}>
          <span style={{color:'var(--neon)'}}>{'>'}</span>./ressources
          <span style={{display:'inline-block',width:'6px',height:'clamp(24px,4.5vw,50px)',background:'var(--neon)',verticalAlign:'middle',marginLeft:'3px',animation:'blink 1s step-end infinite',borderRadius:'1px'}}/>
        </h1>
        <p style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-secondary)'}}><span style={{color:'#1A3A2A',marginRight:'8px'}}>//</span>Guides · Lexique · Outils · Calculateurs</p>
      </div>

      <section style={{padding:'48px 24px',position:'relative',zIndex:1}}>

        {/* GUIDES */}
        <div className="section-label">GUIDES ESSENTIELS</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'16px',marginBottom:'60px'}}>
          {[
            {num:'[01]',title:'Investir en bourse pour débutant',desc:'Du compte épargne aux ETF — tout pour commencer intelligemment, sans se faire avoir.',stats:[['8','chapitres'],['45','min lecture'],['100%','gratuit']],color:'var(--neon)',href:'/blog/etf-debutant'},
            {num:'[02]',title:'Comprendre la crypto en 2026',desc:'Bitcoin, Ethereum, DeFi — on démystifie l\'écosystème crypto avec des données on-chain.',stats:[['6','chapitres'],['30','min lecture'],['100%','gratuit']],color:'var(--yellow)',href:'/blog/ethereum-2026'},
            {num:'[03]',title:'Lire les données économiques',desc:'PIB, inflation, taux directeurs — comment interpréter les chiffres macro qui bougent les marchés.',stats:[['5','chapitres'],['25','min lecture'],['100%','gratuit']],color:'var(--blue)',href:'/blog'},
          ].map(r=>(
            <Link key={r.num} href={r.href} style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',padding:'28px',textDecoration:'none',display:'block',transition:'border-color .2s,transform .2s'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:r.color,letterSpacing:'.1em',marginBottom:'16px'}}>{r.num} // GUIDE</div>
              <div style={{fontSize:'16px',fontWeight:600,color:'var(--text-primary)',marginBottom:'10px',lineHeight:1.3}}>{r.title}</div>
              <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.6,marginBottom:'20px'}}>{r.desc}</p>
              <div style={{display:'flex',gap:'16px',marginBottom:'20px'}}>
                {r.stats.map(([val,label])=>(
                  <div key={label} style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)'}}>
                    <span style={{display:'block',fontSize:'16px',fontWeight:500,color:r.color,marginBottom:'2px'}}>{val}</span>{label}
                  </div>
                ))}
              </div>
              <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:r.color}}>./lire_le_guide →</span>
            </Link>
          ))}
        </div>

        {/* CALCULATEUR */}
        <div className="section-label" id="outils">CALCULATEUR — INTÉRÊTS COMPOSÉS</div>
        <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',overflow:'hidden',marginBottom:'60px'}}>
          <div style={{background:'var(--surface2)',padding:'12px 20px',display:'flex',alignItems:'center',gap:'8px',borderBottom:'0.5px solid var(--border)'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#FF5F57'}}/>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#FFBD2E'}}/>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#28CA41'}}/>
            <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#333',margin:'0 auto'}}>compound_interest.sh</span>
          </div>
          <div style={{padding:'28px',fontFamily:'var(--mono)',fontSize:'13px'}}>
            <div style={{color:'#1A3A2A',marginBottom:'20px'}}>// Renseigne tes paramètres :</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'20px'}}>
              {[
                {label:'Capital initial (€)',val:capital,set:setCapital,min:0},
                {label:'Versement mensuel (€)',val:monthly,set:setMonthly,min:0},
                {label:'Taux annuel (%)',val:rate,set:setRate,min:0,max:100,step:0.1},
                {label:'Durée (années)',val:years,set:setYears,min:1,max:50},
              ].map(({label,val,set,min,max,step})=>(
                <div key={label} style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <span style={{color:'var(--text-secondary)',fontSize:'12px',minWidth:'180px'}}>{label}</span>
                  <input type="number" value={val} min={min} max={max} step={step||1} onChange={e=>set(parseFloat(e.target.value)||0)}
                    style={{background:'var(--void)',border:'0.5px solid var(--border2)',borderRadius:'4px',padding:'6px 12px',fontFamily:'var(--mono)',fontSize:'12px',color:'var(--text-primary)',outline:'none',width:'120px'}}/>
                </div>
              ))}
            </div>
            <div style={{background:'var(--void)',border:'0.5px solid var(--neon)',borderRadius:'8px',padding:'20px',marginTop:'8px'}}>
              <div style={{fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',marginBottom:'8px'}}>RÉSULTAT ESTIMÉ</div>
              <div style={{fontSize:'32px',fontWeight:500,color:'var(--neon)',marginBottom:'6px'}}>{result.total.toLocaleString('fr-FR')} €</div>
              <div style={{fontSize:'11px',color:'var(--text-secondary)'}}>Dont {result.invested.toLocaleString('fr-FR')} € versés · <span style={{color:'var(--neon)'}}>{result.interests.toLocaleString('fr-FR')} € d'intérêts générés</span></div>
            </div>
          </div>
        </div>

        {/* LEXIQUE */}
        <div className="section-label" id="lexique">LEXIQUE FINANCE & CRYPTO</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px'}}>
          {[
            {letter:'A–C',terms:'Actif · Amortissement · Bear market · Beta · Capitalisation'},
            {letter:'D–F',terms:'DeFi · Dividende · ETF · Euro Stoxx · Frais de gestion'},
            {letter:'G–L',terms:'Gearing · Growth · Hedge · Indice · Liquidité · Levier'},
            {letter:'M–P',terms:'Market cap · MVRV · NFT · On-chain · PEA · PER · Put'},
            {letter:'Q–S',terms:'Quantitative easing · Ratio Sharpe · ROI · SOPR · Staking'},
            {letter:'T–Z',terms:'Taux directeur · TVL · Volatilité · Volume · Wallet · Yield'},
          ].map(({letter,terms})=>(
            <div key={letter} style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'20px'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'24px',fontWeight:500,color:'var(--neon)',marginBottom:'8px',lineHeight:1}}>{letter}</div>
              <div style={{fontSize:'12px',color:'var(--text-secondary)',lineHeight:1.8}}>{terms}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{borderTop:'0.5px solid var(--border)',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',position:'relative',zIndex:1}}>
        <Link href="/" style={{fontFamily:'var(--mono)',fontSize:'14px',color:'var(--text-primary)',textDecoration:'none'}}>{'>'} graph<span style={{color:'var(--neon)'}}>eko</span>_</Link>
        <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
          {[['./blog','/blog'],['./ressources','/ressources'],['./newsletter','/newsletter'],['./contact','/contact']].map(([l,h])=>(
            <Link key={h} href={h} style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#333',textDecoration:'none'}}>{l}</Link>
          ))}
        </div>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>© 2026 <span style={{color:'var(--neon)'}}>grapheko</span></span>
      </footer>

      <style jsx global>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 768px) { nav { padding: 0 48px !important; } }
      `}</style>
    </>
  )
}

import { useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { initScrollDepth, initTimeOnPage, trackCTAClick, trackArticleClick } from '../lib/gtm'

const TICKER = [
  { name: 'CAC 40', val: '7 842', change: '+2.41%', dir: 'up' },
  { name: 'BTC/EUR', val: '61 240', change: '+3.12%', dir: 'up' },
  { name: 'ETH/EUR', val: '3 180', change: '+0.44%', dir: 'flat' },
  { name: 'GOLD', val: '2 340$', change: '+0.82%', dir: 'up' },
  { name: 'EUR/USD', val: '1.0842', change: '-0.31%', dir: 'down' },
  { name: 'OAT 10Y', val: '3.12%', change: '-0.08%', dir: 'down' },
  { name: 'INFL FR', val: '2.10%', change: '-0.10%', dir: 'flat' },
  { name: 'S&P 500', val: '5 204', change: '+1.18%', dir: 'up' },
]

const ARTICLES = [
  { slug: 'bourse-debutant-2026', title: 'Bourse pour débutant : par où commencer en 2026', cat: 'finance', time: '13 min', date: '10 mai 2026' },
  { slug: 'bitcoin-metriques-onchain', title: 'Bitcoin : les 5 métriques on-chain à surveiller', cat: 'crypto', time: '10 min', date: '8 mai 2026' },
  { slug: 'ethereum-2026', title: 'Ethereum : tout comprendre avant d\'investir', cat: 'crypto', time: '11 min', date: '6 mai 2026' },
  { slug: 'pea-cto-assurance-vie', title: 'PEA, CTO ou Assurance-vie : quelle enveloppe choisir ?', cat: 'finance', time: '11 min', date: '4 mai 2026' },
  { slug: 'etf-debutant', title: 'Comment investir en ETF quand on débute', cat: 'finance', time: '12 min', date: '2 mai 2026' },
]

const CAT = {
  finance: { bg: '#001A0D', color: '#00FF88' },
  crypto: { bg: '#1A1500', color: '#FFE44D' },
  data: { bg: '#001020', color: '#00C2FF' },
  alerte: { bg: '#1A0000', color: '#FF4D4D' },
}

export default function Home() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const cleanScroll = initScrollDepth('homepage')
    const cleanTime = initTimeOnPage('homepage')
    return () => { cleanScroll?.(); cleanTime?.() }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return
    let mx = 0, my = 0, rx = 0, ry = 0
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    document.addEventListener('mousemove', onMove)
    let raf
    const animate = () => {
      dot.style.left = mx - 4 + 'px'; dot.style.top = my - 4 + 'px'
      rx += (mx - rx) * .12; ry += (my - ry) * .12
      ring.style.left = rx - 16 + 'px'; ring.style.top = ry - 16 + 'px'
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <Head>
        <title>Grapheko — La finance décryptée par la data</title>
        <meta name="description" content="Grapheko décrypte la finance, l'économie et la crypto par la data. Analyses, guides et ressources pour comprendre les marchés." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr" />
        <meta property="og:title" content="Grapheko — La finance décryptée par la data" />
        <meta property="og:description" content="Analyses, guides et ressources pour comprendre les marchés financiers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://grapheko.fr" />
      </Head>

      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, padding:'0 48px', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(8,8,8,.9)', backdropFilter:'blur(12px)', borderBottom:'0.5px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily:'var(--mono)', fontSize:'18px', fontWeight:500, color:'var(--text-primary)', textDecoration:'none', letterSpacing:'-0.5px' }}>
          <span style={{color:'var(--neon)'}}>{'>'}</span>graph<span style={{color:'var(--neon)'}}>eko</span>
          <span style={{display:'inline-block',width:'2px',height:'16px',background:'var(--neon)',verticalAlign:'middle',marginLeft:'1px',animation:'blink 1s step-end infinite'}}/>
        </Link>
        <nav style={{display:'flex',alignItems:'center',gap:'32px'}}>
          {[['./blog','/blog'],['./ressources','/ressources'],['./newsletter','/newsletter'],['./about','/about']].map(([label,href])=>(
            <Link key={href} href={href} style={{fontFamily:'var(--mono)',fontSize:'12px',color:'var(--text-secondary)',textDecoration:'none'}}>{label}</Link>
          ))}
          <Link href="/contact" style={{fontFamily:'var(--mono)',fontSize:'12px',color:'var(--neon)',border:'0.5px solid var(--neon)',padding:'6px 16px',borderRadius:'4px',textDecoration:'none'}}>./contact</Link>
        </nav>
      </nav>

      {/* TICKER */}
      <div style={{position:'fixed',top:'60px',left:0,right:0,zIndex:49}} className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER,...TICKER].map((t,i)=>(
            <div className="ticker-item" key={i}>
              <span className="ticker-name">{t.name}</span>
              <span className="ticker-val">{t.val}</span>
              <span className={t.dir}>{t.dir==='up'?'▲':t.dir==='down'?'▼':'◆'} {t.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={{minHeight:'100vh',padding:'140px 48px 80px',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',zIndex:1}}>
        <div style={{fontFamily:'var(--mono)',fontSize:'12px',color:'#1A3A2A',marginBottom:'32px',lineHeight:2}}>
          <div><span style={{color:'#2A4A3A'}}>$ boot grapheko.sh --mode=finance</span></div>
          <div><span style={{color:'#1A3A2A'}}>[ ✓ ] Loading market data streams...</span></div>
          <div><span style={{color:'#1A3A2A'}}>[ ✓ ] Connecting analytics engine...</span></div>
          <div style={{color:'var(--neon)'}}>[ ✓ ] System ready. Welcome.</div>
        </div>

        <h1 style={{fontFamily:'var(--mono)',fontSize:'clamp(48px,8vw,96px)',fontWeight:500,letterSpacing:'-3px',lineHeight:.95,marginBottom:'24px'}}>
          <span style={{color:'var(--neon)'}}>{'>'}</span>
          <span style={{color:'var(--text-primary)'}}>graph</span>
          <span style={{color:'var(--neon)'}}>eko</span>
          <span style={{display:'inline-block',width:'clamp(6px,1vw,12px)',height:'clamp(44px,7.5vw,88px)',background:'var(--neon)',verticalAlign:'middle',marginLeft:'4px',animation:'blink 1s step-end infinite',borderRadius:'2px'}}/>
        </h1>

        <p style={{fontFamily:'var(--mono)',fontSize:'14px',color:'var(--text-secondary)',marginBottom:'48px'}}>
          <span style={{color:'#1A3A2A',marginRight:'8px'}}>//</span>
          La finance décryptée par la data — analyses, guides, crypto & marchés
        </p>

        <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
          <Link href="/blog" className="btn-primary" onClick={()=>trackCTAClick('./explorer_articles','hero')}>
            ./explorer_articles
          </Link>
          <Link href="/newsletter" className="btn-secondary" onClick={()=>trackCTAClick('./s_abonner','hero')}>
            ./s_abonner
          </Link>
        </div>

        {/* Chart décoratif */}
        <div style={{position:'absolute',right:'48px',top:'50%',transform:'translateY(-50%)',width:'400px',opacity:.18,pointerEvents:'none'}}>
          <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF88" stopOpacity=".2"/>
                <stop offset="100%" stopColor="#00FF88" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,160 L40,140 L80,150 L120,110 L160,120 L200,80 L240,90 L280,50 L320,60 L360,20 L400,30 L400,200 L0,200Z" fill="url(#hg)"/>
            <path d="M0,160 L40,140 L80,150 L120,110 L160,120 L200,80 L240,90 L280,50 L320,60 L360,20 L400,30" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1000" style={{animation:'chart-draw 2s ease forwards'}}/>
            <circle cx="360" cy="20" r="4" fill="#00FF88"/>
          </svg>
        </div>
      </section>

      {/* METRICS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'0.5px solid var(--border)',borderBottom:'0.5px solid var(--border)',background:'var(--surface)',position:'relative',zIndex:1}}>
        {[
          {key:'CAC_40',val:'7 842',change:'+2.41%',dir:'up',bar:72,color:'var(--neon)'},
          {key:'BTC_EUR',val:'61 240',change:'+3.12%',dir:'up',bar:85,color:'var(--yellow)'},
          {key:'INFL_FR',val:'2.10%',change:'-0.10%',dir:'down',bar:28,color:'var(--red)'},
          {key:'GOLD_USD',val:'2 340$',change:'+0.82%',dir:'up',bar:60,color:'var(--blue)'},
        ].map((m,i)=>(
          <div key={m.key} style={{padding:'24px 32px',borderRight:i<3?'0.5px solid var(--border)':'none'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',marginBottom:'8px'}}>{m.key}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:'28px',fontWeight:500,color:m.color,lineHeight:1,marginBottom:'6px'}}>{m.val}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:m.color}}>{m.dir==='up'?'▲':m.dir==='down'?'▼':'◆'} {m.change}</div>
            <div style={{height:'2px',background:'var(--border2)',borderRadius:'1px',marginTop:'12px'}}>
              <div style={{height:'100%',width:`${m.bar}%`,background:m.color,borderRadius:'1px'}}/>
            </div>
          </div>
        ))}
      </div>

      {/* ARTICLES */}
      <section style={{padding:'80px 48px',position:'relative',zIndex:1}}>
        <div className="section-label">DERNIÈRES ANALYSES</div>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'16px'}}>
          <Link href={`/blog/${ARTICLES[0].slug}`} onClick={()=>trackArticleClick(ARTICLES[0].title,ARTICLES[0].cat)}
            style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'32px',textDecoration:'none',display:'block'}}>
            <span style={{...CAT[ARTICLES[0].cat],fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.1em',padding:'4px 10px',borderRadius:'3px',display:'inline-block',marginBottom:'16px'}}>[{ARTICLES[0].cat}]</span>
            <h2 style={{fontSize:'22px',fontWeight:600,color:'var(--text-primary)',lineHeight:1.3,marginBottom:'12px'}}>{ARTICLES[0].title}</h2>
            <p style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:'24px'}}>Tout ce qu'il faut savoir pour commencer à investir intelligemment en 2026 — sans jargon, avec les données.</p>
            <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#333',display:'flex',gap:'16px'}}>
              <span>grapheko</span><span>·</span><span>{ARTICLES[0].time}</span><span>·</span><span>{ARTICLES[0].date}</span>
            </div>
          </Link>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {ARTICLES.slice(1).map(a=>(
              <Link key={a.slug} href={`/blog/${a.slug}`} onClick={()=>trackArticleClick(a.title,a.cat)}
                style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'20px 24px',textDecoration:'none',display:'block',flex:1}}>
                <span style={{...CAT[a.cat],fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.1em',padding:'3px 8px',borderRadius:'3px',display:'inline-block',marginBottom:'10px'}}>[{a.cat}]</span>
                <div style={{fontSize:'14px',fontWeight:500,color:'var(--text-primary)',lineHeight:1.4,marginBottom:'8px'}}>{a.title}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#333'}}>{a.time} · {a.date}</div>
              </Link>
            ))}
          </div>
        </div>
        <div style={{marginTop:'32px',textAlign:'center'}}>
          <Link href="/blog" className="btn-secondary" onClick={()=>trackCTAClick('./voir_tous_les_articles','articles')}>
            ./voir_tous_les_articles
          </Link>
        </div>
      </section>

      {/* TERMINAL */}
      <section style={{padding:'0 48px 80px',position:'relative',zIndex:1}}>
        <div className="section-label">GRAPHEKO TERMINAL</div>
        <div className="terminal-window">
          <div className="terminal-titlebar">
            <div className="t-dot" style={{background:'#FF5F57'}}/>
            <div className="t-dot" style={{background:'#FFBD2E'}}/>
            <div className="t-dot" style={{background:'#28CA41'}}/>
            <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#333',margin:'0 auto'}}>grapheko — market_overview.sh</span>
          </div>
          <div className="terminal-content">
            <div><span className="t-prompt">$ </span><span className="t-cmd">fetch --markets --today</span></div>
            <div className="t-output t-comment">// Récupération des données...</div>
            <div className="t-output"><span style={{color:'#333'}}>STATUS</span> &nbsp; CAC40 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="t-val-up">+2.41%</span> &nbsp; ▲ BULL</div>
            <div className="t-output"><span style={{color:'#333'}}>STATUS</span> &nbsp; BTC/EUR &nbsp;&nbsp;&nbsp; <span className="t-val-warn">+3.12%</span> &nbsp; ◆ HOLD</div>
            <div className="t-output"><span style={{color:'#333'}}>STATUS</span> &nbsp; INFL_FR &nbsp;&nbsp;&nbsp; <span className="t-val-down">2.10%</span> &nbsp;&nbsp; ▼ WATCH</div>
            <div className="t-output"><span style={{color:'#333'}}>STATUS</span> &nbsp; GOLD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span className="t-val-blue">+0.82%</span> &nbsp; ▲ UP</div>
            <div className="t-output t-comment">// Marché en mode prudent — voir article du jour</div>
            <br/>
            <div><span className="t-prompt">grapheko@finance:~$ </span><span style={{animation:'blink 1s step-end infinite',color:'var(--neon)'}}>_</span></div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{padding:'0 48px 80px',position:'relative',zIndex:1}}>
        <div className="section-label">NEWSLETTER</div>
        <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',padding:'56px 64px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'64px',alignItems:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,var(--neon),transparent)'}}/>
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:'28px',fontWeight:500,letterSpacing:'-1px',lineHeight:1.2,marginBottom:'12px'}}>
              {'>'} La Grapheko<br/><span style={{color:'var(--neon)'}}>Weekly_</span>
            </div>
            <p style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:1.6}}>Chaque dimanche, les chiffres qui comptent, décryptés en 5 minutes. Finance, crypto, économie — sans bruit.</p>
          </div>
          <form onSubmit={e=>{e.preventDefault();const {trackNewsletterSignup}=require('../lib/gtm');trackNewsletterSignup('homepage')}} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div>
              <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>PRÉNOM</label>
              <input name="prenom" type="text" placeholder="ton_prénom" className="input-field"/>
            </div>
            <div>
              <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>EMAIL</label>
              <input name="email" type="email" placeholder="toi@example.com" className="input-field" required/>
            </div>
            <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>./s_abonner_gratuitement</button>
            <p style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#222',textAlign:'center'}}>// 0 spam · résiliation en 1 clic</p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'0.5px solid var(--border)',padding:'48px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'48px',position:'relative',zIndex:1}}>
        <div>
          <div style={{fontFamily:'var(--mono)',fontSize:'20px',fontWeight:500,marginBottom:'12px'}}>
            {'>'} graph<span style={{color:'var(--neon)'}}>eko</span>_
          </div>
          <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:'20px',maxWidth:'280px'}}>
            La finance décryptée par la data. Analyses, guides et ressources pour comprendre les marchés.
          </p>
          <div style={{display:'flex',gap:'12px'}}>
            {['Twitter','LinkedIn','TikTok','Instagram'].map(s=>(
              <a key={s} href="#" style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',border:'0.5px solid var(--border2)',padding:'6px 12px',borderRadius:'4px',textDecoration:'none'}}>{s}</a>
            ))}
          </div>
        </div>
        {[
          {title:'NAVIGATION',links:[['./blog','/blog'],['./ressources','/ressources'],['./newsletter','/newsletter'],['./about','/about'],['./contact','/contact']]},
          {title:'CATÉGORIES',links:[['[finance]','/blog?cat=finance'],['[crypto]','/blog?cat=crypto'],['[investissement]','/blog?cat=investissement'],['[data]','/blog?cat=data']]},
          {title:'LÉGAL',links:[['Mentions légales','/mentions-legales'],['CGU','/cgu'],['Confidentialité','/confidentialite'],['Cookies','/cookies']]},
        ].map(col=>(
          <div key={col.title}>
            <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.15em',marginBottom:'20px'}}>{col.title}</div>
            <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'12px'}}>
              {col.links.map(([label,href])=>(
                <li key={href}><Link href={href} style={{fontSize:'13px',color:'#333',textDecoration:'none'}}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
      <div style={{borderTop:'0.5px solid var(--border)',padding:'20px 48px',display:'flex',justifyContent:'space-between',position:'relative',zIndex:1}}>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>© 2026 <span style={{color:'var(--neon)'}}>grapheko</span></span>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>Made with <span style={{color:'var(--neon)'}}>♥</span> & data</span>
      </div>
    </>
  )
}

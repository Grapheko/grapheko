import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { initTimeOnPage, trackArticleClick, trackCTAClick } from '../../lib/gtm'

const ARTICLES = [
  { slug: 'bourse-debutant-2026', title: 'Bourse pour débutant : par où commencer en 2026', cat: 'finance', time: '13 min', date: '10 mai 2026', excerpt: 'Tout ce qu\'il faut savoir pour commencer à investir intelligemment — sans jargon, avec les données.' },
  { slug: 'bitcoin-metriques-onchain', title: 'Bitcoin : les 5 métriques on-chain à surveiller', cat: 'crypto', time: '10 min', date: '8 mai 2026', excerpt: 'MVRV, SOPR, Puell Multiple — les indicateurs que les pros scrutent et que le grand public ignore.' },
  { slug: 'ethereum-2026', title: 'Ethereum : tout comprendre avant d\'investir en 2026', cat: 'crypto', time: '11 min', date: '6 mai 2026', excerpt: 'Smart contracts, staking, Layer 2 — ce qui différencie fondamentalement l\'ETH du Bitcoin.' },
  { slug: 'pea-cto-assurance-vie', title: 'PEA, CTO ou Assurance-vie : quelle enveloppe choisir ?', cat: 'finance', time: '11 min', date: '4 mai 2026', excerpt: 'Comparatif fiscal complet avec simulations chiffrées pour optimiser ta stratégie d\'investissement.' },
  { slug: 'etf-debutant', title: 'Comment investir en ETF quand on débute', cat: 'finance', time: '12 min', date: '2 mai 2026', excerpt: 'ETF, TER, PEA, DCA — le guide complet pour investir passivement et battre 80% des gérants.' },
]

const CAT = {
  finance: { bg: '#001A0D', color: '#00FF88' },
  crypto: { bg: '#1A1500', color: '#FFE44D' },
  data: { bg: '#001020', color: '#00C2FF' },
  alerte: { bg: '#1A0000', color: '#FF4D4D' },
}

export default function Blog() {
  useEffect(() => {
    const cleanTime = initTimeOnPage('blog')
    return () => cleanTime?.()
  }, [])

  return (
    <>
      <Head>
        <title>Blog — Grapheko | Analyses finance & crypto</title>
        <meta name="description" content="Analyses, guides et décryptages finance, crypto et investissement par Grapheko." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/blog" />
      </Head>

      {/* HEADER */}
      <div style={{padding:'80px 24px 40px',borderBottom:'0.5px solid var(--border)',position:'relative',zIndex:1}}>
        <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#1A3A2A',marginBottom:'16px'}}>
          <span style={{color:'var(--neon)'}}>[ ✓ ]</span> blog.sh --load articles --sort=recent
        </div>
        <h1 style={{fontFamily:'var(--mono)',fontSize:'clamp(28px,5vw,56px)',fontWeight:500,letterSpacing:'-2px',lineHeight:1,marginBottom:'12px'}}>
          <span style={{color:'var(--neon)'}}>{'>'}</span>./blog
          <span style={{display:'inline-block',width:'6px',height:'clamp(24px,4.5vw,50px)',background:'var(--neon)',verticalAlign:'middle',marginLeft:'3px',animation:'blink 1s step-end infinite',borderRadius:'1px'}}/>
        </h1>
        <p style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-secondary)'}}>
          <span style={{color:'#1A3A2A',marginRight:'8px'}}>//</span>Analyses · Guides · Décryptages · Data
        </p>
      </div>

      {/* ARTICLES */}
      <section style={{padding:'40px 24px 80px',position:'relative',zIndex:1}}>
        {/* Featured */}
        <Link href={`/blog/${ARTICLES[0].slug}`}
          onClick={()=>trackArticleClick(ARTICLES[0].title, ARTICLES[0].cat)}
          style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'28px',textDecoration:'none',display:'block',marginBottom:'12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px',flexWrap:'wrap'}}>
            <span style={{...CAT[ARTICLES[0].cat],fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.1em',padding:'4px 10px',borderRadius:'3px'}}>[{ARTICLES[0].cat}]</span>
            <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#333'}}>{ARTICLES[0].time} · {ARTICLES[0].date}</span>
          </div>
          <h2 style={{fontSize:'clamp(16px,2.5vw,22px)',fontWeight:600,color:'var(--text-primary)',lineHeight:1.3,marginBottom:'10px'}}>{ARTICLES[0].title}</h2>
          <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:'16px'}}>{ARTICLES[0].excerpt}</p>
          <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--neon)'}}>./lire l'article →</div>
        </Link>

        {/* Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'12px'}}>
          {ARTICLES.slice(1).map(a=>(
            <Link key={a.slug} href={`/blog/${a.slug}`}
              onClick={()=>trackArticleClick(a.title, a.cat)}
              style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'24px',textDecoration:'none',display:'flex',flexDirection:'column'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                <span style={{...CAT[a.cat],fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.1em',padding:'3px 8px',borderRadius:'3px'}}>[{a.cat}]</span>
                <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#333'}}>{a.time}</span>
              </div>
              <div style={{fontSize:'14px',fontWeight:500,color:'var(--text-primary)',lineHeight:1.4,marginBottom:'8px',flex:1}}>{a.title}</div>
              <div style={{fontSize:'12px',color:'var(--text-secondary)',lineHeight:1.6,marginBottom:'12px'}}>{a.excerpt}</div>
              <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#333'}}>{a.date}</div>
            </Link>
          ))}
        </div>

        <div style={{marginTop:'32px',textAlign:'center'}}>
          <Link href="/newsletter" className="btn-secondary" onClick={()=>trackCTAClick('./s_abonner','blog_footer')}>
            ./s_abonner à la newsletter →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
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
        @media (min-width: 768px) {
          nav { padding: 0 48px !important; }
          section { padding-left: 48px !important; padding-right: 48px !important; }
          footer { padding: 32px 48px !important; }
        }
      `}</style>
    </>
  )
}

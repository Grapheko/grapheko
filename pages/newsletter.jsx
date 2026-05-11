import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { initScrollDepth, trackNewsletterSignup } from '../lib/gtm'

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const clean = initScrollDepth('newsletter')
    return () => clean?.()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    if (!email) return
    trackNewsletterSignup('newsletter_page')
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Newsletter — Grapheko | La Grapheko Weekly</title>
        <meta name="description" content="La Grapheko Weekly — l'économie décryptée par la data chaque dimanche. Finance, crypto, investissement en 5 minutes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/newsletter" />
      </Head>

      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,padding:'0 24px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(8,8,8,.95)',backdropFilter:'blur(12px)',borderBottom:'0.5px solid var(--border)'}}>
        <Link href="/" style={{fontFamily:'var(--mono)',fontSize:'16px',fontWeight:500,color:'var(--text-primary)',textDecoration:'none'}}>
          <span style={{color:'var(--neon)'}}>{'>'}</span>graph<span style={{color:'var(--neon)'}}>eko</span>
          <span style={{display:'inline-block',width:'2px',height:'14px',background:'var(--neon)',verticalAlign:'middle',marginLeft:'1px',animation:'blink 1s step-end infinite'}}/>
        </Link>
        <div className="desktop-nav" style={{display:'flex',alignItems:'center',gap:'24px'}}>
          {[['./blog','/blog'],['./ressources','/ressources'],['./newsletter','/newsletter'],['./about','/about']].map(([l,h])=>(
            <Link key={h} href={h} style={{fontFamily:'var(--mono)',fontSize:'12px',color:h==='/newsletter'?'var(--neon)':'var(--text-secondary)',textDecoration:'none'}}>{l}</Link>
          ))}
          <Link href="/contact" style={{fontFamily:'var(--mono)',fontSize:'12px',color:'var(--neon)',border:'0.5px solid var(--neon)',padding:'6px 14px',borderRadius:'4px',textDecoration:'none'}}>./contact</Link>
        </div>
      </nav>

      <section style={{minHeight:'100vh',padding:'100px 24px 80px',display:'flex',alignItems:'center',position:'relative',zIndex:1}}>
        <div style={{width:'100%',maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'60px',alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#1A3A2A',marginBottom:'20px'}}>
              <span style={{color:'var(--neon)'}}>[ ✓ ]</span> newsletter.sh --subscribe grapheko-weekly
            </div>
            <h1 style={{fontFamily:'var(--mono)',fontSize:'clamp(32px,5vw,64px)',fontWeight:500,letterSpacing:'-2px',lineHeight:1,marginBottom:'20px'}}>
              <span style={{color:'var(--neon)'}}>{'>'}</span> La<br/>Grapheko<br/><span style={{color:'var(--neon)'}}>Weekly_</span>
            </h1>
            <p style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.8,marginBottom:'32px'}}>
              <span style={{color:'#1A3A2A'}}>//</span> Chaque dimanche matin — les chiffres qui ont bougé les marchés, décryptés en 5 min. Finance · crypto · économie · data.
            </p>
            <div style={{display:'flex',gap:'32px',flexWrap:'wrap'}}>
              {[['847','abonnés actifs'],['52','éditions/an'],['0€','pour toujours']].map(([val,label])=>(
                <div key={label} style={{borderLeft:'2px solid var(--neon)',paddingLeft:'16px'}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:'24px',fontWeight:500,color:'var(--neon)',lineHeight:1,marginBottom:'4px'}}>{val}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)'}}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',padding:'clamp(24px,5vw,40px)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,var(--neon),transparent)'}}/>
            {!submitted ? (
              <>
                <div style={{fontFamily:'var(--mono)',fontSize:'14px',fontWeight:500,color:'var(--text-primary)',marginBottom:'6px'}}>{'>'} ./subscribe_</div>
                <p style={{fontSize:'13px',color:'var(--text-secondary)',marginBottom:'24px',lineHeight:1.6}}>Rejoins la communauté Grapheko — l'analyse data que tu ne trouveras pas ailleurs.</p>
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  <div>
                    <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>PRÉNOM</label>
                    <input name="prenom" type="text" placeholder="ton_prénom" className="input-field"/>
                  </div>
                  <div>
                    <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>EMAIL *</label>
                    <input name="email" type="email" placeholder="toi@example.com" className="input-field" required/>
                  </div>
                  <button type="submit" className="btn-primary" style={{justifyContent:'center',marginTop:'4px'}}>./s_abonner_gratuitement →</button>
                  <p style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#222',textAlign:'center'}}>// 0 spam · résiliation en 1 clic · données protégées</p>
                </form>
              </>
            ) : (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'40px',color:'var(--neon)',marginBottom:'16px'}}>[ ✓ ]</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'18px',color:'var(--text-primary)',marginBottom:'8px'}}>Bienvenue dans Grapheko !</div>
                <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.6}}>Vérifie ta boîte mail pour confirmer. Ta première édition arrive dimanche.</p>
              </div>
            )}
          </div>
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

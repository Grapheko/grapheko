import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { gEvent } from '../lib/gtm'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [subject, setSubject] = useState('[partenariat]')

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const message = e.target.message.value
    if (!email || !message) return
    gEvent('contact_form_submit', { contact_subject: subject })
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Contact — Grapheko</title>
        <meta name="description" content="Contacter Grapheko — partenariats, collaboration, presse ou simplement dire bonjour." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/contact" />
      </Head>

      <main style={{minHeight:'100vh',padding:'100px 24px 80px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'60px',alignItems:'start'}}>

          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#1A3A2A',marginBottom:'20px'}}>
              <span style={{color:'var(--neon)'}}>[ ✓ ]</span> contact.sh --open channel
            </div>
            <h1 style={{fontFamily:'var(--mono)',fontSize:'clamp(28px,4vw,56px)',fontWeight:500,letterSpacing:'-2px',lineHeight:1,marginBottom:'16px'}}>
              <span style={{color:'var(--neon)'}}>{'>'}</span>./contact
              <span style={{display:'inline-block',width:'6px',height:'clamp(24px,3.5vw,50px)',background:'var(--neon)',verticalAlign:'middle',marginLeft:'3px',animation:'blink 1s step-end infinite',borderRadius:'1px'}}/>
            </h1>
            <p style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.8,marginBottom:'40px'}}>
              <span style={{color:'#1A3A2A'}}>//</span> Une question, un partenariat, une collaboration ou juste dire bonjour — on lit tout et on répond à tout.
            </p>

            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[
                {icon:'[✉]',label:'EMAIL DIRECT',val:'contact@grapheko.fr',href:'mailto:contact@grapheko.fr'},
                {icon:'[⟳]',label:'DÉLAI DE RÉPONSE',val:'Sous 48h'},
                {icon:'[◉]',label:'BASÉ À',val:'France · Remote friendly'},
              ].map(item=>(
                <div key={item.label} style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'16px 20px',display:'flex',gap:'16px',alignItems:'flex-start'}}>
                  <div style={{fontFamily:'var(--mono)',fontSize:'16px',color:'var(--neon)',minWidth:'28px'}}>{item.icon}</div>
                  <div>
                    <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',marginBottom:'4px'}}>{item.label}</div>
                    <div style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-primary)'}}>
                      {item.href ? <a href={item.href} style={{color:'var(--neon)',textDecoration:'none'}}>{item.val}</a> : item.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{display:'flex',gap:'8px',marginTop:'24px',flexWrap:'wrap'}}>
              {['Twitter','LinkedIn','Instagram','TikTok'].map(s=>(
                <a key={s} href="#" style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',border:'0.5px solid var(--border2)',padding:'6px 12px',borderRadius:'4px',textDecoration:'none'}}>{s}</a>
              ))}
            </div>
          </div>

          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',padding:'clamp(24px,5vw,40px)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,var(--neon),transparent)'}}/>
            {!submitted ? (
              <>
                <div style={{fontFamily:'var(--mono)',fontSize:'12px',color:'var(--text-secondary)',letterSpacing:'.1em',marginBottom:'24px'}}>// ENVOYER UN MESSAGE</div>
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                  <div>
                    <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'8px'}}>SUJET</label>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px'}}>
                      {['[partenariat]','[collaboration]','[presse]','[autre]'].map(s=>(
                        <button key={s} type="button" onClick={()=>setSubject(s)} style={{fontFamily:'var(--mono)',fontSize:'11px',padding:'8px 10px',borderRadius:'4px',border:`0.5px solid ${subject===s?'var(--neon)':'var(--border2)'}`,background:subject===s?'var(--neon-ghost)':'transparent',color:subject===s?'var(--neon)':'var(--text-secondary)',cursor:'pointer',textAlign:'left'}}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'12px'}}>
                    <div>
                      <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>PRÉNOM</label>
                      <input name="prenom" type="text" placeholder="ton_prénom" className="input-field"/>
                    </div>
                    <div>
                      <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>EMAIL *</label>
                      <input name="email" type="email" placeholder="toi@example.com" className="input-field" required/>
                    </div>
                  </div>
                  <div>
                    <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>MESSAGE *</label>
                    <textarea name="message" placeholder="// Décris ton projet..." required style={{width:'100%',background:'var(--void)',border:'0.5px solid var(--border2)',borderRadius:'4px',padding:'12px 16px',fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-primary)',outline:'none',resize:'vertical',minHeight:'120px',lineHeight:1.6}}/>
                  </div>
                  <button type="submit" className="btn-primary" style={{justifyContent:'center'}}>./envoyer_message →</button>
                  <p style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#222',textAlign:'center'}}>// Réponse sous 48h · contact@grapheko.fr</p>
                </form>
              </>
            ) : (
              <div style={{textAlign:'center',padding:'40px 0'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'48px',color:'var(--neon)',marginBottom:'16px'}}>[ ✓ ]</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'18px',color:'var(--text-primary)',marginBottom:'8px'}}>Message reçu !</div>
                <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.6}}>On te répondra dans les 48h. Merci de ton intérêt pour Grapheko.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{borderTop:'0.5px solid var(--border)',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',position:'relative',zIndex:1}}>
        <Link href="/" style={{fontFamily:'var(--mono)',fontSize:'14px',color:'var(--text-primary)',textDecoration:'none'}}>{'>'} graph<span style={{color:'var(--neon)'}}>eko</span>_</Link>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>© 2026 <span style={{color:'var(--neon)'}}>grapheko</span></span>
      </footer>

      <style jsx global>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 768px) { nav { padding: 0 48px !important; } }
      `}</style>
    </>
  )
}

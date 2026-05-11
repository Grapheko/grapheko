import Head from 'next/head'
import { useState } from 'react'
import { trackNewsletterSignup } from '../lib/gtm'

export default function Newsletter() {
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Adresse email invalide.')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prenom }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        trackNewsletterSignup('newsletter_page')
      } else {
        setStatus('error')
        setMessage(data.error || 'Une erreur est survenue.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Erreur réseau — réessaie dans un instant.')
    }
  }

  return (
    <>
      <Head>
        <title>Newsletter — Grapheko | La Grapheko Weekly</title>
        <meta name="description" content="La Grapheko Weekly — l'économie décryptée par la data chaque dimanche. Finance, crypto, investissement en 5 minutes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/newsletter" />
      </Head>

      <section style={{minHeight:'100vh',padding:'100px 24px 80px',display:'flex',alignItems:'center',position:'relative',zIndex:1}}>
        <div style={{width:'100%',maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'60px',alignItems:'center'}}>

          {/* LEFT — Pitch */}
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

          {/* RIGHT — Formulaire */}
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',padding:'clamp(24px,5vw,40px)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,var(--neon),transparent)'}}/>

            {status === 'success' ? (
              /* ── SUCCÈS ── */
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'48px',color:'var(--neon)',marginBottom:'20px'}}>[ ✓ ]</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'18px',color:'var(--text-primary)',marginBottom:'12px'}}>
                  Bienvenue dans Grapheko !
                </div>
                <p style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:'20px'}}>
                  Vérifie ta boîte mail pour confirmer ton inscription. Ta première édition arrive dimanche.
                </p>
                <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#333'}}>
                  // check spam si tu ne vois rien
                </div>
              </div>
            ) : (
              /* ── FORMULAIRE ── */
              <>
                <div style={{fontFamily:'var(--mono)',fontSize:'14px',fontWeight:500,color:'var(--text-primary)',marginBottom:'6px'}}>
                  {'>'} ./subscribe_
                </div>
                <p style={{fontSize:'13px',color:'var(--text-secondary)',marginBottom:'24px',lineHeight:1.6}}>
                  Rejoins la communauté Grapheko — l'analyse data que tu ne trouveras pas ailleurs.
                </p>

                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <div>
                    <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>
                      PRÉNOM
                    </label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      placeholder="ton_prénom"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.1em',display:'block',marginBottom:'6px'}}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        if (status === 'error') setStatus('idle')
                      }}
                      placeholder="toi@example.com"
                      className="input-field"
                      required
                      style={{borderColor: status === 'error' ? 'var(--red)' : undefined}}
                    />
                  </div>

                  {/* Message d'erreur */}
                  {status === 'error' && (
                    <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--red)',padding:'8px 12px',background:'rgba(255,77,77,.08)',borderRadius:'4px',border:'0.5px solid rgba(255,77,77,.2)'}}>
                      ⚠ {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary"
                    style={{
                      justifyContent: 'center',
                      marginTop: '4px',
                      opacity: status === 'loading' ? .7 : 1,
                    }}
                  >
                    {status === 'loading' ? '// Inscription en cours...' : './s_abonner_gratuitement →'}
                  </button>

                  <p style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#222',textAlign:'center'}}>
                    // 0 spam · résiliation en 1 clic · données protégées RGPD
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* APERÇU NEWSLETTER */}
      <section style={{padding:'0 24px 80px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'680px',margin:'0 auto'}}>
          <div className="section-label">APERÇU — DERNIÈRE ÉDITION</div>
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',overflow:'hidden'}}>
            <div style={{background:'var(--surface2)',padding:'20px 28px',borderBottom:'0.5px solid var(--border)'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',marginBottom:'4px'}}>
                De : <span style={{color:'var(--neon)'}}>contact@grapheko.fr</span> · Grapheko Weekly
              </div>
              <div style={{fontFamily:'var(--mono)',fontSize:'14px',fontWeight:500,color:'var(--text-primary)',marginBottom:'4px'}}>
                #047 — CAC40 au plus haut, Bitcoin consolide, inflation en recul
              </div>
              <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#333'}}>
                Dimanche 10 mai 2026 · 08:00
              </div>
            </div>
            <div style={{padding:'28px',fontFamily:'var(--mono)',fontSize:'12px',lineHeight:2}}>
              <div style={{color:'var(--text-primary)',marginBottom:'16px'}}>Bonjour [prénom],</div>
              {[
                {title:'// MARCHÉS CETTE SEMAINE',items:['CAC 40 : +2.41% — porté par LVMH et TotalEnergies','S&P 500 : +1.18% — tech en hausse, bancaires stables','Bitcoin : 61 240€ · consolidation après ATH']},
                {title:'// LE CHIFFRE DE LA SEMAINE',items:['2.1% — inflation France en mai. En baisse pour le 3e mois consécutif.']},
                {title:'// ARTICLE DE LA SEMAINE',items:['→ Bourse pour débutant 2026 — grapheko.fr/blog']},
              ].map(section=>(
                <div key={section.title} style={{marginBottom:'20px'}}>
                  <div style={{color:'var(--neon)',fontSize:'10px',letterSpacing:'.15em',marginBottom:'8px',borderBottom:'0.5px solid var(--border)',paddingBottom:'6px'}}>
                    {section.title}
                  </div>
                  {section.items.map(item=>(
                    <div key={item} style={{color:'var(--text-secondary)',paddingLeft:'16px',borderLeft:'1px solid var(--border2)',marginBottom:'4px'}}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{borderTop:'0.5px solid var(--border)',padding:'16px 28px',fontFamily:'var(--mono)',fontSize:'10px',color:'#333',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
              <span>grapheko.fr · contact@grapheko.fr</span>
              <span>Se désabonner</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'0.5px solid var(--border)',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',position:'relative',zIndex:1}}>
        <a href="/" style={{fontFamily:'var(--mono)',fontSize:'14px',color:'var(--text-primary)',textDecoration:'none'}}>
          {'>'} graph<span style={{color:'var(--neon)'}}>eko</span>_
        </a>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>
          © 2026 <span style={{color:'var(--neon)'}}>grapheko</span>
        </span>
      </footer>

      <style jsx global>{`
        @media (min-width: 768px) {
          section { padding-left: 48px !important; padding-right: 48px !important; }
          footer { padding: 32px 48px !important; }
        }
      `}</style>
    </>
  )
}

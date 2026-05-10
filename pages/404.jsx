import Link from 'next/link'
import Head from 'next/head'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 — Page introuvable · Grapheko</title>
      </Head>
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'var(--mono)', position:'relative', zIndex:1, padding:'48px' }}>
        <div style={{ fontSize:'11px', color:'var(--neon)', letterSpacing:'.15em', marginBottom:'16px' }}>// ERROR_404</div>
        <div style={{ fontSize:'clamp(48px,8vw,96px)', fontWeight:500, color:'var(--text-primary)', letterSpacing:'-3px', marginBottom:'16px', lineHeight:1 }}>
          <span style={{color:'var(--neon)'}}>{'>'}</span>404<span style={{display:'inline-block',width:'8px',height:'clamp(44px,7.5vw,88px)',background:'var(--neon)',verticalAlign:'middle',marginLeft:'4px',animation:'blink 1s step-end infinite',borderRadius:'2px'}}/>
        </div>
        <div style={{ fontSize:'14px', color:'var(--text-secondary)', marginBottom:'8px' }}>
          <span style={{color:'#1A3A2A',marginRight:'8px'}}>//</span>Page introuvable
        </div>
        <div style={{ fontSize:'12px', color:'#333', marginBottom:'48px' }}>
          La page que tu cherches n'existe pas ou a été déplacée.
        </div>
        <Link href="/" style={{ fontFamily:'var(--mono)', fontSize:'13px', color:'var(--void)', background:'var(--neon)', border:'none', padding:'12px 28px', borderRadius:'4px', textDecoration:'none' }}>
          ./retour_accueil
        </Link>
      </div>
    </>
  )
}

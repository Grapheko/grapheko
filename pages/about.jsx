import Head from 'next/head'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <Head>
        <title>About — Grapheko | Le projet, la mission, les valeurs</title>
        <meta name="description" content="Grapheko — le média data qui décrypte la finance, l'économie et la crypto pour tous." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://grapheko.fr/about" />
      </Head>

      {/* HERO */}
      <section style={{padding:'100px 24px 60px',position:'relative',zIndex:1,borderBottom:'0.5px solid var(--border)'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#1A3A2A',marginBottom:'20px'}}>
            <span style={{color:'var(--neon)'}}>[ ✓ ]</span> about.sh --load grapheko
          </div>
          <h1 style={{fontFamily:'var(--mono)',fontSize:'clamp(28px,5vw,56px)',fontWeight:500,letterSpacing:'-2px',lineHeight:1,marginBottom:'16px'}}>
            <span style={{color:'var(--neon)'}}>{'>'}</span>./about
            <span style={{display:'inline-block',width:'6px',height:'clamp(24px,4.5vw,50px)',background:'var(--neon)',verticalAlign:'middle',marginLeft:'3px',animation:'blink 1s step-end infinite',borderRadius:'1px'}}/>
          </h1>
          <p style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-secondary)'}}>
            <span style={{color:'#1A3A2A',marginRight:'8px'}}>//</span>Le projet · La mission · Les valeurs
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section style={{padding:'60px 24px',position:'relative',zIndex:1,borderBottom:'0.5px solid var(--border)'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'16px'}}>//  01 · MISSION</div>
          <h2 style={{fontSize:'clamp(22px,3vw,32px)',fontWeight:600,color:'var(--text-primary)',lineHeight:1.2,marginBottom:'24px'}}>
            La finance décryptée par la data — pour tout le monde
          </h2>
          <p style={{fontSize:'15px',color:'var(--text-secondary)',lineHeight:1.9,marginBottom:'20px'}}>
            Grapheko est né d'un constat simple : la finance est partout dans nos vies, mais les ressources pour la comprendre vraiment — avec des données, sans bullshit — sont rares en France.
          </p>
          <p style={{fontSize:'15px',color:'var(--text-secondary)',lineHeight:1.9,marginBottom:'20px'}}>
            Les médias financiers traditionnels parlent aux initiés. Les réseaux sociaux regorgent de "gurus" qui promettent monts et merveilles. Entre les deux, il manquait un média éducatif rigoureux, accessible, et ancré dans la data.
          </p>
          <p style={{fontSize:'15px',color:'var(--text-secondary)',lineHeight:1.9}}>
            <span style={{color:'var(--neon)',fontWeight:500}}>Grapheko, c'est ce média.</span> Des analyses basées sur des données réelles, des guides construits pour les débutants, et un regard analytique sur l'économie, la finance et la crypto — sans langue de bois.
          </p>
        </div>
      </section>

      {/* VALEURS */}
      <section style={{padding:'60px 24px',position:'relative',zIndex:1,borderBottom:'0.5px solid var(--border)'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'40px'}}>//  02 · VALEURS</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'16px'}}>
            {[
              {num:'[01]',title:'Data avant tout',desc:'Chaque affirmation est étayée par des données. Pas d\'opinion sans chiffre, pas de conclusion sans source.'},
              {num:'[02]',title:'Accessibilité radicale',desc:'Le jargon financier est une barrière artificielle. Grapheko traduit la complexité en clarté — sans sacrifier la rigueur.'},
              {num:'[03]',title:'Indépendance éditoriale',desc:'Aucun contenu n\'est influencé par des intérêts commerciaux. Quand un lien est affilié, c\'est clairement indiqué.'},
              {num:'[04]',title:'Transparence totale',desc:'Les sources sont citées, les limites reconnues, les erreurs corrigées publiquement. On assume ce qu\'on écrit.'},
              {num:'[05]',title:'Éducation long terme',desc:'L\'objectif n\'est pas de te donner du poisson. C\'est de t\'apprendre à pêcher — financièrement parlant.'},
              {num:'[06]',title:'Communauté d\'abord',desc:'Grapheko grandit avec ses lecteurs. Chaque retour, question et suggestion façonne le média.'},
            ].map(v=>(
              <div key={v.num} style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'24px'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--neon)',marginBottom:'12px'}}>{v.num}</div>
                <div style={{fontSize:'15px',fontWeight:600,color:'var(--text-primary)',marginBottom:'10px'}}>{v.title}</div>
                <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.7}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHIFFRES */}
      <section style={{padding:'60px 24px',position:'relative',zIndex:1,borderBottom:'0.5px solid var(--border)'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'40px'}}>//  03 · GRAPHEKO EN CHIFFRES</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'16px'}}>
            {[
              {val:'5',label:'Articles publiés',color:'var(--neon)'},
              {val:'847',label:'Abonnés newsletter',color:'var(--neon)'},
              {val:'3',label:'Domaines réservés',color:'var(--yellow)'},
              {val:'100%',label:'Indépendant',color:'var(--blue)'},
              {val:'0€',label:'Contenu gratuit',color:'var(--neon)'},
              {val:'2026',label:'Année de lancement',color:'var(--yellow)'},
            ].map(s=>(
              <div key={s.label} style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'20px',textAlign:'center'}}>
                <div style={{fontFamily:'var(--mono)',fontSize:'28px',fontWeight:500,color:s.color,lineHeight:1,marginBottom:'8px'}}>{s.val}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',letterSpacing:'.05em'}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section style={{padding:'60px 24px',position:'relative',zIndex:1,borderBottom:'0.5px solid var(--border)'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'24px'}}>//  04 · STACK TECHNIQUE</div>
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',overflow:'hidden'}}>
            {[
              {key:'Framework',val:'Next.js 15 — React SSR',color:'var(--neon)'},
              {key:'Hébergement',val:'Vercel — CDN mondial',color:'var(--blue)'},
              {key:'Domaines',val:'grapheko.fr · .com · .org via Gandi',color:'var(--yellow)'},
              {key:'Analytics',val:'Google Analytics 4 + GTM',color:'var(--neon)'},
              {key:'Newsletter',val:'En cours d\'intégration',color:'var(--text-secondary)'},
              {key:'CMS',val:'Notion API — à venir',color:'var(--text-secondary)'},
            ].map((item,i)=>(
              <div key={item.key} style={{display:'flex',gap:'16px',padding:'14px 20px',borderBottom:i<5?'0.5px solid var(--border)':'none',alignItems:'center',flexWrap:'wrap'}}>
                <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',minWidth:'140px'}}>{item.key}</span>
                <span style={{fontFamily:'var(--mono)',fontSize:'12px',color:item.color}}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'60px 24px 80px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'800px',margin:'0 auto',textAlign:'center'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'20px'}}>//  REJOINS L'AVENTURE</div>
          <h2 style={{fontSize:'clamp(20px,3vw,32px)',fontWeight:600,color:'var(--text-primary)',marginBottom:'16px',lineHeight:1.3}}>
            Grapheko grandit chaque jour.<br/>Sois parmi les premiers.
          </h2>
          <p style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:'32px'}}>
            Rejoins la newsletter hebdo, suis les analyses sur les réseaux, ou contacte-nous pour une collaboration.
          </p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/newsletter" className="btn-primary">./s_abonner →</Link>
            <Link href="/contact" className="btn-secondary">./nous_contacter</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'0.5px solid var(--border)',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',position:'relative',zIndex:1}}>
        <Link href="/" style={{fontFamily:'var(--mono)',fontSize:'14px',color:'var(--text-primary)',textDecoration:'none'}}>
          {'>'} graph<span style={{color:'var(--neon)'}}>eko</span>_
        </Link>
        <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
          {[['./blog','/blog'],['./ressources','/ressources'],['./newsletter','/newsletter'],['./contact','/contact']].map(([l,h])=>(
            <Link key={h} href={h} style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#333',textDecoration:'none'}}>{l}</Link>
          ))}
        </div>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>
          © 2026 <span style={{color:'var(--neon)'}}>grapheko</span>
        </span>
      </footer>

      <style jsx global>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 768px) { nav { padding: 0 48px !important; } section { padding-left: 48px !important; padding-right: 48px !important; } footer { padding: 32px 48px !important; } }
      `}</style>
    </>
  )
}

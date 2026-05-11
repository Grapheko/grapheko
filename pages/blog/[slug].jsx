import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { initTimeOnPage, trackArticleClick, gEvent } from '../../lib/gtm'

const ARTICLES = {
  'bourse-debutant-2026': {
    title: 'Bourse pour débutant : par où commencer en 2026',
    description: 'Tout ce qu\'il faut savoir pour commencer à investir intelligemment en 2026 — sans jargon, avec les données.',
    cat: 'finance', readTime: '13 min', date: '10 mai 2026',
    content: [
      { type: 'intro', text: 'Tu veux investir en bourse mais tu ne sais pas par où commencer ? Tu as peur de perdre de l\'argent, tu ne comprends pas le jargon, et tu ne sais pas si c\'est vraiment fait pour toi ? Ce guide est fait exactement pour toi.' },
      { type: 'h2', text: 'Pourquoi investir en bourse en 2026 ?' },
      { type: 'p', text: 'Commençons par un constat difficile : garder ton argent sur un livret A t\'appauvrit en termes réels. Le Livret A rapporte 2.40% en 2026, l\'inflation tourne autour de 2.0% — soit un rendement réel de seulement +0.40%.' },
      { type: 'quote', text: 'La bourse ne garantit pas un rendement. Mais sur le long terme, c\'est le seul placement qui bat structurellement l\'inflation. Le CAC 40 affiche une moyenne de +8.5%/an sur 20 ans.' },
      { type: 'h2', text: 'Les concepts de base' },
      { type: 'h3', text: '// Action — tu deviens propriétaire' },
      { type: 'p', text: 'Acheter une action, c\'est acheter une toute petite part d\'une entreprise. Si l\'entreprise fait des bénéfices, ton action prend de la valeur.' },
      { type: 'h3', text: '// ETF — investir dans un indice entier' },
      { type: 'p', text: 'Un ETF te permet d\'acheter tout un indice en une seule transaction. Tu achètes un ETF S&P 500, tu détiens une fraction des 500 plus grandes entreprises américaines.' },
      { type: 'h2', text: 'Les 5 erreurs à éviter' },
      { type: 'h3', text: '// Erreur #1 — Timer le marché' },
      { type: 'p', text: 'Personne ne sait quand le marché va monter ou baisser. Entre 2000 et 2020, rater les 10 meilleures journées du S&P 500 aurait réduit ton rendement de 9.4% à 5.2%.' },
      { type: 'h3', text: '// Erreur #2 — Vendre en panique' },
      { type: 'p', text: 'Le krach Covid de mars 2020 a fait chuter les marchés de -34%... avant un rebond de +80% en 5 mois. Les investisseurs qui ont vendu ont manqué cette opportunité.' },
      { type: 'h2', text: 'Par où commencer' },
      { type: 'h3', text: '// Étape 1 : Ouvrir un PEA' },
      { type: 'p', text: 'Le PEA offre une exonération d\'impôt après 5 ans — 17.2% au lieu de 30%. Ouvre-le aujourd\'hui, même avec 1 €.' },
      { type: 'h3', text: '// Étape 2 : Choisir un courtier' },
      { type: 'p', text: 'Pour débuter en 2026, Trade Republic est notre recommandation — 1€ par ordre, PEA disponible, interface mobile excellente.' },
      { type: 'quote', text: 'Notre portefeuille débutant 2026 : 70% ETF MSCI World + 20% ETF S&P 500 + 10% obligations. TER moyen : 0.11%/an.' },
      { type: 'h2', text: 'Conclusion' },
      { type: 'p', text: 'La bourse n\'est pas réservée aux experts. Elle est réservée aux patients. Ouvre un PEA, choisis 2-3 ETF, investis chaque mois, ne touche à rien pendant 10 ans.' },
    ]
  },
  'bitcoin-metriques-onchain': {
    title: 'Bitcoin : les 5 métriques on-chain à surveiller',
    description: 'MVRV, SOPR, Puell Multiple — les indicateurs que les pros scrutent et que le grand public ignore.',
    cat: 'crypto', readTime: '10 min', date: '8 mai 2026',
    content: [
      { type: 'intro', text: 'Le prix du Bitcoin ne te dit pas si c\'est le bon moment d\'acheter ou de vendre. Pour ça, il existe les métriques on-chain — des données extraites directement de la blockchain.' },
      { type: 'h2', text: 'Qu\'est-ce qu\'une métrique on-chain ?' },
      { type: 'p', text: 'La blockchain Bitcoin est un registre public. Chaque transaction est enregistrée de façon permanente et consultable. Les métriques on-chain analysent ces données brutes pour en extraire des signaux.' },
      { type: 'h2', text: 'Métrique #1 : Le MVRV Ratio' },
      { type: 'p', text: 'MVRV = Market Value / Realized Value. Il mesure si le marché est en profit ou en perte par rapport à son coût d\'achat moyen.' },
      { type: 'quote', text: 'Signal actuel : MVRV entre 2.1 et 2.8 — zone de prudence. Les tops historiques se produisent avec MVRV > 3.5.' },
      { type: 'h2', text: 'Métrique #2 : Le SOPR' },
      { type: 'p', text: 'Le SOPR mesure si les bitcoins vendus aujourd\'hui le sont en profit ou en perte. En marché haussier, le niveau 1 est un support solide.' },
      { type: 'h2', text: 'Métrique #3 : Le Puell Multiple' },
      { type: 'p', text: 'Mesure la santé financière des mineurs. Un Puell Multiple < 0.5 a historiquement correspondu aux meilleurs points d\'entrée.' },
      { type: 'h2', text: 'Métrique #4 : Les HODL Waves' },
      { type: 'p', text: 'Segmente les bitcoins par âge. Quand les BTC récents (< 3 mois) augmentent rapidement, c\'est souvent un signe d\'euphorie retail.' },
      { type: 'h2', text: 'Métrique #5 : L\'Exchange Reserve' },
      { type: 'p', text: 'Les réserves sur les exchanges sont en baisse structurelle depuis 2020 — signal haussier car les détenteurs ne veulent pas vendre.' },
      { type: 'quote', text: 'Outils gratuits : Glassnode, LookIntoBitcoin, CryptoQuant, Bitcoin Magazine Pro.' },
    ]
  },
  'ethereum-2026': {
    title: 'Ethereum : tout comprendre avant d\'investir en 2026',
    description: 'Smart contracts, staking, Layer 2 — ce qui différencie fondamentalement l\'ETH du Bitcoin.',
    cat: 'crypto', readTime: '11 min', date: '6 mai 2026',
    content: [
      { type: 'intro', text: 'Bitcoin c\'est l\'or numérique. Ethereum, c\'est autre chose — une plateforme mondiale décentralisée sur laquelle on peut construire des applications.' },
      { type: 'h2', text: 'Ethereum vs Bitcoin' },
      { type: 'p', text: 'Bitcoin a été créé pour être une réserve de valeur. Ethereum, créé en 2015 par Vitalik Buterin, est un ordinateur mondial décentralisé. Ils répondent à des besoins différents.' },
      { type: 'quote', text: 'Bitcoin est une monnaie numérique. Ethereum est une plateforme de calcul décentralisé. Ils ne sont pas en compétition.' },
      { type: 'h2', text: 'Les smart contracts' },
      { type: 'p', text: 'Un smart contract s\'exécute automatiquement quand des conditions sont remplies. Pas d\'intermédiaire — le code est la loi.' },
      { type: 'h2', text: 'The Merge — la révolution de 2022' },
      { type: 'p', text: 'En 2022, Ethereum a basculé au Proof of Stake : consommation énergétique réduite de 99.95%, et modèle potentiellement déflationniste.' },
      { type: 'h2', text: 'Le staking' },
      { type: 'p', text: 'Tu peux staker ton ETH pour 3 à 5% de rendement annuel via Lido (sans minimum requis). C\'est une caractéristique unique que Bitcoin n\'a pas.' },
      { type: 'h2', text: 'Les risques' },
      { type: 'p', text: 'Concurrence des autres blockchains, volatilité élevée (drawdowns de 70-90% lors des bear markets), complexité réglementaire.' },
      { type: 'quote', text: 'Allocation recommandée pour débuter : 60% Bitcoin + 30% Ethereum. Commence par BTC avant d\'ajouter ETH.' },
    ]
  },
  'pea-cto-assurance-vie': {
    title: 'PEA, CTO ou Assurance-vie : quelle enveloppe choisir ?',
    description: 'Comparatif fiscal complet avec simulations chiffrées pour optimiser ta stratégie d\'investissement.',
    cat: 'finance', readTime: '11 min', date: '4 mai 2026',
    content: [
      { type: 'intro', text: 'PEA, CTO ou assurance-vie ? Ces trois enveloppes coexistent dans la fiscalité française, chacune avec ses avantages et ses contraintes.' },
      { type: 'h2', text: 'Le PEA — l\'arme fiscale' },
      { type: 'p', text: 'Après 5 ans, les plus-values sont exonérées d\'IR. Tu ne paies que 17.2% de prélèvements sociaux au lieu de 30%. Sur 100 000 € de gains, c\'est 12 800 € d\'économie.' },
      { type: 'quote', text: 'Règle d\'or : ouvre ton PEA AUJOURD\'HUI même avec 1 €. L\'horloge fiscale des 5 ans commence dès l\'ouverture.' },
      { type: 'h2', text: 'Le CTO — la liberté totale' },
      { type: 'p', text: 'Aucune contrainte : pas de plafond, accès à tous les marchés mondiaux, retraits libres. Fiscalité : 30% flat tax. Les moins-values sont déductibles sur 10 ans.' },
      { type: 'h2', text: 'L\'assurance-vie' },
      { type: 'p', text: 'Son vrai atout : la transmission. Jusqu\'à 152 500 € transmis par bénéficiaire sans droits de succession. Abattement de 4 600 €/an après 8 ans.' },
      { type: 'h2', text: 'La stratégie optimale' },
      { type: 'h3', text: '// Tu commences' },
      { type: 'p', text: 'Priorité : ouvre un PEA avec des ETF World éligibles. C\'est tout.' },
      { type: 'h3', text: '// Patrimoine avancé (>150k€)' },
      { type: 'p', text: 'PEA maxé + CTO pour les marchés mondiaux + assurance-vie pour la transmission. Meilleurs contrats : Linxea Spirit 2, Lucya Cardif.' },
      { type: 'quote', text: 'Les 5 erreurs à éviter : ne pas ouvrir son PEA, retirer avant 5 ans, AV avec frais d\'entrée, ignorer les frais, oublier les bénéficiaires.' },
    ]
  },
  'etf-debutant': {
    title: 'Comment investir en ETF quand on débute',
    description: 'ETF, TER, PEA, DCA — le guide complet pour investir passivement et battre 80% des gérants.',
    cat: 'finance', readTime: '12 min', date: '2 mai 2026',
    content: [
      { type: 'intro', text: 'Tu as entendu parler des ETF partout. Mais concrètement, qu\'est-ce que c\'est et comment commencer sans se tromper ?' },
      { type: 'h2', text: 'Qu\'est-ce qu\'un ETF ?' },
      { type: 'p', text: 'Un ETF est un panier de titres financiers que tu achètes comme une action. Un ETF S&P 500 = une fraction des 500 plus grandes entreprises américaines en une transaction.' },
      { type: 'quote', text: 'Le chiffre clé : 83% des fonds actifs français sous-performent leur indice sur 10 ans. Source : S&P Global.' },
      { type: 'h2', text: 'Les 5 critères de sélection' },
      { type: 'h3', text: '// TER — les frais annuels' },
      { type: 'p', text: 'Sur 30 ans, un ETF à 0.07% te laisse 74 872 €. Un fonds actif à 2.50% te laisse 47 349 €. Soit 27 523 € de différence uniquement due aux frais.' },
      { type: 'h3', text: '// Éligibilité PEA' },
      { type: 'p', text: 'En France, l\'éligibilité PEA réduit ta fiscalité de 30% à 17.2% après 5 ans. C\'est le critère numéro 2 après les frais.' },
      { type: 'h2', text: 'Les meilleurs ETF 2026' },
      { type: 'p', text: 'Amundi MSCI World (LU1681043599, TER 0.12%, PEA ✅) et Amundi S&P 500 (LU1681048804, TER 0.07%, PEA ✅) sont les deux références pour débuter.' },
      { type: 'h2', text: 'La stratégie DCA' },
      { type: 'p', text: 'Investis un montant fixe chaque mois, peu importe le cours. Tu achètes plus quand c\'est bas, moins quand c\'est haut. Sur le long terme, c\'est optimal.' },
      { type: 'quote', text: 'Notre recommandation : 70% MSCI World + 20% S&P 500 + 10% obligations. TER moyen 0.11%/an. Versements mensuels automatiques.' },
    ]
  },
}

const CAT_STYLES = {
  finance: { bg: '#001A0D', color: '#00FF88' },
  crypto: { bg: '#1A1500', color: '#FFE44D' },
  data: { bg: '#001020', color: '#00C2FF' },
  alerte: { bg: '#1A0000', color: '#FF4D4D' },
}

export default function ArticlePage({ slug, article }) {
  useEffect(() => {
    const cleanTime = initTimeOnPage(`blog_${slug}`)
    gEvent('article_view', { article_title: article?.title, article_category: article?.cat })
    return () => cleanTime?.()
  }, [slug, article])

  if (!article) {
    return (
      <>
        <Head><title>Article introuvable — Grapheko</title></Head>
        <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',position:'relative',zIndex:1,padding:'48px'}}>
          <div style={{fontSize:'11px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'16px'}}>// ERROR_404</div>
          <div style={{fontSize:'clamp(32px,6vw,64px)',fontWeight:500,color:'var(--text-primary)',letterSpacing:'-2px',marginBottom:'16px'}}>Article introuvable</div>
          <p style={{fontSize:'14px',color:'var(--text-secondary)',marginBottom:'32px'}}>Cet article n'existe pas encore ou a été déplacé.</p>
          <Link href="/blog" style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--void)',background:'var(--neon)',padding:'12px 28px',borderRadius:'4px',textDecoration:'none'}}>./retour_au_blog</Link>
        </div>
      </>
    )
  }

  const catStyle = CAT_STYLES[article.cat] || CAT_STYLES.finance

  return (
    <>
      <Head>
        <title>{article.title} — Grapheko</title>
        <meta name="description" content={article.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://grapheko.fr/blog/${slug}`} />
        <meta property="og:title" content={`${article.title} — Grapheko`} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
      </Head>

      {/* BREADCRUMB */}
      <div style={{padding:'80px 24px 0',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
            <Link href="/" style={{color:'var(--text-secondary)',textDecoration:'none'}}>grapheko</Link>
            <span style={{color:'var(--border2)'}}>/</span>
            <Link href="/blog" style={{color:'var(--text-secondary)',textDecoration:'none'}}>blog</Link>
            <span style={{color:'var(--border2)'}}>/</span>
            <span style={{color:'var(--neon)'}}>{slug}</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header style={{padding:'32px 24px 40px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',padding:'clamp(24px,4vw,40px)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,136,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.015) 1px,transparent 1px)',backgroundSize:'32px 32px',pointerEvents:'none'}}/>
            <div style={{position:'relative'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px',flexWrap:'wrap'}}>
                <span style={{...catStyle,fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.1em',padding:'4px 10px',borderRadius:'3px'}}>[{article.cat}]</span>
                <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)'}}>{article.readTime} read</span>
                <span style={{color:'var(--border2)'}}>·</span>
                <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)'}}>{article.date}</span>
              </div>
              <h1 style={{fontSize:'clamp(20px,3.5vw,32px)',fontWeight:600,color:'var(--text-primary)',lineHeight:1.25,marginBottom:'16px',letterSpacing:'-.3px'}}>{article.title}</h1>
              <p style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:1.7}}>{article.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main style={{padding:'0 24px 80px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border2)',borderRadius:'6px',padding:'10px 14px',marginBottom:'32px',fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',lineHeight:1.6}}>
            <span style={{color:'#1A3A2A'}}>//</span> Cet article est informatif et ne constitue pas un conseil en investissement. Investir comporte des risques de perte en capital.
          </div>

          {article.content.map((block, i) => {
            switch(block.type) {
              case 'intro': return <p key={i} style={{fontSize:'16px',color:'var(--text-primary)',lineHeight:1.9,marginBottom:'32px'}}>{block.text}</p>
              case 'h2': return <h2 key={i} style={{fontSize:'clamp(18px,2.5vw,22px)',fontWeight:600,color:'var(--text-primary)',marginTop:'40px',marginBottom:'16px',paddingTop:'32px',borderTop:'0.5px solid var(--border)'}}>{block.text}</h2>
              case 'h3': return <h3 key={i} style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--neon)',letterSpacing:'.05em',margin:'24px 0 10px'}}>{block.text}</h3>
              case 'p': return <p key={i} style={{fontSize:'15px',color:'var(--text-secondary)',lineHeight:1.85,marginBottom:'16px'}}>{block.text}</p>
              case 'quote': return (
                <div key={i} style={{borderLeft:'2px solid var(--neon)',padding:'14px 20px',margin:'28px 0',background:'rgba(0,255,136,.04)',borderRadius:'0 6px 6px 0'}}>
                  <p style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.7,margin:0}}>{block.text}</p>
                </div>
              )
              default: return null
            }
          })}

          <div style={{marginTop:'48px',paddingTop:'24px',borderTop:'0.5px solid var(--border)',fontFamily:'var(--mono)',fontSize:'11px',color:'#333',lineHeight:1.7}}>
            <div style={{marginBottom:'4px',color:'var(--neon)'}}>// DISCLAIMER</div>
            Grapheko · contact@grapheko.fr · {article.date} · Cet article est informatif et ne constitue pas un conseil en investissement.
          </div>
        </div>
      </main>

      {/* AUTRES ARTICLES */}
      <section style={{padding:'0 24px 80px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <div className="section-label">AUTRES ARTICLES</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'12px'}}>
            {Object.entries(ARTICLES).filter(([s])=>s!==slug).slice(0,3).map(([s,a])=>(
              <Link key={s} href={`/blog/${s}`} onClick={()=>trackArticleClick(a.title,a.cat)}
                style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'20px',textDecoration:'none',display:'block'}}>
                <span style={{...CAT_STYLES[a.cat],fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.1em',padding:'3px 8px',borderRadius:'3px',display:'inline-block',marginBottom:'10px'}}>[{a.cat}]</span>
                <div style={{fontSize:'14px',fontWeight:500,color:'var(--text-primary)',lineHeight:1.4,marginBottom:'8px'}}>{a.title}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'#333'}}>{a.readTime} · {a.date}</div>
              </Link>
            ))}
          </div>
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
          main { padding-left: 48px !important; padding-right: 48px !important; }
          header { padding-left: 48px !important; padding-right: 48px !important; }
          section { padding-left: 48px !important; padding-right: 48px !important; }
          footer { padding: 32px 48px !important; }
        }
      `}</style>
    </>
  )
}

export async function getStaticPaths() {
  const paths = Object.keys(ARTICLES).map(slug => ({ params: { slug } }))
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const article = ARTICLES[params.slug] || null
  return { props: { slug: params.slug, article } }
}

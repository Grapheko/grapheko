import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'
import { initScrollDepth, initTimeOnPage, gEvent } from '../../lib/gtm'

// ── Base de données des articles ──────────────────────────────────
const ARTICLES = {
  'bourse-debutant-2026': {
    title: 'Bourse pour débutant : par où commencer en 2026',
    description: 'Tout ce qu\'il faut savoir pour commencer à investir intelligemment en 2026 — sans jargon, avec les données.',
    cat: 'finance',
    readTime: '13 min',
    date: '10 mai 2026',
    content: [
      { type: 'intro', text: 'Tu veux investir en bourse mais tu ne sais pas par où commencer ? Tu as peur de perdre de l\'argent, tu ne comprends pas le jargon, et tu ne sais pas si c\'est vraiment fait pour toi ? Ce guide est fait exactement pour toi.' },
      { type: 'h2', text: 'Pourquoi investir en bourse en 2026 ?' },
      { type: 'p', text: 'Commençons par un constat difficile : garder ton argent sur un livret A t\'appauvrit en termes réels. Le Livret A rapporte 2.40% en 2026, l\'inflation tourne autour de 2.0% — soit un rendement réel de seulement +0.40%. Sur un compte courant, tu perds réellement du pouvoir d\'achat.' },
      { type: 'quote', text: 'La bourse ne garantit pas un rendement. Mais sur le long terme, c\'est le seul placement qui bat structurellement l\'inflation avec un rendement significatif. Le CAC 40 affiche une moyenne de +8.5%/an sur 20 ans.' },
      { type: 'h2', text: 'Les concepts de base à maîtriser' },
      { type: 'h3', text: '// Action — tu deviens propriétaire' },
      { type: 'p', text: 'Acheter une action, c\'est acheter une toute petite part d\'une entreprise. Si l\'entreprise fait des bénéfices et se développe, ton action prend de la valeur. Si elle distribue des dividendes, tu en reçois une part proportionnelle.' },
      { type: 'h3', text: '// ETF — investir dans un indice entier' },
      { type: 'p', text: 'Un ETF (Exchange-Traded Fund) te permet d\'acheter tout un indice en une seule transaction. Tu achètes un ETF S&P 500, tu détiens une fraction des 500 plus grandes entreprises américaines. C\'est l\'outil idéal pour débuter.' },
      { type: 'h2', text: 'Les 5 erreurs que font 90% des débutants' },
      { type: 'h3', text: '// Erreur #1 — Essayer de timer le marché' },
      { type: 'p', text: '« J\'attendrai que ça baisse pour acheter. » C\'est l\'erreur numéro 1. Personne — pas même les meilleurs gérants professionnels — ne sait quand le marché va monter ou baisser. Entre 2000 et 2020, rater les 10 meilleures journées du S&P 500 aurait réduit ton rendement annualisé de 9.4% à 5.2%.' },
      { type: 'h3', text: '// Erreur #2 — Vendre en panique lors des krachs' },
      { type: 'p', text: 'Les marchés baissent. C\'est certain et inévitable. Le krach Covid de mars 2020 a fait chuter les marchés de -34%... avant un rebond de +80% en seulement 5 mois. Les investisseurs qui ont vendu en panique ont manqué cette opportunité.' },
      { type: 'h2', text: 'Par où commencer concrètement' },
      { type: 'h3', text: '// Étape 1 : Ouvrir un PEA' },
      { type: 'p', text: 'Le Plan d\'Épargne en Actions offre une exonération d\'impôt sur les plus-values après 5 ans — seulement 17.2% de prélèvements sociaux vs 30% de flat tax. Ouvre-le aujourd\'hui, même avec 1 €. L\'horloge fiscale commence dès l\'ouverture.' },
      { type: 'h3', text: '// Étape 2 : Choisir un courtier' },
      { type: 'p', text: 'Pour débuter en 2026, Trade Republic est notre recommandation — 1€ fixe par ordre, PEA disponible, interface mobile excellente. Boursorama est aussi une très bonne option si tu veux tout centraliser dans une seule banque.' },
      { type: 'h3', text: '// Étape 3 : Investir en DCA' },
      { type: 'p', text: 'Le DCA (Dollar Cost Averaging) consiste à investir un montant fixe chaque mois, peu importe le niveau du marché. C\'est la stratégie la plus simple et la plus efficace pour un débutant — elle élimine le stress du timing.' },
      { type: 'quote', text: 'Le portefeuille débutant Grapheko 2026 : 70% ETF MSCI World (Amundi, TER 0.12%) + 20% ETF S&P 500 (Amundi, TER 0.07%) + 10% ETF obligations. TER moyen total : 0.11%/an.' },
      { type: 'h2', text: 'Conclusion' },
      { type: 'p', text: 'La bourse n\'est pas réservée aux riches ni aux experts. Elle est réservée aux patients. Ouvre un PEA aujourd\'hui, choisis 2-3 ETF diversifiés, investis régulièrement chaque mois, et ne touche à rien pendant 10 ans minimum.' },
    ]
  },
  'bitcoin-metriques-onchain': {
    title: 'Bitcoin : les 5 métriques on-chain à surveiller',
    description: 'MVRV, SOPR, Puell Multiple — les indicateurs que les pros scrutent et que le grand public ignore.',
    cat: 'crypto',
    readTime: '10 min',
    date: '8 mai 2026',
    content: [
      { type: 'intro', text: 'Le prix du Bitcoin affiché sur ton écran ne te dit qu\'une chose : combien coûte un bitcoin en ce moment. Il ne te dit pas si c\'est le bon moment d\'acheter, de vendre, ou d\'attendre. Pour ça, il existe les métriques on-chain.' },
      { type: 'h2', text: 'Qu\'est-ce qu\'une métrique on-chain ?' },
      { type: 'p', text: 'La blockchain Bitcoin est un registre public. Chaque transaction, chaque mouvement de bitcoin, chaque wallet actif est enregistré de façon permanente et consultable par n\'importe qui. Les métriques on-chain analysent ces données brutes pour en extraire des signaux.' },
      { type: 'h2', text: 'Métrique #1 : Le MVRV Ratio' },
      { type: 'h3', text: '// Définition' },
      { type: 'p', text: 'MVRV = Market Value / Realized Value. La Market Value c\'est la capitalisation boursière actuelle. La Realized Value c\'est la valeur agrégée de chaque bitcoin au prix auquel il a été déplacé pour la dernière fois — autrement dit, le coût moyen d\'achat du marché.' },
      { type: 'quote', text: 'Signal actuel : MVRV entre 2.1 et 2.8 — zone de prudence. Historiquement, les tops de cycle se produisent avec un MVRV > 3.5. Nous n\'y sommes pas encore.' },
      { type: 'h2', text: 'Métrique #2 : Le SOPR' },
      { type: 'p', text: 'Le SOPR mesure si les bitcoins qui bougent aujourd\'hui sont vendus en profit ou en perte. Un SOPR > 1 signifie que les vendeurs réalisent des profits. En marché haussier, le SOPR teste régulièrement 1 par le bas avant de rebondir — tant que 1 est un support, la tendance haussière est intacte.' },
      { type: 'h2', text: 'Métrique #3 : Le Puell Multiple' },
      { type: 'p', text: 'Le Puell Multiple mesure la santé financière des mineurs. Quand ils sont sous pression, ils vendent plus — ce qui crée une pression baissière. Quand ils sont profitables, ils accumulent. Un Puell Multiple < 0.5 a historiquement correspondu aux meilleurs points d\'entrée.' },
      { type: 'h2', text: 'Métrique #4 : Les HODL Waves' },
      { type: 'p', text: 'Cette métrique segmente tous les bitcoins par âge — depuis combien de temps ils n\'ont pas bougé. Quand la part des BTC âgés de moins de 3 mois augmente rapidement, c\'est souvent synonyme d\'euphorie retail et de pic de cycle.' },
      { type: 'h2', text: 'Métrique #5 : L\'Exchange Reserve' },
      { type: 'p', text: 'Depuis 2020, les réserves sur les exchanges sont en baisse structurelle — passant de 3.2 millions de BTC à moins de 2.3 millions. Cette tendance est haussière : les gens retirent leurs BTC vers des wallets personnels, signalant qu\'ils n\'ont pas l\'intention de vendre.' },
      { type: 'quote', text: 'Où trouver ces métriques gratuitement : Glassnode (gratuit limité), LookIntoBitcoin, CryptoQuant, Bitcoin Magazine Pro.' },
    ]
  },
  'ethereum-2026': {
    title: 'Ethereum : tout comprendre avant d\'investir en 2026',
    description: 'Smart contracts, staking, Layer 2 — ce qui différencie fondamentalement l\'ETH du Bitcoin.',
    cat: 'crypto',
    readTime: '11 min',
    date: '6 mai 2026',
    content: [
      { type: 'intro', text: 'Bitcoin c\'est l\'or numérique. Ethereum, c\'est autre chose — quelque chose de plus complexe, de plus ambitieux, et potentiellement de plus transformateur. En 2026, Ethereum reste la deuxième crypto-monnaie mondiale par capitalisation, mais c\'est surtout la première plateforme de contrats intelligents au monde.' },
      { type: 'h2', text: 'Ethereum vs Bitcoin — la distinction fondamentale' },
      { type: 'p', text: 'Bitcoin a été créé en 2009 avec un objectif précis : être une réserve de valeur numérique décentralisée. Ethereum, créé en 2015 par Vitalik Buterin, a un objectif radicalement différent : être un ordinateur mondial décentralisé sur lequel on peut construire des applications.' },
      { type: 'quote', text: 'Bitcoin est une monnaie numérique. Ethereum est une plateforme de calcul décentralisé. Ils ne sont pas en compétition — ils répondent à des besoins différents.' },
      { type: 'h2', text: 'Les smart contracts — le cœur du réacteur' },
      { type: 'p', text: 'Un smart contract est un programme informatique qui s\'exécute automatiquement sur la blockchain Ethereum quand certaines conditions sont remplies. Il n\'y a pas d\'intermédiaire — pas de banque, pas de notaire. Le code est la loi.' },
      { type: 'h2', text: 'The Merge — la révolution de 2022' },
      { type: 'p', text: 'En septembre 2022, Ethereum a basculé du Proof of Work au Proof of Stake. Résultat : consommation énergétique réduite de 99.95%, émission d\'ETH réduite de 90%, et grâce à l\'EIP-1559, Ethereum est devenu déflationniste lors des périodes d\'intense activité.' },
      { type: 'h2', text: 'Le staking — générer des revenus avec son ETH' },
      { type: 'p', text: 'En 2026, les détenteurs d\'ETH peuvent le staker pour participer à la validation du réseau et recevoir des récompenses de 3 à 5% par an. Via Lido (stETH), tu peux staker sans minimum requis et garder ta liquidité. C\'est une caractéristique unique que Bitcoin n\'a pas.' },
      { type: 'h2', text: 'Les risques spécifiques à Ethereum' },
      { type: 'p', text: 'La concurrence des blockchains alternatives (Solana, Avalanche), la complexité réglementaire, et surtout la volatilité inhérente au marché crypto. L\'ETH a historiquement des drawdowns de 70 à 90% lors des marchés baissiers. N\'investis que ce que tu peux te permettre de perdre.' },
      { type: 'quote', text: 'Allocation recommandée pour débuter : 60% Bitcoin + 30% Ethereum + 10% altcoins diversifiés (optionnel). Commence par BTC avant d\'ajouter ETH.' },
    ]
  },
  'pea-cto-assurance-vie': {
    title: 'PEA, CTO ou Assurance-vie : quelle enveloppe choisir ?',
    description: 'Comparatif fiscal complet avec simulations chiffrées pour optimiser ta stratégie d\'investissement.',
    cat: 'finance',
    readTime: '11 min',
    date: '4 mai 2026',
    content: [
      { type: 'intro', text: 'C\'est la question que tout investisseur français se pose au moins une fois : PEA, compte-titres ordinaire (CTO) ou assurance-vie ? Ces trois enveloppes coexistent dans la fiscalité française, chacune avec ses avantages, ses contraintes et ses cas d\'usage.' },
      { type: 'h2', text: 'Le PEA — l\'arme fiscale de l\'investisseur français' },
      { type: 'p', text: 'Après 5 ans de détention, les plus-values et dividendes générés dans le PEA sont exonérés d\'impôt sur le revenu. Tu ne paies que les prélèvements sociaux : 17.2% au lieu de 30% (flat tax standard). Sur 100 000 € de gains, c\'est 12 800 € d\'économie.' },
      { type: 'quote', text: 'Règle d\'or : ouvre ton PEA AUJOURD\'HUI, même avec 1 €. L\'horloge fiscale des 5 ans commence à tourner dès l\'ouverture — pas dès le premier versement.' },
      { type: 'h2', text: 'Le CTO — la liberté totale' },
      { type: 'p', text: 'Le Compte-Titres Ordinaire n\'a aucune contrainte : pas de plafond, pas de restriction géographique, accès à tous les marchés mondiaux. Les gains sont soumis à la flat tax de 30%. Son avantage caché : les moins-values sont déductibles des plus-values des 10 années suivantes.' },
      { type: 'h2', text: 'L\'assurance-vie — la reine de la transmission' },
      { type: 'p', text: 'Après 8 ans, tu bénéficies d\'un abattement annuel de 4 600 € (célibataire) ou 9 200 € (couple) sur les gains. Mais son vrai atout c\'est la transmission : jusqu\'à 152 500 € transmis par bénéficiaire sans droits de succession.' },
      { type: 'h2', text: 'La stratégie optimale — comment combiner les 3' },
      { type: 'h3', text: '// Tu commences à investir' },
      { type: 'p', text: 'Priorité absolue : ouvre un PEA immédiatement. Mets-y des ETF World éligibles. Laisse courir les 5 ans. Rien d\'autre n\'est nécessaire au départ.' },
      { type: 'h3', text: '// Patrimoine intermédiaire (50k–150k€)' },
      { type: 'p', text: '70% PEA avec ETF World + 30% CTO pour les actions mondiales non éligibles PEA (Amazon, Tesla...) ou les ETF thématiques.' },
      { type: 'h3', text: '// Patrimoine avancé (>150k€)' },
      { type: 'p', text: 'PEA maxé + CTO + Assurance-vie pour la transmission et la diversification fiscale. Les meilleurs contrats : Linxea Spirit 2 (0.50%/an) et Lucya Cardif (0.60%/an).' },
      { type: 'quote', text: 'Les 5 erreurs à éviter : ne pas ouvrir son PEA immédiatement, faire des retraits avant 5 ans, choisir une AV avec frais d\'entrée, ignorer le frottement des frais, ne pas désigner de bénéficiaires.' },
    ]
  },
  'etf-debutant': {
    title: 'Comment investir en ETF quand on débute',
    description: 'ETF, TER, PEA, DCA — le guide complet pour investir passivement et battre 80% des gérants.',
    cat: 'finance',
    readTime: '12 min',
    date: '2 mai 2026',
    content: [
      { type: 'intro', text: 'Tu as entendu parler des ETF partout — sur YouTube, sur Reddit, dans les podcasts finance. Mais concrètement, qu\'est-ce que c\'est ? Comment ça fonctionne ? Et surtout, comment commencer à investir dedans sans se tromper ?' },
      { type: 'h2', text: 'Qu\'est-ce qu\'un ETF exactement ?' },
      { type: 'p', text: 'Un ETF (Exchange-Traded Fund) est un panier de titres financiers que tu achètes et vends comme une action ordinaire en bourse. Au lieu d\'acheter une seule action Apple, tu achètes un ETF qui contient Apple, Microsoft, Amazon, Tesla et 497 autres entreprises en une seule transaction.' },
      { type: 'quote', text: 'Le chiffre clé : selon S&P Global, 83% des fonds actifs français sous-performent leur indice de référence sur 10 ans. Les ETF répliquent simplement l\'indice — ni plus, ni moins.' },
      { type: 'h2', text: 'Les 5 critères pour choisir un bon ETF' },
      { type: 'h3', text: '// Critère 1 : Les frais (TER)' },
      { type: 'p', text: 'C\'est le critère numéro 1. Sur 30 ans avec 10 000 € et 7% de rendement brut, un ETF à 0.07% te laisse 74 872 €. Un fonds actif à 2.50% te laisse seulement 47 349 €. La différence : 27 523 € uniquement due aux frais.' },
      { type: 'h3', text: '// Critère 2 : La taille du fonds' },
      { type: 'p', text: 'Un ETF avec moins de 100 millions d\'euros d\'encours risque d\'être liquidé. Vise toujours plus de 500 millions € pour un ETF cœur de portefeuille.' },
      { type: 'h3', text: '// Critère 3 : L\'éligibilité PEA' },
      { type: 'p', text: 'Si tu es résident français, l\'éligibilité PEA est cruciale pour la fiscalité. Après 5 ans, tes gains ne sont taxés qu\'à 17.2% au lieu de 30%.' },
      { type: 'h2', text: 'Les meilleurs ETF pour débuter en 2026' },
      { type: 'p', text: 'Pour le cœur du portefeuille : Amundi MSCI World UCITS ETF (ISIN: LU1681043599, TER: 0.12%, éligible PEA). Pour une exposition US : Amundi S&P 500 UCITS ETF (ISIN: LU1681048804, TER: 0.07%, éligible PEA).' },
      { type: 'h2', text: 'La stratégie DCA — investir sans se prendre la tête' },
      { type: 'p', text: 'Le DCA (Dollar Cost Averaging) : investis un montant fixe chaque mois, peu importe le cours. Tu achètes plus de parts quand c\'est bas, moins quand c\'est haut. Sur le long terme, ça lisse ton prix moyen d\'achat et élimine le stress du timing.' },
      { type: 'quote', text: 'Notre recommandation pour débuter : 70% ETF MSCI World + 20% ETF S&P 500 + 10% ETF obligations. TER moyen : 0.11%/an. Versements mensuels automatiques. Ne pas toucher pendant 10 ans.' },
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
    const cleanScroll = initScrollDepth(`blog_${slug}`)
    const cleanTime = initTimeOnPage(`blog_${slug}`)
    gEvent('article_view', { article_title: article?.title, article_category: article?.cat })
    return () => { cleanScroll?.(); cleanTime?.() }
  }, [slug, article])

  if (!article) {
    return (
      <>
        <Head><title>Article introuvable — Grapheko</title></Head>
        <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'var(--mono)',position:'relative',zIndex:1,padding:'48px'}}>
          <div style={{fontSize:'11px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'16px'}}>// ERROR_404</div>
          <div style={{fontSize:'clamp(32px,6vw,64px)',fontWeight:500,color:'var(--text-primary)',letterSpacing:'-2px',marginBottom:'16px'}}>
            Article introuvable
          </div>
          <p style={{fontSize:'14px',color:'var(--text-secondary)',marginBottom:'32px'}}>Cet article n'existe pas encore ou a été déplacé.</p>
          <Link href="/blog" style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--void)',background:'var(--neon)',padding:'12px 28px',borderRadius:'4px',textDecoration:'none'}}>
            ./retour_au_blog
          </Link>
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
        <meta property="og:url" content={`https://grapheko.fr/blog/${slug}`} />
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

      {/* ARTICLE HEADER */}
      <header style={{padding:'32px 24px 40px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'12px',padding:'clamp(24px,4vw,40px)',position:'relative',overflow:'hidden'}}>
            {/* Scanline */}
            <div style={{position:'absolute',top:'-100%',left:0,right:0,height:'80px',background:'linear-gradient(transparent,rgba(0,255,136,.04),transparent)',animation:'scanline 5s linear infinite',pointerEvents:'none'}}/>
            {/* Grid */}
            <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,136,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,.015) 1px,transparent 1px)',backgroundSize:'32px 32px',pointerEvents:'none'}}/>

            <div style={{position:'relative'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px',flexWrap:'wrap'}}>
                <span style={{...catStyle,fontFamily:'var(--mono)',fontSize:'10px',letterSpacing:'.1em',padding:'4px 10px',borderRadius:'3px'}}>[{article.cat}]</span>
                <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)'}}>{article.readTime} read</span>
                <span style={{color:'var(--border2)'}}>·</span>
                <span style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)'}}>{article.date}</span>
              </div>

              <h1 style={{fontSize:'clamp(20px,3.5vw,32px)',fontWeight:600,color:'var(--text-primary)',lineHeight:1.25,marginBottom:'20px',letterSpacing:'-.3px'}}>
                {article.title}
              </h1>

              <p style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:'20px'}}>
                {article.description}
              </p>

              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {['grapheko','finance','data','2026'].map(tag=>(
                  <span key={tag} style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--text-secondary)',border:'0.5px solid var(--border2)',padding:'2px 8px',borderRadius:'3px'}}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ARTICLE BODY */}
      <main style={{padding:'0 24px 80px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'760px',margin:'0 auto',display:'grid',gap:'0',gridTemplateColumns:'1fr'}}>
          <div className="article-body">
            {/* DISCLAIMER */}
            <div style={{background:'var(--surface)',border:'0.5px solid var(--border2)',borderRadius:'6px',padding:'10px 14px',marginBottom:'32px',fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',lineHeight:1.6}}>
              <span style={{color:'#1A3A2A'}}>//</span> Cet article est informatif et ne constitue pas un conseil en investissement. Investir comporte des risques de perte en capital.
            </div>

            {article.content.map((block, i) => {
              switch(block.type) {
                case 'intro':
                  return <p key={i} style={{fontSize:'16px',color:'var(--text-primary)',lineHeight:1.9,marginBottom:'32px',fontWeight:400}}>{block.text}</p>
                case 'h2':
                  return <h2 key={i} style={{fontSize:'clamp(18px,2.5vw,22px)',fontWeight:600,color:'var(--text-primary)',marginTop:'40px',marginBottom:'16px',paddingTop:'32px',borderTop:'0.5px solid var(--border)',letterSpacing:'-.2px'}}>{block.text}</h2>
                case 'h3':
                  return <h3 key={i} style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--neon)',letterSpacing:'.05em',margin:'24px 0 10px'}}>{block.text}</h3>
                case 'p':
                  return <p key={i} style={{fontSize:'15px',color:'var(--text-secondary)',lineHeight:1.85,marginBottom:'16px'}}>{block.text}</p>
                case 'quote':
                  return (
                    <div key={i} style={{borderLeft:'2px solid var(--neon)',padding:'14px 20px',margin:'28px 0',background:'rgba(0,255,136,.04)',borderRadius:'0 6px 6px 0'}}>
                      <p style={{fontFamily:'var(--mono)',fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.7,margin:0}}>{block.text}</p>
                    </div>
                  )
                default:
                  return null
              }
            })}

            {/* DISCLAIMER FOOTER */}
            <div style={{marginTop:'48px',paddingTop:'24px',borderTop:'0.5px solid var(--border)',fontFamily:'var(--mono)',fontSize:'11px',color:'#333',lineHeight:1.7}}>
              <div style={{marginBottom:'4px',color:'var(--neon)'}}>// DISCLAIMER</div>
              Grapheko · contact@grapheko.fr · {article.date} · Cet article est informatif et ne constitue pas un conseil en investissement. Investir comporte des risques de perte en capital. Les crypto-actifs sont des actifs très volatils.
            </div>
          </div>
        </div>
      </main>

      {/* ARTICLES SUIVANTS */}
      <section style={{padding:'0 24px 80px',position:'relative',zIndex:1}}>
        <div style={{maxWidth:'760px',margin:'0 auto'}}>
          <div className="section-label">AUTRES ARTICLES</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'12px'}}>
            {Object.entries(ARTICLES)
              .filter(([s]) => s !== slug)
              .slice(0, 3)
              .map(([s, a]) => (
                <Link key={s} href={`/blog/${s}`}
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
        <Link href="/" style={{fontFamily:'var(--mono)',fontSize:'14px',color:'var(--text-primary)',textDecoration:'none'}}>
          {'>'} graph<span style={{color:'var(--neon)'}}>eko</span>_
        </Link>
        <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
          {[['./blog','/blog'],['./ressources','/ressources'],['./newsletter','/newsletter'],['./contact','/contact']].map(([l,h])=>(
            <Link key={h} href={h} style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#333',textDecoration:'none'}}>{l}</Link>
          ))}
        </div>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>© 2026 <span style={{color:'var(--neon)'}}>grapheko</span></span>
      </footer>

      <style jsx global>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min(768px)) { nav { padding: 0 48px !important; } }
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

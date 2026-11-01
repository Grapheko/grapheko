// ══════════════════════════════════════════════════════════════
// Catalogue des quiz Grapheko. Une entrée = une page /quiz/<slug>.
//
// type 'profil'       : pas de bonne réponse, un profil en sortie (lib/content/quiz.js)
// type 'connaissances': une bonne réponse par question (index `ok`),
//                       une explication et un terme du glossaire lié.
// Chiffres réglementaires à jour au 1er novembre 2026.
// ══════════════════════════════════════════════════════════════
import { QUESTIONS as PROFIL_QUESTIONS } from './quiz'

export const QUIZZES = [
  {
    slug: 'profil-investisseur',
    type: 'profil',
    name: 'profil_investisseur',
    title: 'Quel investisseur es-tu ?',
    short: 'Profil investisseur',
    teaser: 'Ton horizon, ton épargne, ta réaction face à une baisse : un profil et les premières étapes adaptées.',
    seoTitle: 'Quiz : quel investisseur es-tu ?',
    seoDescription: 'Sept questions sur ton horizon, ton épargne et ta réaction face à une baisse pour savoir par où commencer. Gratuit, sans inscription.',
    lede: 'Sept questions, deux minutes. Le résultat ne te dit pas quoi acheter : il t’aide à savoir par où commencer, et ce qu’il faut vérifier avant.',
    minutes: 2,
    tone: 'var(--outremer)',
    count: PROFIL_QUESTIONS.length,
  },
  {
    slug: 'crypto',
    type: 'connaissances',
    name: 'crypto',
    title: 'Quiz crypto : connais-tu vraiment les bases ?',
    short: 'Crypto',
    teaser: 'Proof of Work, layer 2, phrase de récupération, fiscalité : dix questions pour vérifier ce que tu sais avant d’acheter.',
    seoTitle: 'Quiz crypto : 10 questions pour tester tes connaissances',
    seoDescription: 'Proof of Work, Proof of Stake, layer 2, wallets, fiscalité 2026 : teste tes connaissances crypto en 10 questions, avec la correction expliquée.',
    lede: 'Dix questions, trois minutes. Chaque réponse est corrigée et expliquée, avec un lien vers la définition complète.',
    minutes: 3,
    tone: '#D9D7FF',
    questions: [
      {
        id: 'consensus-btc',
        q: 'Quel mécanisme Bitcoin utilise-t-il pour valider les blocs ?',
        a: ['La preuve d’enjeu (Proof of Stake)', 'La preuve de travail (Proof of Work)', 'Un vote des plus gros détenteurs', 'Une validation par une banque centrale'],
        ok: 1,
        why: 'Les mineurs de Bitcoin dépensent de la puissance de calcul pour trouver chaque bloc. C’est ce coût qui rend la réécriture de l’historique hors de prix.',
        term: 'proof-of-work',
      },
      {
        id: 'ethereum-pos',
        q: 'Depuis septembre 2022, comment Ethereum valide-t-il ses blocs ?',
        a: ['Toujours par le minage', 'Par la preuve d’enjeu, avec des validateurs', 'Par une société centrale, la Fondation Ethereum', 'Il ne valide plus de blocs'],
        ok: 1,
        why: 'Avec « The Merge », le 15 septembre 2022, Ethereum est passé au Proof of Stake : des validateurs bloquent des ETH en garantie au lieu de miner.',
        term: 'proof-of-stake',
      },
      {
        id: 'layer-2',
        q: 'À quoi sert principalement une layer 2 comme Arbitrum ou le Lightning Network ?',
        a: ['À stocker ses cryptos hors ligne', 'À créer une blockchain totalement indépendante', 'À traiter plus de transactions, plus vite et moins cher, au-dessus d’une blockchain existante', 'À convertir ses cryptos en euros'],
        ok: 2,
        why: 'Une layer 2 exécute les transactions en dehors de la chaîne principale et y inscrit un résumé : on profite de sa sécurité sans en payer l’encombrement.',
        term: 'layer-2',
      },
      {
        id: 'offre-btc',
        q: 'Combien de bitcoins existeront au maximum ?',
        a: ['21 millions', '100 millions', '1 milliard', 'Il n’y a pas de limite'],
        ok: 0,
        why: 'Le protocole plafonne l’offre à 21 millions. Chaque bitcoin se divise en 100 millions de satoshis, ce qui permet d’en acheter pour quelques euros.',
        term: 'satoshi',
      },
      {
        id: 'halving',
        q: 'Que se passe-t-il lors d’un halving du bitcoin ?',
        a: ['Le prix du bitcoin est divisé par deux', 'La récompense versée aux mineurs pour chaque bloc est divisée par deux', 'La moitié des bitcoins est détruite', 'Les frais de transaction sont supprimés'],
        ok: 1,
        why: 'Tous les 210 000 blocs, environ tous les quatre ans, la création de nouveaux bitcoins ralentit de moitié. La récompense est de 3,125 BTC depuis avril 2024.',
        term: 'halving',
      },
      {
        id: 'seed',
        q: 'Qui peut te demander ta phrase de récupération (12 ou 24 mots) de façon légitime ?',
        a: ['Le support de ta plateforme d’échange', 'Le fabricant de ton wallet, pour une mise à jour', 'L’administration fiscale', 'Personne, jamais'],
        ok: 3,
        why: 'Quiconque connaît la phrase peut vider le portefeuille. Toute demande, quelle que soit la forme ou l’urgence invoquée, est une arnaque.',
        term: 'phrase-de-recuperation',
      },
      {
        id: 'cex',
        q: 'Sur une plateforme centralisée comme Coinbase ou Binance, qui détient les clés de tes cryptos ?',
        a: ['Toi seul', 'La plateforme', 'La Banque de France', 'Les mineurs'],
        ok: 1,
        why: 'Sur une plateforme centralisée, c’est l’entreprise qui garde les clés : tu dépends de sa solidité. La faillite de FTX en 2022 l’a rappelé.',
        term: 'cex',
      },
      {
        id: 'stablecoin',
        q: 'Que cherche à faire un stablecoin comme l’USDC ?',
        a: ['Garder une valeur stable, en général 1 dollar', 'Garantir un rendement fixe de 5 % par an', 'Suivre le cours du bitcoin', 'Remplacer l’euro en France'],
        ok: 0,
        why: 'Un stablecoin est adossé à une monnaie, le plus souvent le dollar, grâce à des réserves. Sa stabilité dépend de la qualité de ces réserves.',
        term: 'stablecoin',
      },
      {
        id: 'fiscalite-swap',
        q: 'En France, échanger du bitcoin contre de l’ether est-il imposable ?',
        a: ['Oui, à chaque échange', 'Non, seules les cessions contre des euros ou un bien sont imposables', 'Oui, au-delà de 1 000 € par an', 'Uniquement sur une plateforme étrangère'],
        ok: 1,
        why: 'Les échanges entre cryptos ne déclenchent pas d’impôt. L’imposition intervient à la cession contre des euros, ou contre un bien ou un service, au-delà de 305 € de cessions par an.',
        term: 'fiscalite-crypto',
      },
      {
        id: 'mica',
        q: 'Quel texte encadre les prestataires de cryptos dans l’Union européenne ?',
        a: ['Le RGPD', 'MiCA', 'Bâle III', 'La directive TVA'],
        ok: 1,
        why: 'Le règlement MiCA s’applique entièrement depuis le 30 décembre 2024. En France, l’AMF publie la liste des prestataires autorisés.',
        term: 'mica',
      },
    ],
  },
  {
    slug: 'bourse-debutant',
    type: 'connaissances',
    name: 'bourse_debutant',
    title: 'Quiz Bourse : les bases pour bien débuter',
    short: 'Bourse débutant',
    teaser: 'Actions, ETF, obligations, frais, PEA : dix questions sur ce qu’il faut savoir avant de passer son premier ordre.',
    seoTitle: 'Quiz Bourse débutant : 10 questions pour tester tes bases',
    seoDescription: 'Actions, ETF, obligations, ordres, frais, PEA : teste tes connaissances en Bourse en 10 questions, avec la correction expliquée.',
    lede: 'Dix questions, trois minutes. Pas de piège : chaque réponse est expliquée simplement, avec un lien pour aller plus loin.',
    minutes: 3,
    tone: 'var(--lichen)',
    questions: [
      {
        id: 'action',
        q: 'Acheter une action, c’est…',
        a: ['Prêter de l’argent à une entreprise contre des intérêts', 'Devenir copropriétaire d’une petite part de l’entreprise', 'Acheter un produit de l’entreprise à prix réduit', 'Ouvrir un compte dans une banque'],
        ok: 1,
        why: 'Une action est une part du capital. Prêter à une entreprise contre des intérêts, c’est acheter une obligation.',
        term: 'action',
      },
      {
        id: 'etf',
        q: 'Que permet un ETF qui réplique le MSCI World ?',
        a: ['Investir dans une seule grande entreprise américaine', 'Obtenir un rendement garanti', 'Investir en une fois dans plus de 1 000 entreprises de pays développés', 'Placer son argent sur un livret'],
        ok: 2,
        why: 'Un ETF reproduit un indice. Avec un seul achat, on détient une part de chacune de ses entreprises, avec des frais généralement faibles.',
        term: 'etf',
      },
      {
        id: 'capitalisant',
        q: 'Que fait un ETF « capitalisant » des dividendes qu’il reçoit ?',
        a: ['Il les verse sur ton compte chaque trimestre', 'Il les réinvestit automatiquement', 'Il les garde pour payer ses frais', 'Il les reverse à l’État'],
        ok: 1,
        why: 'Les dividendes sont réinvestis dans le fonds, ce qui nourrit l’effet des intérêts composés et évite d’avoir à les réinvestir soi-même.',
        term: 'etf-capitalisant',
      },
      {
        id: 'cac-dividendes',
        q: 'Le CAC 40 affiché aux informations tient-il compte des dividendes ?',
        a: ['Oui, ils sont inclus automatiquement', 'Non, c’est un indice de prix, hors dividendes', 'Seulement en fin d’année', 'Seulement pour les entreprises françaises'],
        ok: 1,
        why: 'L’indice qu’on voit partout mesure seulement l’évolution des cours. Un investisseur qui réinvestit les dividendes a fait nettement mieux sur le long terme.',
        term: 'indice',
      },
      {
        id: 'obligations-taux',
        q: 'Quand les taux d’intérêt montent, que devient le prix des obligations déjà émises ?',
        a: ['Il monte', 'Il baisse', 'Il ne change pas', 'Elles sont remboursées immédiatement'],
        ok: 1,
        why: 'Les nouvelles obligations rapportent plus : les anciennes, moins rémunératrices, perdent de la valeur. C’est ce qui s’est passé en 2022.',
        term: 'obligation',
      },
      {
        id: 'ordre-limite',
        q: 'Tu passes un ordre d’achat à cours limité à 50 €. Que se passe-t-il ?',
        a: ['L’achat se fait immédiatement, quel que soit le prix', 'L’achat ne se fait qu’à 50 € ou moins', 'L’achat se fait à 50 € exactement, jamais en dessous', 'L’ordre est annulé si le cours dépasse 40 €'],
        ok: 1,
        why: 'L’ordre limité fixe un prix maximum à l’achat. Tu gardes le contrôle du prix, au risque que l’ordre ne soit pas exécuté.',
        term: 'ordre-limite',
      },
      {
        id: 'diversification',
        q: 'Quel risque la diversification réduit-elle surtout ?',
        a: ['Le risque qu’une seule entreprise ou un seul secteur fasse chuter tout le portefeuille', 'Le risque d’une baisse générale de tous les marchés', 'Le risque d’inflation', 'Le risque de payer des impôts'],
        ok: 0,
        why: 'Répartir son argent limite l’impact d’une faillite ou d’un secteur en crise. Elle ne protège pas d’une baisse générale, quand presque tout chute ensemble.',
        term: 'diversification',
      },
      {
        id: 'frais',
        q: 'À performance égale, que pèsent sur 20 ans des frais de 2 % par an face à 0,2 % ?',
        a: ['Presque rien, la différence est de 1,8 €', 'Ils réduisent nettement le capital final, souvent de plusieurs dizaines de pourcents des gains', 'Ils sont compensés par une meilleure gestion', 'Ils ne s’appliquent que la première année'],
        ok: 1,
        why: 'Les frais se prélèvent chaque année sur un capital qui grossit : leur effet se compose dans le temps, comme les intérêts, mais à l’envers.',
        term: 'ter',
      },
      {
        id: 'pea',
        q: 'Après 5 ans de détention, comment sont imposés les gains retirés d’un PEA en 2026 ?',
        a: ['À la flat tax de 31,4 %', 'Seulement aux prélèvements sociaux de 18,6 %', 'Ils ne sont pas imposés du tout', 'Au barème de l’impôt sur le revenu uniquement'],
        ok: 1,
        why: 'Après 5 ans, les gains sont exonérés d’impôt sur le revenu. Restent les prélèvements sociaux, passés de 17,2 % à 18,6 % le 1er janvier 2026.',
        term: 'pea',
      },
      {
        id: 'drawdown',
        q: 'Ton placement perd 50 %. Quelle hausse faut-il ensuite pour revenir au point de départ ?',
        a: ['+50 %', '+75 %', '+100 %', '+150 %'],
        ok: 2,
        why: 'Après une baisse de 50 %, 100 € deviennent 50 € : il faut doubler, donc +100 %, pour retrouver 100 €. Plus la chute est forte, plus la remontée est longue.',
        term: 'drawdown',
      },
    ],
  },
]

export const getQuiz = (slug) => QUIZZES.find((q) => q.slug === slug) || null

export const scoreLevel = (score, total) => {
  const r = score / total
  if (r === 1) return { key: 'parfait', title: 'Sans faute.', text: 'Tu maîtrises les bases. Les fiches du glossaire te permettront d’aller plus loin sur chaque notion.' }
  if (r >= 0.7) return { key: 'solide', title: 'Solides bases.', text: 'L’essentiel est là. Relis les corrections ci-dessous : ce sont souvent ces détails qui coûtent cher.' }
  if (r >= 0.4) return { key: 'en_route', title: 'En bonne voie.', text: 'Plusieurs notions sont acquises, d’autres méritent cinq minutes de lecture. Les corrections et les définitions sont juste en dessous.' }
  return { key: 'a_revoir', title: 'Tout s’apprend.', text: 'Ces notions reviennent sans cesse quand on investit. Commence par les corrections ci-dessous, puis refais le quiz.' }
}

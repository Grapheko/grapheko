// Quiz « Quel investisseur es-tu ? » — outil pédagogique, pas un conseil personnalisé.
// Chaque réponse ajoute des points de "risque" (0 à 3). Certaines réponses
// déclenchent un drapeau (flag) qui prime sur le score.

export const QUESTIONS = [
  {
    id: 'precaution',
    q: 'As-tu une épargne disponible pour faire face à un imprévu (plusieurs mois de dépenses) ?',
    a: [
      { label: 'Oui, et elle est à part de ce que je veux investir', score: 2 },
      { label: 'En partie, moins de trois mois de dépenses', score: 1 },
      { label: 'Non, pas encore', score: 0, flag: 'precaution' },
    ],
  },
  {
    id: 'horizon',
    q: 'Dans combien de temps pourrais-tu avoir besoin de cet argent ?',
    a: [
      { label: 'Moins de 2 ans', score: 0, flag: 'horizon' },
      { label: 'Entre 2 et 5 ans', score: 1 },
      { label: 'Entre 5 et 10 ans', score: 2 },
      { label: 'Plus de 10 ans', score: 3 },
    ],
  },
  {
    id: 'baisse',
    q: 'Ton investissement perd 30 % en trois mois. Que fais-tu ?',
    a: [
      { label: 'Je vends tout pour arrêter les pertes', score: 0 },
      { label: 'Je vends une partie, ça m’empêche de dormir', score: 1 },
      { label: 'Je ne touche à rien', score: 2 },
      { label: 'J’en rachète, c’est moins cher', score: 3 },
    ],
  },
  {
    id: 'objectif',
    q: 'Quel est ton objectif principal ?',
    a: [
      { label: 'Ne pas perdre d’argent, quitte à gagner peu', score: 0 },
      { label: 'Battre l’inflation sans trop de secousses', score: 1 },
      { label: 'Faire croître mon capital sur le long terme', score: 2 },
      { label: 'Chercher la plus forte performance possible', score: 3 },
    ],
  },
  {
    id: 'connaissance',
    q: 'Comment décrirais-tu tes connaissances en investissement ?',
    a: [
      { label: 'Je débute complètement', score: 0 },
      { label: 'Je connais les bases (actions, ETF, livrets)', score: 1 },
      { label: 'J’investis déjà et je comprends les risques', score: 2 },
    ],
  },
  {
    id: 'regularite',
    q: 'Comment préfères-tu investir ?',
    a: [
      { label: 'Un petit montant chaque mois, en automatique', score: 2 },
      { label: 'Une somme d’un coup quand j’en ai l’occasion', score: 1 },
      { label: 'Je ne sais pas encore', score: 1 },
    ],
  },
  {
    id: 'crypto',
    q: 'Que penses-tu des cryptomonnaies ?',
    a: [
      { label: 'Trop risqué pour moi', score: 0 },
      { label: 'Une petite part, par curiosité', score: 2 },
      { label: 'Une part importante de mon portefeuille', score: 3, flag: 'crypto' },
    ],
  },
]

export const PROFILES = {
  precaution: {
    title: 'D’abord, la base',
    text: 'Avant d’investir, l’étape prioritaire est une épargne de précaution disponible à tout moment, sur un livret réglementé par exemple. Elle évite de devoir vendre un placement au pire moment pour faire face à un imprévu.',
    next: [
      { href: '/glossaire/livret-a', label: 'Comprendre le Livret A' },
      { href: '/simulateurs/rendement-reel', label: 'Voir l’effet de l’inflation sur l’épargne' },
    ],
  },
  horizon: {
    title: 'Horizon court',
    text: 'Avec un besoin d’argent dans moins de deux ans, les placements volatils comme les actions ou les cryptos sont mal adaptés : une baisse temporaire pourrait tomber au moment où tu as besoin des fonds.',
    next: [
      { href: '/glossaire/horizon-de-placement', label: 'L’horizon de placement, expliqué' },
      { href: '/simulateurs/rendement-reel', label: 'Comparer livret et inflation' },
    ],
  },
  prudent: {
    title: 'Profil prudent',
    text: 'Tu privilégies la stabilité. Une part limitée d’actions largement diversifiées, investie progressivement, peut aider à battre l’inflation sur le long terme, à condition d’accepter des variations.',
    next: [
      { href: '/glossaire/diversification', label: 'La diversification' },
      { href: '/simulateurs/dca/msci-world', label: 'Simuler un investissement progressif' },
    ],
  },
  equilibre: {
    title: 'Profil équilibré',
    text: 'Tu acceptes des fluctuations pour viser une croissance de long terme. Un socle d’ETF diversifiés, des versements réguliers et un rééquilibrage de temps en temps forment une approche cohérente avec ce profil.',
    next: [
      { href: '/blog/etf-debutant', label: 'Investir en ETF quand on débute' },
      { href: '/simulateurs/dca/msci-world', label: 'Simuler un DCA sur le MSCI World' },
    ],
  },
  dynamique: {
    title: 'Profil dynamique',
    text: 'Tu vises la performance et tu supportes bien les baisses. Garde en tête que la tolérance au risque se mesure vraiment pendant une crise : le drawdown maximal d’un actif te dit à quoi t’attendre.',
    next: [
      { href: '/glossaire/drawdown', label: 'Le drawdown, expliqué' },
      { href: '/simulateurs/dca/nasdaq', label: 'Tester un DCA sur le Nasdaq' },
    ],
  },
}

export function computeProfile(answers) {
  const picked = QUESTIONS.map((q, i) => q.a[answers[i]]).filter(Boolean)
  const flags = picked.map((a) => a.flag).filter(Boolean)
  if (flags.includes('precaution')) return { key: 'precaution', flags }
  if (flags.includes('horizon')) return { key: 'horizon', flags }
  const score = picked.reduce((s, a) => s + a.score, 0)
  const max = QUESTIONS.reduce((s, q) => s + Math.max(...q.a.map((a) => a.score)), 0)
  const ratio = score / max
  const key = ratio < 0.4 ? 'prudent' : ratio < 0.7 ? 'equilibre' : 'dynamique'
  return { key, score, max, flags }
}

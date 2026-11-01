// ══════════════════════════════════════════════════════════════
// Comparatif des courtiers PEA. Données vérifiées le 1er novembre 2026
// sur les grilles tarifaires officielles (sauf mention contraire).
//
// fee(montant, premierOrdreDuMois) → frais de courtage en euros pour un
// ordre d'achat en ligne sur Euronext Paris, dans un PEA.
// Le plafond légal des frais de courtage en ligne sur PEA (0,5 % du montant
// de l'ordre) est appliqué à toutes les grilles.
//
// referral : code ou lien de parrainage de Grapheko (signalé comme tel sur la
// page). null tant qu'aucun code n'est renseigné. Il n'influence ni l'ordre
// ni le calcul.
// ══════════════════════════════════════════════════════════════

export const VERIFIED_AT = '2026-11-01'
const PEA_CAP = 0.005
const cap = (m, f) => Math.min(f, m * PEA_CAP)

export const BROKERS = [
  {
    id: 'bourse-direct',
    name: 'Bourse Direct',
    offer: 'Tarif unique',
    fee: (m) => cap(m, m <= 500 ? 0.99 : m <= 1000 ? 1.9 : m <= 2000 ? 2.9 : m <= 4400 ? 3.8 : m * 0.0009),
    grid: '0,99 € jusqu’à 500 € (0,5 % jusqu’à 198 €), 1,90 € jusqu’à 1 000 €, 2,90 € jusqu’à 2 000 €, 3,80 € jusqu’à 4 400 €, puis 0,09 %',
    programmed: 'Non',
    custody: '0 €',
    inactivity: 'Aucun',
    minOrder: '80 € par achat en PEA',
    notes: ['Grille la plus basse sur les ordres moyens et gros.', 'Pas d’investissement programmé : chaque achat se passe à la main.'],
    source: { label: 'Conditions tarifaires Bourse Direct, applicables au 6 janvier 2026', url: 'https://www.boursedirect.fr/pdf/tarifs_bd.pdf' },
    referral: null,
  },
  {
    id: 'trade-republic',
    name: 'Trade Republic',
    offer: 'Ordre ponctuel',
    fee: (m) => cap(m, 1),
    grid: '1 € par ordre (2 € en « Direct Price » sur la place de ton choix) ; plans d’investissement programmés gratuits',
    programmed: 'Oui, 0 €',
    programmedFee: () => 0,
    custody: '0 €',
    inactivity: 'Aucun',
    minOrder: '—',
    notes: ['Les plans programmés sont sans frais : imbattable pour un versement mensuel automatique.', 'Univers PEA plus restreint (environ 150 ETF éligibles).'],
    source: { label: 'PEA.fr, tarification Trade Republic, mise à jour du 6 juillet 2026 (grille non détaillée sur le site officiel)', url: 'https://pea.fr/courtier/trade-republic-tarification-ordres-fin-pfof-best-price-direct-price/' },
    referral: null,
  },
  {
    id: 'fortuneo-starter',
    name: 'Fortuneo',
    offer: 'Starter',
    fee: (m, first) => (first && m <= 500 ? 0 : cap(m, m * 0.0035)),
    grid: '1er ordre du mois ≤ 500 € gratuit, sinon 0,35 % de l’ordre',
    programmed: 'Non',
    custody: '0 €',
    inactivity: 'Aucun',
    minOrder: '—',
    notes: ['Un achat mensuel jusqu’à 500 € ne coûte rien.', 'Au-delà, 0,35 % : cher sur les gros ordres.'],
    source: { label: 'Brochure tarifaire Fortuneo au 6 août 2026', url: 'https://www.fortuneo.fr/files/tarifs_fortuneo.pdf' },
    referral: null,
  },
  {
    id: 'fortuneo-progress',
    name: 'Fortuneo',
    offer: 'Progress',
    fee: (m) => cap(m, m <= 3000 ? 4.9 : m * 0.0015),
    grid: '4,90 € jusqu’à 3 000 €, puis 0,15 % (plafond 0,5 % sur PEA)',
    programmed: 'Non',
    custody: '0 €',
    inactivity: 'Aucun',
    minOrder: '—',
    notes: ['Intéressant au-delà de 1 000 € par ordre.'],
    source: { label: 'Brochure tarifaire Fortuneo au 6 août 2026', url: 'https://www.fortuneo.fr/files/tarifs_fortuneo.pdf' },
    referral: null,
  },
  {
    id: 'boursobank',
    name: 'BoursoBank',
    offer: 'Trader',
    fee: (m) => cap(m, m <= 7750 ? 16.65 : m * 0.0022),
    grid: '16,65 € jusqu’à 7 750 €, puis 0,22 %, dans la limite de 0,5 % sur PEA (soit 0,5 % de l’ordre jusqu’à 3 330 €)',
    programmed: 'Sur fonds partenaires uniquement',
    custody: '0 €',
    inactivity: '5,95 € par mois sans ordre exécuté',
    minOrder: '100 € par achat en PEA',
    notes: [
      'Selon la brochure, les profils Découverte et Classic sont réservés au compte-titres : sur PEA, c’est la grille Trader, plafonnée à 0,5 %.',
      'La brochure affiche un achat d’ETF à 0 € (offre BoursoMarkets) : vérifie dans ton espace quels ETF sont concernés, cela peut changer complètement le calcul.',
    ],
    source: { label: 'Brochure tarifaire BoursoBank, tarifs applicables au 5 octobre 2026', url: 'https://www.boursobank.com/content/brochure_tarifaire/boursorama_bt-new.pdf' },
    referral: {
      url: 'https://bour.so/p/PuXsCqotCQA',
      code: null,
      headline: 'Tu ouvres un compte BoursoBank ? Passe par le parrainage Grapheko.',
      terms: 'Ce lien préremplit le parrainage dans le parcours d’ouverture. Après l’ouverture du compte et un premier versement minimum, toi et Grapheko recevez chacun une récompense. Montant et conditions : ceux affichés par BoursoBank pendant l’ouverture.',
    },
  },
]

export const brokerLabel = (b) => (b.offer && b.offer !== 'Tarif unique' && b.offer !== 'Ordre ponctuel' ? `${b.name} ${b.offer}` : b.name)

// Coût sur un an d'un achat mensuel de `monthly` euros
export function yearlyCost(b, monthly, { programmed = true } = {}) {
  if (programmed && b.programmedFee) return 12 * b.programmedFee(monthly)
  return 12 * b.fee(monthly, true)
}

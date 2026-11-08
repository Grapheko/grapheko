// ══════════════════════════════════════════════════════════════
// Comparatif des assurances-vie en ligne (gestion libre).
// Données vérifiées le 8 novembre 2026 sur les pages officielles des contrats
// (sauf mention contraire dans `source`).
//
// ucFee        : frais de gestion annuels sur les unités de compte (UC), en %
// euroFee      : frais de gestion annuels du fonds en euros principal, en %
// euroRate2025 : taux net de frais de gestion, avant prélèvements sociaux,
//                du fonds en euros principal pour 2025 (texte, conditions comprises)
// referral     : lien de parrainage de Grapheko, signalé comme tel sur la page.
//                Il n'influence ni l'ordre ni les calculs.
//
// À revoir chaque année en janvier-février (taux des fonds en euros de l'année
// écoulée) et à chaque changement des conditions de bonus.
// ══════════════════════════════════════════════════════════════

export const VERIFIED_AT = '2026-11-08'

export const CONTRACTS = [
  {
    id: 'linxea-spirit-2',
    name: 'Linxea Spirit 2',
    insurer: 'Spirica (Crédit Agricole Assurances)',
    ucFee: 0.5,
    euroFee: 'jusqu’à 2 %',
    euroRate2025: '3,08 % (Nouvelle Génération) · 3,26 % (Objectif Climat)',
    euroAccess: 'Jusqu’à 100 % en fonds en euros, sans part minimum en UC',
    minDeposit: 500,
    supports: 'Plus de 1 100 supports, dont des ETF, des actions et des SCPI',
    managed: 'En option : Yomoni (+0,70 % par an) ou OTEA Capital (+0,20 % par an)',
    notes: [
      'Les deux fonds en euros garantissent 98 % du capital, pas 100 % : c’est la contrepartie de leurs frais de gestion plus élevés.',
      'Le fonds Objectif Climat ne s’alimente que par versement, pas par arbitrage depuis un autre support.',
    ],
    source: { label: 'Linxea, page du contrat Linxea Spirit 2 (5 novembre 2026)', url: 'https://www.linxea.com/assurance-vie/linxea-spirit-2/' },
    referral: null,
  },
  {
    id: 'lucya-cardif',
    name: 'Lucya Cardif',
    insurer: 'BNP Paribas Cardif',
    ucFee: 0.5,
    euroFee: '0,70 %',
    euroRate2025: '2,75 % (fonds général)',
    euroAccess: 'Bonus jusqu’à +1,5 % en 2026 et 2027, dès 10 000 € versés avec 45 % d’UC',
    minDeposit: 500,
    supports: 'Environ 2 300 supports en UC, dont des ETF et des actions',
    managed: 'Gestion déléguée en option (+0,25 % par an)',
    notes: [
      'Le plus grand choix de supports de ce comparatif.',
      'Les achats d’ETF et d’actions supportent jusqu’à 0,10 % de frais par opération.',
    ],
    source: { label: 'Lucya, comparateur des contrats et rendements 2025 (mai 2026)', url: 'https://lucya.com/rendement-des-fonds-euros-2025/' },
    referral: null,
  },
  {
    id: 'placement-direct-vie',
    name: 'Placement-direct Vie',
    insurer: 'Swiss Life Assurance et Patrimoine',
    ucFee: 0.5,
    euroFee: '0,60 %',
    euroRate2025: '1,90 % à 3,25 % selon la part d’UC (encours sous 250 000 €)',
    euroAccess: '1,90 % sous 40 % d’UC, 2,40 % entre 40 et 60 %, 3,25 % à partir de 60 %',
    minDeposit: 500,
    supports: 'Plus de 1 300 supports, dont plus de 300 actions en direct',
    managed: 'Allocation déléguée en option (+0,40 % par an, +0,70 % pour l’allocation 100 % trackers)',
    notes: [
      'Le rendement du fonds en euros dépend fortement de la part investie en UC.',
      'Les actions en direct coûtent plus cher : 0,80 % de frais de gestion par an et 0,45 % par opération. Achat ou vente d’ETF : 0,05 %.',
    ],
    source: { label: 'Placement-direct, page du contrat et taux 2025 (30 janvier 2026)', url: 'https://www.placement-direct.fr/actualites/taux-assurance-vie-2025' },
    referral: null,
  },
  {
    id: 'boursovie',
    name: 'BoursoVie',
    insurer: 'Generali Vie',
    ucFee: 0.75,
    euroFee: 'jusqu’à 0,75 %',
    euroRate2025: '3 % (Euro Exclusif)',
    euroAccess: 'Bonus de 2 % sur les versements du 1er novembre au 31 décembre 2026, avec au moins 30 % d’UC',
    minDeposit: 300,
    supports: 'Plus de 600 supports, dont plus de 40 ETF et fonds indiciels',
    managed: '8 mandats de gestion pilotée, sans frais supplémentaires',
    notes: [
      'Gestion pilotée sans surcoût : un atout si tu ne veux pas choisir tes supports toi-même.',
      'Il faut ouvrir un compte bancaire BoursoBank, gratuit, pour souscrire.',
      'Frais sur les UC de 0,75 %, plus élevés que les contrats à 0,50 %.',
    ],
    source: { label: 'BoursoBank, page assurance-vie et frais du contrat BoursoVie', url: 'https://www.boursobank.com/epargne/assurance-vie' },
    referral: {
      url: 'https://bour.so/p/PuXsCqotCQA',
      code: null,
      label: 'Ouvrir un compte BoursoBank',
      terms: 'BoursoVie se souscrit depuis un compte BoursoBank. Ce lien préremplit le parrainage dans le parcours d’ouverture du compte. Après l’ouverture et un premier versement minimum, toi et Grapheko recevez chacun une récompense. Montant et conditions : ceux affichés par BoursoBank pendant l’ouverture.',
    },
  },
  {
    id: 'fortuneo-vie',
    name: 'Fortuneo Vie',
    insurer: 'Suravenir',
    ucFee: 0.75,
    euroFee: '0,60 % (Rendement 2) · jusqu’à 3 % (Opportunités 2)',
    euroRate2025: '2,10 % (Rendement 2) · 3 % à 4,5 % (Opportunités 2, selon la part d’UC)',
    euroAccess: 'Rendement 2 : 30 % d’UC minimum par versement. Opportunités 2 : accessible à 100 % pour l’instant',
    minDeposit: 100,
    supports: 'Plus de 200 supports, dont des ETF',
    managed: 'Gestion sous mandat dès 300 € (UC à 0,85 % au lieu de 0,75 %)',
    notes: [
      'Le plus petit versement d’ouverture de ce comparatif : 100 €.',
      'Opportunités 2 garantit 97 % du capital, Rendement 2 99,4 %. Suravenir peut remettre une condition d’UC sur Opportunités 2 à tout moment.',
      'Prime de bienvenue de 500 à 1 500 € pour une première adhésion dès 50 000 € versés, jusqu’au 15 décembre 2026.',
    ],
    source: { label: 'Fortuneo, page assurance-vie et frais du contrat Fortuneo Vie', url: 'https://www.fortuneo.fr/assurance-vie' },
    referral: null,
  },
]

// Valeur au bout de `years` ans d'un capital placé en UC, après les seuls frais de gestion
// du contrat (rendement des supports supposé identique partout, avant leurs propres frais).
export function ucValue(contract, { amount, years, ratePct }) {
  return amount * Math.pow((1 + ratePct / 100) * (1 - contract.ucFee / 100), years)
}

// ══════════════════════════════════════════════════════════════
// Comparatif des plateformes crypto agréées MiCA, accessibles en France.
// Agréments vérifiés le 8 novembre 2026 sur la liste blanche des PSCA de l'AMF
// (export du 5 novembre 2026). Frais vérifiés le 8 novembre 2026 sur les grilles
// officielles, sauf quand `source.secondary` est vrai (grille officielle
// inaccessible : source indépendante datée, signalée sur la page).
//
// simpleFee : frais annoncés pour un achat de bitcoin dans l'application, en %
//             (null si la plateforme ne publie pas de pourcentage)
// bookFee   : frais « taker » d'un achat immédiat dans le carnet d'ordres (mode
//             avancé), au premier palier de volume, en % (null si pas de carnet)
// foreign   : compte ouvert à l'étranger → formulaire 3916-3916 bis chaque année
// referral  : lien de parrainage Grapheko, signalé comme tel. Il n'influence ni l'ordre ni les calculs.
// ══════════════════════════════════════════════════════════════

export const VERIFIED_AT = '2026-11-08'
export const AMF_LIST_URL = 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-blanches'

export const PLATFORMS = [
  {
    id: 'bitvavo',
    name: 'Bitvavo',
    country: 'Pays-Bas',
    entity: 'Bitvavo B.V.',
    simpleFee: 0.25,
    simpleLabel: '0,25\u00a0% par ordre, écart de prix de 0\u00a0% constaté',
    bookFee: 0.25,
    bookLabel: '0,25\u00a0% (même taux dans l’application)',
    programmed: 'Oui, plan d’épargne dans l’application',
    withdrawal: 'Oui, 1,30 € par retrait de bitcoin',
    foreign: true,
    notes: [
      'Le moins cher de ce comparatif pour un achat simple, avec un écart de prix nul relevé début novembre 2026.',
      'Interface volontairement simple, peu d’outils avancés.',
    ],
    source: { label: 'Cryptoticker, frais Bitvavo relevés le 4 novembre 2026 (grille officielle inaccessible)', url: 'https://cryptoticker.io/fr/bitvavo-frais-spread/', secondary: true },
    referral: null,
  },
  {
    id: 'bitpanda',
    name: 'Bitpanda',
    country: 'Autriche',
    entity: 'Bitpanda GmbH',
    simpleFee: 0.99,
    simpleLabel: '0,99\u00a0% pour le bitcoin, 1,49\u00a0% pour la plupart des autres cryptos',
    bookFee: 0.25,
    bookLabel: 'Bitpanda Fusion : de 0,25\u00a0% à 0,02\u00a0% selon le volume',
    programmed: 'Oui, dès 10 €, hebdomadaire à mensuel, à partir de 0,99\u00a0%',
    withdrawal: 'Oui, frais de réseau de la blockchain',
    foreign: true,
    notes: [
      'Plan d’épargne dès 10 € par semaine ou par mois, pratique pour investir régulièrement.',
      'Indices crypto automatiques à 1,99\u00a0% par opération.',
    ],
    source: { label: 'Bitpanda, transparence des coûts crypto, version 4.0.0 du 8 juillet 2026', url: 'https://cdn.bitpanda.com/terms-and-conditions/cost-transparency-crypto-bitpanda-en-4.0.0.pdf' },
    referral: null,
  },
  {
    id: 'kraken',
    name: 'Kraken',
    country: 'Irlande',
    entity: 'Payward Europe Solutions Ltd',
    simpleFee: 1,
    simpleLabel: '1\u00a0% pour un achat immédiat ou programmé, plus un écart de prix variable',
    bookFee: 0.8,
    bookLabel: 'Kraken Pro : 0,40\u00a0% (ordre en attente) ou 0,80\u00a0% (achat immédiat) au premier palier',
    programmed: 'Oui, 1\u00a0% par achat',
    withdrawal: 'Oui, frais selon l’actif et le réseau',
    foreign: true,
    notes: [
      'Le même compte donne accès à l’application simple et à Kraken Pro.',
      'Dans l’application, un écart de prix s’ajoute au 1\u00a0% : son montant n’est pas publié.',
    ],
    source: { label: 'Kraken, grilles de frais de l’application et de Kraken Pro', url: 'https://www.kraken.com/features/fee-schedule' },
    referral: null,
  },
  {
    id: 'revolut',
    name: 'Revolut',
    country: 'Chypre',
    entity: 'Revolut Digital Assets Europe Ltd',
    simpleFee: 1.49,
    simpleLabel: 'À partir de 1,49\u00a0% avec l’offre Standard, plus un écart de prix',
    bookFee: 0.09,
    bookLabel: 'Revolut X : 0\u00a0% (ordre en attente) ou 0,09\u00a0% (achat immédiat)',
    programmed: 'Oui, dans l’application',
    withdrawal: 'Oui, frais de réseau',
    foreign: true,
    notes: [
      'Revolut X, la plateforme d’échange de Revolut, est la moins chère de ce comparatif en carnet d’ordres.',
      'Dans l’application principale, les frais baissent avec les offres payantes.',
    ],
    source: { label: 'Revolut, frais de Revolut X ; Signal Alpha pour les frais de l’application (juillet 2026)', url: 'https://cdn.revolut.com/terms_and_conditions/pdf/crypto_exchange_fees_2564a8ff_1.0.0_1761835097_en.pdf' },
    referral: null,
  },
  {
    id: 'coinhouse',
    name: 'Coinhouse',
    country: 'France',
    entity: 'COINHOUSE SAS',
    simpleFee: 0.99,
    simpleLabel: '0,99\u00a0% par virement ou compte en euros (1,79\u00a0% par carte), vente à 1,49\u00a0%',
    bookFee: null,
    bookLabel: 'Pas de carnet d’ordres',
    programmed: 'Oui, 1,79\u00a0% par achat',
    withdrawal: 'Oui, frais de réseau + 0,29\u00a0% (minimum 1,49 €)',
    foreign: false,
    notes: [
      'Plateforme française : pas de formulaire 3916-3916 bis à remplir pour ce compte.',
      'Achat programmé plus cher que l’achat ponctuel (1,79\u00a0% contre 0,99\u00a0%).',
    ],
    source: { label: 'Coinhouse, grille tarifaire Particuliers publiée le 9 décembre 2025', url: 'https://cms-www.coinhouse.com/wp-content/uploads/2026/01/CH_-GrilleTarifaire_Web_FR_DEC25.pdf' },
    referral: null,
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    country: 'Luxembourg',
    entity: 'Coinbase Luxembourg S.A.',
    simpleFee: null,
    simpleLabel: 'Frais variables affichés avant validation, plus un écart de prix (frais Coinbase jusqu’à 1,875\u00a0% selon le moyen de paiement)',
    bookFee: null,
    bookLabel: 'Coinbase Advanced : sans écart de prix, frais selon le volume (grille non publiée en ligne pour la France)',
    programmed: 'Oui, dans l’application',
    withdrawal: 'Oui, frais de réseau estimés',
    foreign: true,
    notes: [
      'Coinbase ne publie pas de pourcentage fixe pour l’achat simple : vérifie l’aperçu des frais avant chaque achat.',
      'Coinbase Advanced évite l’écart de prix de l’application simple.',
    ],
    source: { label: 'Coinbase, page d’aide sur la tarification et les frais', url: 'https://help.coinbase.com/fr/coinbase/trading-and-funding/pricing-and-fees/fees' },
    referral: {
      url: 'https://coinbase.com/join/RGZTVAK',
      code: 'RGZTVAK',
      label: 'Ouvrir un compte Coinbase',
      terms: 'Ce lien ouvre l’inscription Coinbase avec le parrainage de Grapheko. Selon l’offre de parrainage en cours, toi et Grapheko pouvez recevoir une récompense après ton premier achat. Montant et conditions : ceux affichés par Coinbase pendant l’inscription.',
    },
  },
]

// Frais annoncés sur un an pour `monthly` euros de bitcoin achetés chaque mois
export const yearlyFees = (pct, monthly) => (pct === null ? null : (12 * monthly * pct) / 100)

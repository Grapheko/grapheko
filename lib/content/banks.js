// ══════════════════════════════════════════════════════════════
// Comparatif banques en ligne et néobanques. Données vérifiées le
// 1er novembre 2026 sur les grilles et pages officielles citées.
// Une valeur absente de la source officielle est notée « Non communiqué » :
// rien n'est déduit ni complété de mémoire.
//
// tags : critères utilisés par les filtres de la page
//   sansRevenus     : offre ouverte sans condition de revenus
//   gratuite        : 0 € par mois (sous la condition d'usage indiquée)
//   paiementsDevises: paiements par carte hors zone euro sans frais de la banque
//   retraitsDevises : au moins un retrait hors zone euro gratuit chaque mois
//   decouvert       : découvert autorisé possible (sous réserve d'acceptation)
//   especes         : dépôt d'espèces possible facilement
//
// referral : offre de parrainage de Grapheko, affichée comme telle.
// Sans effet sur l'ordre (alphabétique) ni sur les filtres.
// ══════════════════════════════════════════════════════════════

export const BANKS_VERIFIED_AT = '2026-11-01'

export const BANKS = [
  {
    id: 'boursobank',
    name: 'BoursoBank',
    kind: 'Banque en ligne',
    offer: 'Welcome / Ultim',
    monthly: '0 €',
    usage: 'Ultim : carte gratuite si utilisée au moins une fois par mois, sinon 9 € par mois. Welcome : sans condition d’utilisation selon la brochure.',
    income: 'Aucune condition de revenus indiquée dans la brochure (éligibilité vérifiée à l’ouverture)',
    foreignPay: 'Sans frais',
    foreignCash: 'Welcome : 1 retrait gratuit par mois, Ultim : 3, puis 1,69 %',
    euroCash: 'Gratuits',
    overdraft: 'Possible, sous réserve d’acceptation (taux de 7 %)',
    extra: 'Metal à 9,90 € par mois (5,90 € en carte virtuelle) : retraits en devises illimités sans frais.',
    tags: ['sansRevenus', 'gratuite', 'paiementsDevises', 'retraitsDevises', 'decouvert'],
    source: { label: 'Brochure tarifaire BoursoBank, tarifs au 5 octobre 2026', url: 'https://www.boursobank.com/content/brochure_tarifaire/boursorama_bt-new.pdf' },
    referral: null,
  },
  {
    id: 'fortuneo',
    name: 'Fortuneo',
    kind: 'Banque en ligne',
    offer: 'Fosfo / Gold',
    monthly: '0 €',
    usage: 'Gratuite avec au moins un paiement par carte par mois, sinon 3 € (Fosfo) ou 9 € (Gold) par mois. Les retraits ne comptent pas.',
    income: 'Fosfo : aucune. Gold : 2 200 € nets par mois',
    foreignPay: 'Sans frais',
    foreignCash: 'Sans frais',
    euroCash: 'Gratuits',
    overdraft: 'Possible, sous réserve d’acceptation (taux de 7 %)',
    extra: 'World Elite gratuite avec 4 000 € versés chaque mois, sinon 50 € par trimestre.',
    tags: ['sansRevenus', 'gratuite', 'paiementsDevises', 'retraitsDevises', 'decouvert'],
    source: { label: 'Conditions tarifaires Fortuneo au 6 août 2026 et conditions d’octroi des cartes', url: 'https://www.fortuneo.fr/files/tarifs_fortuneo.pdf' },
    referral: null,
  },
  {
    id: 'hello-bank',
    name: 'Hello bank!',
    kind: 'Banque en ligne (groupe BNP Paribas)',
    offer: 'Hello One',
    monthly: '0 €',
    usage: 'Gratuit avec au moins un paiement ou retrait par carte dans le mois, sinon 6 € par mois.',
    income: 'Aucune (Hello Prime : 1 500 € nets par mois)',
    foreignPay: 'Sans frais de la banque',
    foreignCash: 'Sans frais aux distributeurs BNP Paribas et partenaires dans le monde',
    euroCash: 'Sans frais aux distributeurs BNP Paribas et Cash Services',
    overdraft: 'Non communiqué sur la page de l’offre',
    extra: 'Plafonds Hello One : 400 € de retraits sur 7 jours, 1 000 € de paiements sur 30 jours.',
    tags: ['sansRevenus', 'gratuite', 'paiementsDevises'],
    source: { label: 'Page officielle de l’offre Hello One', url: 'https://www.hellobank.fr/fr/offre/compte-et-cartes/hello-one/' },
    referral: null,
  },
  {
    id: 'monabanq',
    name: 'Monabanq',
    kind: 'Banque en ligne (groupe Crédit Mutuel)',
    offer: 'Uniq',
    monthly: '6 € (Pratiq+ : 3,90 €)',
    usage: 'Cotisation fixe, sans condition d’utilisation',
    income: 'Non communiqué sur la page de l’offre',
    foreignPay: 'Sans frais',
    foreignCash: '25 retraits en devises gratuits par an',
    euroCash: 'Gratuits',
    overdraft: 'Non communiqué sur la page de l’offre',
    extra: 'Dépôt de chèques dans les distributeurs Crédit Mutuel et CIC (3 par trimestre).',
    tags: ['paiementsDevises', 'retraitsDevises'],
    source: { label: 'Page officielle de l’offre Uniq', url: 'https://www.monabanq.com/fr/uniq-visa-classic.html' },
    referral: null,
  },
  {
    id: 'n26',
    name: 'N26',
    kind: 'Néobanque',
    offer: 'Standard',
    monthly: '0 € (carte physique : 10 €)',
    usage: 'Aucune',
    income: 'Aucune',
    foreignPay: 'Sans frais',
    foreignCash: '1,7 % du montant',
    euroCash: '2 retraits gratuits par mois (frais au-delà non communiqués sur la page)',
    overdraft: 'Non communiqué',
    extra: 'Formules Smart (4,90 €), Go (9,90 € : retraits en devises sans frais) et Metal (16,90 €).',
    tags: ['sansRevenus', 'gratuite', 'paiementsDevises'],
    source: { label: 'Page tarifs N26 France', url: 'https://n26.com/fr-fr/tarifs' },
    referral: null,
  },
  {
    id: 'nickel',
    name: 'Nickel',
    kind: 'Compte de paiement',
    offer: 'Nickel',
    monthly: '25 € par an (environ 2,10 € par mois)',
    usage: 'Aucune',
    income: 'Aucune, ouverture possible chez un buraliste',
    foreignPay: '1,50 € par paiement (gratuit avec Chrome ou Metal)',
    foreignCash: '2,50 € par retrait (1,50 € avec Chrome, gratuit avec Metal)',
    euroCash: '3 retraits gratuits par mois en point Nickel, puis 0,50 € ; 1,50 € en distributeur en zone euro',
    overdraft: 'Non',
    extra: 'Dépôt d’espèces chez les buralistes (3 % du montant). Chrome : 30 € par an, Metal : 80 € par an, en plus de la cotisation.',
    tags: ['sansRevenus', 'especes'],
    source: { label: 'Pages officielles Nickel (offre et frais à l’étranger)', url: 'https://nickel.eu/fr/offre' },
    referral: null,
  },
  {
    id: 'revolut',
    name: 'Revolut',
    kind: 'Néobanque',
    offer: 'Standard',
    monthly: '0 € (livraison de la carte : 7,99 €)',
    usage: 'Aucune',
    income: 'Aucune',
    foreignPay: 'Sans frais jusqu’à 1 000 € de change par mois en semaine, puis 1 % ; 1 % le week-end',
    foreignCash: '5 retraits ou 200 € gratuits par mois, puis 2 % (minimum 1 €)',
    euroCash: '5 retraits ou 200 € gratuits par mois, puis 2 % (minimum 1 €)',
    overdraft: 'Non communiqué',
    extra: 'Formules payantes Plus, Premium et Metal avec des plafonds plus élevés.',
    tags: ['sansRevenus', 'gratuite', 'paiementsDevises', 'retraitsDevises'],
    source: { label: 'Frais personnels Revolut Standard, applicables au 31 décembre 2025', url: 'https://cdn.revolut.com/terms_and_conditions/pdf/frais_personnels_standard_e81c1163_1.3.0_1761822747_fr.pdf' },
    referral: null,
  },
  {
    id: 'trade-republic',
    name: 'Trade Republic',
    kind: 'Banque d’investissement avec compte courant',
    offer: 'Compte et carte',
    monthly: '0 € (carte physique : 5 € une fois)',
    usage: 'Aucune',
    income: 'Aucune',
    foreignPay: 'Non communiqué clairement dans le document tarifaire',
    foreignCash: 'Non communiqué clairement dans le document tarifaire',
    euroCash: 'Non communiqué clairement dans le document tarifaire',
    overdraft: 'Non',
    extra: '1 % des paiements par carte réinvesti (Saveback) selon la page de la carte. Pratique si tu investis déjà chez Trade Republic.',
    tags: ['sansRevenus', 'gratuite'],
    source: { label: 'Document d’information tarifaire du compte Trade Republic', url: 'https://assets.traderepublic.com/assets/files/FeeInformation_PaymentAccount_fr.pdf' },
    referral: null,
  },
]

export const BANK_FILTERS = [
  { key: 'gratuite', label: '0 € par mois' },
  { key: 'sansRevenus', label: 'Sans condition de revenus' },
  { key: 'paiementsDevises', label: 'Paiements hors zone euro sans frais' },
  { key: 'retraitsDevises', label: 'Retraits en devises gratuits' },
  { key: 'decouvert', label: 'Découvert possible' },
  { key: 'especes', label: 'Dépôt d’espèces facile' },
]

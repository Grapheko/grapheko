// ══════════════════════════════════════════════════════════════
// Catalogue des actifs suivis par Grapheko.
// Ajouter un actif ici crée automatiquement :
//   /marches/<slug>  et  /simulateurs/dca/<slug>
// ══════════════════════════════════════════════════════════════

export const ASSETS = [
  {
    slug: 'bitcoin',
    name: 'Bitcoin',
    short: 'BTC',
    kind: 'crypto',
    currency: 'USD',
    yahoo: 'BTC-USD',
    binance: 'BTCUSDT',
    live: { type: 'crypto', binance: 'BTCEUR', coinbase: 'BTC-EUR' },
    note: 'Cours en dollars converti en euros au taux de change de fin de mois.',
    intro:
      "Première cryptomonnaie, lancée en 2009. Son offre est plafonnée à 21 millions d'unités, ce qui alimente son image de réserve de valeur numérique. C'est aussi l'un des actifs les plus volatils qu'un particulier puisse acheter : des baisses de plus de 70 % ont déjà eu lieu plusieurs fois.",
    points: [
      'Volatilité très élevée : un DCA lisse le prix d’entrée mais pas le risque.',
      'Aucun revenu (ni dividende ni intérêt) : la performance vient uniquement du prix.',
      'Fiscalité française des plus-values crypto : flat tax de 31,4 % en 2026.',
    ],
    related: ['blockchain', 'volatilite', 'dca', 'drawdown'],
  },
  {
    slug: 'ethereum',
    name: 'Ethereum',
    short: 'ETH',
    kind: 'crypto',
    currency: 'USD',
    yahoo: 'ETH-USD',
    binance: 'ETHUSDT',
    live: { type: 'crypto', binance: 'ETHEUR', coinbase: 'ETH-EUR' },
    note: 'Cours en dollars converti en euros au taux de change de fin de mois.',
    intro:
      "Blockchain programmable lancée en 2015, sur laquelle tournent des applications (smart contracts, finance décentralisée, stablecoins). L'ether (ETH) sert à payer les transactions du réseau. Depuis 2022, le réseau fonctionne en preuve d'enjeu (proof of stake).",
    points: [
      'Historique plus court que le Bitcoin, et des baisses tout aussi violentes.',
      'Le staking permet de percevoir une rémunération, avec des risques propres.',
      'Fiscalité française des plus-values crypto : flat tax de 31,4 % en 2026.',
    ],
    related: ['smart-contract', 'staking', 'blockchain', 'volatilite'],
  },
  {
    slug: 'solana',
    name: 'Solana',
    short: 'SOL',
    kind: 'crypto',
    currency: 'USD',
    yahoo: 'SOL-USD',
    binance: 'SOLUSDT',
    live: { type: 'crypto', binance: 'SOLEUR', coinbase: 'SOL-EUR' },
    note: 'Cours en dollars converti en euros au taux de change de fin de mois.',
    intro:
      "Blockchain conçue pour des transactions rapides et peu chères, lancée en 2020. Historique court, capitalisation plus faible que Bitcoin ou Ethereum : c'est un actif nettement plus spéculatif.",
    points: [
      'Moins de cinq ans d’historique : les backtests sont peu représentatifs.',
      'A perdu plus de 90 % de sa valeur entre fin 2021 et fin 2022.',
      'Fiscalité française des plus-values crypto : flat tax de 31,4 % en 2026.',
    ],
    related: ['blockchain', 'volatilite', 'drawdown'],
  },
  {
    slug: 'cac-40',
    name: 'CAC 40',
    short: 'CAC 40',
    kind: 'bourse',
    currency: 'EUR',
    yahoo: '^FCHI',
    live: { type: 'delayed', yahoo: '^FCHI' },
    note: 'Indice de prix, hors dividendes : la performance réelle d’un ETF CAC 40 capitalisant est supérieure.',
    intro:
      "Indice des 40 plus grandes capitalisations de la Bourse de Paris (LVMH, TotalEnergies, Airbus…). Il est très exposé au luxe, à l'industrie et à l'énergie, et ne représente qu'une petite partie de l'économie mondiale.",
    points: [
      'Indice publié hors dividendes : il sous-estime la performance réelle.',
      'Concentration sectorielle forte (luxe, énergie, industrie).',
      'Accessible via des ETF éligibles au PEA.',
    ],
    related: ['indice', 'etf', 'pea', 'dividende'],
  },
  {
    slug: 'sp-500',
    name: 'S&P 500',
    short: 'S&P 500',
    kind: 'bourse',
    currency: 'USD',
    yahoo: '^GSPC',
    live: { type: 'delayed', yahoo: '^GSPC' },
    note: 'Indice de prix en dollars, hors dividendes, converti en euros au taux de fin de mois.',
    intro:
      "Indice des 500 plus grandes entreprises cotées aux États-Unis, pondéré par la capitalisation. Les dix plus grosses valeurs (Apple, Microsoft, Nvidia…) pèsent une part importante de l'indice.",
    points: [
      'Pour un investisseur en euros, le taux de change EUR/USD joue sur la performance.',
      'Indice hors dividendes : la performance réelle d’un ETF capitalisant est supérieure.',
      'Accessible via des ETF éligibles au PEA (réplication synthétique).',
    ],
    related: ['indice', 'etf', 'capitalisation', 'risque-de-change'],
  },
  {
    slug: 'nasdaq',
    name: 'Nasdaq Composite',
    short: 'Nasdaq',
    kind: 'bourse',
    currency: 'USD',
    yahoo: '^IXIC',
    live: { type: 'delayed', yahoo: '^IXIC' },
    note: 'Indice de prix en dollars, hors dividendes, converti en euros au taux de fin de mois.',
    intro:
      "Indice regroupant les milliers de sociétés cotées sur le Nasdaq, très orienté technologie. Plus concentré et plus volatil que le S&P 500 : il a perdu près de 80 % lors de l'éclatement de la bulle internet (2000-2002).",
    points: [
      'Forte concentration sur la tech américaine.',
      'Indice hors dividendes, en dollars convertis en euros.',
      'Ne pas confondre avec le Nasdaq-100, l’indice que répliquent la plupart des ETF.',
    ],
    related: ['indice', 'volatilite', 'risque-de-change'],
  },
  {
    slug: 'msci-world',
    name: 'MSCI World',
    short: 'MSCI World',
    kind: 'bourse',
    currency: 'USD',
    yahoo: 'URTH',
    note: 'Suivi via l’ETF iShares MSCI World (URTH), cours en dollars hors dividendes, converti en euros. Historique depuis 2012.',
    intro:
      "Indice d'environ 1 400 grandes et moyennes entreprises de 23 pays développés. C'est l'indice de référence de l'investissement passif « monde », même si les États-Unis y pèsent environ 70 %.",
    points: [
      'Diversifié en nombre de sociétés, mais dominé par les États-Unis.',
      'Les pays émergents n’y figurent pas (il faut un ETF « All Country » pour les inclure).',
      'Accessible via des ETF éligibles au PEA.',
    ],
    related: ['etf', 'indice', 'diversification', 'pea'],
  },
  {
    slug: 'or',
    name: 'Or',
    short: 'Or',
    kind: 'matiere',
    currency: 'USD',
    yahoo: 'GC=F',
    live: { type: 'delayed', yahoo: 'GC=F', toEur: true },
    note: 'Contrat à terme sur l’once d’or en dollars, converti en euros au taux de fin de mois.',
    intro:
      "Valeur refuge historique, l'or ne verse aucun revenu. Il est souvent utilisé pour diversifier un portefeuille, car il ne réagit pas toujours comme les actions lors des crises.",
    points: [
      'Aucun rendement : la performance vient uniquement du prix.',
      'Exposé au dollar : le change EUR/USD joue sur la performance en euros.',
      'Achat possible en physique, via des ETC, ou des fonds.',
    ],
    related: ['valeur-refuge', 'diversification', 'risque-de-change'],
  },
]

export const KIND_LABEL = { crypto: 'Crypto', bourse: 'Bourse', matiere: 'Matière première' }

export const getAsset = (slug) => ASSETS.find((a) => a.slug === slug) || null

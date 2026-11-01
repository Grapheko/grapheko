// ══════════════════════════════════════════════════════════════
// Glossaire Grapheko. Une entrée = une page /glossaire/<slug>.
// Chiffres réglementaires à jour au 1er novembre 2026 (vérifier à chaque
// changement de loi de finances : PFU, prélèvements sociaux, Livret A).
// ══════════════════════════════════════════════════════════════

export const CATEGORIES = {
  bourse: 'Bourse',
  crypto: 'Crypto',
  epargne: 'Épargne',
  fiscalite: 'Fiscalité',
  notions: 'Notions clés',
}

export const TERMS = [
  {
    slug: 'action', term: 'Action', cat: 'bourse',
    short: 'Une part du capital d’une entreprise, qui donne droit à une partie de ses bénéfices et à un vote en assemblée générale.',
    body: [
      'Acheter une action, c’est devenir copropriétaire d’une entreprise, pour une toute petite part. Sa valeur suit les perspectives de l’entreprise telles que le marché les anticipe : résultats, croissance, taux d’intérêt, contexte économique.',
      'Une action peut rapporter de deux façons : par la hausse de son cours (plus-value) et par les dividendes, si l’entreprise en verse. Elle peut aussi perdre une grande partie de sa valeur, voire toute, si l’entreprise fait faillite.',
    ],
    related: ['dividende', 'capitalisation', 'etf', 'diversification'],
  },
  {
    slug: 'obligation', term: 'Obligation', cat: 'bourse',
    short: 'Un titre de dette : tu prêtes à un État ou une entreprise, qui te verse des intérêts et te rembourse à une date fixée.',
    body: [
      'Une obligation a une valeur de remboursement, une date d’échéance et un taux d’intérêt (le coupon). Tant que l’émetteur ne fait pas défaut, tu touches les coupons puis tu récupères ta mise à l’échéance.',
      'Avant l’échéance, son prix varie : quand les taux d’intérêt montent, les obligations déjà émises (qui rapportent moins) perdent de la valeur, et inversement. C’est ce qui explique les fortes baisses obligataires de 2022.',
    ],
    related: ['taux-directeur', 'allocation-d-actifs', 'diversification'],
  },
  {
    slug: 'etf', term: 'ETF (tracker)', cat: 'bourse',
    short: 'Un fonds coté en Bourse qui réplique un indice, pour acheter des centaines d’entreprises en une seule transaction.',
    body: [
      'Un ETF (Exchange Traded Fund) cherche à reproduire la performance d’un indice, comme le MSCI World ou le CAC 40, au lieu d’essayer de le battre. Il s’achète et se vend comme une action, à tout moment de la séance.',
      'Ses deux atouts principaux sont la diversification immédiate et des frais faibles, souvent entre 0,05 % et 0,40 % par an. Certains sont éligibles au PEA, y compris sur des indices internationaux grâce à la réplication synthétique.',
    ],
    related: ['indice', 'ter', 'etf-capitalisant', 'pea', 'diversification'],
  },
  {
    slug: 'etf-capitalisant', term: 'Capitalisant ou distribuant', cat: 'bourse',
    short: 'Un fonds capitalisant réinvestit les dividendes ; un fonds distribuant te les verse.',
    body: [
      'Un ETF capitalisant (souvent noté « Acc ») réinvestit automatiquement les dividendes reçus dans le fonds. Un ETF distribuant (« Dist ») les verse sur ton compte, en général une à quatre fois par an.',
      'Sur un compte-titres ordinaire, les dividendes versés sont imposés l’année de leur perception, ce qui rend les fonds capitalisants souvent plus efficaces fiscalement. Dans un PEA, les dividendes restent dans l’enveloppe : la différence est surtout une question de préférence.',
    ],
    related: ['etf', 'dividende', 'cto', 'interets-composes'],
  },
  {
    slug: 'indice', term: 'Indice boursier', cat: 'bourse',
    short: 'Un panier d’actions défini par des règles, qui sert de thermomètre à un marché.',
    body: [
      'Un indice regroupe des entreprises selon des critères précis (pays, taille, secteur) et calcule une valeur qui résume leur évolution. Le CAC 40 suit les 40 plus grandes capitalisations de Paris, le S&P 500 les 500 plus grandes des États-Unis.',
      'Attention à la version : un indice « de prix » ignore les dividendes, un indice « dividendes réinvestis » (ou net return) les inclut. Sur longue période, l’écart est important.',
    ],
    related: ['etf', 'capitalisation', 'dividende'],
  },
  {
    slug: 'dividende', term: 'Dividende', cat: 'bourse',
    short: 'La part des bénéfices qu’une entreprise reverse à ses actionnaires.',
    body: [
      'Chaque année, ou plus souvent, une entreprise peut décider de distribuer une partie de ses bénéfices. Le jour du détachement, le cours de l’action baisse mécaniquement d’un montant proche du dividende.',
      'Un dividende n’est pas un revenu garanti : il peut être réduit ou supprimé, comme beaucoup l’ont été en 2020. Sur un compte-titres, il est imposé à la flat tax (31,4 % en 2026).',
    ],
    related: ['action', 'etf-capitalisant', 'flat-tax'],
  },
  {
    slug: 'capitalisation', term: 'Capitalisation boursière', cat: 'bourse',
    short: 'La valeur totale d’une entreprise en Bourse : nombre d’actions multiplié par le cours.',
    body: [
      'Si une entreprise compte 100 millions d’actions à 50 €, sa capitalisation est de 5 milliards d’euros. C’est la mesure qui sert à classer les entreprises et à pondérer la plupart des indices.',
      'Dans un indice pondéré par la capitalisation, les plus grosses entreprises pèsent le plus. C’est pourquoi quelques géants de la tech représentent une part importante du S&P 500 et du MSCI World.',
    ],
    related: ['indice', 'action'],
  },
  {
    slug: 'per', term: 'PER (price earnings ratio)', cat: 'bourse',
    short: 'Le rapport entre le cours d’une action et le bénéfice par action : combien d’années de bénéfices le marché paie.',
    body: [
      'Un PER de 20 signifie que l’action vaut 20 fois le bénéfice annuel par action. Plus il est élevé, plus le marché anticipe de croissance, ou plus l’action est chère.',
      'Le PER se compare entre entreprises d’un même secteur, ou à l’historique d’une même entreprise. Il ne dit rien seul : une entreprise en forte croissance peut justifier un PER élevé, une entreprise en déclin peut sembler bon marché à tort.',
    ],
    related: ['action', 'capitalisation'],
  },
  {
    slug: 'ordre-limite', term: 'Ordre à cours limité', cat: 'bourse',
    short: 'Un ordre d’achat ou de vente qui ne s’exécute qu’à un prix que tu fixes, ou mieux.',
    body: [
      'Avec un ordre « au marché », tu achètes au meilleur prix disponible à l’instant, quel qu’il soit. Avec un ordre à cours limité, tu fixes un prix maximum à l’achat (ou minimum à la vente) : l’ordre attend ou ne passe pas.',
      'Sur des titres peu échangés ou en début de séance, l’ordre à cours limité évite d’acheter nettement plus cher que prévu à cause d’un écart important entre acheteurs et vendeurs.',
    ],
    related: ['spread', 'liquidite', 'courtier'],
  },
  {
    slug: 'spread', term: 'Spread (fourchette)', cat: 'bourse',
    short: 'L’écart entre le meilleur prix d’achat et le meilleur prix de vente d’un titre.',
    body: [
      'À un instant donné, des acheteurs proposent un prix et des vendeurs en demandent un autre, un peu plus élevé. Cet écart est un coût caché : acheter puis revendre immédiatement fait perdre la fourchette.',
      'Il est très faible sur les grandes actions et les gros ETF, plus large sur les petites valeurs, certaines cryptos et en dehors des heures de forte activité.',
    ],
    related: ['liquidite', 'ordre-limite'],
  },
  {
    slug: 'liquidite', term: 'Liquidité', cat: 'notions',
    short: 'La facilité avec laquelle un actif peut être vendu rapidement, sans faire baisser son prix.',
    body: [
      'Un compte courant est parfaitement liquide. Une action du CAC 40 l’est presque. Un bien immobilier, une part de société non cotée ou un petit token crypto beaucoup moins.',
      'Le manque de liquidité devient un risque au pire moment : quand beaucoup de monde veut vendre en même temps, le prix peut chuter fortement avant de trouver preneur.',
    ],
    related: ['spread', 'volatilite'],
  },
  {
    slug: 'courtier', term: 'Courtier', cat: 'bourse',
    short: 'L’intermédiaire (banque ou plateforme) qui transmet tes ordres de Bourse et conserve tes titres.',
    body: [
      'Pour acheter une action ou un ETF, il faut passer par un courtier, qui facture des frais de courtage et parfois des frais de tenue de compte ou de change. Les écarts de prix entre courtiers sont importants.',
      'Avant de choisir, vérifie quelles enveloppes il propose (PEA, CTO), les frais réels pour ta fréquence d’achat, et son pays d’enregistrement, qui joue sur les démarches fiscales.',
    ],
    related: ['pea', 'cto', 'ordre-limite'],
  },
  {
    slug: 'krach', term: 'Krach', cat: 'bourse',
    short: 'Une chute brutale et rapide des marchés, souvent de plus de 20 % en quelques jours ou semaines.',
    body: [
      'Les krachs les plus connus : octobre 1929, le « lundi noir » d’octobre 1987, l’éclatement de la bulle internet en 2000, la crise de 2008 et la chute liée au Covid en mars 2020.',
      'Ils sont impossibles à prévoir précisément. Ce qu’on peut préparer, c’est sa réaction : un investissement sur un horizon long et un montant que l’on peut se permettre de voir baisser temporairement.',
    ],
    related: ['drawdown', 'bull-bear', 'volatilite', 'horizon-de-placement'],
  },
  {
    slug: 'bull-bear', term: 'Marché haussier et baissier', cat: 'bourse',
    short: 'Bull market : une période de hausse durable. Bear market : une baisse d’au moins 20 % depuis un sommet.',
    body: [
      'Le taureau (bull) attaque de bas en haut, l’ours (bear) de haut en bas : l’image vient de là. On parle conventionnellement de marché baissier quand un indice a perdu 20 % ou plus par rapport à son plus haut.',
      'Sur les grands indices actions, les phases haussières ont historiquement duré bien plus longtemps que les phases baissières, mais rien ne garantit que ce sera toujours le cas.',
    ],
    related: ['krach', 'drawdown'],
  },
  {
    slug: 'pea', term: 'PEA (Plan d’épargne en actions)', cat: 'fiscalite',
    short: 'Une enveloppe fiscale française pour investir en actions européennes, avec une fiscalité allégée après 5 ans.',
    body: [
      'Le PEA accepte jusqu’à 150 000 € de versements. Il permet d’acheter des actions européennes et des ETF éligibles, y compris des ETF qui répliquent des indices mondiaux.',
      'Après 5 ans, les gains sont exonérés d’impôt sur le revenu : seuls les prélèvements sociaux s’appliquent, à 18,6 % en 2026, au lieu de 31,4 % avec la flat tax. Un retrait avant 5 ans entraîne en principe la clôture du plan, sauf exceptions prévues par la loi.',
    ],
    related: ['cto', 'assurance-vie', 'flat-tax', 'etf'],
  },
  {
    slug: 'cto', term: 'CTO (compte-titres ordinaire)', cat: 'fiscalite',
    short: 'Un compte de Bourse sans plafond ni restriction géographique, sans avantage fiscal.',
    body: [
      'Le CTO permet d’acheter des actions, ETF et obligations du monde entier, sans limite de versement, et de retirer à tout moment.',
      'Les dividendes et plus-values sont imposés à la flat tax de 31,4 % en 2026 (ou au barème progressif sur option). Les moins-values sont imputables sur les plus-values de même nature pendant 10 ans.',
    ],
    related: ['pea', 'flat-tax', 'courtier'],
  },
  {
    slug: 'assurance-vie', term: 'Assurance-vie', cat: 'fiscalite',
    short: 'Une enveloppe d’épargne polyvalente, avec une fiscalité qui s’allège après 8 ans et des avantages pour la transmission.',
    body: [
      'Un contrat d’assurance-vie peut contenir un fonds en euros (capital garanti par l’assureur, hors frais) et des unités de compte (fonds, ETF), dont la valeur fluctue.',
      'Après 8 ans, les gains retirés bénéficient d’un abattement annuel de 4 600 € (9 200 € pour un couple). Les prélèvements sociaux y restent à 17,2 % en 2026, la hausse de la CSG ne s’appliquant pas à cette enveloppe. En cas de décès, les sommes versées avant 70 ans profitent d’un abattement de 152 500 € par bénéficiaire.',
    ],
    related: ['pea', 'cto', 'flat-tax'],
  },
  {
    slug: 'livret-a', term: 'Livret A', cat: 'epargne',
    short: 'Le livret d’épargne réglementé le plus répandu : sans risque, disponible à tout moment, défiscalisé.',
    body: [
      'Le Livret A rapporte 1,7 % depuis le 1er août 2026 (après 1,5 % de février à juillet), avec un plafond de 22 950 € pour un particulier. Les intérêts sont exonérés d’impôt et de prélèvements sociaux.',
      'Son taux est révisé deux fois par an selon une formule qui tient compte de l’inflation et des taux courts. Il sert d’épargne de précaution, pas d’investissement de long terme : sur longue période, il protège mal du coût de la vie.',
    ],
    related: ['inflation', 'rendement-reel', 'taux-directeur'],
  },
  {
    slug: 'flat-tax', term: 'Flat tax (PFU)', cat: 'fiscalite',
    short: 'Le prélèvement forfaitaire unique sur les revenus du capital : 31,4 % en 2026.',
    body: [
      'Le PFU regroupe 12,8 % d’impôt sur le revenu et 18,6 % de prélèvements sociaux, soit 31,4 % depuis la hausse de la CSG au 1er janvier 2026 (le taux était de 30 % auparavant).',
      'Il s’applique notamment aux dividendes, aux intérêts et aux plus-values sur un compte-titres, ainsi qu’aux plus-values sur cryptoactifs. L’assurance-vie, les revenus fonciers et les plus-values immobilières restent à 17,2 % de prélèvements sociaux ; les livrets réglementés (Livret A, LDDS, LEP) restent exonérés.',
    ],
    related: ['pea', 'cto', 'assurance-vie', 'dividende'],
  },
  {
    slug: 'inflation', term: 'Inflation', cat: 'notions',
    short: 'La hausse générale des prix, qui réduit ce que tu peux acheter avec la même somme.',
    body: [
      'En France, l’Insee la mesure chaque mois avec l’indice des prix à la consommation. Une inflation de 2 % signifie qu’un panier de biens et services coûte en moyenne 2 % de plus qu’un an plus tôt.',
      'Pour un épargnant, c’est le point de référence : un placement qui rapporte moins que l’inflation fait perdre du pouvoir d’achat, même si son solde augmente.',
    ],
    related: ['rendement-reel', 'livret-a', 'taux-directeur'],
  },
  {
    slug: 'rendement-reel', term: 'Rendement réel', cat: 'notions',
    short: 'Le rendement d’un placement une fois l’inflation déduite : ce que tu gagnes vraiment en pouvoir d’achat.',
    body: [
      'Si un placement rapporte 3 % et que l’inflation est de 2 %, le rendement réel est d’environ 1 %. La formule exacte est (1 + rendement) / (1 + inflation) − 1.',
      'C’est le chiffre qui compte sur le long terme. Un rendement nominal élevé dans un contexte de forte inflation peut cacher un rendement réel nul, voire négatif.',
    ],
    related: ['inflation', 'livret-a', 'interets-composes'],
  },
  {
    slug: 'interets-composes', term: 'Intérêts composés', cat: 'notions',
    short: 'Les gains produisent eux-mêmes des gains : la croissance s’accélère avec le temps.',
    body: [
      'Avec 1 000 € placés à 5 % par an, tu as 1 050 € après un an. La deuxième année, les 5 % portent sur 1 050 €, pas sur 1 000 €. Après 30 ans, le capital dépasse 4 300 €, dont plus des trois quarts viennent des gains.',
      'L’effet joue dans les deux sens : des frais de 2 % par an se composent aussi, et peuvent amputer une part importante du capital final sur une longue durée.',
    ],
    related: ['cagr', 'ter', 'horizon-de-placement'],
  },
  {
    slug: 'cagr', term: 'Taux de croissance annuel moyen', cat: 'notions',
    short: 'Le rendement annuel constant qui mènerait de la valeur de départ à la valeur d’arrivée (CAGR en anglais).',
    body: [
      'Un placement qui passe de 10 000 € à 20 000 € en 10 ans a un taux de croissance annuel moyen d’environ 7,2 %, même si certaines années ont été à −20 % et d’autres à +30 %.',
      'C’est plus juste qu’une moyenne simple des rendements annuels, qui surestime la performance quand les rendements sont volatils.',
    ],
    related: ['interets-composes', 'volatilite'],
  },
  {
    slug: 'dca', term: 'DCA (investissement programmé)', cat: 'notions',
    short: 'Investir un montant fixe à intervalles réguliers, quel que soit le prix.',
    body: [
      'Le Dollar Cost Averaging consiste par exemple à investir 100 € chaque mois. Quand le prix baisse, tu achètes plus de parts ; quand il monte, moins. Ton prix de revient moyen se lisse dans le temps.',
      'Le DCA ne garantit pas un gain et, sur un marché qui monte longtemps, investir une somme d’un coup a souvent fait mieux. Son vrai intérêt est de rendre l’investissement régulier, automatique et moins dépendant de l’émotion du moment.',
    ],
    related: ['volatilite', 'horizon-de-placement', 'drawdown'],
  },
  {
    slug: 'volatilite', term: 'Volatilité', cat: 'notions',
    short: 'L’amplitude des variations d’un prix : plus elle est forte, plus le prix bouge, à la hausse comme à la baisse.',
    body: [
      'On la mesure le plus souvent par l’écart-type des rendements, exprimé en pourcentage annuel. Un livret a une volatilité nulle, un grand indice d’actions tourne historiquement autour de 15 à 20 %, le Bitcoin bien au-delà de 50 %.',
      'Une forte volatilité n’est pas un problème en soi sur un horizon très long, mais elle devient un risque si tu peux avoir besoin de l’argent au mauvais moment.',
    ],
    related: ['drawdown', 'diversification', 'horizon-de-placement'],
  },
  {
    slug: 'drawdown', term: 'Drawdown (perte maximale)', cat: 'notions',
    short: 'La baisse entre un plus haut et le plus bas qui suit, avant de retrouver le sommet.',
    body: [
      'Si un portefeuille passe de 10 000 € à 6 000 € avant de remonter, son drawdown est de −40 %. Le drawdown maximal d’un actif donne une idée concrète du pire scénario déjà vécu.',
      'Point souvent oublié : après −50 %, il faut +100 % pour revenir au point de départ. C’est la raison pour laquelle les fortes baisses pèsent autant sur la performance à long terme.',
    ],
    related: ['volatilite', 'krach', 'bull-bear'],
  },
  {
    slug: 'diversification', term: 'Diversification', cat: 'notions',
    short: 'Répartir son argent sur des actifs qui ne bougent pas tous de la même façon, pour réduire le risque global.',
    body: [
      'Détenir une seule action expose à la faillite d’une seule entreprise. En détenir des centaines, dans plusieurs pays et secteurs, réduit fortement ce risque spécifique.',
      'La diversification ne supprime pas le risque de marché : lors d’une crise générale, la plupart des actions baissent ensemble. Elle se travaille aussi entre classes d’actifs (actions, obligations, monétaire).',
    ],
    related: ['allocation-d-actifs', 'etf', 'volatilite'],
  },
  {
    slug: 'allocation-d-actifs', term: 'Allocation d’actifs', cat: 'notions',
    short: 'La répartition de ton patrimoine entre grandes catégories : actions, obligations, épargne de précaution, immobilier…',
    body: [
      'C’est la décision qui explique l’essentiel du comportement d’un portefeuille, bien plus que le choix de tel ou tel titre. Elle dépend de ton horizon, de tes besoins et de ta capacité à supporter les baisses.',
      'Une règle de bon sens : constituer d’abord une épargne de précaution disponible (plusieurs mois de dépenses), puis seulement investir ce qui peut rester placé longtemps.',
    ],
    related: ['diversification', 'reequilibrage', 'horizon-de-placement'],
  },
  {
    slug: 'reequilibrage', term: 'Rééquilibrage', cat: 'notions',
    short: 'Revenir périodiquement à la répartition cible de son portefeuille.',
    body: [
      'Si tu vises 70 % d’actions et 30 % d’obligations et que les actions montent fortement, elles peuvent peser 80 %. Rééquilibrer consiste à revenir à 70/30, en vendant une partie de ce qui a monté ou en orientant les nouveaux versements.',
      'Cela maintient le niveau de risque choisi au départ. Sur un compte-titres, vendre peut déclencher de l’impôt : orienter les versements futurs est souvent plus simple.',
    ],
    related: ['allocation-d-actifs', 'diversification'],
  },
  {
    slug: 'horizon-de-placement', term: 'Horizon de placement', cat: 'notions',
    short: 'La durée pendant laquelle tu peux laisser ton argent investi sans en avoir besoin.',
    body: [
      'C’est le premier critère pour choisir un placement. De l’argent dont tu auras besoin dans un an n’a rien à faire en actions ou en crypto, qui peuvent baisser fortement sur une courte période.',
      'Plus l’horizon est long, plus il laisse le temps de traverser les baisses, sans jamais garantir une issue positive.',
    ],
    related: ['volatilite', 'allocation-d-actifs', 'dca'],
  },
  {
    slug: 'ter', term: 'Frais courants (TER)', cat: 'bourse',
    short: 'Les frais annuels prélevés par un fonds ou un ETF, exprimés en pourcentage de ton investissement.',
    body: [
      'Le TER (Total Expense Ratio) est déduit directement de la valeur du fonds, tu ne le vois jamais passer. Un ETF World coûte souvent entre 0,1 % et 0,4 % par an, un fonds actif classique plutôt entre 1,5 % et 2,5 %.',
      'Sur 20 ou 30 ans, l’écart est considérable, car les frais se composent comme les gains. Le simulateur « coût des frais » de Grapheko permet de le chiffrer.',
    ],
    related: ['etf', 'interets-composes'],
  },
  {
    slug: 'risque-de-change', term: 'Risque de change', cat: 'notions',
    short: 'Le risque qu’une variation entre l’euro et une autre devise modifie la valeur de ton investissement.',
    body: [
      'Si tu détiens des actions américaines et que le dollar baisse de 10 % face à l’euro, ton investissement perd environ 10 % en euros, même si les actions n’ont pas bougé en dollars.',
      'Certains ETF sont couverts contre le risque de change (mention « Hedged »), contre un coût. Sur longue durée, beaucoup d’investisseurs acceptent ce risque dans un portefeuille diversifié.',
    ],
    related: ['diversification', 'indice'],
  },
  {
    slug: 'taux-directeur', term: 'Taux directeur', cat: 'notions',
    short: 'Le taux auquel une banque centrale prête aux banques ; il oriente tous les autres taux de l’économie.',
    body: [
      'Dans la zone euro, c’est la Banque centrale européenne qui le fixe. Elle le monte pour freiner l’inflation, et le baisse pour soutenir l’activité.',
      'Ses décisions touchent les crédits immobiliers, la rémunération des livrets, le prix des obligations et, indirectement, la valorisation des actions.',
    ],
    related: ['inflation', 'obligation', 'livret-a'],
  },
  {
    slug: 'valeur-refuge', term: 'Valeur refuge', cat: 'notions',
    short: 'Un actif vers lequel les investisseurs se tournent en période de crise, comme l’or ou certaines dettes d’État.',
    body: [
      'L’or, le franc suisse ou les emprunts d’État allemands ou américains sont traditionnellement considérés comme des valeurs refuges, parce qu’ils ont souvent mieux résisté pendant les crises.',
      'Le statut n’est jamais garanti : l’or a lui aussi connu de longues périodes de baisse, et les obligations ont chuté fortement en 2022.',
    ],
    related: ['diversification', 'obligation'],
  },
  {
    slug: 'blockchain', term: 'Blockchain', cat: 'crypto',
    short: 'Un registre partagé entre de nombreux ordinateurs, où les transactions sont regroupées en blocs reliés les uns aux autres.',
    body: [
      'Chaque bloc contient des transactions et une empreinte du bloc précédent : modifier un bloc ancien obligerait à refaire toute la chaîne qui suit, ce qui rend la falsification très coûteuse.',
      'Le registre est validé par un mécanisme de consensus : la preuve de travail (proof of work) pour Bitcoin, la preuve d’enjeu (proof of stake) pour Ethereum depuis 2022.',
    ],
    related: ['staking', 'smart-contract', 'wallet'],
  },
  {
    slug: 'smart-contract', term: 'Smart contract', cat: 'crypto',
    short: 'Un programme enregistré sur une blockchain, qui s’exécute automatiquement quand ses conditions sont remplies.',
    body: [
      'Popularisés par Ethereum, les smart contracts font tourner des échanges décentralisés, des prêts, des stablecoins ou des jetons.',
      'Leur code est généralement public et non modifiable une fois déployé : une faille peut être exploitée sans possibilité de retour en arrière, ce qui a déjà coûté des centaines de millions de dollars.',
    ],
    related: ['blockchain', 'stablecoin'],
  },
  {
    slug: 'staking', term: 'Staking', cat: 'crypto',
    short: 'Immobiliser des cryptos pour participer à la validation d’une blockchain en preuve d’enjeu, contre une rémunération.',
    body: [
      'Sur une blockchain en proof of stake comme Ethereum, les validateurs bloquent des jetons en garantie. En échange, ils reçoivent une rémunération, exprimée en rendement annuel.',
      'Le rendement est versé dans la même crypto : il ne protège pas d’une baisse du prix. S’y ajoutent des risques de plateforme, de blocage des fonds et de sanction en cas de mauvais comportement du validateur.',
    ],
    related: ['blockchain', 'volatilite'],
  },
  {
    slug: 'stablecoin', term: 'Stablecoin', cat: 'crypto',
    short: 'Une cryptomonnaie conçue pour valoir une monnaie classique, en général 1 dollar ou 1 euro.',
    body: [
      'La plupart sont adossés à des réserves (liquidités, bons du Trésor) détenues par l’émetteur, comme l’USDT ou l’USDC. Ils servent surtout de monnaie d’échange entre cryptos.',
      'La parité n’est pas garantie par un État : elle dépend de la solidité et de la transparence des réserves. En 2022, le stablecoin algorithmique TerraUSD a perdu sa parité et quasiment toute sa valeur.',
    ],
    related: ['mica', 'blockchain'],
  },
  {
    slug: 'halving', term: 'Halving', cat: 'crypto',
    short: 'La division par deux de la récompense des mineurs de Bitcoin, environ tous les quatre ans.',
    body: [
      'Tous les 210 000 blocs, la quantité de nouveaux bitcoins créés à chaque bloc est divisée par deux. Le dernier halving, en avril 2024, l’a fait passer de 6,25 à 3,125 BTC par bloc.',
      'C’est ce mécanisme qui plafonne l’offre totale à 21 millions de bitcoins. Son effet sur le prix est largement débattu : le halving est connu à l’avance par tout le marché.',
    ],
    related: ['blockchain'],
  },
  {
    slug: 'wallet', term: 'Wallet (portefeuille crypto)', cat: 'crypto',
    short: 'Le logiciel ou l’appareil qui garde les clés donnant accès à tes cryptos.',
    body: [
      'Sur une plateforme d’échange, c’est elle qui détient les clés : tu dépends de sa solvabilité. Avec un wallet personnel (application ou clé matérielle), tu détiens toi-même les clés, et la responsabilité qui va avec.',
      'La phrase de récupération (12 ou 24 mots) permet de restaurer le wallet. Quiconque la connaît peut vider le portefeuille : elle ne se communique jamais, à personne.',
    ],
    related: ['blockchain', 'mica'],
  },
  {
    slug: 'mica', term: 'MiCA', cat: 'crypto',
    short: 'Le règlement européen qui encadre les cryptoactifs et les prestataires qui les proposent.',
    body: [
      'Le règlement MiCA (Markets in Crypto-Assets) s’applique entièrement depuis le 30 décembre 2024. Il impose aux prestataires un agrément, des règles de protection des clients et des exigences de réserves pour les stablecoins.',
      'En France, c’est l’AMF qui délivre les agréments. Avant d’utiliser une plateforme, vérifie qu’elle figure sur la liste des prestataires autorisés publiée par l’AMF.',
    ],
    related: ['stablecoin', 'wallet'],
  },
]

export const getTerm = (slug) => TERMS.find((t) => t.slug === slug) || null
export const termsSorted = () => [...TERMS].sort((a, b) => a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' }))

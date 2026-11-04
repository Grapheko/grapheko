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
    related: ['indice', 'ter', 'etf-capitalisant', 'pea', 'diversification', 'gestion-passive', 'replication'],
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
    related: ['action', 'capitalisation', 'bpa'],
  },
  {
    slug: 'ordre-limite', term: 'Ordre à cours limité', cat: 'bourse',
    short: 'Un ordre d’achat ou de vente qui ne s’exécute qu’à un prix que tu fixes, ou mieux.',
    body: [
      'Avec un ordre « au marché », tu achètes au meilleur prix disponible à l’instant, quel qu’il soit. Avec un ordre à cours limité, tu fixes un prix maximum à l’achat (ou minimum à la vente) : l’ordre attend ou ne passe pas.',
      'Sur des titres peu échangés ou en début de séance, l’ordre à cours limité évite d’acheter nettement plus cher que prévu à cause d’un écart important entre acheteurs et vendeurs.',
    ],
    related: ['spread', 'liquidite', 'courtier', 'ordre-au-marche', 'carnet-d-ordres'],
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
    related: ['drawdown', 'bull-bear', 'volatilite', 'horizon-de-placement', 'correction'],
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
    related: ['pea', 'cto', 'flat-tax', 'fonds-euros', 'unites-de-compte'],
  },
  {
    slug: 'livret-a', term: 'Livret A', cat: 'epargne',
    short: 'Le livret d’épargne réglementé le plus répandu : sans risque, disponible à tout moment, défiscalisé.',
    body: [
      'Le Livret A rapporte 1,7 % depuis le 1er août 2026 (après 1,5 % de février à juillet), avec un plafond de 22 950 € pour un particulier. Les intérêts sont exonérés d’impôt et de prélèvements sociaux.',
      'Son taux est révisé deux fois par an selon une formule qui tient compte de l’inflation et des taux courts. Il sert d’épargne de précaution, pas d’investissement de long terme : sur longue période, il protège mal du coût de la vie.',
    ],
    related: ['inflation', 'rendement-reel', 'taux-directeur', 'ldds', 'lep', 'epargne-de-precaution'],
  },
  {
    slug: 'flat-tax', term: 'Flat tax (PFU)', cat: 'fiscalite',
    short: 'Le prélèvement forfaitaire unique sur les revenus du capital : 31,4 % en 2026.',
    body: [
      'Le PFU regroupe 12,8 % d’impôt sur le revenu et 18,6 % de prélèvements sociaux, soit 31,4 % depuis la hausse de la CSG au 1er janvier 2026 (le taux était de 30 % auparavant).',
      'Il s’applique notamment aux dividendes, aux intérêts et aux plus-values sur un compte-titres, ainsi qu’aux plus-values sur cryptoactifs. L’assurance-vie, les revenus fonciers et les plus-values immobilières restent à 17,2 % de prélèvements sociaux ; les livrets réglementés (Livret A, LDDS, LEP) restent exonérés.',
    ],
    related: ['pea', 'cto', 'assurance-vie', 'dividende', 'prelevements-sociaux', 'bareme-progressif'],
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
    related: ['volatilite', 'horizon-de-placement', 'drawdown', 'market-timing'],
  },
  {
    slug: 'volatilite', term: 'Volatilité', cat: 'notions',
    short: 'L’amplitude des variations d’un prix : plus elle est forte, plus le prix bouge, à la hausse comme à la baisse.',
    body: [
      'On la mesure le plus souvent par l’écart-type des rendements, exprimé en pourcentage annuel. Un livret a une volatilité nulle, un grand indice d’actions tourne historiquement autour de 15 à 20 %, le Bitcoin bien au-delà de 50 %.',
      'Une forte volatilité n’est pas un problème en soi sur un horizon très long, mais elle devient un risque si tu peux avoir besoin de l’argent au mauvais moment.',
    ],
    related: ['drawdown', 'diversification', 'horizon-de-placement', 'beta'],
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
    related: ['allocation-d-actifs', 'etf', 'volatilite', 'correlation'],
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
    related: ['staking', 'smart-contract', 'wallet', 'proof-of-work', 'proof-of-stake', 'layer-1'],
  },
  {
    slug: 'smart-contract', term: 'Smart contract', cat: 'crypto',
    short: 'Un programme enregistré sur une blockchain, qui s’exécute automatiquement quand ses conditions sont remplies.',
    body: [
      'Popularisés par Ethereum, les smart contracts font tourner des échanges décentralisés, des prêts, des stablecoins ou des jetons.',
      'Leur code est généralement public et non modifiable une fois déployé : une faille peut être exploitée sans possibilité de retour en arrière, ce qui a déjà coûté des centaines de millions de dollars.',
    ],
    related: ['blockchain', 'stablecoin', 'gas', 'defi', 'token'],
  },
  {
    slug: 'staking', term: 'Staking', cat: 'crypto',
    short: 'Immobiliser des cryptos pour participer à la validation d’une blockchain en preuve d’enjeu, contre une rémunération.',
    body: [
      'Sur une blockchain en proof of stake comme Ethereum, les validateurs bloquent des jetons en garantie. En échange, ils reçoivent une rémunération, exprimée en rendement annuel.',
      'Le rendement est versé dans la même crypto : il ne protège pas d’une baisse du prix. S’y ajoutent des risques de plateforme, de blocage des fonds et de sanction en cas de mauvais comportement du validateur.',
    ],
    related: ['blockchain', 'volatilite', 'proof-of-stake', 'validateur'],
  },
  {
    slug: 'stablecoin', term: 'Stablecoin', cat: 'crypto',
    short: 'Une cryptomonnaie conçue pour valoir une monnaie classique, en général 1 dollar ou 1 euro.',
    body: [
      'La plupart sont adossés à des réserves (liquidités, bons du Trésor) détenues par l’émetteur, comme l’USDT ou l’USDC. Ils servent surtout de monnaie d’échange entre cryptos.',
      'La parité n’est pas garantie par un État : elle dépend de la solidité et de la transparence des réserves. En 2022, le stablecoin algorithmique TerraUSD a perdu sa parité et quasiment toute sa valeur.',
    ],
    related: ['mica', 'blockchain', 'defi', 'token'],
  },
  {
    slug: 'halving', term: 'Halving', cat: 'crypto',
    short: 'La division par deux de la récompense des mineurs de Bitcoin, environ tous les quatre ans.',
    body: [
      'Tous les 210 000 blocs, la quantité de nouveaux bitcoins créés à chaque bloc est divisée par deux. Le dernier halving, en avril 2024, l’a fait passer de 6,25 à 3,125 BTC par bloc.',
      'C’est ce mécanisme qui plafonne l’offre totale à 21 millions de bitcoins. Son effet sur le prix est largement débattu : le halving est connu à l’avance par tout le marché.',
    ],
    related: ['blockchain', 'minage', 'satoshi'],
  },
  {
    slug: 'wallet', term: 'Wallet (portefeuille crypto)', cat: 'crypto',
    short: 'Le logiciel ou l’appareil qui garde les clés donnant accès à tes cryptos.',
    body: [
      'Sur une plateforme d’échange, c’est elle qui détient les clés : tu dépends de sa solvabilité. Avec un wallet personnel (application ou clé matérielle), tu détiens toi-même les clés, et la responsabilité qui va avec.',
      'La phrase de récupération (12 ou 24 mots) permet de restaurer le wallet. Quiconque la connaît peut vider le portefeuille : elle ne se communique jamais, à personne.',
    ],
    related: ['blockchain', 'mica', 'cle-privee', 'phrase-de-recuperation', 'cold-wallet'],
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
  // ── Crypto : fonctionnement des blockchains ─────────────────
  {
    slug: 'proof-of-work', aliases: 'PoW preuve de travail', term: 'Proof of Work (preuve de travail)', cat: 'crypto',
    short: 'Le mécanisme de consensus où des mineurs dépensent de la puissance de calcul pour valider les blocs. C’est celui de Bitcoin.',
    body: [
      'Pour ajouter un bloc de transactions, les mineurs cherchent une solution à un problème mathématique qui ne se résout qu’en essayant des milliards de combinaisons. Le premier qui trouve gagne la récompense du bloc et les frais de transaction.',
      'La sécurité vient du coût : pour réécrire l’historique, un attaquant devrait contrôler plus de la moitié de la puissance de calcul du réseau (une « attaque des 51 % »), ce qui coûterait une fortune sur Bitcoin. Contrepartie : une forte consommation d’électricité.',
    ],
    related: ['minage', 'hashrate', 'proof-of-stake', 'blockchain'],
  },
  {
    slug: 'proof-of-stake', aliases: 'PoS preuve d enjeu', term: 'Proof of Stake (preuve d’enjeu)', cat: 'crypto',
    short: 'Le mécanisme de consensus où des validateurs bloquent des cryptos en garantie pour valider les blocs. C’est celui d’Ethereum depuis 2022.',
    body: [
      'Au lieu de dépenser de l’énergie, les validateurs immobilisent des jetons. Ils sont choisis pour proposer et vérifier les blocs, et touchent une rémunération. S’ils trichent ou tombent souvent en panne, une partie de leur mise est confisquée : c’est le « slashing ».',
      'Ethereum est passé du Proof of Work au Proof of Stake le 15 septembre 2022 (« The Merge »), ce qui a réduit sa consommation d’énergie d’environ 99,95 % selon l’Ethereum Foundation. Solana, Cardano ou Avalanche utilisent aussi des variantes de ce modèle.',
    ],
    related: ['validateur', 'staking', 'proof-of-work', 'layer-1'],
  },
  {
    slug: 'minage', term: 'Minage', cat: 'crypto',
    short: 'L’activité qui consiste à valider des blocs sur une blockchain en Proof of Work, en échange de nouvelles unités créées et de frais.',
    body: [
      'Les mineurs font tourner des machines spécialisées (des ASIC pour Bitcoin) qui calculent en continu. Leur rentabilité dépend du prix de la crypto, du coût de l’électricité et de la concurrence des autres mineurs.',
      'Sur Bitcoin, la récompense par bloc est divisée par deux tous les 210 000 blocs, environ tous les quatre ans : c’est le halving. Elle est de 3,125 BTC depuis avril 2024.',
    ],
    related: ['proof-of-work', 'hashrate', 'halving'],
  },
  {
    slug: 'hashrate', term: 'Hashrate', cat: 'crypto',
    short: 'La puissance de calcul totale consacrée au minage d’une blockchain. Plus elle est élevée, plus le réseau est coûteux à attaquer.',
    body: [
      'Le hashrate se mesure en nombre de calculs par seconde. Sur Bitcoin, il se compte en exahash par seconde (des milliards de milliards de calculs).',
      'Le réseau ajuste automatiquement la difficulté du minage tous les 2 016 blocs, environ toutes les deux semaines, pour maintenir un bloc toutes les dix minutes en moyenne, quel que soit le nombre de mineurs.',
    ],
    related: ['minage', 'proof-of-work'],
  },
  {
    slug: 'validateur', term: 'Validateur', cat: 'crypto',
    short: 'Sur une blockchain en Proof of Stake, l’acteur qui bloque des jetons en garantie pour proposer et vérifier les blocs.',
    body: [
      'Sur Ethereum, faire tourner son propre validateur demande 32 ETH et un ordinateur connecté en permanence. La plupart des particuliers passent plutôt par une plateforme ou un service de staking qui mutualise les mises.',
      'Un validateur malhonnête ou défaillant peut perdre une partie de ses jetons. Déléguer son staking, c’est aussi déléguer ce risque et la garde de ses fonds.',
    ],
    related: ['proof-of-stake', 'staking'],
  },
  {
    slug: 'layer-1', aliases: 'L1 couche 1', term: 'Layer 1 (couche 1)', cat: 'crypto',
    short: 'Une blockchain de base, qui assure elle-même la sécurité et le règlement des transactions : Bitcoin, Ethereum, Solana…',
    body: [
      'Une layer 1 a son propre réseau, son propre mécanisme de consensus et sa propre crypto, utilisée pour payer les frais. C’est la fondation sur laquelle tout le reste est construit.',
      'Les layer 1 font face au même compromis : il est difficile d’être à la fois très rapide, très sûr et très décentralisé. Bitcoin et Ethereum privilégient la sécurité et la décentralisation, d’autres comme Solana misent davantage sur la vitesse.',
    ],
    related: ['layer-2', 'blockchain', 'proof-of-stake'],
  },
  {
    slug: 'layer-2', aliases: 'L2 couche 2 lightning arbitrum', term: 'Layer 2 (couche 2)', cat: 'crypto',
    short: 'Un réseau construit au-dessus d’une blockchain pour traiter plus de transactions, plus vite et moins cher, en s’appuyant sur sa sécurité.',
    body: [
      'Le principe : exécuter les transactions en dehors de la chaîne principale, puis y inscrire un résumé. On profite de la sécurité de la layer 1 sans en subir l’encombrement ni les frais élevés.',
      'Exemples : le Lightning Network pour les paiements en bitcoin, Arbitrum, Optimism ou Base pour Ethereum. Les fonds doivent passer de la layer 1 à la layer 2 par un pont, une étape qui comporte ses propres risques.',
    ],
    related: ['layer-1', 'rollup', 'bridge', 'gas'],
  },
  {
    slug: 'rollup', term: 'Rollup', cat: 'crypto',
    short: 'Le type de layer 2 le plus répandu sur Ethereum : il regroupe des centaines de transactions en un seul lot publié sur la chaîne principale.',
    body: [
      'Il en existe deux familles. Les rollups « optimistes » considèrent les transactions valides par défaut et laissent un délai pour les contester. Les rollups « zero-knowledge » (ZK) publient une preuve mathématique que tout est correct.',
      'En partageant le coût d’une inscription sur Ethereum entre de nombreuses transactions, les rollups divisent fortement les frais pour l’utilisateur.',
    ],
    related: ['layer-2', 'gas'],
  },
  {
    slug: 'gas', aliases: 'gwei frais', term: 'Gas (frais de réseau)', cat: 'crypto',
    short: 'Les frais payés pour faire exécuter une transaction ou un smart contract sur Ethereum, réglés en ETH.',
    body: [
      'Chaque opération consomme une quantité de « gas » qui dépend de sa complexité : un simple transfert en consomme peu, un échange sur une plateforme décentralisée beaucoup plus. Le prix du gas s’exprime en gwei (un milliardième d’ETH).',
      'Ce prix monte quand le réseau est encombré. C’est l’une des raisons du succès des layer 2, où les frais sont souvent de quelques centimes.',
    ],
    related: ['smart-contract', 'layer-2', 'rollup'],
  },
  {
    slug: 'fork', term: 'Fork', cat: 'crypto',
    short: 'Une modification des règles d’une blockchain. Si une partie du réseau refuse le changement, la chaîne se divise en deux.',
    body: [
      'Un « soft fork » reste compatible avec les anciennes règles. Un « hard fork » ne l’est pas : tous les participants doivent mettre à jour, sinon deux chaînes coexistent.',
      'Exemples de scissions : Ethereum Classic en 2016, Bitcoin Cash en 2017. Les détenteurs se retrouvent alors avec des unités sur les deux chaînes, dont la valeur évolue séparément.',
    ],
    related: ['blockchain', 'layer-1'],
  },
  {
    slug: 'oracle', term: 'Oracle', cat: 'crypto',
    short: 'Un service qui transmet des données extérieures (prix, résultats, météo) à une blockchain, pour que les smart contracts puissent les utiliser.',
    body: [
      'Une blockchain ne peut pas consulter internet par elle-même. Un protocole de prêt qui doit connaître le prix de l’ETH pour liquider une position a donc besoin d’un oracle.',
      'Chainlink est le réseau d’oracles le plus utilisé. Un oracle manipulé ou défaillant peut provoquer des pertes importantes : c’est un point de fragilité de la finance décentralisée.',
    ],
    related: ['smart-contract', 'defi'],
  },
  {
    slug: 'bridge', term: 'Bridge (pont)', cat: 'crypto',
    short: 'Un protocole qui permet de faire passer des cryptos d’une blockchain à une autre.',
    body: [
      'En général, le bridge bloque les jetons sur la chaîne de départ et émet une version équivalente sur la chaîne d’arrivée. Il concentre donc de grosses sommes au même endroit.',
      'Les bridges ont été la cible de plusieurs des plus gros piratages de l’histoire des cryptos, pour des centaines de millions de dollars. Moins on fait transiter de fonds par des ponts, moins on s’expose.',
    ],
    related: ['layer-2', 'defi', 'smart-contract'],
  },
  {
    slug: 'satoshi', aliases: 'sats', term: 'Satoshi (sat)', cat: 'crypto',
    short: 'La plus petite unité du bitcoin : un cent-millionième de BTC.',
    body: [
      '1 BTC = 100 000 000 satoshis. On n’a donc pas besoin d’acheter un bitcoin entier : on peut en acheter pour 10 € comme pour 10 000 €.',
      'Le nom rend hommage à Satoshi Nakamoto, le pseudonyme de la personne ou du groupe qui a publié le livre blanc de Bitcoin le 31 octobre 2008. Le nombre total de bitcoins est plafonné à 21 millions.',
    ],
    related: ['whitepaper', 'halving'],
  },
  {
    slug: 'whitepaper', term: 'Whitepaper (livre blanc)', cat: 'crypto',
    short: 'Le document qui présente un projet crypto : le problème visé, le fonctionnement technique, la répartition des jetons.',
    body: [
      'Le plus célèbre est celui de Bitcoin, neuf pages publiées en 2008. Un whitepaper sérieux explique clairement ce que fait le projet et pourquoi il a besoin d’une blockchain et d’un jeton.',
      'Sous MiCA, la plupart des émetteurs de cryptoactifs doivent publier un livre blanc conforme et le notifier au régulateur. Un document flou, rempli de promesses de rendement, est un signal d’alerte.',
    ],
    related: ['tokenomics', 'mica', 'rug-pull'],
  },
  {
    slug: 'tokenomics', term: 'Tokenomics', cat: 'crypto',
    short: 'Les règles économiques d’un jeton : nombre total, rythme d’émission, répartition entre fondateurs et investisseurs, déblocages.',
    body: [
      'Deux chiffres à distinguer : l’offre en circulation (les jetons déjà sur le marché) et l’offre maximale. Si une grande partie reste à émettre ou à débloquer, la pression vendeuse future peut peser sur le prix.',
      'Il faut aussi regarder qui détient quoi. Quand l’équipe et les premiers investisseurs possèdent une grosse part des jetons, avec des déblocages programmés, le risque de ventes massives est réel.',
    ],
    related: ['whitepaper', 'token', 'capitalisation'],
  },

  // ── Crypto : actifs et usages ────────────────────────────────
  {
    slug: 'token', term: 'Token (jeton)', cat: 'crypto',
    short: 'Une crypto créée sur une blockchain existante, par opposition à la crypto native de cette blockchain.',
    body: [
      'L’ETH est la crypto native d’Ethereum : elle sert à payer les frais du réseau. Des milliers d’autres jetons sont émis sur Ethereum grâce à des smart contracts : stablecoins, jetons de protocoles, NFT.',
      'Un jeton peut représenter beaucoup de choses : un droit de vote dans un protocole, un dollar numérique, un objet de collection. Sa valeur dépend entièrement de ce qu’il permet de faire et de la confiance dans son émetteur.',
    ],
    related: ['smart-contract', 'stablecoin', 'nft', 'altcoin'],
  },
  {
    slug: 'altcoin', term: 'Altcoin', cat: 'crypto',
    short: 'Toute crypto autre que le bitcoin.',
    body: [
      'Le terme regroupe des projets très différents : de grandes plateformes comme Ethereum ou Solana, des stablecoins, mais aussi des milliers de jetons sans usage réel.',
      'Historiquement, les altcoins sont plus volatils que le bitcoin : ils montent souvent plus fort dans les phases d’euphorie et chutent plus fort ensuite. Beaucoup ont disparu ou perdu l’essentiel de leur valeur.',
    ],
    related: ['token', 'dominance-bitcoin', 'volatilite'],
  },
  {
    slug: 'dominance-bitcoin', term: 'Dominance du bitcoin', cat: 'crypto',
    short: 'La part du bitcoin dans la capitalisation totale du marché des cryptos.',
    body: [
      'Si le marché crypto vaut 3 000 milliards et le bitcoin 1 800 milliards, sa dominance est de 60 %. L’indicateur sert à voir si l’argent se concentre sur le bitcoin ou se disperse vers les altcoins.',
      'Une dominance qui baisse accompagne souvent les phases spéculatives sur les altcoins. Ce n’est pas un signal d’achat ou de vente fiable, seulement une photographie du marché.',
    ],
    related: ['altcoin', 'capitalisation'],
  },
  {
    slug: 'defi', term: 'DeFi (finance décentralisée)', cat: 'crypto',
    short: 'Des services financiers (prêt, emprunt, échange) qui fonctionnent par smart contracts, sans banque ni intermédiaire.',
    body: [
      'On peut prêter des stablecoins contre intérêts, emprunter en déposant des cryptos en garantie ou échanger des jetons sur une plateforme décentralisée, à toute heure, depuis un simple wallet.',
      'Les risques sont spécifiques : faille dans un smart contract, oracle manipulé, liquidation automatique si la garantie perd de la valeur. Les rendements élevés affichés rémunèrent souvent ces risques.',
    ],
    related: ['smart-contract', 'dex', 'oracle', 'stablecoin'],
  },
  {
    slug: 'cex', aliases: 'exchange binance coinbase', term: 'CEX (plateforme centralisée)', cat: 'crypto',
    short: 'Une plateforme d’échange gérée par une entreprise, qui détient les cryptos de ses clients : Binance, Coinbase, Kraken…',
    body: [
      'C’est la porte d’entrée la plus simple : on dépose des euros, on achète, l’interface ressemble à celle d’un courtier. En échange, la plateforme garde les clés de tes cryptos.',
      'La faillite de FTX en novembre 2022 a rappelé le risque : les clients ont vu leurs fonds bloqués. En France, vérifie qu’une plateforme est autorisée par l’AMF au titre de MiCA avant de l’utiliser.',
    ],
    related: ['dex', 'wallet', 'mica', 'kyc'],
  },
  {
    slug: 'dex', aliases: 'uniswap', term: 'DEX (plateforme décentralisée)', cat: 'crypto',
    short: 'Une plateforme d’échange qui fonctionne par smart contracts, sans entreprise qui détient les fonds : Uniswap, Curve…',
    body: [
      'On échange directement depuis son wallet. Les prix sont souvent fixés par un « teneur de marché automatique » : des réserves de jetons alimentées par des utilisateurs, rémunérés par les frais.',
      'Avantage : on garde ses clés. Inconvénients : frais de réseau, risque de faille dans le smart contract et facilité de lister n’importe quel jeton, y compris des arnaques.',
    ],
    related: ['cex', 'defi', 'gas', 'rug-pull'],
  },
  {
    slug: 'nft', term: 'NFT', cat: 'crypto',
    short: 'Un jeton unique enregistré sur une blockchain, qui sert de certificat de propriété pour un objet numérique.',
    body: [
      'Contrairement à un bitcoin, qui est interchangeable avec un autre, chaque NFT (non-fungible token) est unique. Il peut représenter une œuvre, un billet, un objet de jeu vidéo.',
      'Posséder un NFT ne donne pas forcément les droits d’auteur sur l’œuvre. Après l’engouement de 2021, les volumes et les prix de la plupart des collections se sont effondrés.',
    ],
    related: ['token', 'smart-contract'],
  },
  {
    slug: 'airdrop', term: 'Airdrop', cat: 'crypto',
    short: 'Une distribution gratuite de jetons par un projet, souvent pour récompenser ses premiers utilisateurs.',
    body: [
      'Certains protocoles ont distribué des jetons à ceux qui les avaient utilisés tôt, parfois pour des montants importants. Cela a créé une chasse aux airdrops.',
      'C’est aussi un appât classique d’arnaque : un jeton inconnu apparaît dans ton wallet avec un lien pour le « réclamer ». Ne jamais connecter son wallet ni signer une transaction sur un site inconnu.',
    ],
    related: ['token', 'rug-pull', 'wallet'],
  },

  // ── Crypto : sécurité et accès ───────────────────────────────
  {
    slug: 'cle-privee', aliases: 'private key', term: 'Clé privée', cat: 'crypto',
    short: 'Le code secret qui permet de dépenser les cryptos associées à une adresse. Qui a la clé a les fonds.',
    body: [
      'Une adresse publique sert à recevoir, comme un numéro de compte. La clé privée sert à signer les transactions sortantes. Elle est générée et conservée par le wallet.',
      'Il n’y a ni service client ni recours : une clé privée perdue, ce sont des fonds perdus ; une clé volée, des fonds volés. D’où l’adage « not your keys, not your coins ».',
    ],
    related: ['phrase-de-recuperation', 'wallet', 'cold-wallet'],
  },
  {
    slug: 'phrase-de-recuperation', aliases: 'seed phrase mnemonique', term: 'Phrase de récupération (seed)', cat: 'crypto',
    short: 'Une suite de 12 ou 24 mots qui permet de restaurer un wallet et toutes ses clés privées.',
    body: [
      'Elle est affichée une seule fois, à la création du wallet. Elle doit être notée sur papier (ou gravée sur métal) et rangée en lieu sûr, jamais en photo ni dans un fichier en ligne.',
      'Aucun service légitime ne la demandera jamais : ni ta plateforme, ni le fabricant de ta clé, ni un « support technique ». Toute demande de ce type est une arnaque.',
    ],
    related: ['cle-privee', 'wallet', 'cold-wallet'],
  },
  {
    slug: 'cold-wallet', aliases: 'hardware wallet ledger trezor hot wallet', term: 'Cold wallet (portefeuille froid)', cat: 'crypto',
    short: 'Un wallet dont les clés restent hors ligne, le plus souvent sur une clé matérielle dédiée.',
    body: [
      'Les clés ne quittent jamais l’appareil (Ledger, Trezor…) : pour envoyer des fonds, on valide la transaction sur l’appareil lui-même. Même un ordinateur infecté ne peut pas les voler.',
      'À l’inverse, un « hot wallet » (application mobile, extension de navigateur) est connecté en permanence : pratique au quotidien, plus exposé. On garde l’essentiel au froid et une petite somme au chaud.',
    ],
    related: ['wallet', 'cle-privee', 'phrase-de-recuperation'],
  },
  {
    slug: 'kyc', term: 'KYC (vérification d’identité)', cat: 'crypto',
    short: 'La vérification d’identité qu’une plateforme régulée doit effectuer avant de t’ouvrir un compte.',
    body: [
      'KYC signifie « Know Your Customer ». Pièce d’identité, selfie, parfois justificatif de domicile ou d’origine des fonds : ces contrôles découlent des règles de lutte contre le blanchiment.',
      'Une plateforme qui propose d’acheter de grosses sommes sans aucune vérification n’est probablement pas autorisée en France. C’est un signal d’alerte, pas un avantage.',
    ],
    related: ['cex', 'mica'],
  },
  {
    slug: 'rug-pull', term: 'Rug pull', cat: 'crypto',
    short: 'Une arnaque où les créateurs d’un projet crypto disparaissent avec l’argent des investisseurs.',
    body: [
      'Le scénario type : un nouveau jeton, beaucoup de communication, une hausse spectaculaire, puis l’équipe retire toutes les réserves ou vend ses jetons d’un coup. Le prix tombe à presque zéro.',
      'Signaux d’alerte : équipe anonyme, promesses de rendement garanti, pression pour acheter vite, jetons concentrés dans quelques portefeuilles, impossibilité de revendre.',
    ],
    related: ['whitepaper', 'tokenomics', 'dex', 'airdrop'],
  },
  {
    slug: 'etp-crypto', aliases: 'ETF bitcoin ETN', term: 'ETF / ETP crypto', cat: 'crypto',
    short: 'Un produit coté en Bourse qui suit le cours d’une crypto, pour s’y exposer depuis un compte-titres, sans wallet.',
    body: [
      'Aux États-Unis, des ETF « spot » sur le bitcoin, qui détiennent réellement des bitcoins, sont autorisés depuis janvier 2024. En Europe, les règles des fonds ne permettent pas un ETF sur une seule crypto : on trouve à la place des ETP ou ETN, des titres adossés à la crypto.',
      'Ils évitent la gestion des clés, mais comportent des frais annuels et un risque lié à l’émetteur. Ils ne sont pas éligibles au PEA.',
    ],
    related: ['etf', 'cto', 'wallet'],
  },

  // ── Bourse : passer des ordres ───────────────────────────────
  {
    slug: 'ordre-au-marche', term: 'Ordre au marché', cat: 'bourse',
    short: 'Un ordre d’achat ou de vente exécuté immédiatement, au meilleur prix disponible à cet instant.',
    body: [
      'Il a l’avantage d’être exécuté presque à coup sûr. L’inconvénient : tu ne maîtrises pas le prix. Sur un titre peu échangé ou à l’ouverture de la séance, l’écart avec le dernier cours affiché peut être important.',
      'Pour un ETF très liquide en pleine séance, l’ordre au marché pose rarement problème. Pour un titre peu liquide, l’ordre à cours limité est plus prudent.',
    ],
    related: ['ordre-limite', 'carnet-d-ordres', 'spread', 'liquidite'],
  },
  {
    slug: 'carnet-d-ordres', term: 'Carnet d’ordres', cat: 'bourse',
    short: 'La liste, en temps réel, des ordres d’achat et de vente en attente sur un titre, avec leurs prix et leurs quantités.',
    body: [
      'D’un côté les acheteurs et le prix qu’ils proposent, de l’autre les vendeurs et le prix qu’ils demandent. L’écart entre le meilleur acheteur et le meilleur vendeur est le spread.',
      'Un carnet bien rempli signifie qu’on peut acheter ou vendre de grosses quantités sans faire bouger le prix. Un carnet vide est le signe d’un titre peu liquide.',
    ],
    related: ['spread', 'liquidite', 'ordre-limite'],
  },
  {
    slug: 'stop-loss', aliases: 'ordre stop', term: 'Stop loss (ordre stop)', cat: 'bourse',
    short: 'Un ordre de vente qui se déclenche automatiquement si le cours tombe sous un seuil, pour limiter une perte.',
    body: [
      'Exemple : tu achètes à 100 € et places un stop à 90 €. Si le cours touche 90 €, un ordre de vente part automatiquement.',
      'Il ne garantit pas le prix : en cas de chute brutale ou d’ouverture en forte baisse, la vente peut se faire bien en dessous du seuil. Pour un investisseur de long terme en ETF, il peut aussi faire vendre au pire moment, juste avant un rebond.',
    ],
    related: ['ordre-limite', 'ordre-au-marche', 'volatilite'],
  },
  {
    slug: 'frais-de-courtage', term: 'Frais de courtage', cat: 'bourse',
    short: 'Les frais prélevés par le courtier à chaque achat ou vente de titres.',
    body: [
      'Ils peuvent être fixes (quelques euros par ordre), proportionnels au montant, ou mélanger les deux. Certains courtiers proposent des ordres gratuits sous conditions, par exemple pour les investissements programmés.',
      'Pour de petits versements mensuels, des frais fixes élevés pèsent lourd : 5 € de frais sur un achat de 100 €, c’est déjà 5 % de perdus. Ils s’ajoutent aux frais annuels des fonds, mesurés par le TER.',
    ],
    related: ['courtier', 'ter', 'dca'],
  },

  // ── Bourse : entreprises et indicateurs ──────────────────────
  {
    slug: 'introduction-en-bourse', aliases: 'IPO', term: 'Introduction en Bourse (IPO)', cat: 'bourse',
    short: 'La première mise en vente des actions d’une entreprise sur un marché boursier.',
    body: [
      'L’entreprise lève de l’argent auprès du public ou permet à ses actionnaires historiques de vendre une partie de leurs titres. Le prix est fixé avec des banques à partir de la demande des investisseurs.',
      'Les introductions très médiatisées attirent l’attention, mais leurs performances dans les années suivantes sont très variables. Le prospectus, validé par l’AMF en France, détaille l’activité et les risques.',
    ],
    related: ['action', 'capitalisation'],
  },
  {
    slug: 'bpa', aliases: 'EPS', term: 'BPA (bénéfice par action)', cat: 'bourse',
    short: 'Le bénéfice net d’une entreprise divisé par son nombre d’actions.',
    body: [
      'Une entreprise qui gagne 1 milliard d’euros avec 500 millions d’actions a un BPA de 2 €. C’est la base du calcul du PER : cours de l’action divisé par le BPA.',
      'Sa progression dans le temps compte plus que son niveau. Attention : un BPA peut monter simplement parce que l’entreprise rachète ses propres actions, sans que ses bénéfices augmentent.',
    ],
    related: ['per', 'rachat-d-actions', 'action'],
  },
  {
    slug: 'rendement-du-dividende', aliases: 'dividend yield', term: 'Rendement du dividende', cat: 'bourse',
    short: 'Le dividende annuel d’une action divisé par son cours, exprimé en pourcentage.',
    body: [
      'Une action à 50 € qui verse 2 € par an offre un rendement de 4 %. Le chiffre permet de comparer des entreprises entre elles ou avec un livret.',
      'Un rendement très élevé n’est pas toujours une bonne nouvelle : il peut venir d’un cours qui s’est effondré parce que le marché anticipe une baisse du dividende.',
    ],
    related: ['dividende', 'action', 'etf-capitalisant'],
  },
  {
    slug: 'rachat-d-actions', term: 'Rachat d’actions', cat: 'bourse',
    short: 'Une entreprise qui achète ses propres actions sur le marché, souvent pour les annuler.',
    body: [
      'Moins d’actions en circulation, c’est un bénéfice partagé entre moins de titres : chaque action restante représente une part un peu plus grande de l’entreprise.',
      'C’est une autre façon de rendre de l’argent aux actionnaires que le dividende, très utilisée aux États-Unis. Son intérêt dépend du prix payé : racheter des actions trop chères détruit de la valeur.',
    ],
    related: ['dividende', 'bpa', 'action'],
  },
  {
    slug: 'small-caps', term: 'Small caps (petites capitalisations)', cat: 'bourse',
    short: 'Les entreprises cotées de petite taille, généralement de quelques centaines de millions à quelques milliards d’euros de capitalisation.',
    body: [
      'Elles peuvent croître plus vite que les géants, mais sont aussi plus fragiles et moins liquides. Leurs cours varient souvent plus fortement, à la hausse comme à la baisse.',
      'Les grands indices comme le MSCI World ou le CAC 40 sont dominés par les grandes entreprises. Des ETF spécifiques permettent de s’exposer aux small caps.',
    ],
    related: ['capitalisation', 'liquidite', 'volatilite'],
  },
  {
    slug: 'value-croissance', term: 'Value et croissance', cat: 'bourse',
    short: 'Deux styles d’investissement : acheter des entreprises jugées bon marché (value) ou des entreprises dont les bénéfices progressent vite (croissance).',
    body: [
      'Les valeurs « value » affichent un PER bas, souvent dans des secteurs mûrs comme la banque ou l’énergie. Les valeurs de « croissance » se paient plus cher, en pariant sur des bénéfices futurs, comme beaucoup d’entreprises technologiques.',
      'Selon les périodes, l’un ou l’autre style fait mieux, sans qu’on puisse le prévoir de façon fiable. Un ETF sur un indice large mélange les deux.',
    ],
    related: ['per', 'action', 'diversification'],
  },
  {
    slug: 'oat', term: 'OAT (obligation de l’État français)', cat: 'bourse',
    short: 'Les obligations émises par l’État français pour financer sa dette.',
    body: [
      'OAT signifie « obligation assimilable du Trésor ». Leur taux, en particulier celui à 10 ans, sert de référence pour les crédits immobiliers et le coût de la dette publique.',
      'L’écart entre le taux de l’OAT et celui de l’obligation allemande équivalente, le « spread », est suivi comme un thermomètre de la confiance des marchés envers la France.',
    ],
    related: ['obligation', 'taux-directeur'],
  },

  // ── Bourse : fonds et produits ───────────────────────────────
  {
    slug: 'opcvm', aliases: 'SICAV FCP fonds', term: 'OPCVM (fonds d’investissement)', cat: 'bourse',
    short: 'Un fonds qui regroupe l’argent de nombreux épargnants pour l’investir selon une stratégie définie. SICAV et FCP en sont les deux formes.',
    body: [
      'En achetant une part, tu détiens une fraction d’un portefeuille géré par une société de gestion. Les règles européennes (UCITS) imposent notamment une diversification minimale.',
      'Les ETF sont des OPCVM cotés en Bourse. Les autres fonds se trouvent souvent dans les contrats d’assurance-vie ou les PEA bancaires, avec des frais généralement plus élevés.',
    ],
    related: ['etf', 'gestion-active', 'ter', 'unites-de-compte'],
  },
  {
    slug: 'gestion-passive', term: 'Gestion passive', cat: 'bourse',
    short: 'Une stratégie qui consiste à reproduire un indice plutôt qu’à essayer de le battre, généralement via des ETF.',
    body: [
      'L’idée : puisqu’il est difficile de battre le marché de façon durable, autant le suivre au plus près, avec des frais minimes.',
      'Les études comparatives, comme les rapports SPIVA de S&P, montrent régulièrement qu’une majorité de fonds actifs font moins bien que leur indice de référence sur dix ans ou plus, une fois les frais déduits.',
    ],
    related: ['etf', 'gestion-active', 'benchmark', 'ter'],
  },
  {
    slug: 'gestion-active', term: 'Gestion active', cat: 'bourse',
    short: 'Une stratégie où un gérant choisit les titres dans le but de faire mieux que le marché.',
    body: [
      'Le gérant sélectionne des entreprises, ajuste les pondérations et peut s’écarter fortement de l’indice. Cette recherche se paie : les frais annuels sont souvent de 1,5 % à 2 %, contre 0,05 % à 0,4 % pour un ETF.',
      'Certains gérants battent leur indice, mais il est difficile de les identifier à l’avance, et peu y parviennent durablement.',
    ],
    related: ['gestion-passive', 'opcvm', 'benchmark', 'ter'],
  },
  {
    slug: 'replication', term: 'Réplication physique et synthétique', cat: 'bourse',
    short: 'Les deux façons dont un ETF reproduit son indice : en détenant les titres, ou par un contrat d’échange avec une banque.',
    body: [
      'En réplication physique, l’ETF achète les actions de l’indice. En réplication synthétique, il détient d’autres titres et passe un contrat (un « swap ») avec une banque qui lui verse la performance de l’indice.',
      'La réplication synthétique permet de loger dans un PEA des ETF sur des indices mondiaux ou américains. Le risque de contrepartie est encadré par la réglementation européenne et reste limité.',
    ],
    related: ['etf', 'pea', 'indice'],
  },
  {
    slug: 'benchmark', term: 'Benchmark (indice de référence)', cat: 'notions',
    short: 'L’indice auquel on compare la performance d’un fonds ou d’un portefeuille.',
    body: [
      'Un fonds d’actions européennes se compare par exemple à l’indice MSCI Europe. Si le fonds fait +8 % quand son indice fait +10 %, il a sous-performé, même s’il a gagné de l’argent.',
      'Choisir le bon benchmark est essentiel : comparer un fonds prudent au Nasdaq ou un fonds tech au livret A n’a pas de sens.',
    ],
    related: ['indice', 'gestion-active', 'gestion-passive'],
  },
  {
    slug: 'produit-derive', aliases: 'CFD option future', term: 'Produit dérivé (CFD, option, future)', cat: 'bourse',
    short: 'Un contrat dont la valeur dépend d’un autre actif. Il permet de parier sur une hausse ou une baisse, souvent avec effet de levier.',
    body: [
      'Les options, les contrats à terme (futures) et les CFD sont utilisés par les professionnels pour se couvrir ou spéculer. Ils sont complexes et peuvent faire perdre plus que la mise de départ selon le produit.',
      'Pour les CFD, les courtiers doivent afficher la part de leurs clients particuliers qui perdent de l’argent : c’est la majorité. Ce ne sont pas des outils d’investissement de long terme.',
    ],
    related: ['effet-de-levier', 'vente-a-decouvert', 'volatilite'],
  },
  {
    slug: 'effet-de-levier', term: 'Effet de levier', cat: 'bourse',
    short: 'Investir avec de l’argent emprunté, ce qui multiplie les gains comme les pertes.',
    body: [
      'Avec un levier de 5, une hausse de 2 % de l’actif rapporte 10 %, mais une baisse de 2 % en fait perdre 10 %. Une baisse de 20 % efface toute la mise.',
      'Sur les produits à levier, une position perdante peut être fermée automatiquement (liquidée) avant même que le marché ne remonte. C’est l’une des premières causes de pertes chez les particuliers, en crypto comme en Bourse.',
    ],
    related: ['produit-derive', 'volatilite', 'drawdown'],
  },
  {
    slug: 'vente-a-decouvert', term: 'Vente à découvert', cat: 'bourse',
    short: 'Vendre un titre qu’on ne possède pas, en l’empruntant, pour le racheter plus tard moins cher et empocher la différence.',
    body: [
      'C’est une façon de parier sur une baisse. Le risque est asymétrique : le gain maximal est limité (le cours ne peut pas descendre sous zéro), la perte potentielle ne l’est pas.',
      'Des fonds y recourent pour couvrir leurs positions. Pour un particulier, c’est une stratégie spéculative à réserver à ceux qui en comprennent tous les mécanismes.',
    ],
    related: ['produit-derive', 'effet-de-levier', 'bull-bear'],
  },
  {
    slug: 'correction', term: 'Correction', cat: 'bourse',
    short: 'Une baisse d’au moins 10 % d’un marché ou d’un titre par rapport à son dernier plus haut.',
    body: [
      'Les corrections sont fréquentes et font partie du fonctionnement normal des marchés. Au-delà de 20 % de baisse, on parle généralement de marché baissier (bear market).',
      'Un krach désigne une chute particulièrement brutale, sur quelques jours. Pour un investisseur régulier, une correction est aussi l’occasion d’acheter moins cher.',
    ],
    related: ['krach', 'bull-bear', 'drawdown'],
  },
  {
    slug: 'plus-value', term: 'Plus-value et moins-value', cat: 'fiscalite',
    short: 'Le gain (ou la perte) réalisé en vendant un actif plus cher (ou moins cher) que son prix d’achat.',
    body: [
      'Tant que tu ne vends pas, la plus-value est « latente » : elle n’est pas imposée. Elle devient « réalisée », et imposable, au moment de la vente, sauf dans les enveloppes comme le PEA ou l’assurance-vie, où l’impôt n’intervient qu’au retrait.',
      'Sur un compte-titres, les moins-values réalisées s’imputent sur les plus-values de même nature de l’année et des dix années suivantes.',
    ],
    related: ['flat-tax', 'cto', 'pea'],
  },

  // ── Notions clés : risque et comportement ────────────────────
  {
    slug: 'beta', term: 'Bêta', cat: 'notions',
    short: 'Une mesure de la sensibilité d’un titre aux mouvements du marché.',
    body: [
      'Un bêta de 1 signifie que le titre bouge en moyenne comme le marché. À 1,5, il amplifie les mouvements : +15 % quand le marché fait +10 %, et inversement à la baisse. Sous 1, il est plus calme que le marché.',
      'Le bêta est calculé sur le passé et peut changer. Il ne mesure qu’une partie du risque, celle liée au marché dans son ensemble.',
    ],
    related: ['volatilite', 'correlation'],
  },
  {
    slug: 'correlation', term: 'Corrélation', cat: 'notions',
    short: 'La tendance de deux actifs à évoluer dans le même sens (corrélation positive) ou en sens inverse (négative).',
    body: [
      'Elle va de -1 à +1. Deux actifs corrélés à +1 montent et baissent ensemble ; à 0, leurs mouvements sont sans lien.',
      'C’est le fondement de la diversification : associer des actifs peu corrélés réduit les variations du portefeuille. Attention, les corrélations augmentent souvent pendant les crises, quand presque tout baisse en même temps.',
    ],
    related: ['diversification', 'beta', 'allocation-d-actifs'],
  },
  {
    slug: 'ratio-de-sharpe', term: 'Ratio de Sharpe', cat: 'notions',
    short: 'La performance obtenue par unité de risque pris : le rendement au-delà d’un placement sans risque, divisé par la volatilité.',
    body: [
      'Deux fonds qui font +8 % par an ne se valent pas si l’un a connu des variations deux fois plus fortes. Le ratio de Sharpe permet de les départager : plus il est élevé, meilleure est la performance au regard du risque.',
      'Il utilise la volatilité comme mesure du risque, ce qui traite de la même façon les hausses et les baisses. Le regarder avec la pire baisse historique donne une vision plus complète.',
    ],
    related: ['volatilite', 'drawdown', 'prime-de-risque'],
  },
  {
    slug: 'prime-de-risque', term: 'Prime de risque', cat: 'notions',
    short: 'Le supplément de rendement attendu pour accepter un placement risqué plutôt qu’un placement sûr.',
    body: [
      'Si un placement sans risque rapporte 2 %, personne n’accepterait les variations des actions pour 2 %. L’écart de rendement espéré entre les deux est la prime de risque.',
      'Elle n’est jamais garantie : elle se mesure sur de longues périodes, et peut être négative pendant plusieurs années.',
    ],
    related: ['ratio-de-sharpe', 'horizon-de-placement', 'volatilite'],
  },
  {
    slug: 'market-timing', term: 'Market timing', cat: 'notions',
    short: 'Essayer d’acheter au plus bas et de vendre au plus haut en anticipant les mouvements du marché.',
    body: [
      'Il faut avoir raison deux fois : au moment de sortir et au moment de revenir. Les meilleures séances arrivent souvent juste après les pires, et les manquer pèse lourdement sur la performance finale.',
      'Investir à intervalles réguliers (DCA) est une façon de ne pas avoir à choisir le bon moment.',
    ],
    related: ['dca', 'fomo', 'horizon-de-placement'],
  },
  {
    slug: 'fomo', aliases: 'peur de rater', term: 'FOMO', cat: 'notions',
    short: 'La peur de rater une hausse (« fear of missing out »), qui pousse à acheter dans la précipitation.',
    body: [
      'Un actif monte depuis des semaines, tout le monde en parle, on achète pour ne pas rester sur le quai, souvent près du sommet. Le mécanisme est particulièrement visible sur les cryptos.',
      'Antidotes : un plan décidé à l’avance (montant, fréquence, allocation), et la question « est-ce que j’achèterais si le prix n’avait pas monté ? ».',
    ],
    related: ['market-timing', 'dca', 'bull-bear'],
  },

  // ── Épargne ──────────────────────────────────────────────────
  {
    slug: 'epargne-de-precaution', term: 'Épargne de précaution', cat: 'epargne',
    short: 'Une réserve d’argent disponible à tout moment pour faire face aux imprévus, avant d’investir en Bourse.',
    body: [
      'Le repère souvent cité est de trois à six mois de dépenses, à adapter selon la stabilité de tes revenus. Elle se place sur des supports sans risque et disponibles : Livret A, LDDS, LEP si tu y as droit.',
      'Elle évite de devoir vendre des actions en pleine baisse pour payer une réparation ou passer une période sans revenus.',
    ],
    related: ['livret-a', 'ldds', 'lep', 'horizon-de-placement'],
  },
  {
    slug: 'ldds', term: 'LDDS', cat: 'epargne',
    short: 'Le livret de développement durable et solidaire : mêmes règles et même taux que le Livret A, avec un plafond de 12 000 €.',
    body: [
      'Il rapporte 1,7 % depuis le 1er août 2026, comme le Livret A, sans impôt ni prélèvements sociaux. L’argent reste disponible à tout moment.',
      'Une personne ne peut détenir qu’un seul LDDS. Avec un Livret A, il permet d’abriter jusqu’à 34 950 € d’épargne réglementée défiscalisée.',
    ],
    related: ['livret-a', 'lep', 'epargne-de-precaution'],
  },
  {
    slug: 'lep', term: 'LEP', cat: 'epargne',
    short: 'Le livret d’épargne populaire, réservé aux revenus modestes, mieux rémunéré que le Livret A.',
    body: [
      'Il rapporte 2,5 %, taux maintenu au 1er août 2026, sans impôt ni prélèvements sociaux, dans la limite de 10 000 € de versements. L’ouverture dépend du revenu fiscal de référence, avec un plafond qui varie selon la composition du foyer.',
      'Des millions de foyers éligibles n’en ont pas. Si tes revenus sont modestes, c’est le premier livret à ouvrir.',
    ],
    related: ['livret-a', 'ldds', 'epargne-de-precaution'],
  },
  {
    slug: 'pel', term: 'PEL', cat: 'epargne',
    short: 'Le plan d’épargne logement : un placement à taux fixe, bloqué au moins quatre ans, historiquement lié à un prêt immobilier.',
    body: [
      'Le taux est fixé à l’ouverture pour toute la durée du plan : 2 % brut pour les PEL ouverts depuis le 1er janvier 2026. Les plans plus anciens gardent leur taux d’origine.',
      'Un retrait avant quatre ans entraîne la fermeture du plan et une rémunération réduite. Les intérêts des PEL ouverts depuis 2018 sont imposés dès la première année.',
    ],
    related: ['livret-a', 'epargne-de-precaution', 'inflation'],
  },
  {
    slug: 'fonds-euros', term: 'Fonds en euros', cat: 'epargne',
    short: 'Le support sans risque de perte de l’assurance-vie : le capital est garanti par l’assureur, qui verse un rendement chaque année.',
    body: [
      'L’assureur investit surtout en obligations. Les intérêts acquis chaque année sont définitivement gagnés (effet cliquet). Le rendement moyen était d’environ 2,6 % en 2025, avant prélèvements sociaux, selon l’ACPR.',
      'Les écarts entre contrats sont importants, et certains assureurs imposent une part minimale en unités de compte pour accéder à leurs meilleurs fonds en euros.',
    ],
    related: ['assurance-vie', 'unites-de-compte', 'obligation'],
  },
  {
    slug: 'unites-de-compte', term: 'Unités de compte', cat: 'epargne',
    short: 'Les supports d’une assurance-vie investis sur les marchés (fonds, ETF, immobilier), sans garantie en capital.',
    body: [
      'Contrairement au fonds en euros, leur valeur varie à la hausse comme à la baisse. Elles visent un rendement plus élevé sur le long terme, en échange de ce risque.',
      'Leurs frais s’ajoutent à ceux du contrat : un fonds à 2 % par an dans un contrat à 0,85 % de frais de gestion, c’est près de 3 % de frais annuels. Les contrats en ligne proposent souvent des ETF.',
    ],
    related: ['assurance-vie', 'fonds-euros', 'opcvm', 'ter'],
  },
  {
    slug: 'plan-epargne-retraite', aliases: 'PER retraite', term: 'PER (plan d’épargne retraite)', cat: 'epargne',
    short: 'Une enveloppe pour préparer sa retraite, dont les versements peuvent être déduits du revenu imposable, en échange d’un blocage jusqu’à la retraite.',
    body: [
      'Les versements volontaires sont déductibles dans la limite d’un plafond, ce qui réduit l’impôt l’année du versement. L’avantage est d’autant plus fort que ta tranche marginale d’imposition est élevée.',
      'L’argent est bloqué jusqu’à la retraite, sauf exceptions comme l’achat de la résidence principale ou certains accidents de la vie. À la sortie, les sommes déduites à l’entrée sont imposées.',
    ],
    related: ['tmi', 'assurance-vie', 'horizon-de-placement'],
  },
  {
    slug: 'scpi', term: 'SCPI', cat: 'epargne',
    short: 'Une société qui achète et gère des immeubles (bureaux, commerces, santé) et reverse les loyers à ses associés : la « pierre-papier ».',
    body: [
      'On investit dans l’immobilier à partir de quelques centaines d’euros, sans gérer de locataires. Les frais de souscription sont élevés, souvent autour de 8 à 12 % : c’est un placement de long terme.',
      'Ni le capital ni les revenus ne sont garantis, et la revente des parts peut prendre du temps. Quand les parts sont détenues en direct, les revenus sont imposés comme des revenus fonciers, au barème et aux prélèvements sociaux de 17,2 %.',
    ],
    related: ['assurance-vie', 'tmi', 'liquidite'],
  },

  // ── Fiscalité ────────────────────────────────────────────────
  {
    slug: 'prelevements-sociaux', term: 'Prélèvements sociaux', cat: 'fiscalite',
    short: 'Les contributions sociales (CSG, CRDS…) prélevées sur les revenus de l’épargne, en plus ou à la place de l’impôt sur le revenu.',
    body: [
      'Depuis le 1er janvier 2026, leur taux est de 18,6 % sur la plupart des revenus du capital : dividendes, plus-values, gains d’un PEA de plus de 5 ans. Il reste de 17,2 % pour l’assurance-vie, les revenus fonciers et les plus-values immobilières.',
      'Le Livret A, le LDDS et le LEP en sont totalement exonérés.',
    ],
    related: ['flat-tax', 'pea', 'assurance-vie'],
  },
  {
    slug: 'tmi', aliases: 'tranche impot', term: 'TMI (tranche marginale d’imposition)', cat: 'fiscalite',
    short: 'Le taux d’impôt sur le revenu qui s’applique à la dernière tranche de tes revenus : 0 %, 11 %, 30 %, 41 % ou 45 %.',
    body: [
      'L’impôt est progressif : chaque tranche de revenu est taxée à son propre taux. Avoir une TMI de 30 % ne veut pas dire payer 30 % d’impôt sur tous ses revenus, seulement sur la partie qui dépasse le seuil de cette tranche.',
      'La TMI sert à évaluer l’intérêt de nombreux choix : opter pour le barème plutôt que la flat tax, verser sur un PER, investir en SCPI en direct.',
    ],
    related: ['bareme-progressif', 'flat-tax', 'plan-epargne-retraite'],
  },
  {
    slug: 'bareme-progressif', term: 'Option pour le barème progressif', cat: 'fiscalite',
    short: 'La possibilité d’imposer ses revenus du capital au barème de l’impôt sur le revenu plutôt qu’à la flat tax.',
    body: [
      'Par défaut, dividendes et plus-values sont taxés à la flat tax (31,4 % en 2026). On peut opter pour le barème, ce qui est souvent intéressant pour les foyers non imposables ou dans la tranche à 11 %.',
      'L’option est globale : elle s’applique à tous les revenus et plus-values mobiliers de l’année, et se choisit lors de la déclaration de revenus. Un simulateur des impôts permet de comparer les deux.',
    ],
    related: ['flat-tax', 'tmi', 'dividende'],
  },
  {
    slug: 'fiscalite-crypto', aliases: 'impot crypto 2086 3916 305', term: 'Fiscalité des cryptos', cat: 'fiscalite',
    short: 'Les règles d’imposition des gains en cryptos pour un particulier en France.',
    body: [
      'Seules les cessions contre des euros, ou contre un bien ou un service, sont imposables. Les échanges d’une crypto contre une autre ne le sont pas. Si le total des cessions de l’année ne dépasse pas 305 €, aucun impôt n’est dû. Au-delà, les plus-values sont taxées à la flat tax, 31,4 % en 2026, sauf option pour le barème.',
      'Les cessions se déclarent avec le formulaire 2086. Les comptes ouverts sur des plateformes étrangères doivent être déclarés chaque année, même sans vente, avec le formulaire 3916-3916 bis, sous peine d’amende.',
    ],
    related: ['flat-tax', 'plus-value', 'cex'],
  },
]

export const getTerm = (slug) => TERMS.find((t) => t.slug === slug) || null
export const termsSorted = () => [...TERMS].sort((a, b) => a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' }))

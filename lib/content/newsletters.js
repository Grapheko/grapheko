// ══════════════════════════════════════════════════════════════
// Éditions de la newsletter du dimanche, envoyées automatiquement
// par /api/cron/newsletter (tâche planifiée Vercel, dimanche matin).
//
// Une édition = une date (AAAA-MM-JJ, heure de Paris). Le jour J, la tâche
// crée la campagne dans Brevo sur la liste Grapheko Weekly et l'envoie.
// Pour annuler un envoi : retirer l'édition ou passer `ready` à false.
// Texte : **gras** autorisé, rien d'autre.
// ══════════════════════════════════════════════════════════════

const utm = (date, content = 'simulateur') =>
  `utm_source=brevo&utm_medium=email&utm_campaign=newsletter-${date}&utm_content=${content}`

export const NEWSLETTERS = [
  {
    date: '2026-11-08',
    ready: true,
    subject: 'PER : pourquoi ta tranche ne dit pas tout',
    preheader: 'De 0 à 1 350 € pour 3 000 € versés',
    title: '3 000 € sur un PER : de 0 à 1 350 € d’impôt en moins',
    image: '/email/2026-11-08-per.png',
    alt: 'Économie d’impôt pour 3 000 € versés sur un PER, selon le revenu imposable',
    intro: [
      'Pour un même versement de 3 000 €, l’économie d’impôt va de 0 à 1 350 € selon le revenu. La règle qu’on entend partout, « versement × ta tranche », tombe juste entre 40 000 et 200 000 € de revenu imposable. Aux deux bouts, elle se trompe.',
    ],
    shows: [
      '**À 22 000 €, 480 € au lieu de 330 €.** En baissant ton impôt, le versement augmente aussi ta décote, ce mécanisme qui allège l’impôt des revenus modestes.',
      '**À 30 000 €, 540 € au lieu de 900 €.** Seuls 421 € du versement sont pris dans la tranche à 30 % ; le reste ne fait économiser que 11 %.',
      '**À 15 000 €, rien.** Sans impôt à payer, il n’y a rien à réduire.',
    ],
    hides: [
      'L’impôt de la sortie : à la retraite, le capital versé s’ajoute aux revenus de l’année. Le vrai gain dépend de l’écart entre ta tranche d’aujourd’hui et celle de demain.',
      'Le blocage : l’argent reste sur le PER jusqu’à la retraite, sauf achat de la résidence principale ou accidents de la vie.',
      'Ta famille : un couple ou des enfants déplacent tous ces seuils. Le calcul est fait ici pour une personne seule.',
      'Le plafond : la déduction est limitée à 10 % des revenus d’activité, entre 4 710 et 37 680 € en 2026.',
    ],
    outro: 'Pour compter sur 2026, le versement doit être encaissé avant le 31 décembre.',
    cta: { label: 'Faire le calcul avec ma situation', url: `https://grapheko.fr/simulateurs/per?${utm('2026-11-08')}` },
  },
  {
    date: '2026-11-15',
    ready: true,
    subject: '100 € par mois pendant 10 ans : le bilan',
    preheader: '12 000 € versés, 22 008 € aujourd’hui',
    title: '100 € par mois sur le MSCI World : 12 000 € devenus 22 008 €',
    image: '/email/2026-11-15-msci.png',
    alt: 'Valeur d’un investissement de 100 € par mois sur le MSCI World depuis novembre 2016',
    intro: [
      'Quelqu’un qui a investi 100 € chaque fin de mois sur le MSCI World depuis novembre 2016 a versé 12 000 €. Fin octobre 2026, son portefeuille vaut 22 008 €, soit 83 % de plus que ce qu’il a mis.',
    ],
    shows: [
      '**Le pire moment a duré peu.** En mars 2020, au cœur du Covid, le portefeuille valait 3 834 € pour 4 100 € versés. Sur 120 mois, il n’est passé sous le total versé que 6 fois.',
      '**Les baisses ont quand même été réelles.** Au plus fort, la valeur a reculé de 16 % par rapport à son sommet précédent. Continuer à verser pendant ces mois-là, c’est acheter moins cher.',
      '**L’écart se creuse avec le temps.** Les gains finissent par peser plus que les versements eux-mêmes : c’est l’effet des intérêts composés.',
    ],
    hides: [
      'L’avenir : ces dix années ont été favorables aux actions mondiales. Une autre décennie peut donner un tout autre résultat.',
      'Les dividendes : le calcul suit le prix de l’ETF, sans les dividendes versés. Le résultat réel aurait été un peu meilleur.',
      'Le tout-en-une-fois : 12 000 € placés dès novembre 2016 vaudraient 32 266 €, car le marché a surtout monté. Encore faut-il avoir eu cette somme dès le départ.',
      'Les frais de courtage et la fiscalité, qui dépendent de ton enveloppe (PEA ou compte-titres).',
    ],
    cta: { label: 'Rejouer le calcul avec mon montant', url: `https://grapheko.fr/simulateurs/dca/msci-world?${utm('2026-11-15')}` },
  },
  {
    date: '2026-11-22',
    ready: true,
    subject: '1,8 % de frais en plus, 50 958 € en moins',
    preheader: 'Le coût caché d’un placement',
    title: '0,2 % ou 2 % de frais : 50 958 € d’écart au bout de 30 ans',
    image: '/email/2026-11-22-frais.png',
    alt: 'Valeur d’un placement de 200 € par mois pendant 30 ans avec 0,2 % ou 2 % de frais annuels',
    intro: [
      'Deux épargnants versent 200 € par mois pendant 30 ans, soit 72 000 € chacun, sur un placement qui rapporte 6 % par an avant frais. Avec 0,2 % de frais annuels, le premier finit à 188 012 €. Avec 2 %, le second s’arrête à 137 054 €.',
    ],
    shows: [
      '**Les frais se composent comme les gains.** Prélevés chaque année sur tout le capital, ils pèsent de plus en plus lourd : l’écart est presque invisible les dix premières années, puis il s’envole.',
      '**Près de 44 % des gains partent en frais.** Le premier gagne 116 012 €, le second 65 054 €.',
      '**Ordre de grandeur :** un ETF indiciel coûte souvent quelques dixièmes de pourcent par an ; un fonds géré activement, souvent autour de 1,5 à 2 %.',
    ],
    hides: [
      'La performance : un fonds plus cher peut faire mieux, mais ce n’est jamais garanti, alors que ses frais, eux, sont certains.',
      'Un rendement régulier : aucun marché ne rapporte 6 % chaque année. Le calcul isole l’effet des frais, il ne prédit rien.',
      'Les autres frais : droits d’entrée, frais sur versements, frais de gestion d’un contrat d’assurance-vie, courtage.',
      'La fiscalité, qui dépend de l’enveloppe.',
    ],
    outro: '**Où trouver les frais d’un fonds :** dans son document d’informations clés (DIC), ligne « frais courants ».',
    cta: { label: 'Comparer mes propres frais', url: `https://grapheko.fr/simulateurs/frais?${utm('2026-11-22')}` },
  },
  {
    date: '2026-11-29',
    ready: true,
    subject: 'Et si tu avais investi juste avant 2008 ?',
    preheader: '−49 % en deux ans, puis…',
    title: 'Investir au sommet de 2007 : 12 000 € devenus 71 353 €',
    image: '/email/2026-11-29-sp500.png',
    alt: '12 000 € investis sur le S&P 500 en mai 2007, en une fois ou par 100 € chaque mois',
    intro: [
      'Mai 2007 a marqué le plus haut du S&P 500 en euros avant la crise financière : le pire moment pour acheter. 12 000 € placés ce mois-là ne valaient plus que 6 116 € en février 2009. Fin octobre 2026, ils valent 71 353 €.',
    ],
    shows: [
      '**La chute a été brutale.** −49 % en moins de deux ans : la moitié du capital envolée sur le papier.',
      '**Le retour a pris presque six ans.** Le placement n’a retrouvé ses 12 000 € qu’en février 2013.',
      '**Investir chaque mois a adouci le chemin.** Avec 100 € par mois pendant dix ans à partir de mai 2007, les achats faits pendant la crise ont été bon marché : le portefeuille a dépassé le total versé dès février 2010, trois ans plus tôt. Il vaut aujourd’hui 75 010 €, pour les mêmes 12 000 € investis.',
    ],
    hides: [
      'Les nerfs qu’il a fallu : rester investi avec −49 % affiché à l’écran, c’est là que beaucoup vendent, au pire moment.',
      'Les marchés qui n’ont pas rebondi aussi vite : l’indice japonais Nikkei a mis 34 ans à retrouver son record de 1989. Le marché américain a été l’un des plus favorables de cette période.',
      'Les dividendes, qui auraient encore amélioré le résultat, et l’effet du dollar : le calcul est fait en euros.',
      'Les frais et la fiscalité.',
    ],
    cta: { label: 'Rejouer un investissement sur le S&P 500', url: `https://grapheko.fr/simulateurs/dca/sp-500?${utm('2026-11-29')}` },
  },
]

export const getNewsletter = (date) => NEWSLETTERS.find((n) => n.date === date && n.ready) || null

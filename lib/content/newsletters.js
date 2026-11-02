// ══════════════════════════════════════════════════════════════
// Éditions de la newsletter du dimanche, envoyées automatiquement
// par /api/cron/newsletter (tâche planifiée Vercel, dimanche matin).
//
// Une édition = une date (AAAA-MM-JJ, heure de Paris). Le jour J, la tâche
// crée la campagne dans Brevo sur la liste Grapheko Weekly et l'envoie.
// Pour annuler un envoi : retirer l'édition ou passer `ready` à false.
//
// Lecteur visé : un débutant complet. Structure d'une édition :
//   tldr     → « En bref » : la conclusion en une phrase simple
//   context  → « Le contexte » : de quoi on parle, chaque terme expliqué, la question posée
//   image    → la courbe
//   shows    → « Ce que montre la courbe » : 3 points, un chiffre expliqué par point
//   hides    → « Ce qu'elle ne montre pas » : 3 ou 4 limites
//   outro    → un repère pratique (facultatif)
//   cta      → un outil Grapheko pour aller plus loin
// Texte : **gras** autorisé, rien d'autre.
// ══════════════════════════════════════════════════════════════

const utm = (date, content = 'simulateur') =>
  `utm_source=brevo&utm_medium=email&utm_campaign=newsletter-${date}&utm_content=${content}`

export const NEWSLETTERS = [
  {
    date: '2026-11-08',
    ready: true,
    subject: 'PER : combien d’impôt économises-tu vraiment ?',
    preheader: 'La règle habituelle, vérifiée',
    title: '3 000 € sur un PER : de 0 à 1 350 € d’impôt en moins',
    tldr: 'Verser de l’argent sur un PER fait baisser tes impôts, mais pas toujours autant qu’on le dit : tout dépend de ton revenu.',
    context: [
      'Le **PER** (plan d’épargne retraite) est un placement pour préparer ta retraite. Son atout : l’argent que tu y verses est retiré de ton revenu imposable. Tu paies donc moins d’impôt l’année du versement.',
      'On entend souvent que l’économie se calcule simplement : **montant versé × ta tranche d’imposition**. Ta tranche, c’est le taux qui s’applique à la dernière partie de tes revenus : 0, 11, 30, 41 ou 45 %. Avec cette règle, 3 000 € versés dans la tranche à 30 % feraient économiser 900 €.',
      'Nous avons vérifié cette règle avec le vrai calcul de l’impôt 2026, pour une personne seule qui verse 3 000 €. Le revenu imposable, c’est celui de ton avis d’impôt, après la déduction automatique de 10 % sur les salaires.',
    ],
    image: '/email/2026-11-08-per.png',
    alt: 'Économie d’impôt pour 3 000 € versés sur un PER, selon le revenu imposable',
    shows: [
      '**Le plus souvent, la règle tombe juste.** Entre 40 000 et 200 000 € de revenu imposable, l’économie est bien de 3 000 € × la tranche : 900, 1 230 ou 1 350 €.',
      '**À 22 000 €, tu gagnes plus que prévu : 480 € au lieu de 330 €.** Les petits impôts bénéficient d’une réduction automatique, la décote. Quand ton impôt baisse, cette réduction grossit : l’économie est donc plus forte.',
      '**À 30 000 €, tu gagnes moins que prévu : 540 € au lieu de 900 €.** Tu es tout juste dans la tranche à 30 %. Seuls 421 € du versement profitent de ce taux ; le reste ne fait économiser que 11 %. Et à 15 000 €, comme tu ne paies pas d’impôt, il n’y a rien à économiser.',
    ],
    hides: [
      '**L’impôt payé plus tard.** À la retraite, l’argent retiré du PER redevient imposable. Le PER décale l’impôt plus qu’il ne le supprime : il est surtout intéressant si ta tranche baisse à la retraite.',
      '**Le blocage.** L’argent reste sur le PER jusqu’à la retraite, sauf exceptions : achat de ta résidence principale, accidents de la vie.',
      '**Ta situation familiale.** En couple ou avec des enfants, les seuils changent. Ici, le calcul est fait pour une personne seule.',
      '**Le plafond.** Tu ne peux déduire qu’une partie de tes revenus : 10 % de tes revenus d’activité, entre 4 710 et 37 680 € en 2026.',
    ],
    outro: 'Pour réduire l’impôt sur tes revenus 2026, le versement doit être fait avant le 31 décembre.',
    cta: { label: 'Calculer mon économie avec ma situation', url: `https://grapheko.fr/simulateurs/per?${utm('2026-11-08')}` },
  },
  {
    date: '2026-11-15',
    ready: true,
    subject: '100 € par mois pendant 10 ans : le bilan',
    preheader: '12 000 € versés, 22 008 € aujourd’hui',
    title: '100 € par mois sur le MSCI World : 12 000 € devenus 22 008 €',
    tldr: 'Investir la même petite somme chaque mois, sans s’arrêter pendant les crises, a presque doublé la mise en dix ans.',
    context: [
      'Le **MSCI World** est un indice qui suit les actions d’environ 1 250 grandes et moyennes entreprises de 23 pays développés. On peut l’acheter facilement grâce à un **ETF**, un fonds coté en Bourse qui copie l’indice.',
      'Investir un montant fixe chaque mois, quoi qu’il arrive, s’appelle le **DCA** (en français : investissement programmé). L’idée : ne pas chercher le bon moment pour acheter, et lisser les hauts et les bas.',
      'Nous avons rejoué cette méthode sur les vrais cours : 100 € investis à chaque fin de mois, de novembre 2016 à octobre 2026, soit 120 versements.',
    ],
    image: '/email/2026-11-15-msci.png',
    alt: 'Valeur d’un investissement de 100 € par mois sur le MSCI World depuis novembre 2016',
    shows: [
      '**12 000 € versés, 22 008 € à l’arrivée.** Le portefeuille vaut 83 % de plus que la somme versée.',
      '**Les crises ont fait peur, mais peu duré.** En mars 2020, au début du Covid, le portefeuille valait 3 834 € pour 4 100 € versés : une perte de 266 € sur le papier. Sur 120 mois, il n’est passé sous la somme versée que 6 fois.',
      '**Continuer pendant les baisses a aidé.** Quand les prix baissent, les mêmes 100 € achètent plus de parts. Ces achats « en solde » ont pesé dans le résultat final.',
    ],
    hides: [
      '**L’avenir.** Ces dix ans ont été bons pour les actions. Une autre période peut donner beaucoup moins, voire une perte.',
      '**Les dividendes**, la part des bénéfices reversée aux actionnaires, ne sont pas comptés ici. Le vrai résultat aurait été un peu meilleur.',
      '**Tout investir d’un coup** aurait rapporté plus sur cette période (32 266 €), parce que le marché a surtout monté. Mais il faut avoir la somme dès le départ, et accepter de tout placer juste avant une éventuelle baisse.',
      '**Les frais et les impôts**, qui dépendent de l’endroit où tu investis : PEA, compte-titres ou assurance-vie.',
    ],
    cta: { label: 'Rejouer le calcul avec mon montant', url: `https://grapheko.fr/simulateurs/dca/msci-world?${utm('2026-11-15')}` },
  },
  {
    date: '2026-11-22',
    ready: true,
    subject: '1,8 % de frais en plus, 50 958 € en moins',
    preheader: 'Le coût caché d’un placement',
    title: '0,2 % ou 2 % de frais : 50 958 € d’écart au bout de 30 ans',
    tldr: 'Une petite différence de frais, répétée chaque année, finit par coûter très cher : ici, plus de 50 000 € en 30 ans.',
    context: [
      'Quand tu investis dans un fonds (un ETF, un fonds d’assurance-vie…), le gestionnaire prélève des **frais chaque année**, en pourcentage de ton épargne. 1 % ou 2 %, ça paraît peu.',
      'Le piège : ces frais sont pris sur tout ton capital, chaque année, y compris sur les gains déjà accumulés. Leur effet grossit avec le temps, comme les intérêts, mais en ta défaveur.',
      'Exemple : deux personnes versent 200 € par mois pendant 30 ans, soit 72 000 € chacune, sur un placement qui rapporte 6 % par an avant frais. Seule différence : 0,2 % de frais par an pour l’une, 2 % pour l’autre.',
    ],
    image: '/email/2026-11-22-frais.png',
    alt: 'Valeur d’un placement de 200 € par mois pendant 30 ans avec 0,2 % ou 2 % de frais annuels',
    shows: [
      '**188 012 € contre 137 054 €.** Même effort d’épargne, 50 958 € d’écart à l’arrivée.',
      '**L’écart reste discret au début.** Les dix premières années, la différence semble minime. C’est ensuite qu’elle s’emballe.',
      '**Près de la moitié des gains part en frais.** La première personne gagne 116 012 €, la seconde 65 054 € : 44 % de moins.',
    ],
    hides: [
      '**La performance.** Un fonds plus cher peut faire mieux, mais ce n’est jamais garanti. Ses frais, eux, sont certains.',
      '**Les hauts et les bas.** Aucun placement ne rapporte 6 % chaque année. Le calcul isole l’effet des frais, il ne prédit rien.',
      '**Les autres frais** : droits d’entrée, frais sur chaque versement, frais du contrat d’assurance-vie, frais de Bourse.',
      '**Les impôts**, qui dépendent de l’endroit où tu investis.',
    ],
    outro: '**Repère :** un ETF qui copie un indice coûte souvent quelques dixièmes de pourcent par an ; un fonds piloté par un gérant, souvent 1,5 à 2 %. Les frais d’un fonds sont indiqués dans son document d’informations clés (DIC), à la ligne « frais courants ».',
    cta: { label: 'Comparer mes propres frais', url: `https://grapheko.fr/simulateurs/frais?${utm('2026-11-22')}` },
  },
  {
    date: '2026-11-29',
    ready: true,
    subject: 'Et si tu avais investi juste avant la crise de 2008 ?',
    preheader: '−49 % en deux ans, puis…',
    title: 'Investir au pire moment, en 2007 : 12 000 € devenus 71 353 €',
    tldr: 'Même en investissant au pire moment, juste avant la crise de 2008, la patience a fini par payer. Mais il a fallu tenir six ans.',
    context: [
      'Le **S&P 500** est l’indice des 500 plus grandes entreprises américaines. C’est le marché d’actions le plus suivi au monde.',
      'La grande peur de beaucoup d’épargnants : investir juste avant un krach. Nous avons pris le pire cas récent : **mai 2007**, le point le plus haut avant la crise financière de 2008.',
      'Deux façons d’investir 12 000 € : tout d’un coup en mai 2007, ou 100 € par mois pendant dix ans à partir de cette date. Le calcul est fait en euros, sur les vrais cours mensuels.',
    ],
    image: '/email/2026-11-29-sp500.png',
    alt: '12 000 € investis sur le S&P 500 en mai 2007, en une fois ou par 100 € chaque mois',
    shows: [
      '**Tout d’un coup : −49 % en deux ans.** Les 12 000 € ne valaient plus que 6 116 € en février 2009. Il a fallu attendre février 2013, près de six ans, pour retrouver la mise de départ. Aujourd’hui, ils valent 71 353 €.',
      '**Chaque mois : un chemin plus doux.** Les versements faits pendant la crise ont acheté à bas prix. Le portefeuille est repassé au-dessus des sommes versées dès février 2010, trois ans plus tôt. Il vaut aujourd’hui 75 010 €.',
      '**Le temps a effacé le mauvais moment.** Dans les deux cas, la mise a été multipliée par environ six en dix-neuf ans.',
    ],
    hides: [
      '**Les nerfs qu’il a fallu.** Rester investi avec −49 % affiché à l’écran est très difficile. C’est souvent là que les épargnants vendent, au pire moment.',
      '**Les marchés qui ont mis bien plus longtemps.** La Bourse japonaise a mis 34 ans à retrouver son record de 1989. Le marché américain a été l’un des plus favorables de cette période.',
      '**Les dividendes**, la part des bénéfices reversée aux actionnaires, ne sont pas comptés : le résultat réel aurait été meilleur. Le calcul en euros inclut aussi l’effet du dollar.',
      '**Les frais et les impôts.**',
    ],
    cta: { label: 'Rejouer un investissement sur le S&P 500', url: `https://grapheko.fr/simulateurs/dca/sp-500?${utm('2026-11-29')}` },
  },
]

export const getNewsletter = (date) => NEWSLETTERS.find((n) => n.date === date && n.ready) || null

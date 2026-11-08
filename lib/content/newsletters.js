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
  {
    date: '2026-12-06',
    ready: true,
    subject: 'LEP : 80 € de plus par an, sans risque',
    preheader: 'Es-tu sous le plafond ?',
    title: '10 000 € sur un LEP : 250 € par an, contre 170 € sur un Livret A',
    tldr: 'Le LEP rapporte nettement plus que le Livret A, sans risque, mais il est réservé aux revenus modestes : beaucoup y ont droit sans le savoir.',
    context: [
      'Le **Livret A** et le **LEP** (livret d’épargne populaire) sont deux livrets d’épargne sans risque. Ton argent ne peut pas baisser, tu peux le retirer à tout moment, et les intérêts ne sont pas imposés.',
      'Le LEP rapporte **2,5 % par an**, contre **1,7 %** pour le Livret A, jusqu’au 31 janvier 2027. Mais on ne peut y verser que 10 000 €, et seulement si ses revenus restent sous un plafond.',
      'Ce plafond porte sur le **revenu fiscal de référence**, un montant inscrit en première page de ton avis d’impôt. Il dépend de la taille du foyer. La courbe montre le plafond 2026 en métropole pour plusieurs foyers.',
    ],
    image: '/email/2026-12-06-lep.png',
    alt: 'Plafond 2026 de revenu fiscal de référence pour ouvrir un LEP, selon le foyer',
    shows: [
      '**Une personne seule y a droit jusqu’à 23 028 €.** C’est le revenu fiscal de référence, pas le salaire. Pour un salarié, il est en général plus bas que son salaire annuel, car la déduction de 10 % est déjà retirée.',
      '**Un couple avec deux enfants y a droit jusqu’à 47 624 €.** Chaque enfant relève le plafond. Avec trois enfants, il monte à 59 922 €.',
      '**Sur 10 000 €, l’écart est de 80 € par an.** Le LEP rapporte 250 €, le Livret A 170 €. Sur 3 000 €, c’est 75 € contre 51 €.',
    ],
    hides: [
      '**Les taux changent.** Ils sont revus le 1er février et le 1er août. Ceux de cette édition valent jusqu’au 31 janvier 2027.',
      '**L’outre-mer.** Les plafonds y sont plus élevés. Ici, ce sont ceux de la métropole.',
      '**Les deux derniers avis.** La banque peut retenir l’un de tes deux derniers avis d’impôt : il suffit que l’un des deux soit sous le plafond.',
      '**Le calcul par quinzaine.** Les intérêts se comptent par périodes de quinze jours : un versement en cours d’année rapporte un peu moins.',
    ],
    outro: '**Repère :** le LEP et le Livret A peuvent se cumuler. Un couple peut avoir deux LEP, un par personne.',
    cta: { label: 'Vérifier si j’ai droit au LEP', url: `https://grapheko.fr/simulateurs/eligibilite-lep?${utm('2026-12-06')}` },
  },
  {
    date: '2026-12-13',
    ready: true,
    subject: 'Tranche à 30 % : tu ne paies pas 30 %',
    preheader: 'Le malentendu le plus courant',
    title: 'Dans la tranche à 30 %, un impôt d’environ 7 à 22 % de ton revenu',
    tldr: 'Être « dans la tranche à 30 % » ne veut pas dire payer 30 % d’impôt : seule la dernière partie de ton revenu est taxée à ce taux.',
    context: [
      'L’impôt sur le revenu est calculé **par tranches**. Ton revenu est découpé en morceaux, et chaque morceau a son propre taux : 0 %, 11 %, 30 %, 41 % ou 45 %.',
      'Ta **tranche marginale**, c’est le taux du dernier morceau, le plus haut. Ton **taux moyen**, c’est ton impôt divisé par ton revenu. C’est lui qui dit ce que tu paies vraiment.',
      'Nous avons calculé les deux pour une personne seule, avec le barème 2026. Le revenu est le **revenu imposable** de ton avis d’impôt, après la déduction de 10 % sur les salaires.',
    ],
    image: '/email/2026-12-13-tranche.png',
    alt: 'Taux moyen d’imposition et tranche marginale selon le revenu imposable, personne seule',
    shows: [
      '**À 30 000 €, la tranche est de 30 %, mais l’impôt pèse 7 %.** Il s’élève à 2 104 €. Seuls les 421 € au-dessus de 29 579 € sont taxés à 30 %.',
      '**À 60 000 €, l’impôt pèse 18,5 %.** Il s’élève à 11 104 €. Le taux moyen monte doucement, mais reste loin de la tranche.',
      '**Changer de tranche ne fait jamais baisser ton revenu après impôt.** Seule la partie au-dessus du seuil est taxée au taux plus élevé.',
    ],
    hides: [
      '**Les cotisations sociales**, déjà prélevées sur ton salaire avant l’impôt, ne sont pas comptées ici.',
      '**Ta situation familiale.** En couple ou avec des enfants, les seuils sont multipliés par le nombre de parts. Le calcul est fait pour une personne seule.',
      '**Les réductions et crédits d’impôt**, par exemple pour des dons ou un emploi à domicile, peuvent encore baisser l’impôt.',
      '**Les revenus de l’épargne.** Les intérêts et dividendes sont souvent taxés à part, avec la flat tax.',
    ],
    outro: '**Repère :** ta tranche sert à estimer ce que rapporte une déduction d’impôt. Ton taux moyen dit ce que tu paies vraiment.',
    cta: { label: 'Calculer mon impôt et ma tranche', url: `https://grapheko.fr/simulateurs/per?${utm('2026-12-13')}` },
  },
  {
    date: '2026-12-20',
    ready: true,
    subject: 'Épargner à 25 ou à 35 ans : l’écart',
    preheader: 'Dix ans qui valent 66 714 €',
    title: '100 € par mois à 5 % : 148 252 € en commençant à 25 ans, 81 538 € à 35 ans',
    tldr: 'Commencer à épargner dix ans plus tôt compte plus que le montant versé : les premières années ont le plus de temps pour grossir.',
    context: [
      'Les **intérêts composés**, c’est quand tes gains rapportent à leur tour des gains. Chaque année, le rendement s’applique à ce que tu as versé et à ce que tu as déjà gagné.',
      'Exemple : deux personnes versent **100 € par mois** jusqu’à 65 ans, sur un placement qui rapporte **5 % par an**. La première commence à 25 ans, la seconde à 35 ans.',
      'Le rendement de 5 % est une hypothèse fixe, choisie pour isoler l’effet du temps. Aucun placement ne rapporte la même chose chaque année.',
    ],
    image: '/email/2026-12-20-commencer-tot.png',
    alt: 'Valeur de l’épargne à 65 ans avec 100 € par mois, en commençant à 25 ou à 35 ans',
    shows: [
      '**148 252 € contre 81 538 €.** La première a versé 48 000 €, la seconde 36 000 €. Pour 12 000 € versés en plus, elle finit avec 66 714 € de plus.',
      '**Tout l’écart vient des dix premières années.** À 35 ans, la première a déjà 15 436 €. Sans aucun versement de plus, cette somme devient 66 714 € à 65 ans.',
      '**Commencer plus tard demande de verser plus.** Même avec 150 € par mois à partir de 35 ans, soit 54 000 € versés, la seconde n’atteint que 122 306 €.',
    ],
    hides: [
      '**Les hauts et les bas.** En Bourse, le rendement varie fortement d’une année à l’autre. Il peut être négatif plusieurs années de suite.',
      '**L’inflation.** Dans 40 ans, 148 252 € permettront d’acheter beaucoup moins qu’aujourd’hui.',
      '**Les frais et les impôts**, qui réduisent le résultat selon le placement.',
      '**La vie réelle.** Peu de gens versent la même somme pendant 40 ans sans s’arrêter.',
    ],
    cta: { label: 'Faire le calcul avec mes chiffres', url: `https://grapheko.fr/simulateurs/interets-composes?${utm('2026-12-20')}` },
  },
  {
    date: '2026-12-27',
    ready: true,
    subject: 'Dividendes : 31,4 % d’impôt, ou moins ?',
    preheader: 'Une case qui peut changer tout',
    title: '1 000 € de dividendes : de 186 € à 404 € d’impôt selon ton revenu',
    tldr: 'Les revenus de ton épargne sont taxés à 31,4 % par défaut. Avec de petits revenus, le barème de l’impôt peut coûter moins cher.',
    context: [
      'Les **dividendes** sont la part des bénéfices qu’une entreprise reverse à ses actionnaires. Sur un compte-titres, ils sont taxés par défaut avec la **flat tax** : 31,4 % en 2026, soit 12,8 % d’impôt et 18,6 % de prélèvements sociaux.',
      'Tu peux choisir à la place le **barème** de l’impôt sur le revenu, celui de tes salaires. Les dividendes y ont un avantage : seuls 60 % de leur montant sont imposés.',
      'Nous avons comparé les deux pour une personne seule qui touche 1 000 € de dividendes, selon son revenu imposable, avec les règles 2026.',
    ],
    image: '/email/2026-12-27-flat-tax.png',
    alt: 'Impôt sur 1 000 € de dividendes avec la flat tax ou le barème, selon le revenu imposable',
    shows: [
      '**Jusqu’à 25 000 € de revenu, le barème coûte moins cher.** Le total est de 186 à 271 €, contre 314 € avec la flat tax.',
      '**Dès la tranche à 30 %, la flat tax l’emporte.** Entre 30 000 et 60 000 € de revenu, le barème coûte 346 €, soit 32 € de plus.',
      '**Les intérêts suivent une autre règle.** Ils n’ont pas l’avantage des 60 %. Même à 20 000 € de revenu, 1 000 € d’intérêts coûtent 335 € au barème, contre 314 € avec la flat tax.',
    ],
    hides: [
      '**Un choix pour tout.** Le barème s’applique alors à tous tes revenus de l’épargne de l’année : dividendes, intérêts, plus-values. Le calcul se fait sur l’ensemble.',
      '**Ta situation familiale.** En couple ou avec des enfants, les seuils changent. Le calcul est fait pour une personne seule.',
      '**Le PEA et l’assurance-vie**, qui ont leurs propres règles. Dans un PEA, les dividendes ne sont pas taxés tant qu’ils restent dans le plan.',
      '**Les prélèvements sociaux** de 18,6 % sont dus dans les deux cas. Avec le barème, une partie est déductible l’année suivante : le calcul en tient compte.',
    ],
    outro: '**Repère :** ce choix se fait au printemps, sur la déclaration de revenus, en cochant une case. Rien à faire avant le 31 décembre.',
    cta: { label: 'Comparer avec mes revenus', url: `https://grapheko.fr/simulateurs/flat-tax-ou-bareme?${utm('2026-12-27')}` },
  },
]

export const getNewsletter = (date) => NEWSLETTERS.find((n) => n.date === date && n.ready) || null

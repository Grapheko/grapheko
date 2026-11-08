# Grapheko

Média éducatif sur la Bourse, la crypto et l’épargne : simulateurs sur données réelles, fiches marché, glossaire, quiz et articles.
Next.js 15 (Pages Router), déployé sur Vercel.

## Démarrer

```bash
npm install
npm run dev                         # données réelles (nécessite un accès réseau)
GRAPHEKO_DEMO_DATA=1 npm run dev    # données fictives signalées à l'écran, pour travailler hors ligne
```

## Tests

`npm test` vérifie les calculs des simulateurs (`tests/` : barème, décote, quotient familial, PER, flat tax ou barème, LEP, DCA, intérêts composés). Les tests tournent automatiquement avant chaque build (`prebuild`) : si un calcul casse, Vercel refuse la mise en ligne. Quand une règle fiscale change (barème, plafonds, taux), mettre à jour la constante dans `lib/` **et** les valeurs attendues dans `tests/`.

## Variables d’environnement (Vercel)

| Variable | Usage | Obligatoire |
|---|---|---|
| `BREVO_API_KEY` | Inscription newsletter et envoi du formulaire de contact | Oui |
| `CONTACT_SENDER` | Adresse expéditrice **validée dans Brevo** pour le formulaire de contact | Oui pour le contact |
| `CONTACT_TO` | Destinataire des messages (défaut : contact@grapheko.fr) | Non |
| `CRON_SECRET` | Protège les tâches planifiées `/api/cron/*` | Oui |
| `NEWSLETTER_TEST_EMAIL` | Destinataire des tests de newsletter et, par défaut, des alertes | Non |
| `ALERT_EMAIL` | Destinataires des alertes du contrôle quotidien, séparés par des virgules | Non |

## Structure

```
lib/assets.js            Catalogue des actifs → crée /marches/<slug> et /simulateurs/dca/<slug>
lib/history.js           Historique mensuel en euros (Yahoo Finance, secours Binance), cache 12 h
lib/finance.js           Calculs des simulateurs (fonctions pures)
lib/content/             Glossaire, articles, quiz, liste des simulateurs
lib/gtm.js               Tracking (voir docs/plan-de-taggage.md)
lib/motion.js            Défilement fluide (Lenis) et animations au scroll (GSAP ScrollTrigger)
components/home/         Sections animées de l’accueil
pages/                   Routes
```

Ajouter un actif, un terme ou un article = ajouter une entrée dans `lib/`. Les pages, le sitemap et les liens se mettent à jour seuls. Nouvelle page fixe, ou contenu d'une page fixe modifié : l'ajouter ou mettre sa date à jour dans `lib/sitemap.js`.

## Données de marché

- Ticker : cryptos en temps réel dans le navigateur (top 10 par capitalisation d’après CoinGecko, flux publics Binance convertis en euros, aucune clé) ; indices et or différés d’au moins 15 minutes via `/api/ticker` (affichés avec l’heure du cours). Le temps réel des indices demande des licences payantes auprès des bourses.

- Historique : clôtures mensuelles, converties en euros au taux EUR/USD de fin de mois. Pages régénérées toutes les 12 h (ISR), ou toutes les 5 minutes si la source était indisponible.
- Aucune valeur inventée : si une source ne répond pas, l’interface affiche un message d’erreur.
- Les indices sont des indices de prix (hors dividendes), c’est indiqué sur chaque page.

## Chiffres réglementaires à surveiller

À mettre à jour à chaque changement (recherche : `31,4`, `18,6`, `1,7`) :
- Flat tax (PFU) : 31,4 % depuis le 1er janvier 2026 (12,8 % + 18,6 % de prélèvements sociaux).
- Assurance-vie, revenus fonciers, plus-values immobilières : prélèvements sociaux à 17,2 % (le cas du PEL varie selon les sources, à vérifier).
- Livret A : 1,7 % depuis le 1er août 2026, plafond 22 950 €.

## Surveillance

`/api/cron/health` tourne chaque matin (`vercel.json`) : historiques, bandeau de cours, accès Brevo, édition de la semaine et envoi du dimanche. Il signale aussi à IndexNow (Bing) les pages modifiées la veille ou le jour même (dates de `lib/sitemap.js`). En cas de problème, un e-mail part via Brevo. Si Brevo est en panne, l'alerte ne peut pas partir et seuls les journaux Vercel gardent la trace.

## Accessibilité et animations

Toutes les animations respectent `prefers-reduced-motion`. Le défilement fluide est désactivé sur écran tactile.

## Vitesse

- Polices auto-hébergées dans `public/fonts` (`styles/fonts.css`), préchargées dans `pages/_document.jsx` et mises en cache un an : le texte s'affiche directement dans la bonne police, sans décalage. Nouvelle version d'une police = nouveau suffixe de fichier.
- GSAP, ScrollTrigger, SplitText et Lenis (`lib/motion.js`) ne sont plus dans le code commun à toutes les pages : `pages/_app.jsx` les charge à la première interaction (défilement, toucher, clic, clavier) ou au bout de 6 s. Les titres déjà visibles à ce moment restent affichés sans animation. Pour un utilitaire sans GSAP (`prefersReducedMotion`), importer `lib/reducedMotion.js`.
- Mesure : Lighthouse mobile en ligne de commande, et PageSpeed Insights sur le site en production.

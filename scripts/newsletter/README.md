# Newsletter du dimanche

- Les éditions sont dans `lib/content/newsletters.js` (une entrée par dimanche, `ready: true` pour l'envoi).
- Les images vont dans `public/email/AAAA-MM-JJ-sujet.png` (1200 px de large).
- L'envoi est automatique : `/api/cron/newsletter`, appelé par Vercel Cron le dimanche à 7 h UTC (voir `vercel.json`).
- Pour annuler un envoi : passer `ready: false` sur l'édition, puis déployer.

## Fabriquer les chiffres et les graphiques
1. Historiques mensuels en euros : `curl -s https://grapheko.fr/api/history/<actif> -o out/<actif>.json`
   (actifs : bitcoin, ethereum, solana, xrp, bnb, tron, dogecoin, cardano, chainlink, avalanche, cac-40, sp-500, nasdaq, msci-world, or).
2. Calculs avec les fonctions du site (`lib/finance.js`, `lib/tax.js`) : voir `compute_novembre_2026.mjs`, lancer avec `npx tsx`.
3. Graphiques : écrire un SVG sur le modèle de `charts_novembre_2026.py`, puis `node render.js <noms>` pour le PNG.

## Règles éditoriales
Une courbe, ce qu'elle montre (3 points), ce qu'elle ne montre pas (3-4 points), un lien vers un outil Grapheko avec UTM
`utm_source=brevo&utm_medium=email&utm_campaign=newsletter-AAAA-MM-JJ&utm_content=simulateur`. Tutoiement, phrases courtes,
chiffres vérifiés par le calcul. Jamais de recommandation d'acheter, vendre ou verser (pas de conseil personnalisé : agrément AMF).

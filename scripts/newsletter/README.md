# Newsletter du dimanche

- Les éditions sont dans `lib/content/newsletters.js` (une entrée par dimanche, `ready: true` pour l'envoi).
- Les images vont dans `public/email/AAAA-MM-JJ-sujet.png` (1200 px de large).
- L'envoi est automatique : `/api/cron/newsletter`, appelé par Vercel Cron le dimanche à 7 h UTC (voir `vercel.json`).
- Pour annuler un envoi : passer `ready: false` sur l'édition, puis déployer.

## Fabriquer les chiffres et les graphiques
1. Historiques mensuels en euros : `curl -s https://grapheko.fr/api/history/<actif> -o out/<actif>.json`
   (actifs : bitcoin, ethereum, solana, xrp, bnb, tron, dogecoin, cardano, chainlink, avalanche, cac-40, sp-500, nasdaq, msci-world, or).
2. Calculs avec les fonctions du site (`lib/finance.js`, `lib/tax.js`) : voir `compute_novembre_2026.mjs`, lancer avec `npx tsx`.
   Décembre 2026 : `compute_decembre_2026.mjs` (LEP, tranche et taux moyen, intérêts composés, flat tax ou barème), sans historique de cours : `NL_DIR=dossier node scripts/newsletter/compute_decembre_2026.mjs`.
3. Graphiques : écrire un SVG sur le modèle de `charts_novembre_2026.py`, puis `node render.js <noms>` pour le PNG. Graphiques de décembre : `charts_decembre_2026.py`.

## Règles éditoriales
**Lecteur visé : un débutant complet**, qui ne connaît ni le jargon ni les mécanismes. Il doit comprendre l'édition sans rien chercher ailleurs.

Structure (champs de `lib/content/newsletters.js`) :
1. `tldr` — « En bref » : la conclusion en une phrase simple, sans chiffre compliqué.
2. `context` — « Le contexte », 2 ou 3 paragraphes : de quoi on parle, chaque terme technique expliqué en une phrase la première fois (PER, ETF, indice, DCA, tranche, décote, dividendes…), et la question exacte à laquelle la courbe répond, avec l'hypothèse de calcul (montant, durée, période).
3. `image` — la courbe.
4. `shows` — 3 points. Chacun commence par une phrase en gras qui dit le constat, puis explique le chiffre avec des mots simples (« une perte de 266 € sur le papier », « 44 % de moins »).
5. `hides` — 3 ou 4 limites, chacune avec un titre en gras : passé ≠ avenir, dividendes, frais, impôts, situation personnelle, selon le cas.
6. `outro` — facultatif : un repère pratique (date limite, où trouver une information).
7. `cta` — un outil Grapheko, avec les UTM `utm_source=brevo&utm_medium=email&utm_campaign=newsletter-AAAA-MM-JJ&utm_content=simulateur`.

Style : tutoiement, phrases de 20 mots au plus, un chiffre par phrase quand c'est possible, typographie française. Objet ≤ 50 caractères, aperçu ≤ 35. Chaque chiffre sort d'un calcul exécuté. Jamais de recommandation d'acheter, vendre, verser ou choisir un produit (pas de conseil personnalisé : agrément AMF), pas de nom de banque ou de courtier, pas de promesse de rendement.

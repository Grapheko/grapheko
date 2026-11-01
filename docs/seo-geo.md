# SEO et GEO : plan de référencement de Grapheko

SEO : apparaître dans Google et Bing. GEO : être cité par les moteurs de réponse (ChatGPT, Perplexity, Gemini, Copilot).
Les deux reposent sur la même base : être indexé, avoir des pages qui répondent précisément à une question, avec des chiffres sourcés et datés.

## 1. Ce qui est déjà en place dans le code

- Sitemap dynamique : `/sitemap.xml` (toutes les pages, mis à jour automatiquement).
- `robots.txt` : tout est ouvert sauf `/api/` et les pages légales. Les robots d’IA (GPTBot, ClaudeBot, PerplexityBot…) ne sont pas bloqués.
- `/llms.txt` : résumé du site et liste commentée des pages, pour les moteurs de réponse.
- Balises `title`, `description`, `canonical` et Open Graph sur chaque page, image de partage `/og.png`.
- Données structurées (JSON-LD) : WebSite et Organization (accueil), BreadcrumbList (pages intérieures), Article (blog), DefinedTerm (glossaire), FAQPage (fiches marché, simulateurs DCA, articles).
- FAQ chiffrées sur les 15 fiches marché et les 15 simulateurs DCA, recalculées toutes les 12 h à partir des vrais cours : ce sont des réponses courtes, datées et sourcées, le format que les moteurs de réponse reprennent le plus volontiers.
- Maillage interne : glossaire ↔ fiches marché ↔ simulateurs ↔ articles.

Note honnête : depuis 2023, Google n’affiche plus les FAQ enrichies que pour quelques sites officiels (santé, administration). Le balisage FAQPage reste utile pour la compréhension de la page et pour les moteurs de réponse, mais il ne fera pas apparaître de menu déroulant dans les résultats Google.

## 2. À faire une seule fois (côté Gauthier)

1. **Google Search Console** : ajouter une propriété de type *Domaine* `grapheko.fr`, valider par l’enregistrement TXT DNS chez Gandi, puis soumettre `https://grapheko.fr/sitemap.xml`.
2. **Demander l’indexation** des pages clés (outil « Inspection de l’URL ») : accueil, `/simulateurs/dca/bitcoin`, `/simulateurs/dca/msci-world`, `/glossaire/flat-tax`, `/blog/flat-tax-2026-31-4`, `/blog/livret-a-2026-combien-rapporte`.
3. **Bing Webmaster Tools** : importer le site depuis Search Console (deux clics). Bing alimente Copilot et une partie des recherches web de ChatGPT : c’est le levier GEO le plus direct.
4. **Vercel, Domains** : vérifier que `www.grapheko.fr` redirige vers `grapheko.fr` (et pas l’inverse), pour n’avoir qu’une adresse officielle, cohérente avec les balises canonical.
5. **Liens entrants** : profils sur LinkedIn, X, GitHub, Reddit (r/vosfinances) pointant vers grapheko.fr. Partager un simulateur DCA quand la question revient sur un forum est le lien le plus naturel.
6. **Suivi** : dans GA4, relier Search Console (Admin > Associations de produits) pour voir les requêtes à côté du comportement.

## 3. Requêtes visées

Pas d’outil de volume ici : la liste est construite sur l’intention de recherche et la concurrence perçue. À confirmer avec Search Console (rapport Performances) après 4 à 6 semaines, puis Google Keyword Planner.

| Page | Requêtes visées | Pourquoi Grapheko peut se positionner |
|---|---|---|
| `/simulateurs/dca/<actif>` | « simulateur dca bitcoin », « combien aurait rapporté 100 € par mois en bitcoin », « dca msci world » | Outil sur vrais cours en euros, rare en français |
| `/marches/<actif>` | « pire baisse bitcoin », « performance msci world 5 ans en euros » | Chiffres en euros, datés, avec FAQ |
| `/blog/flat-tax-2026-31-4` | « flat tax 2026 », « pfu 31,4 », « hausse csg 2026 placement » | Sujet d’actualité, exemples chiffrés |
| `/blog/livret-a-2026-combien-rapporte` | « livret a 2026 combien rapporte », « taux livret a novembre 2026 » | Requête récurrente, calcul complet |
| `/blog/acheter-bitcoin-france-2026` | « acheter bitcoin france », « fiscalité crypto 305 euros », « 3916 bis crypto » | Synthèse réglementaire à jour |
| `/blog/dca-investir-chaque-mois` | « dca c’est quoi », « dca ou investir en une fois » | Réponse nuancée + outil |
| `/glossaire/<terme>` | « drawdown définition », « mvrv », « ter etf définition » | Longue traîne, définitions courtes |

## 4. Rythme conseillé

- **Chaque semaine** : un article qui répond à une question précise et renvoie vers un simulateur ou une fiche.
- **À chaque changement réglementaire** (février et août pour le Livret A, loi de finances en fin d’année) : mettre à jour les chiffres et la date `updated` de l’article. La fraîcheur compte, surtout pour les moteurs de réponse.
- **Chaque mois** : regarder dans Search Console les requêtes en positions 8 à 20. Ce sont celles où une amélioration de la page (titre, FAQ, paragraphe ajouté) fait gagner le plus vite.
- **Glossaire** : ajouter les termes recherchés sans résultat (event `glossary_search` avec `results_count = 0` dans GA4).

## 5. Idées d’articles suivants

- « PEA : combien investir chaque mois pour avoir 100 000 € ? » (lien simulateur intérêts composés)
- « Bitcoin : combien aurait rapporté un DCA depuis chaque halving ? » (données réelles)
- « ETF MSCI World : comprendre les frais réels » (lien simulateur frais)
- « LEP 2026 : qui y a droit et combien il rapporte » (vérifier taux et plafond avant d’écrire)
- « Assurance-vie ou PEA en 2026 après la hausse de la flat tax »

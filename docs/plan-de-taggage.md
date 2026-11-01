# Plan de taggage Grapheko (v2, novembre 2026)

Architecture : **Next.js → dataLayer → GTM (GTM-5BKPJLC8) → GA4 (G-9K1C83LWRF)**.
Le code ne parle jamais directement à GA4 : tout passe par le dataLayer, GTM décide quoi envoyer.
Toute la logique est dans `lib/gtm.js`.

## 1. Consentement (Consent Mode v2)

- `pages/_document.jsx` déclare **avant GTM** : `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` = `denied`, `wait_for_update: 500`.
- Si un choix existe déjà (`localStorage.gk_consent`), il est réappliqué immédiatement (`consent update`).
- La bannière (`components/layout/ConsentBanner.jsx`) propose « Tout refuser » et « Tout accepter » au même niveau, plus « Personnaliser ».
- Lien « Gérer les cookies » dans le pied de page et bouton sur `/confidentialite`.

**À faire dans GTM**
- Admin du conteneur > Paramètres du conteneur : activer **Afficher la vue d’ensemble du consentement**.
- Balise Google (GA4) : consentement supplémentaire requis = aucun (la balise Google gère `analytics_storage` nativement en mode avancé). Vérifier en mode Aperçu que les hits partent en `gcs=G100` avant accord puis `G111` après.

## 2. Events conservés (aucun changement de nom ni de clé)

| Event | Quand | Clés principales |
|---|---|---|
| `page.display` | Chaque page (y compris le premier chargement, voir § 4) | `page_path`, `page_name`, `page_cat1-3`, **`page_type`**, **`content_group`**, + clés de page |
| `clicStandard` | Clics suivis | `click`, `click_chapter1-3` |
| `formulaire_inscription` | Inscription newsletter réussie | `form_location`, `page_source` |
| `formulaire_contact` | Message de contact envoyé | `contact_subject` |
| `time_on_page` | 30 s, 60 s, 180 s | `seconds_spent` |
| `tracker_data_refresh` | Rafraîchissement du ticker | `symbols_refreshed` |

Nouvelles clés ajoutées à tous les events : `page_type` (home, hub, outil, actif, definition, quiz, article…) et `content_group` (simulateurs, marches, glossaire, blog…).
`env_work` vaut désormais l’environnement réel (`production`, `preview`, `development`) au lieu de `production` en dur : **filtrer les rapports sur `env_work = production`**.

## 3. Nouveaux events

| Event | Quand | Paramètres |
|---|---|---|
| `tool_start` | Première modification d’un simulateur | `tool_name` |
| `tool_result` | Résultat affiché, 1,2 s après la dernière modification | `tool_name`, `tool_montant`, `tool_annee`, `tool_frais`… (préfixe `tool_`) |
| `tool_share` | Copie du lien ou partage natif | `tool_name`, `share_method` (`copy_link`, `native`) |
| `quiz_start` | Début du quiz | `quiz_name` |
| `quiz_answer` | Chaque réponse | `quiz_step`, `quiz_question`, `quiz_answer` |
| `quiz_complete` | Résultat affiché | `quiz_result` (precaution, horizon, prudent, equilibre, dynamique) |
| `quiz_restart` | Nouveau passage | — |
| `glossary_search` | Recherche dans le glossaire (après 1,2 s) | `search_term`, `results_count` |
| `consent_update` | Choix de cookies | `consent_analytics`, `consent_marketing` |
| `page.reset` | Juste avant chaque `page.display` | vide les clés de page (`asset`, `tool_name`…) |

Valeurs de `tool_name` : `dca_<actif>` (ex. `dca_bitcoin`), `interets_composes`, `cout_frais`, `rendement_reel`.
Clés de page envoyées avec `page.display` : `asset` (fiches marché et DCA), `tool_name`, `glossary_term`, `article_category`.

## 4. Changement de comportement à vérifier

L’ancienne version n’envoyait **pas** `page.display` au premier chargement (seulement aux navigations suivantes).
La v2 l’envoie à chaque page, premier chargement compris.
➜ Si la balise GA4 « page_view » est aussi déclenchée sur « All Pages / Initialisation », **retirer ce déclencheur** pour éviter les doublons : la page vue doit partir uniquement sur l’event personnalisé `page.display`.

## 5. Configuration GTM à ajouter

**Variables (Variable de couche de données)** : `page_type`, `content_group`, `asset`, `tool_name`, `share_method`, `quiz_step`, `quiz_question`, `quiz_answer`, `quiz_result`, `search_term`, `results_count`, `glossary_term`, `tool_montant`, `tool_annee`, `tool_frais`.

**Déclencheurs (Événement personnalisé)** :
- `tool_start|tool_result|tool_share` (regex) → balise GA4 Event, nom = `{{Event}}`
- `quiz_.*` (regex) → balise GA4 Event, nom = `{{Event}}`
- `glossary_search` → balise GA4 Event `search` (event recommandé GA4) avec `search_term`

**GA4 – Dimensions personnalisées (portée événement)** : `page_type`, `content_group`, `asset`, `tool_name`, `quiz_result`, `share_method`.
**GA4 – Événements clés** : `formulaire_inscription` (ou `generate_lead` si renommé dans GTM), `quiz_complete`, `tool_share`.

## 6. Idées d’analyses une fois les données en place

- Entonnoir simulateur : `page.display` (page_type = outil) → `tool_start` → `tool_result` → `tool_share`.
- Actifs les plus simulés : `tool_result` par `tool_name`.
- Parcours inter-sections : exploration de chemins GA4 sur `content_group` (glossaire → simulateur → newsletter).
- Termes recherchés sans résultat (`results_count = 0`) : liste de mots à ajouter au glossaire.
- Export BigQuery (gratuit) pour croiser `tool_result` et `formulaire_inscription` par session.

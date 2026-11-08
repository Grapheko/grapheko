# Plan de taggage Grapheko (v2, novembre 2026)

Architecture : **Next.js → dataLayer → GTM (GTM-5BKPJLC8) → GA4 (G-9K1C83LWRF)**.
Le code ne parle jamais directement à GA4 : tout passe par le dataLayer, GTM décide quoi envoyer.
Toute la logique est dans `lib/gtm.js`.

## 1. Consentement (Consent Mode v2, mode basique)

- `pages/_document.jsx` déclare **avant tout** : `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` = `denied`, `wait_for_update: 500`.
- **GTM n'est chargé qu'après accord pour la mesure d'audience** (`analytics`). Sans accord, aucune requête ne part vers Google (pas de ping `gcs=G100`). Pas de `<noscript>` GTM.
- Si un choix valide existe (`localStorage.gk_consent`, moins de 6 mois), il est réappliqué (`consent update`) et GTM est chargé s'il inclut la mesure d'audience. Au-delà de 6 mois, le bandeau revient.
- Au premier accord (`lib/consent.js`) : les events en attente dans le dataLayer sont retirés, `consent update` est poussé, GTM est chargé, puis `consent_update` et un nouveau `page.display` de la page en cours.
- Retrait de l'accord : `consent update` à `denied` et suppression des cookies `_ga` / `_ga_*`. GTM n'est plus chargé à la page suivante.
- Un accord « Publicité et affiliation » seul ne charge pas GTM : à revoir le jour où une balise publicitaire (Meta, Google Ads) sera ajoutée.
- La bannière (`components/layout/ConsentBanner.jsx`) propose « Tout refuser » et « Tout accepter » au même niveau, plus « Personnaliser ».
- Lien « Gérer les cookies » dans le pied de page et bouton sur `/confidentialite`.

**À faire dans GTM**
- Admin du conteneur > Paramètres du conteneur : activer **Afficher la vue d’ensemble du consentement**.
- Sécurité supplémentaire (recommandé) : sur la balise Google et les balises d'événement GA4, consentement supplémentaire requis = `analytics_storage`.
- Vérifier en navigation privée : aucune requête vers `googletagmanager.com` ni `google-analytics.com` avant accord ; après « Tout accepter », hits en `gcs=G111`.

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

Valeurs de `tool_name` : `dca_<actif>` (ex. `dca_bitcoin`), `interets_composes`, `cout_frais`, `rendement_reel`, `economie_per`, `flat_tax_bareme`, `test_lep`.

Simulateurs fiscaux (`economie_per`, `flat_tax_bareme`) : aucun montant (revenu, versement, dividendes) n'est envoyé au dataLayer ni écrit dans l'URL. Seuls `tool_situation`, `tool_enfants`, `tool_isole` (parent isolé, 0 ou 1), `tool_revenuMode` (`salaires` ou `avis`) remontent, plus `tool_plafondMode` et `tool_tmiRetraite` pour le PER, et `tool_best` (`bareme` ou `pfu`, l'option la moins chère) pour flat tax ou barème.
Test LEP (`test_lep`) : ni revenu, ni montant, ni résultat (il révélerait le niveau de revenu du foyer). Seuls `tool_zone`, `tool_revenuMode`, `tool_situation`, `tool_enfants` et `tool_isole` remontent.
Clés de page envoyées avec `page.display` : `asset` (fiches marché et DCA), `tool_name`, `glossary_term`, `article_category`.

## 4. Page vue : règle en place

La page vue part **uniquement** sur l’event personnalisé `page.display` (premier chargement compris).
La balise Google se déclenche sur « Initialization - All Pages » avec `send_page_view = false`, et la mesure améliorée GA4 « modifications de page basées sur l’historique du navigateur » est **désactivée** (les simulateurs mettent l’URL à jour à chaque réglage).

Le site vide les clés propres à un event dès qu’elles ne s’appliquent plus (`page.reset`, et sur `tool_*` / `quiz_*`), pour éviter que GTM ne réutilise une ancienne valeur (ex. `share_method` sur un `tool_result`).

## 5. Configuration GTM et GA4 en production (1er novembre 2026)

**Balises**
| Balise | Type | Déclencheur | Nom d’event GA4 |
|---|---|---|---|
| Balise GA4 | Balise Google G-9K1C83LWRF, `send_page_view=false` | Initialization - All Pages | — |
| page_view | Événement GA4 | CE `page.display` (sans regex) | `page_view` |
| GA4 Clic Standard | Événement GA4 | CE `clicStandard` | (existant) |
| GA4 Formulaire Contact / Inscription | Événement GA4 | CE formulaires | (existants) |
| GA4 - tool_* | Événement GA4 | CE `^tool_(start\|result\|share)$` (regex) | `{{Event}}` |
| GA4 - quiz_* | Événement GA4 | CE `^quiz_(start\|answer\|complete\|restart)$` (regex) | `{{Event}}` |
| GA4 - glossary_search | Événement GA4 | CE `glossary_search` | `{{Event}}` |
| GA4 - consent_update | Événement GA4 | CE `consent_update` | `consent_update` |

Chaque balise d’event envoie aussi `page_cat1`, `page_cat2`, `page_cat3`, `env_work`.

**Variables de couche de données** (`dlv - <clé>`) : `page_cat1-3`, `env_work`, `tool_name`, `share_method`, `quiz_name`, `quiz_step`, `quiz_question`, `quiz_answer`, `quiz_result`, `search_term`, `results_count` (avec un s), `consent_analytics`, `consent_marketing`, `consent_method`. Variable intégrée `Event` activée.

**GA4 – Dimensions personnalisées (portée événement)** : Environnement (`env_work`), Page catégorie 1-3, Outil (`tool_name`), Méthode de partage, Quiz question, Quiz réponse, Quiz résultat, Recherche glossaire (`search_term`), Nb résultats glossaire (`results_count`), Méthode de consentement (`consent_method`).

**GA4 – Événements clés** : `formulaire_inscription`, `formulaire_contact`, `quiz_complete` (à étoiler dès qu’il apparaît).

**À savoir** : après un refus, rien n'est envoyé ; `consent_update` n'apparaît dans GA4 que pour les accords (et pour un retrait si GTM était déjà chargé sur la page).

**Quiz** : `quiz_name` (`profil_investisseur`, `crypto`, `bourse_debutant`), `quiz_answer` = lettre affichée (A à D), `quiz_correct` = `oui`/`non` (quiz de connaissances), `quiz_result` = profil ou score (`7/10`).

**Pas encore tagué** : `time_on_page`, `tracker_data_refresh`.

## 6. Idées d’analyses une fois les données en place

- Entonnoir simulateur : `page.display` (page_type = outil) → `tool_start` → `tool_result` → `tool_share`.
- Actifs les plus simulés : `tool_result` par `tool_name`.
- Parcours inter-sections : exploration de chemins GA4 sur `content_group` (glossaire → simulateur → newsletter).
- Termes recherchés sans résultat (`results_count = 0`) : liste de mots à ajouter au glossaire.
- Export BigQuery (gratuit) pour croiser `tool_result` et `formulaire_inscription` par session.

## Récapitulatif et compte rendu IA (simulateurs fiscaux)
Événement `clicStandard` :
- `click` = `recap_pdf`, `click_chapter1` = nom de l'outil, `click_chapter2` = `compte_rendu_auto` (compte rendu rédigé par règles, par défaut) ou `avec_ia` : téléchargement du PDF.
- `click` = `compte_rendu_ia` (`demande` ou `mise_a_jour`) : demande de la version IA. Option en sommeil, visible seulement si `ANTHROPIC_API_KEY` est configurée dans Vercel.
Le PDF est généré dans le navigateur ; le compte rendu passe par `/api/compte-rendu` (variable Vercel `ANTHROPIC_API_KEY`), sans aucune donnée d'identité.


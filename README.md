# Grapheko

Média éducatif sur la Bourse, la crypto et l’épargne : simulateurs sur données réelles, fiches marché, glossaire, quiz et articles.
Next.js 15 (Pages Router), déployé sur Vercel.

## Démarrer

```bash
npm install
npm run dev                         # données réelles (nécessite un accès réseau)
GRAPHEKO_DEMO_DATA=1 npm run dev    # données fictives signalées à l'écran, pour travailler hors ligne
```

## Variables d’environnement (Vercel)

| Variable | Usage | Obligatoire |
|---|---|---|
| `FINNHUB_KEY` | Cours en direct (ticker, fiches marché) | Oui pour le direct |
| `BREVO_API_KEY` | Inscription newsletter et envoi du formulaire de contact | Oui |
| `CONTACT_SENDER` | Adresse expéditrice **validée dans Brevo** pour le formulaire de contact | Oui pour le contact |
| `CONTACT_TO` | Destinataire des messages (défaut : contact@grapheko.fr) | Non |

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

Ajouter un actif, un terme ou un article = ajouter une entrée dans `lib/`. Les pages, le sitemap et les liens se mettent à jour seuls.

## Données de marché

- Historique : clôtures mensuelles, converties en euros au taux EUR/USD de fin de mois. Pages régénérées toutes les 12 h (ISR), ou toutes les 5 minutes si la source était indisponible.
- Aucune valeur inventée : si une source ne répond pas, l’interface affiche un message d’erreur.
- Les indices sont des indices de prix (hors dividendes), c’est indiqué sur chaque page.

## Chiffres réglementaires à surveiller

À mettre à jour à chaque changement (recherche : `31,4`, `18,6`, `1,7`) :
- Flat tax (PFU) : 31,4 % depuis le 1er janvier 2026 (12,8 % + 18,6 % de prélèvements sociaux).
- Assurance-vie, PEL : prélèvements sociaux à 17,2 %.
- Livret A : 1,7 % depuis le 1er août 2026, plafond 22 950 €.

## Accessibilité et animations

Toutes les animations respectent `prefers-reduced-motion`. Le défilement fluide est désactivé sur écran tactile.

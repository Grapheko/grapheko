import { Html, Head, Main, NextScript } from 'next/document'
import { GTM_ID } from '../lib/gtm'

// Consent Mode v2, mode basique : tout est refusé par défaut, et GTM n'est
// chargé que si l'utilisateur a accepté la mesure d'audience (choix stocké
// en local, valable 6 mois). Sans accord, aucune requête ne part vers Google.
// Le bandeau charge GTM au moment de l'accord (lib/consent.js).
const CONSENT_AND_GTM = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
try {
  var c = JSON.parse(localStorage.getItem('gk_consent') || 'null');
  var age = c && c.date ? Date.now() - Date.parse(c.date) : -1;
  if (c && c.v === 1 && age >= 0 && age < ${182 * 24 * 60 * 60 * 1000}) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (c.analytics) {
      window.__gkGtmLoaded = true;
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
    }
  }
} catch (e) {}
`

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: CONSENT_AND_GTM }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FCEC9C" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

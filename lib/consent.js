import { trackConsent, GTM_ID } from './gtm'

const KEY = 'gk_consent'
export const OPEN_EVENT = 'gk:open-consent'
export const GRANTED_EVENT = 'gk:consent-granted'

// Durée de validité d'un choix (recommandation CNIL : 6 mois), puis le bandeau revient.
// Même valeur dans le script en ligne de pages/_document.jsx.
export const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000

export const readConsent = () => {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!c || c.v !== 1) return null
    const age = Date.now() - Date.parse(c.date)
    if (!(age >= 0 && age < CONSENT_MAX_AGE_MS)) return null
    return c
  } catch {
    return null
  }
}

// GTM n'est chargé qu'après accord pour la mesure d'audience (mode basique) :
// sans accord, aucune requête ne part vers Google.
export const loadGtm = () => {
  if (typeof window === 'undefined' || window.__gkGtmLoaded) return
  window.__gkGtmLoaded = true
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(s)
}

// Retire du dataLayer les events poussés avant l'accord (page vue, temps passé…),
// pour qu'ils ne soient pas rejoués au chargement de GTM.
const purgePendingEvents = () => {
  const dl = window.dataLayer || []
  const kept = dl.filter((entry) => !(entry && typeof entry === 'object' && 'event' in entry && !('length' in entry)))
  dl.length = 0
  kept.forEach((entry) => dl.push(entry))
}

// En cas de retrait du consentement, supprime les cookies Google Analytics déjà déposés.
const deleteAnalyticsCookies = () => {
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n === '_ga' || n.startsWith('_ga_')).forEach((name) => {
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
    })
  })
}

export const saveConsent = ({ analytics, marketing, method = 'personnalise' }) => {
  const choice = { v: 1, analytics: !!analytics, marketing: !!marketing, date: new Date().toISOString() }
  try { localStorage.setItem(KEY, JSON.stringify(choice)) } catch {}
  if (typeof window === 'undefined') return choice

  const firstLoad = choice.analytics && !window.__gkGtmLoaded
  if (firstLoad) purgePendingEvents()

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: choice.analytics ? 'granted' : 'denied',
      ad_storage: choice.marketing ? 'granted' : 'denied',
      ad_user_data: choice.marketing ? 'granted' : 'denied',
      ad_personalization: choice.marketing ? 'granted' : 'denied',
    })
  }

  if (!choice.analytics) deleteAnalyticsCookies()

  if (firstLoad) {
    loadGtm()
    trackConsent(choice, method)
    // La page en cours est comptée une fois l'accord donné
    window.dispatchEvent(new Event(GRANTED_EVENT))
  } else if (window.__gkGtmLoaded) {
    trackConsent(choice, method)
  }
  return choice
}

export const openConsentSettings = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_EVENT))
}

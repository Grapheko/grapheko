import { trackConsent } from './gtm'

const KEY = 'gk_consent'
export const OPEN_EVENT = 'gk:open-consent'

export const readConsent = () => {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null')
    return c && c.v === 1 ? c : null
  } catch {
    return null
  }
}

export const saveConsent = ({ analytics, marketing }) => {
  const choice = { v: 1, analytics: !!analytics, marketing: !!marketing, date: new Date().toISOString() }
  try { localStorage.setItem(KEY, JSON.stringify(choice)) } catch {}
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: choice.analytics ? 'granted' : 'denied',
      ad_storage: choice.marketing ? 'granted' : 'denied',
      ad_user_data: choice.marketing ? 'granted' : 'denied',
      ad_personalization: choice.marketing ? 'granted' : 'denied',
    })
  }
  trackConsent(choice)
  return choice
}

export const openConsentSettings = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_EVENT))
}

export const GTM_ID = 'GTM-5BKPJLC8'
export const GA4_ID = 'G-9K1C83LWRF'

export const gEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: eventName, ...params })
  }
}

export const pageView = (url, title) => {
  gEvent('page_view', { page_location: url, page_title: title })
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_ID, { page_path: url, page_title: title })
  }
}

export const initScrollDepth = (pageName) => {
  if (typeof window === 'undefined') return
  const fired = new Set()
  const handler = () => {
    const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
    ;[25, 50, 75, 100].forEach((m) => {
      if (pct >= m && !fired.has(m)) {
        fired.add(m)
        gEvent('scroll_depth', { scroll_depth_percent: m, page_name: pageName })
      }
    })
  }
  window.addEventListener('scroll', handler, { passive: true })
  return () => window.removeEventListener('scroll', handler)
}

export const initTimeOnPage = (pageName) => {
  if (typeof window === 'undefined') return
  const timers = [30, 60, 180].map((s) =>
    setTimeout(() => gEvent('time_on_page', { seconds_spent: s, page_name: pageName }), s * 1000)
  )
  return () => timers.forEach(clearTimeout)
}

export const trackCTAClick = (text, location) => gEvent('cta_click', { cta_text: text, cta_location: location })
export const trackArticleClick = (title, category) => gEvent('article_click', { article_title: title, article_category: category })
export const trackNewsletterSignup = (location) => {
  gEvent('newsletter_signup', { form_location: location })
  if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'generate_lead', { currency: 'EUR', value: 1.0 })
}
export const trackTickerRefresh = (symbols) => gEvent('tracker_data_refresh', { symbols_refreshed: symbols, timestamp: new Date().toISOString() })

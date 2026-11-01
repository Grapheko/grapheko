// ══════════════════════════════════════════════════════════════
// GRAPHEKO — Système analytics centralisé (v2)
// GTM : GTM-5BKPJLC8 · GA4 : G-9K1C83LWRF
// Architecture : Next.js → dataLayer → GTM → GA4 (aucun envoi direct)
//
// Rétrocompatibilité : les events historiques (page.display, clicStandard,
// formulaire_inscription, formulaire_contact, time_on_page,
// tracker_data_refresh) gardent exactement le même nom et les mêmes clés.
// Les nouveaux events sont documentés dans docs/plan-de-taggage.md.
// ══════════════════════════════════════════════════════════════

export const GTM_ID = 'GTM-5BKPJLC8'
export const GA4_ID = 'G-9K1C83LWRF'

const ENV = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development'

// ── Catégorisation des pages ─────────────────────────────────
// Règles ordonnées : la première qui correspond gagne.
// page_type et content_group sont les nouvelles dimensions transverses.
const RULES = [
  { test: (p) => p === '/', cats: ['grapheko', 'home', 'homepage'], type: 'home', group: 'accueil' },
  { test: (p) => p === '/simulateurs', cats: ['outils', 'simulateurs', 'hub'], type: 'hub', group: 'simulateurs' },
  { test: (p) => p.startsWith('/simulateurs/dca/'), cats: ['outils', 'simulateurs', 'dca'], type: 'outil', group: 'simulateurs' },
  { test: (p) => p.startsWith('/simulateurs/'), cats: ['outils', 'simulateurs', null], type: 'outil', group: 'simulateurs' },
  { test: (p) => p === '/marches', cats: ['data', 'marches', 'hub'], type: 'hub', group: 'marches' },
  { test: (p) => p.startsWith('/marches/'), cats: ['data', 'marches', null], type: 'actif', group: 'marches' },
  { test: (p) => p === '/glossaire', cats: ['contenu', 'glossaire', 'hub'], type: 'hub', group: 'glossaire' },
  { test: (p) => p.startsWith('/glossaire/'), cats: ['contenu', 'glossaire', null], type: 'definition', group: 'glossaire' },
  { test: (p) => p.startsWith('/quiz'), cats: ['outils', 'quiz', null], type: 'quiz', group: 'quiz' },
  { test: (p) => p.startsWith('/comparatifs'), cats: ['monetisation', 'comparatifs', null], type: 'comparatif', group: 'comparatifs' },
  { test: (p) => p === '/blog', cats: ['contenu', 'blog', 'liste_articles'], type: 'hub', group: 'blog' },
  { test: (p) => p.startsWith('/blog/'), cats: ['contenu', 'blog', null], type: 'article', group: 'blog' },
  { test: (p) => p === '/newsletter', cats: ['acquisition', 'newsletter', 'inscription'], type: 'conversion', group: 'newsletter' },
  { test: (p) => ['/about', '/contact'].includes(p), cats: ['grapheko', 'institutionnel', null], type: 'institutionnel', group: 'institutionnel' },
  { test: (p) => ['/mentions-legales', '/confidentialite'].includes(p), cats: ['grapheko', 'legal', null], type: 'legal', group: 'legal' },
]

const lastSegment = (p) => p.split('/').filter(Boolean).pop() || 'home'

export const getPageContext = (pathname = '/') => {
  const path = pathname.split('?')[0].split('#')[0].replace(/\/$/, '') || '/'
  const rule = RULES.find((r) => r.test(path))
  if (!rule) {
    return { page_cat1: 'grapheko', page_cat2: 'autre', page_cat3: lastSegment(path), page_type: 'autre', content_group: 'autre' }
  }
  const [c1, c2, c3] = rule.cats
  return {
    page_cat1: c1,
    page_cat2: c2,
    page_cat3: (c3 || lastSegment(path)).replace(/-/g, '_'),
    page_type: rule.type,
    content_group: rule.group,
  }
}

// Ancien nom, conservé pour compatibilité
const getPageCategories = getPageContext

// ── Push dataLayer bas niveau ─────────────────────────────────
export const gEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...params })
}

const base = () => {
  const pathname = window.location.pathname
  return {
    env_work: ENV,
    env_channel: 'web',
    page_path: pathname,
    page_url: window.location.href,
    ...getPageCategories(pathname),
  }
}

// ══════════════════════════════════════════════════════════════
// 1. PAGE VIEW — "page.display"
//    extra : paramètres propres à la page (asset, tool_name…)
// ══════════════════════════════════════════════════════════════
export const pageView = (pathname, title, extra = {}) => {
  if (typeof window === 'undefined') return
  // Réinitialise les clés de page pour éviter les fuites d'une page à l'autre
  gEvent('page.reset', { asset: undefined, tool_name: undefined, glossary_term: undefined, article_category: undefined, share_method: undefined, search_term: undefined, results_count: undefined })
  gEvent('page.display', {
    ...base(),
    page_path: pathname,
    page_name: title || document.title,
    ...getPageCategories(pathname),
    ...extra,
  })
}

// ══════════════════════════════════════════════════════════════
// 2. CLIC STANDARD — "clicStandard"
// ══════════════════════════════════════════════════════════════
export const trackClick = (clickLabel, chapter1 = '', chapter2 = '', chapter3 = '') => {
  if (typeof window === 'undefined') return
  gEvent('clicStandard', {
    ...base(),
    action: 'clic',
    click: clickLabel,
    click_chapter1: chapter1 || clickLabel,
    click_chapter2: chapter2 || '',
    click_chapter3: chapter3 || '',
  })
}

export const trackCTAClick = (ctaText, ctaLocation) => trackClick(ctaText, ctaLocation, 'cta', '')

export const trackArticleClick = (title, category) => trackClick(title, 'article', category, title)

export const trackOutboundClick = (url, linkText) => trackClick(linkText, 'lien_externe', url, '')

export const trackBlogFilter = (category) => trackClick(`filtre_${category}`, 'blog', 'filtre', category)

// ══════════════════════════════════════════════════════════════
// 3. FORMULAIRES
// ══════════════════════════════════════════════════════════════
export const trackNewsletterSignup = (location = '') => {
  if (typeof window === 'undefined') return
  const ctx = base()
  gEvent('formulaire_inscription', {
    ...ctx,
    event_category: 'acquisition',
    event_action: 'newsletter_signup',
    form_location: location || ctx.page_path,
    page_source: ctx.page_path,
  })
}

export const trackContactSubmit = (subject) => {
  if (typeof window === 'undefined') return
  const ctx = base()
  gEvent('formulaire_contact', {
    ...ctx,
    event_category: 'engagement',
    event_action: 'contact_submit',
    contact_subject: subject,
    page_source: ctx.page_path,
  })
}

// ══════════════════════════════════════════════════════════════
// 4. TEMPS PASSÉ — 30s / 60s / 180s
// ══════════════════════════════════════════════════════════════
export const initTimeOnPage = (pageName) => {
  if (typeof window === 'undefined') return () => {}
  const timers = [30, 60, 180].map((seconds) =>
    setTimeout(() => {
      gEvent('time_on_page', { ...base(), seconds_spent: seconds, page_name: pageName })
    }, seconds * 1000)
  )
  return () => timers.forEach(clearTimeout)
}

// ══════════════════════════════════════════════════════════════
// 5. TICKER
// ══════════════════════════════════════════════════════════════
export const trackTickerRefresh = (symbols) => {
  gEvent('tracker_data_refresh', {
    env_work: ENV,
    symbols_refreshed: symbols,
    timestamp: new Date().toISOString(),
  })
}

// ══════════════════════════════════════════════════════════════
// 6. OUTILS (simulateurs) — nouveau
//    tool_start  : première interaction avec l'outil
//    tool_result : résultat affiché après modification (debounce)
//    tool_share  : copie du lien / partage du résultat
// ══════════════════════════════════════════════════════════════
const toolStarted = new Set()

export const trackToolStart = (toolName, params = {}) => {
  if (typeof window === 'undefined' || toolStarted.has(toolName + location.pathname)) return
  toolStarted.add(toolName + location.pathname)
  gEvent('tool_start', { ...base(), tool_name: toolName, share_method: undefined, ...params })
}

export const trackToolResult = (toolName, params = {}) => {
  if (typeof window === 'undefined') return
  gEvent('tool_result', { ...base(), tool_name: toolName, share_method: undefined, ...params })
}

export const trackToolShare = (toolName, method, params = {}) => {
  if (typeof window === 'undefined') return
  gEvent('tool_share', { ...base(), tool_name: toolName, share_method: method, ...params })
}

// Compatibilité avec l'ancien calculateur
export const trackCalculatorUse = (type, params = {}) => trackToolResult(type, params)

// ══════════════════════════════════════════════════════════════
// 7. QUIZ — nouveau
// ══════════════════════════════════════════════════════════════
export const trackQuiz = (step, params = {}) => {
  if (typeof window === 'undefined') return
  // step : 'start' | 'answer' | 'complete' | 'restart'
  gEvent(`quiz_${step}`, { ...base(), quiz_name: 'profil_investisseur', quiz_step: undefined, quiz_question: undefined, quiz_answer: undefined, quiz_result: undefined, ...params })
}

// ══════════════════════════════════════════════════════════════
// 8. GLOSSAIRE — nouveau
// ══════════════════════════════════════════════════════════════
export const trackGlossarySearch = (term, resultsCount) => {
  if (typeof window === 'undefined' || !term) return
  gEvent('glossary_search', { ...base(), search_term: term.toLowerCase().slice(0, 60), results_count: resultsCount })
}

// ══════════════════════════════════════════════════════════════
// 9. CONSENTEMENT — nouveau
// ══════════════════════════════════════════════════════════════
export const trackConsent = (choice) => {
  gEvent('consent_update', { consent_analytics: choice.analytics ? 'granted' : 'denied', consent_marketing: choice.marketing ? 'granted' : 'denied' })
}

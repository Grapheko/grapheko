// ══════════════════════════════════════════════════════════════
// GRAPHEKO — Système Analytics Centralisé
// GTM : GTM-5BKPJLC8 · GA4 : G-9K1C83LWRF
// Architecture : Next.js → dataLayer → GTM → GA4
// ══════════════════════════════════════════════════════════════

export const GTM_ID = 'GTM-5BKPJLC8'
export const GA4_ID = 'G-9K1C83LWRF'

// ── Mapping des catégories de pages ──────────────────────────
const PAGE_CATEGORIES = {
  '/': {
    page_cat1: 'grapheko',
    page_cat2: 'home',
    page_cat3: 'homepage',
  },
  '/blog': {
    page_cat1: 'contenu',
    page_cat2: 'blog',
    page_cat3: 'liste_articles',
  },
  '/blog/bourse-debutant-2026': {
    page_cat1: 'contenu',
    page_cat2: 'finance',
    page_cat3: 'bourse_debutant',
  },
  '/blog/bitcoin-metriques-onchain': {
    page_cat1: 'contenu',
    page_cat2: 'crypto',
    page_cat3: 'bitcoin_onchain',
  },
  '/blog/ethereum-2026': {
    page_cat1: 'contenu',
    page_cat2: 'crypto',
    page_cat3: 'ethereum',
  },
  '/blog/pea-cto-assurance-vie': {
    page_cat1: 'contenu',
    page_cat2: 'finance',
    page_cat3: 'enveloppes_fiscales',
  },
  '/blog/etf-debutant': {
    page_cat1: 'contenu',
    page_cat2: 'finance',
    page_cat3: 'etf_debutant',
  },
  '/ressources': {
    page_cat1: 'outils',
    page_cat2: 'ressources',
    page_cat3: 'guides_et_calculateurs',
  },
  '/newsletter': {
    page_cat1: 'acquisition',
    page_cat2: 'newsletter',
    page_cat3: 'inscription',
  },
  '/about': {
    page_cat1: 'grapheko',
    page_cat2: 'institutionnel',
    page_cat3: 'about',
  },
  '/contact': {
    page_cat1: 'grapheko',
    page_cat2: 'institutionnel',
    page_cat3: 'contact',
  },
  '/mentions-legales': {
    page_cat1: 'grapheko',
    page_cat2: 'legal',
    page_cat3: 'mentions_legales',
  },
}

// Résolution des catégories — fallback pour les slugs dynamiques
const getPageCategories = (pathname) => {
  if (PAGE_CATEGORIES[pathname]) return PAGE_CATEGORIES[pathname]
  // Pages blog dynamiques non listées
  if (pathname.startsWith('/blog/')) {
    return { page_cat1: 'contenu', page_cat2: 'blog', page_cat3: pathname.replace('/blog/', '') }
  }
  return { page_cat1: 'grapheko', page_cat2: 'autre', page_cat3: pathname.replace('/', '') || 'home' }
}

// ── Push dataLayer bas niveau ─────────────────────────────────
export const gEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...params })
}

// Push GA4 direct
const ga4Event = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, { send_to: GA4_ID, ...params })
  }
}

// ══════════════════════════════════════════════════════════════
// 1. PAGE VIEW — event: "page.display"
// ══════════════════════════════════════════════════════════════
export const pageView = (pathname, title) => {
  const cats = getPageCategories(pathname)

  // dataLayer → GTM
  gEvent('page.display', {
    env_work: 'production',
    env_channel: 'web',
    page_name: title || document.title,
    page_url: window.location.href,
    page_path: pathname,
    ...cats,
  })

  // GA4 direct
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_ID, {
      page_path: pathname,
      page_title: title,
    })
  }
}

// ══════════════════════════════════════════════════════════════
// 2. CLIC STANDARD — event: "clicStandard"
// ══════════════════════════════════════════════════════════════
export const trackClick = (clickLabel, chapter1 = '', chapter2 = '', chapter3 = '') => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const cats = getPageCategories(pathname)

  // dataLayer → GTM
  gEvent('clicStandard', {
    env_work: 'production',
    env_channel: 'web',
    action: 'clic',
    click: clickLabel,
    click_chapter1: chapter1 || clickLabel,
    click_chapter2: chapter2 || '',
    click_chapter3: chapter3 || '',
    // Contexte de page complet
    page_path: pathname,
    page_url: window.location.href,
    ...cats,
  })

  // GA4 direct
  ga4Event('clic_standard', {
    click_label: clickLabel,
    click_chapter1: chapter1 || clickLabel,
    page_path: pathname,
    page_cat1: cats.page_cat1,
    page_cat2: cats.page_cat2,
  })
}

// ══════════════════════════════════════════════════════════════
// 3. FORM SUBMIT — Newsletter avec page source
// ══════════════════════════════════════════════════════════════
export const trackNewsletterSignup = (location = '') => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const cats = getPageCategories(pathname)

  // dataLayer → GTM
  gEvent('formulaire_inscription', {
    env_work: 'production',
    env_channel: 'web',
    event_category: 'acquisition',
    event_action: 'newsletter_signup',
    form_location: location || pathname,
    // Page source complète
    page_source: pathname,
    page_url: window.location.href,
    ...cats,
  })

  // GA4 direct — conversion
  ga4Event('generate_lead', {
    currency: 'EUR',
    value: 1.0,
    form_location: location || pathname,
    page_source: pathname,
    page_cat1: cats.page_cat1,
    page_cat2: cats.page_cat2,
    page_cat3: cats.page_cat3,
  })
}

// ══════════════════════════════════════════════════════════════
// 4. CTA CLICK — Boutons d'action
// ══════════════════════════════════════════════════════════════
export const trackCTAClick = (ctaText, ctaLocation) => {
  trackClick(ctaText, ctaLocation, 'cta', '')
}

// ══════════════════════════════════════════════════════════════
// 5. ARTICLE CLICK — avec page source
// ══════════════════════════════════════════════════════════════
export const trackArticleClick = (title, category) => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const cats = getPageCategories(pathname)

  gEvent('clicStandard', {
    env_work: 'production',
    env_channel: 'web',
    action: 'clic',
    click: title,
    click_chapter1: 'article',
    click_chapter2: category,
    click_chapter3: title,
    page_path: pathname,
    page_url: window.location.href,
    ...cats,
  })

  ga4Event('select_content', {
    content_type: 'article',
    content_id: title,
    article_category: category,
    page_source: pathname,
    page_cat1: cats.page_cat1,
    page_cat2: cats.page_cat2,
  })
}



// ══════════════════════════════════════════════════════════════
// 7. TIME ON PAGE — 30s / 60s / 180s
// ══════════════════════════════════════════════════════════════
export const initTimeOnPage = (pageName) => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const cats = getPageCategories(pathname)

  const timers = [30, 60, 180].map((seconds) =>
    setTimeout(() => {
      gEvent('time_on_page', {
        env_work: 'production',
        seconds_spent: seconds,
        page_name: pageName,
        page_path: pathname,
        ...cats,
      })
      ga4Event('timing_complete', {
        name: 'time_on_page',
        value: seconds,
        page_name: pageName,
        page_cat1: cats.page_cat1,
        page_cat2: cats.page_cat2,
      })
    }, seconds * 1000)
  )

  return () => timers.forEach(clearTimeout)
}

// ══════════════════════════════════════════════════════════════
// 8. OUTBOUND CLICK — Liens externes & affiliation
// ══════════════════════════════════════════════════════════════
export const trackOutboundClick = (url, linkText) => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const cats = getPageCategories(pathname)

  gEvent('clicStandard', {
    env_work: 'production',
    env_channel: 'web',
    action: 'clic',
    click: linkText,
    click_chapter1: 'lien_externe',
    click_chapter2: url,
    click_chapter3: '',
    page_path: pathname,
    page_url: window.location.href,
    ...cats,
  })

  ga4Event('click', {
    link_url: url,
    link_text: linkText,
    outbound: true,
    page_source: pathname,
  })
}

// ══════════════════════════════════════════════════════════════
// 9. TICKER REFRESH — Alpha Vantage
// ══════════════════════════════════════════════════════════════
export const trackTickerRefresh = (symbols) => {
  gEvent('tracker_data_refresh', {
    env_work: 'production',
    symbols_refreshed: symbols,
    timestamp: new Date().toISOString(),
  })
}

// ══════════════════════════════════════════════════════════════
// 10. CALCULATOR USE — Ressources
// ══════════════════════════════════════════════════════════════
export const trackCalculatorUse = (type, params = {}) => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const cats = getPageCategories(pathname)

  gEvent('clicStandard', {
    env_work: 'production',
    env_channel: 'web',
    action: 'clic',
    click: `calculateur_${type}`,
    click_chapter1: 'outils',
    click_chapter2: type,
    click_chapter3: '',
    page_path: pathname,
    ...cats,
    ...params,
  })
}

// ══════════════════════════════════════════════════════════════
// 11. CONTACT FORM SUBMIT
// ══════════════════════════════════════════════════════════════
export const trackContactSubmit = (subject) => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const cats = getPageCategories(pathname)

  gEvent('formulaire_contact', {
    env_work: 'production',
    env_channel: 'web',
    event_category: 'engagement',
    event_action: 'contact_submit',
    contact_subject: subject,
    page_source: pathname,
    page_url: window.location.href,
    ...cats,
  })

  ga4Event('contact', {
    contact_subject: subject,
    page_source: pathname,
  })
}

// ══════════════════════════════════════════════════════════════
// 12. BLOG FILTER
// ══════════════════════════════════════════════════════════════
export const trackBlogFilter = (category) => {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname

  gEvent('clicStandard', {
    env_work: 'production',
    env_channel: 'web',
    action: 'clic',
    click: `filtre_${category}`,
    click_chapter1: 'blog',
    click_chapter2: 'filtre',
    click_chapter3: category,
    page_path: pathname,
    page_url: window.location.href,
  })
}

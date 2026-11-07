// IndexNow : prévient Bing (et Yandex, Seznam, Naver…) qu'une page a été ajoutée ou modifiée.
// Google n'utilise pas IndexNow : pour lui, ce sont le sitemap et l'inspection d'URL dans Search Console.
//
// La clé n'est pas un secret : elle doit être publique dans /public/<clé>.txt,
// c'est ce fichier qui prouve aux moteurs que grapheko.fr est bien à nous.
import { SITE, sitemapUrls } from './sitemap'

export const INDEXNOW_KEY = 'c5a8670c659d5d6151aa619d538db2af'
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const addDays = (date, days) => new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10)

// Pages modifiées depuis `days` jours (date de la page ≥ aujourd'hui - days)
export function recentlyChanged(today, days = 1) {
  const since = addDays(today, -days)
  return sitemapUrls(today).filter((u) => u.lastmod >= since).map((u) => u.loc)
}

export const allUrls = (today) => sitemapUrls(today).map((u) => u.loc)

// 200 : reçu. 202 : reçu, clé en cours de vérification (normal la première fois).
// 403 : fichier de clé introuvable ou différent. 422 : URL hors du domaine. 429 : trop d'envois.
export async function submitIndexNow(urls) {
  if (!urls.length) return { sent: 0, status: null }
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (r.status !== 200 && r.status !== 202) throw new Error(`IndexNow ${r.status} ${(await r.text()).slice(0, 160)}`)
  return { sent: Math.min(urls.length, 10000), status: r.status }
}

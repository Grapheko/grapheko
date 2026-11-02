// Limiteur de fréquence simple, en mémoire, par adresse IP.
// Il protège chaque instance serveur contre les rafales (robots, scripts) ;
// ce n'est pas une garantie absolue sur Vercel, où plusieurs instances coexistent.
const buckets = new Map()

export const clientIp = (req) =>
  String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim() || 'inconnue'

export function rateLimited(req, name, { max, windowMs }) {
  const key = `${name}:${clientIp(req)}`
  const now = Date.now()
  const list = (buckets.get(key) || []).filter((t) => now - t < windowMs)
  const blocked = list.length >= max
  if (!blocked) list.push(now)
  buckets.set(key, list)
  if (buckets.size > 10000) buckets.clear()
  return blocked
}

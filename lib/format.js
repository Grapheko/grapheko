const nf = (opts) => new Intl.NumberFormat('fr-FR', opts)

// Typographie française : pas de retour à la ligne avant « : ? ! ; % € » ni au milieu d'un nombre
export const fr = (s) => (typeof s === 'string'
  ? s.replace(/ ([?!:;%€»])/g, '\u00A0$1').replace(/« /g, '«\u00A0').replace(/(\d) (?=\d{3}(?!\d))/g, '$1\u00A0')
  : s)

export const eur = (v, digits = 0) =>
  Number.isFinite(v) ? nf({ style: 'currency', currency: 'EUR', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v) : '—'

export const num = (v, digits = 0) =>
  Number.isFinite(v) ? nf({ maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v) : '—'

export const pct = (v, digits = 1, sign = true) =>
  Number.isFinite(v) ? `${sign && v > 0 ? '+' : ''}${nf({ maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v)}\u00A0%` : '—'

export const priceFmt = (v) => {
  if (!Number.isFinite(v)) return '—'
  if (v >= 1000) return num(v, 0)
  if (v >= 10) return num(v, 2)
  return num(v, 3)
}

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const MOIS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

// '2018-01' → 'janv. 2018'
export const monthLabel = (m, long = false) => {
  if (!m) return '—'
  const [y, mo] = m.split('-').map(Number)
  return `${(long ? MOIS_LONG : MOIS)[mo - 1]} ${y}`
}

// 27 → « 2 ans et 3 mois »
export const durationFr = (months) => {
  if (!Number.isFinite(months)) return '—'
  if (months < 24) return `${months}\u00A0mois`
  const y = Math.floor(months / 12)
  const r = months % 12
  return `${y}\u00A0ans${r ? ` et ${r}\u00A0mois` : ''}`
}

export const dirClass = (v) => (v > 0 ? 'up' : v < 0 ? 'down' : '')

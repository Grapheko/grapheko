const nf = (opts) => new Intl.NumberFormat('fr-FR', opts)

export const eur = (v, digits = 0) =>
  Number.isFinite(v) ? nf({ style: 'currency', currency: 'EUR', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v) : '—'

export const num = (v, digits = 0) =>
  Number.isFinite(v) ? nf({ maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v) : '—'

export const pct = (v, digits = 1, sign = true) =>
  Number.isFinite(v) ? `${sign && v > 0 ? '+' : ''}${nf({ maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v)} %` : '—'

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

export const dirClass = (v) => (v > 0 ? 'up' : v < 0 ? 'down' : '')

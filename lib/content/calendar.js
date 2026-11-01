// ══════════════════════════════════════════════════════════════
// Calendrier fiscal et financier Grapheko (France, Europe, monde).
// Vérifié le 2 novembre 2026. Chaque date a sa source.
//
// date   : 'AAAA-MM-JJ' (jour, heure de Paris)
// utc    : heure exacte en UTC si l'événement a une heure (ex. annonce BCE)
// confirmed : false → date pas encore officielle, affichée « à confirmer »
//             et exclue du flux agenda (.ics)
// ══════════════════════════════════════════════════════════════

export const CALENDAR_VERIFIED_AT = '2026-11-02'

export const ZONES = { france: 'France', europe: 'Europe', monde: 'Monde' }
export const KINDS = {
  fiscalite: 'Fiscalité',
  epargne: 'Épargne',
  banques: 'Banques centrales',
  bourse: 'Bourse',
}

const SRC = {
  bce: { label: 'BCE, calendrier 2027 (communiqué Banque de France, juillet 2026)', url: 'https://www.banque-france.fr/fr/communiques-de-presse/la-bce-publie-des-calendriers-operationnels-indicatifs-pour-2027' },
  bceHeure: { label: 'Banque de France, horaires des décisions de la BCE', url: 'https://www.banque-france.fr/en/node/23614' },
  fed: { label: 'Federal Reserve, calendrier des réunions du FOMC', url: 'https://federalreserve.gov/monetarypolicy/fomccalendars.htm' },
  euronext: { label: 'Euronext, jours fériés et séances écourtées', url: 'https://www.financecalendar.com/?p=1651' },
  livret: { label: 'Règle de révision semestrielle du Livret A (1er février et 1er août)', url: 'https://placement.meilleurtaux.com/livret-epargne/actualites/2026-octobre/taux-du-livret-a-au-1er-fevrier-2027-le-calcul.html' },
  impots: { label: 'impots.gouv.fr (calendrier publié au printemps)', url: 'https://www.impots.gouv.fr' },
}

// Réunions de politique monétaire : décision BCE à 14h15 (heure de Francfort),
// décision Fed à 14h00 heure de New York.
const bce = (date, utc) => ({
  id: `bce-${date}`, date, utc, zone: 'europe', kind: 'banques', confirmed: true,
  title: 'Décision de taux de la BCE',
  note: 'Annonce de la politique monétaire à 14h15, conférence de presse à 14h45. Les taux de la BCE influencent ceux des crédits, de l’épargne et des obligations.',
  source: SRC.bce,
})
const fed = (date, utc, sep) => ({
  id: `fed-${date}`, date, utc, zone: 'monde', kind: 'banques', confirmed: true,
  title: 'Décision de taux de la Fed (FOMC)',
  note: `Communiqué de la Réserve fédérale américaine à 14h00, heure de New York.${sep ? ' Avec projections économiques des membres.' : ''} Date provisoire jusqu’à confirmation lors de la réunion précédente.`,
  source: SRC.fed,
})
const closed = (date, label) => ({
  id: `euronext-ferme-${date}`, date, zone: 'europe', kind: 'bourse', confirmed: true,
  title: `Bourse de Paris fermée (${label})`,
  note: 'Euronext ne cote pas ce jour-là : un ordre passé sera exécuté à la séance suivante.',
  source: SRC.euronext,
})
const half = (date) => ({
  id: `euronext-demi-${date}`, date, zone: 'europe', kind: 'bourse', confirmed: true,
  title: 'Séance écourtée à la Bourse de Paris',
  note: 'Clôture anticipée vers 14h05 sur Euronext.',
  source: SRC.euronext,
})
const livret = (date) => ({
  id: `livret-${date}`, date, zone: 'france', kind: 'epargne', confirmed: true,
  title: 'Révision du taux du Livret A, du LDDS et du LEP',
  note: 'Le nouveau taux est calculé à partir de l’inflation et des taux monétaires, et annoncé environ deux semaines avant.',
  source: SRC.livret,
})
const yearEnd = (year) => ({
  id: `fin-annee-${year}`, date: `${year}-12-31`, zone: 'france', kind: 'fiscalite', confirmed: true,
  title: `Dernier jour pour réduire l’impôt sur les revenus ${year}`,
  note: 'Versements sur un PER (déductibles dans la limite du plafond), dons aux associations, vente de titres en moins-value sur un compte-titres pour compenser des plus-values. Les établissements fixent souvent une date limite quelques jours avant.',
  source: SRC.impots,
})

export const EVENTS = [
  // ── Fin 2026 ──
  fed('2026-12-09', '2026-12-09T19:00:00Z', true),
  bce('2026-12-17', '2026-12-17T13:15:00Z'),
  half('2026-12-24'),
  closed('2026-12-25', 'Noël'),
  half('2026-12-31'),
  yearEnd(2026),

  // ── 2027 ──
  closed('2027-01-01', 'Jour de l’an'),
  fed('2027-01-27', '2027-01-27T19:00:00Z', false),
  livret('2027-02-01'),
  bce('2027-02-04', '2027-02-04T13:15:00Z'),
  fed('2027-03-17', '2027-03-17T18:00:00Z', true),
  bce('2027-03-18', '2027-03-18T13:15:00Z'),
  closed('2027-03-26', 'Vendredi saint'),
  closed('2027-03-29', 'Lundi de Pâques'),
  {
    id: 'declaration-revenus-2027', date: '2027-04-15', approx: 'Avril à juin 2027', zone: 'france', kind: 'fiscalite', confirmed: false,
    title: 'Déclaration des revenus 2026',
    note: 'Ouverture du service en ligne au printemps, dates limites échelonnées selon le département. Y joindre le formulaire 2086 (cessions de cryptos) et le 3916-3916 bis (comptes à l’étranger, y compris crypto). Dates officielles publiées par impots.gouv.fr.',
    source: SRC.impots,
  },
  fed('2027-04-28', '2027-04-28T18:00:00Z', false),
  bce('2027-04-29', '2027-04-29T12:15:00Z'),
  fed('2027-06-09', '2027-06-09T18:00:00Z', true),
  bce('2027-06-10', '2027-06-10T12:15:00Z'),
  bce('2027-07-22', '2027-07-22T12:15:00Z'),
  fed('2027-07-28', '2027-07-28T18:00:00Z', false),
  livret('2027-08-01'),
  bce('2027-09-09', '2027-09-09T12:15:00Z'),
  fed('2027-09-15', '2027-09-15T18:00:00Z', true),
  {
    id: 'taxe-fonciere-2027', date: '2027-10-15', approx: 'Mi-octobre 2027', zone: 'france', kind: 'fiscalite', confirmed: false,
    title: 'Paiement de la taxe foncière 2027',
    note: 'Date limite habituellement mi-octobre, avec quelques jours de plus en paiement en ligne. La date exacte figure sur l’avis d’imposition.',
    source: SRC.impots,
  },
  fed('2027-10-27', '2027-10-27T18:00:00Z', false),
  bce('2027-10-28', '2027-10-28T12:15:00Z'),
  fed('2027-12-08', '2027-12-08T19:00:00Z', true),
  bce('2027-12-16', '2027-12-16T13:15:00Z'),
  half('2027-12-24'),
  half('2027-12-31'),
  yearEnd(2027),
].sort((a, b) => (a.date + (a.utc || '')).localeCompare(b.date + (b.utc || '')))

export const getEvent = (id) => EVENTS.find((e) => e.id === id) || null

// Date du jour à Paris, au format AAAA-MM-JJ
export const todayParis = () => new Intl.DateTimeFormat('fr-CA', { timeZone: 'Europe/Paris' }).format(new Date())

// ── Agenda : lien Google et fichier .ics ─────────────────────
const SITE = 'https://grapheko.fr'
const compact = (d) => d.replace(/[-:]/g, '').replace(/\.\d+/, '')
const nextDay = (date) => {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}
const endUtc = (utc) => new Date(new Date(utc).getTime() + 45 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z')
const detailsOf = (e) => `${e.note}\n\nSource : ${e.source.label}\n${SITE}/calendrier`

export function googleUrl(e) {
  const dates = e.utc ? `${compact(e.utc)}/${compact(endUtc(e.utc))}` : `${compact(e.date)}/${compact(nextDay(e.date))}`
  const p = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates, details: detailsOf(e) })
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
// Repli des lignes à 75 octets (RFC 5545)
const fold = (line) => {
  const out = []
  let cur = ''
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch) > 74) { out.push(cur); cur = ' ' + ch } else cur += ch
  }
  out.push(cur)
  return out.join('\r\n')
}

export function toIcs(events, { name = 'Grapheko : calendrier fiscal et financier' } = {}) {
  const stamp = compact(new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'))
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Grapheko//Calendrier//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(name)}`, 'X-WR-TIMEZONE:Europe/Paris', 'REFRESH-INTERVAL;VALUE=DURATION:P1D', 'X-PUBLISHED-TTL:P1D',
  ]
  events.filter((e) => e.confirmed).forEach((e) => {
    lines.push('BEGIN:VEVENT', `UID:${e.id}@grapheko.fr`, `DTSTAMP:${stamp}`)
    if (e.utc) lines.push(`DTSTART:${compact(e.utc)}`, `DTEND:${compact(endUtc(e.utc))}`)
    else lines.push(`DTSTART;VALUE=DATE:${compact(e.date)}`, `DTEND;VALUE=DATE:${compact(nextDay(e.date))}`)
    lines.push(`SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(detailsOf(e))}`, `URL:${SITE}/calendrier`, 'TRANSP:TRANSPARENT', 'END:VEVENT')
  })
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}

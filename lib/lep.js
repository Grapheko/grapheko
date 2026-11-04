// ══════════════════════════════════════════════════════════════
// Livret d'épargne populaire : plafonds et règles d'éligibilité.
// Source : service-public.gouv.fr (fiche F2367, vérifiée le 1er août 2026),
// art. R221-33 du code monétaire et financier.
//
// À revoir chaque année :
//   - janvier : plafonds de l'année et années d'avis (loi de finances) ;
//   - 1er février et 1er août : taux du LEP et du Livret A.
// ══════════════════════════════════════════════════════════════

export const LEP_VERIFIED_AT = '2026-11-04'
export const LEP_CEILING_YEAR = 2026
export const LEP_MAX_DEPOSIT = 10000 // par personne ; les intérêts peuvent faire dépasser ce montant
export const LEP_RATE = 0.025 // arrêté du 29 juillet 2026, jusqu'au 31 janvier 2027
export const LIVRET_A_RATE = 0.017 // arrêté du 28 juillet 2026 (LDDS), même taux au 1er août 2026
export const RATES_UNTIL = '31 janvier 2027'

// Les deux avis que la banque peut retenir pour une demande en 2026
export const LATEST_NOTICE = { income: 2025, notice: 2026 }
export const PREVIOUS_NOTICE = { income: 2024, notice: 2025 }

const HALF_PART = 6149

// Plafonds officiels de 1 à 6 parts, par quart de part.
export const ZONES = {
  metropole: {
    label: 'Métropole',
    quarter: 3075,
    table: [23028, 26103, 29177, 32252, 35326, 38401, 41475, 44550, 47624, 50699, 53773, 56848, 59922, 62997, 66071, 69146, 72220, 75295, 78369, 81444, 84518],
  },
  antilles: {
    label: 'Guadeloupe, Martinique, La Réunion',
    quarter: 3254,
    table: [27251, 30505, 33758, 37012, 39907, 43161, 46056, 49310, 52205, 55459, 58354, 61608, 64503, 67757, 70652, 73906, 76801, 80055, 82950, 86204, 89099],
  },
  guyane: {
    label: 'Guyane, Mayotte',
    quarter: 3921,
    table: [28489, 32410, 36330, 40251, 42479, 46400, 48628, 52549, 54777, 58698, 60926, 64847, 67075, 70996, 73224, 77145, 79373, 83294, 85522, 89443, 91671],
  },
}

// Plafond de revenu fiscal de référence pour un nombre de parts (au quart de part près).
// Au-delà de 6 parts : 6 149 € par demi-part et le quart de part de la zone.
export function lepCeiling(parts, zone = 'metropole') {
  const z = ZONES[zone] || ZONES.metropole
  const quarters = Math.max(0, Math.round((Math.max(1, parts) - 1) * 4))
  if (quarters < z.table.length) return z.table[quarters]
  const extra = quarters - (z.table.length - 1)
  return z.table[z.table.length - 1] + Math.floor(extra / 2) * HALF_PART + (extra % 2 ? z.quarter : 0)
}

// Éligible si le revenu de l'un des deux derniers avis ne dépasse pas le plafond
// (R221-33 : « ne doivent pas dépasser »). previous : null si l'avis n'est pas renseigné.
export function lepEligibility({ latest, previous = null, parts, zone, attached = false }) {
  const ceiling = lepCeiling(parts, zone)
  const latestOk = latest <= ceiling
  const previousOk = previous !== null && previous <= ceiling
  return {
    ceiling,
    latestOk,
    previousOk,
    eligible: !attached && (latestOk || previousOk),
    margin: ceiling - latest,
  }
}

// Intérêts d'une année pleine, à taux inchangé. Calcul simple : la banque compte
// par quinzaines, donc un versement en cours d'année rapporte un peu moins.
export const yearlyInterest = (amount, rate) => Math.max(0, amount) * rate

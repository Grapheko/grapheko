// ══════════════════════════════════════════════════════════════
// Fiscalité française des particuliers : barème de l'impôt sur le revenu,
// PFU (flat tax), plafond PER. Vérifié le 2 novembre 2026.
//
// Barème 2026 (revenus 2025) : loi n° 2026-103 du 19 février 2026, art. 4
// (BOI-IR-LIQ-20-10 du 7 avril 2026). Plafond du quotient familial et décote :
// mêmes sources. PFU 31,4 % = 12,8 % d'impôt + 18,6 % de prélèvements
// sociaux (CSG portée à 10,6 % par l'art. 12 de la LFSS 2026).
// ══════════════════════════════════════════════════════════════

export const TAX_VERIFIED_AT = '2026-11-02'
export const TAX_YEAR_LABEL = 'barème 2026 (revenus 2025)'

// Tranches par part : [plafond de la tranche, taux]
export const BRACKETS = [
  [11600, 0],
  [29579, 0.11],
  [84577, 0.30],
  [181917, 0.41],
  [Infinity, 0.45],
]

export const QF_CAP_PER_HALF = 1807 // avantage maximal par demi-part supplémentaire (cas général)
export const QF_CAP_ISOLATED = 4262 // parent isolé : les deux premières demi-parts liées au premier enfant (case T)
// Déduction forfaitaire de 10 % sur les salaires (revenus 2025, aide-mémoire impots.gouv.fr)
export const SALARY_ALLOWANCE = { rate: 0.1, min: 509, max: 14555 }
export const DECOTE = {
  single: { threshold: 1982, base: 897 },
  couple: { threshold: 3277, base: 1483 },
  rate: 0.4525,
}

export const PFU_IR = 0.128
export const SOCIAL = 0.186 // prélèvements sociaux sur dividendes, intérêts, plus-values mobilières
export const CSG_DEDUCTIBLE = 0.068 // CSG déductible l'année suivante, seulement en cas d'option pour le barème
export const DIVIDEND_ALLOWANCE = 0.4 // abattement de 40 % sur les dividendes au barème

// PER : plafond 2026 = 10 % des revenus professionnels 2025, entre 10 % du PASS 2025
// et 10 % de 8 PASS 2025 (PASS 2025 = 47 100 €).
export const PASS_2025 = 47100
export const PER_MIN = Math.round(PASS_2025 * 0.1) // 4 710 €
export const PER_MAX = Math.round(PASS_2025 * 8 * 0.1) // 37 680 €

// Impôt pour une part
function perPart(q) {
  let tax = 0
  let low = 0
  for (const [high, rate] of BRACKETS) {
    if (q <= low) break
    tax += (Math.min(q, high) - low) * rate
    low = high
  }
  return tax
}

// Taux marginal pour une part
export function marginalRate(income, parts) {
  const q = Math.max(0, income) / parts
  let low = 0
  for (const [high, rate] of BRACKETS) {
    if (q <= high) return rate
    low = high
  }
  return BRACKETS[BRACKETS.length - 1][1]
}

// Salaire net imposable annuel → salaire après déduction forfaitaire de 10 %
export function netSalary(salary) {
  const s = Math.max(0, salary)
  const a = Math.min(SALARY_ALLOWANCE.max, Math.max(SALARY_ALLOWANCE.min, s * SALARY_ALLOWANCE.rate))
  return Math.max(0, s - a)
}

// Nombre de parts : 1 (seul) ou 2 (couple), + 0,5 pour chacun des deux premiers enfants,
// + 1 à partir du troisième, + 0,5 pour un parent qui élève seul ses enfants (case T).
export function partsFor({ situation, children = 0, isolated = false }) {
  const base = situation === 'couple' ? 2 : 1
  const c = Math.max(0, Math.round(children))
  const kids = Math.min(c, 2) * 0.5 + Math.max(0, c - 2)
  return base + kids + (situation !== 'couple' && isolated && c > 0 ? 0.5 : 0)
}

// Impôt sur le revenu du foyer, après plafonnement du quotient familial et décote.
// situation : 'single' (1 part de base) ou 'couple' (2 parts de base, marié ou pacsé)
// isolated : parent isolé (case T), dont le premier enfant ouvre un plafond spécifique
export function incomeTax(income, parts, situation = 'single', isolated = false) {
  return taxDetail(income, parts, situation, isolated).net
}

// Détail du calcul : impôt avant décote, décote appliquée, impôt final, plafonnement du QF
export function taxDetail(income, parts, situation = 'single', isolated = false) {
  const base = situation === 'couple' ? 2 : 1
  const p = Math.max(base, parts)
  const r = Math.max(0, income)
  let tax = perPart(r / p) * p
  let capped = false
  if (p > base) {
    const halves = Math.round((p - base) * 2)
    const cap = isolated && situation !== 'couple' && halves >= 2
      ? QF_CAP_ISOLATED + QF_CAP_PER_HALF * (halves - 2)
      : QF_CAP_PER_HALF * halves
    const ref = perPart(r / base) * base - cap
    capped = ref > tax
    tax = Math.max(tax, ref)
  }
  const brut = tax
  const d = DECOTE[situation === 'couple' ? 'couple' : 'single']
  const decote = tax < d.threshold ? Math.max(0, Math.min(tax, d.base - DECOTE.rate * tax)) : 0
  return { brut: Math.round(brut), decote: Math.round(decote), net: Math.max(0, Math.round(brut - decote)), capped }
}

// ── PER ─────────────────────────────────────────────────────
// Plafond estimé pour une personne, à partir de ses revenus d'activité nets (après les 10 %)
export const perCeilingEstimate = (proIncome) => Math.min(PER_MAX, Math.max(PER_MIN, Math.round(proIncome * 0.1)))

export function perSaving({ income, parts, situation, isolated, payment, ceiling }) {
  const deductible = Math.min(payment, ceiling, income)
  const before = incomeTax(income, parts, situation, isolated)
  const after = incomeTax(income - deductible, parts, situation, isolated)
  const saving = before - after
  return {
    before,
    after,
    deductible,
    excess: Math.max(0, payment - ceiling),
    saving,
    netCost: payment - saving,
    effectiveRate: deductible > 0 ? saving / deductible : 0,
    tmi: marginalRate(income, Math.max(situation === 'couple' ? 2 : 1, parts)),
  }
}

// Impôt à la sortie en capital sur le versement lui-même : tout ce qui est versé sans option
// de non-déduction est imposé au barème, part au-dessus du plafond comprise
// (BOI-RSA-PENS-30-10-20, § 90 et 110). Les gains sont imposés à part.
export const perExitTax = (payment, retirementRate) => Math.max(0, payment) * retirementRate

// Économie selon le montant versé, pour le graphique
export function perCurve({ income, parts, situation, isolated, ceiling, max, steps = 24 }) {
  const top = Math.max(1000, max)
  return Array.from({ length: steps + 1 }, (_, i) => {
    const payment = Math.round((top * i) / steps / 100) * 100
    return { payment, saving: perSaving({ income, parts, situation, isolated, payment, ceiling }).saving }
  })
}

// ── Flat tax ou barème ───────────────────────────────────────
// income : revenu net imposable du foyer hors revenus du capital
// dividends, interest, gains : montants bruts de l'année
export function flatTaxVsScale({ income, parts, situation, isolated, dividends, interest, gains }) {
  const capital = dividends + interest + gains
  const social = capital * SOCIAL
  const pfuIr = capital * PFU_IR

  const base = incomeTax(income, parts, situation, isolated)
  const taxable = dividends * (1 - DIVIDEND_ALLOWANCE) + interest + gains
  const scaleIr = incomeTax(income + taxable, parts, situation, isolated) - base
  // CSG déductible : réduit le revenu imposable de l'année suivante (revenus supposés identiques)
  const deductible = capital * CSG_DEDUCTIBLE
  const csgRelief = incomeTax(income, parts, situation, isolated) - incomeTax(income - deductible, parts, situation, isolated)

  const pfuTotal = pfuIr + social
  const scaleTotal = scaleIr + social - csgRelief
  return {
    capital,
    social,
    pfu: { ir: pfuIr, total: pfuTotal, rate: capital > 0 ? pfuTotal / capital : 0 },
    scale: { ir: scaleIr, csgRelief, total: scaleTotal, rate: capital > 0 ? scaleTotal / capital : 0, taxable },
    best: capital === 0 ? null : scaleTotal < pfuTotal - 0.5 ? 'bareme' : 'pfu',
    gap: Math.abs(pfuTotal - scaleTotal),
    tmi: marginalRate(income + taxable, Math.max(situation === 'couple' ? 2 : 1, parts)),
  }
}

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

// Impôt sur le revenu du foyer, après plafonnement du quotient familial et décote.
// situation : 'single' (1 part de base) ou 'couple' (2 parts de base, marié ou pacsé)
export function incomeTax(income, parts, situation = 'single') {
  const base = situation === 'couple' ? 2 : 1
  const p = Math.max(base, parts)
  const r = Math.max(0, income)
  let tax = perPart(r / p) * p
  if (p > base) {
    const halves = (p - base) * 2
    const ref = perPart(r / base) * base - QF_CAP_PER_HALF * halves
    tax = Math.max(tax, ref)
  }
  const d = DECOTE[situation === 'couple' ? 'couple' : 'single']
  if (tax < d.threshold) tax -= Math.max(0, Math.min(tax, d.base - DECOTE.rate * tax))
  return Math.max(0, Math.round(tax))
}

// ── PER ─────────────────────────────────────────────────────
export const perCeilingEstimate = (proIncome) => Math.min(PER_MAX, Math.max(PER_MIN, Math.round(proIncome * 0.1)))

export function perSaving({ income, parts, situation, payment, ceiling }) {
  const deductible = Math.min(payment, ceiling, income)
  const before = incomeTax(income, parts, situation)
  const after = incomeTax(income - deductible, parts, situation)
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

// Économie selon le montant versé, pour le graphique
export function perCurve({ income, parts, situation, ceiling, max, steps = 24 }) {
  const top = Math.max(1000, max)
  return Array.from({ length: steps + 1 }, (_, i) => {
    const payment = Math.round((top * i) / steps / 100) * 100
    return { payment, saving: perSaving({ income, parts, situation, payment, ceiling }).saving }
  })
}

// ── Flat tax ou barème ───────────────────────────────────────
// income : revenu net imposable du foyer hors revenus du capital
// dividends, interest, gains : montants bruts de l'année
export function flatTaxVsScale({ income, parts, situation, dividends, interest, gains }) {
  const capital = dividends + interest + gains
  const social = capital * SOCIAL
  const pfuIr = capital * PFU_IR

  const base = incomeTax(income, parts, situation)
  const taxable = dividends * (1 - DIVIDEND_ALLOWANCE) + interest + gains
  const scaleIr = incomeTax(income + taxable, parts, situation) - base
  // CSG déductible : réduit le revenu imposable de l'année suivante (revenus supposés identiques)
  const deductible = capital * CSG_DEDUCTIBLE
  const csgRelief = incomeTax(income, parts, situation) - incomeTax(income - deductible, parts, situation)

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

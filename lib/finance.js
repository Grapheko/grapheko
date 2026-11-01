// ══════════════════════════════════════════════════════════════
// Calculs financiers des simulateurs. Fonctions pures, testables.
// ══════════════════════════════════════════════════════════════

// ── DCA rétroactif ────────────────────────────────────────────
// Achat d'un montant fixe à chaque clôture mensuelle (ou trimestrielle),
// frais d'achat en % déduits de chaque versement.
export function backtestDca(points, { start, amount, everyMonths = 1, feePct = 0, end } = {}) {
  const series = points.filter((p) => p.m >= start && (!end || p.m <= end))
  if (series.length < 2) return null

  let units = 0
  let invested = 0
  let peakValue = 0
  let worstDd = 0
  let monthsUnderwater = 0
  const rows = []

  series.forEach((p, i) => {
    if (i % everyMonths === 0) {
      invested += amount
      units += (amount * (1 - feePct / 100)) / p.close
    }
    const value = units * p.close
    peakValue = Math.max(peakValue, value)
    if (peakValue > 0) worstDd = Math.min(worstDd, (value / peakValue - 1) * 100)
    if (value < invested) monthsUnderwater++
    rows.push({ m: p.m, invested, value, price: p.close })
  })

  const last = rows[rows.length - 1]
  const lumpUnits = (invested * (1 - feePct / 100)) / series[0].close

  return {
    rows,
    invested: last.invested,
    value: last.value,
    gain: last.value - last.invested,
    perfPct: (last.value / last.invested - 1) * 100,
    avgCost: last.invested / units,
    lastPrice: last.price,
    worstDrawdown: worstDd,
    monthsUnderwater,
    months: rows.length,
    lumpSumValue: lumpUnits * last.price, // même total investi en une fois au départ
    from: series[0].m,
    to: last.m,
  }
}

// ── Intérêts composés ─────────────────────────────────────────
export function compound({ capital, monthly, ratePct, years, feePct = 0 }) {
  const r = Math.pow(1 + (ratePct - feePct) / 100, 1 / 12) - 1 // taux mensuel équivalent
  const rows = [{ year: 0, invested: capital, value: capital }]
  let value = capital
  let invested = capital
  for (let m = 1; m <= years * 12; m++) {
    value = value * (1 + r) + monthly
    invested += monthly
    if (m % 12 === 0) rows.push({ year: m / 12, invested, value })
  }
  return { rows, invested, value, interests: value - invested }
}

// ── Coût des frais sur la durée ───────────────────────────────
export function feesImpact({ capital, monthly, ratePct, years, feesA, feesB }) {
  const a = compound({ capital, monthly, ratePct, years, feePct: feesA })
  const b = compound({ capital, monthly, ratePct, years, feePct: feesB })
  return { a, b, gap: a.value - b.value }
}

// ── Rendement réel (après inflation) ──────────────────────────
// Pouvoir d'achat, en euros d'aujourd'hui, d'une somme placée à un taux donné.
export function realReturn({ capital, ratePct, inflationPct, years }) {
  const rows = []
  for (let y = 0; y <= years; y++) {
    const nominal = capital * Math.pow(1 + ratePct / 100, y)
    const real = nominal / Math.pow(1 + inflationPct / 100, y)
    rows.push({ year: y, nominal, real })
  }
  const realRate = ((1 + ratePct / 100) / (1 + inflationPct / 100) - 1) * 100
  return { rows, realRate, nominal: rows[years].nominal, real: rows[years].real }
}

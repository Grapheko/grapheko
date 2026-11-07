// FAQ chiffrées, calculées à partir des vrais historiques au moment de la génération
// de la page (régénérée toutes les 12 h). Utiles pour Google et pour les moteurs
// de réponse (ChatGPT, Perplexity…) qui citent des réponses courtes et datées.
import { backtestDca, backtestLump } from './finance'
import { eur, pct, monthLabel } from './format'

const startOffset = (points, months) => points[Math.max(0, points.length - months)]?.m

function dcaAnswer(asset, points, years, amount = 100) {
  const start = startOffset(points, years * 12)
  if (!start || points.length < years * 12) return null
  const r = backtestDca(points, { start, amount })
  if (!r) return null
  return {
    q: `Combien vaudraient ${amount} € investis chaque mois sur ${asset.name} depuis ${years} ans ?`,
    a: `En investissant ${amount} € à chaque fin de mois sur ${asset.name} de ${monthLabel(r.from, true)} à ${monthLabel(r.to, true)}, on aurait versé ${eur(r.invested)} pour un portefeuille valant ${eur(r.value)}, soit ${pct(r.perfPct)} (hors frais et fiscalité, calcul Grapheko sur les clôtures mensuelles en euros).`,
  }
}

export function marketFaq(asset, history, stats) {
  if (!history?.points || !stats) return []
  const p = history.points
  const items = []
  if (stats.perf5y != null) {
    items.push({
      q: `Combien a rapporté ${asset.name} sur 5 ans ?`,
      a: `Sur les cinq dernières années, à fin ${monthLabel(stats.lastMonth, true)}, ${asset.name} a varié de ${pct(stats.perf5y, 0)} en euros${asset.kind === 'bourse' ? ', hors dividendes' : ''}. Sur un an, la variation est de ${pct(stats.perf1y, 1)}.`,
    })
  }
  if (stats.drawdownFrom) {
    items.push({
      q: `Quelle a été la pire baisse de ${asset.name} ?`,
      a: `Depuis ${stats.first.slice(0, 4)}, la plus forte baisse mensuelle d’un sommet à un creux a été de ${pct(stats.maxDrawdown, 0)}, entre ${monthLabel(stats.drawdownFrom, true)} et ${monthLabel(stats.drawdownTo, true)}, en euros et en clôtures mensuelles.`,
    })
  }
  const d = dcaAnswer(asset, p, 5)
  if (d) items.push(d)
  items.push({
    q: `Le cours de ${asset.name} affiché sur Grapheko est-il en temps réel ?`,
    a: asset.live?.type === 'crypto'
      ? `Oui. Le cours de ${asset.name} est mis à jour en temps réel à partir des flux publics de Binance, converti en euros. Les graphiques et statistiques utilisent les clôtures mensuelles.`
      : asset.live?.type === 'delayed'
        ? `Non. Le cours est différé d’au moins 15 minutes, avec l’heure indiquée. Les graphiques et statistiques utilisent les clôtures mensuelles.`
        : `Grapheko affiche les clôtures mensuelles de ${asset.name}, pas de cours en direct.`,
  })
  return items
}

export function dcaFaq(asset, history) {
  if (!history?.points) return []
  const p = history.points
  const items = [3, 5, 10].map((y) => dcaAnswer(asset, p, y)).filter(Boolean)
  const start = startOffset(p, 60)
  const r = start && backtestDca(p, { start, amount: 100 })
  if (r) {
    items.push({
      q: `Sur ${asset.name}, valait-il mieux investir chaque mois ou tout d’un coup ?`,
      a: `Sur les cinq dernières années, investir ${eur(r.invested)} en une fois en ${monthLabel(r.from, true)} aurait donné ${eur(r.lumpSumValue)}, contre ${eur(r.value)} en versements mensuels de 100 €. ${r.lumpSumValue > r.value ? 'L’investissement en une fois a fait mieux sur cette période' : 'Les versements mensuels ont fait mieux sur cette période'}, ce qui dépend entièrement du chemin suivi par les cours.`,
    })
  }
  return items
}

// Investissement unique : 1 000 € placés il y a 1, 3, 5, 10, 15 ou 20 ans (si l'historique le permet)
export const LUMP_HORIZONS = [1, 3, 5, 10, 15, 20]

export function lumpTable(history, amount = 1000) {
  const p = history?.points
  if (!p?.length) return []
  return LUMP_HORIZONS.map((years) => {
    if (p.length <= years * 12) return null
    const r = backtestLump(p, { start: p[p.length - 1 - years * 12].m, amount })
    return r && { years, from: r.from, to: r.to, value: r.value, perfPct: r.perfPct, cagrPct: r.cagrPct, worstDrawdown: r.worstDrawdown }
  }).filter(Boolean)
}

export function lumpFaq(asset, history, table) {
  if (!table.length) return []
  const items = table.filter((t) => [1, 5, 10].includes(t.years)).map((t) => ({
    q: `Combien vaudraient 1 000 € investis sur ${asset.name} il y a ${t.years} an${t.years > 1 ? 's' : ''} ?`,
    a: `1 000 € investis sur ${asset.name} à fin ${monthLabel(t.from, true)} valaient ${eur(t.value)} à fin ${monthLabel(t.to, true)}, soit ${pct(t.perfPct)}${t.cagrPct != null && t.years > 1 ? ` (${pct(t.cagrPct)} par an en moyenne)` : ''}. Calcul Grapheko sur les clôtures mensuelles en euros, hors frais et fiscalité${asset.kind === 'bourse' ? ', dividendes non réinvestis' : ''}.`,
  }))
  const worst = table[table.length - 1]
  items.push({
    q: `Quelle baisse aurait-il fallu supporter en investissant sur ${asset.name} ?`,
    a: `Sur les ${worst.years} dernières années, un investissement fait à fin ${monthLabel(worst.from, true)} a connu une baisse maximale de ${pct(worst.worstDrawdown, 0)} entre un sommet et le creux suivant, en clôtures mensuelles. C’est la perte temporaire qu’il aurait fallu traverser sans vendre.`,
  })
  return items
}

export const faqJsonLd = (items) =>
  items.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
      }
    : null

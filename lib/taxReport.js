// Comptes rendus des simulateurs fiscaux, rédigés par des règles (gratuit, instantané,
// sans envoi de données). Format : « ## Titre », paragraphes, puces « - ».
// Garde-fou : on explique les chiffres et on liste des points à vérifier,
// sans jamais recommander un produit ou un montant (pas de conseil personnalisé).
import { taxDetail, marginalRate, DECOTE } from './tax'
import { eur, num } from './format'

const p100 = (rate) => `${num(rate * 100)} %`
const s = (n, word, plural = `${word}s`) => (n > 1 ? plural : word)

function foyerSentence({ situation, enfants, isolated, parts }) {
  const who = situation === 'couple' ? 'Tu es en couple, marié(e) ou pacsé(e)' : 'Tu es seul(e)'
  const kids = enfants > 0 ? `, avec ${enfants} ${s(enfants, 'enfant')} à charge${isolated ? ' que tu élèves seul(e)' : ''}` : ', sans enfant à charge'
  const partsTxt = `${num(parts, parts % 1 ? 1 : 0)} ${s(parts, 'part fiscale', 'parts fiscales')}`
  return `${who}${kids} : ton foyer compte ${partsTxt}.`
}

const render = (sections) => sections
  .filter((sec) => sec.lines.length)
  .map((sec) => [`## ${sec.title}`, ...sec.lines].join('\n'))
  .join('\n\n')

// ── PER ─────────────────────────────────────────────────────
// ctx : { situation, enfants, isolated, parts, income, payment, ceiling, plafondMode, r, tmiRetraite, exitTax, netGain }
export function perReport(ctx) {
  const { situation, isolated, parts, income, payment, ceiling, plafondMode, r, tmiRetraite, exitTax, netGain } = ctx
  const tmi = r.tmi
  const situationLines = [foyerSentence(ctx)]
  if (r.before === 0) {
    situationLines.push(`Avec ${eur(income)} de revenu imposable, tu ne paies pas d’impôt sur le revenu.`)
  } else {
    situationLines.push(`Avec ${eur(income)} de revenu imposable, ton impôt sur le revenu est de ${eur(r.before)} et ta tranche marginale d’imposition est de ${p100(tmi)}.`)
  }

  const calc = []
  if (r.before === 0) {
    calc.push('Un versement sur un PER ne réduirait donc pas ton impôt. Si tu verses quand même, il est possible de renoncer à la déduction : le capital ne sera alors pas imposé à la sortie, seuls les gains le seront.')
  } else if (payment > 0) {
    calc.push(`Verser ${eur(payment)} ferait passer ton impôt de ${eur(r.before)} à ${eur(r.after)}, soit ${eur(r.saving)} d’économie. Le versement te coûterait réellement ${eur(r.netCost)}.`)
    const eff = r.effectiveRate
    if (r.deductible > 0 && eff < tmi - 0.005) {
      const after = taxDetail(income - r.deductible, parts, situation, isolated)
      const tmiAfter = marginalRate(income - r.deductible, parts)
      let why
      if (r.after === 0) why = 'ton impôt tombe à zéro avant que tout le montant déduit soit utilisé'
      else if (after.decote > 0) why = `ton foyer entre dans la zone de la décote (impôt inférieur à ${eur(DECOTE[situation === 'couple' ? 'couple' : 'single'].threshold)} avant décote), qui réduit déjà ton impôt`
      else if (tmiAfter < tmi) why = `le versement fait passer une partie de tes revenus dans la tranche à ${p100(tmiAfter)}`
      else if (taxDetail(income, parts, situation, isolated).capped) why = 'le plafonnement du quotient familial limite l’avantage lié à tes parts'
      else why = 'ton impôt est calculé sur plusieurs tranches et sur la décote'
      calc.push(`L’économie représente ${num(eff * 100, 1)} % du montant déduit, moins que ta tranche de ${p100(tmi)}, parce que ${why}.`)
    } else if (r.deductible > 0 && eff > tmi + 0.005) {
      calc.push(`L’économie représente ${num(eff * 100, 1)} % du montant déduit, un peu plus que ta tranche de ${p100(tmi)} : en réduisant ton impôt, le versement augmente aussi ta décote.`)
    } else if (r.deductible > 0) {
      calc.push(`Tout le montant déduit reste dans ta tranche à ${p100(tmi)} : chaque euro déduit réduit ton impôt d’environ ${num(tmi * 100)} centimes.`)
    }
    if (r.excess > 0) {
      calc.push(`${eur(r.excess)} dépassent ton plafond ${plafondMode === 'auto' ? 'estimé' : 'indiqué'} de ${eur(ceiling)} et ne sont pas déductibles cette année. Sans option de non-déduction au plus tard lors du versement, leur capital reste imposé à la sortie : l’estimation ci-dessous en tient compte.`)
    }
    if (r.saving > 0) {
      calc.push(netGain > 0
        ? `À la sortie en capital, ce versement serait ajouté à tes revenus de l’année : environ ${eur(exitTax)} d’impôt avec une tranche à ${tmiRetraite} %. L’ordre de grandeur du gain fiscal net est donc de ${eur(netGain)}.`
        : `À la sortie en capital, ce versement serait ajouté à tes revenus de l’année : environ ${eur(exitTax)} d’impôt avec une tranche à ${tmiRetraite} %. ${netGain === 0
          ? 'Dans cette hypothèse, l’impôt économisé aujourd’hui serait entièrement repayé à la sortie.'
          : `Dans cette hypothèse, tu repaierais à la sortie ${eur(-netGain)} de plus que ce que tu économises aujourd’hui.`}`)
    }
  } else {
    calc.push('Indique un montant de versement pour voir son effet sur ton impôt.')
  }

  const check = []
  check.push(plafondMode === 'auto'
    ? 'Ton plafond exact figure sur ton avis d’impôt, rubrique « plafond épargne retraite », avec les montants non utilisés des années passées.'
    : 'Les plafonds non utilisés générés à partir de 2026 se reportent pendant cinq ans, ceux des années précédentes pendant trois ans.')
  if (r.saving > 0 && tmiRetraite >= tmi * 100) check.push('Ta tranche prévue à la retraite n’est pas plus basse qu’aujourd’hui : c’est la configuration où l’avantage fiscal du PER est le plus faible.')
  if (situation === 'couple' && r.excess > 0) check.push('En couple, les plafonds des deux conjoints peuvent être additionnés en cochant la case 6QR de la déclaration.')
  check.push('Pour compter sur l’année, le versement doit être encaissé avant le 31 décembre ; les établissements fixent souvent une date limite quelques jours avant.')
  check.push('L’argent reste bloqué jusqu’à la retraite, sauf cas de déblocage anticipé : achat de la résidence principale ou accidents de la vie.')

  return render([
    { title: 'Ta situation', lines: situationLines },
    { title: 'Ce que montre le calcul', lines: calc },
    { title: 'Points à vérifier', lines: check.slice(0, 4).map((l) => `- ${l}`) },
  ])
}

// ── Flat tax ou barème ───────────────────────────────────────
// ctx : { situation, enfants, isolated, parts, income, dividends, interest, gains, r, crossover }
export function flatReport(ctx) {
  const { income, dividends, interest, gains, r, crossover } = ctx
  const items = [
    dividends > 0 && `${eur(dividends)} de dividendes`,
    interest > 0 && `${eur(interest)} d’intérêts`,
    gains > 0 && `${eur(gains)} de plus-values`,
  ].filter(Boolean)

  const situationLines = [foyerSentence(ctx)]
  if (!r.capital) {
    situationLines.push(`Ton revenu imposable hors placements est de ${eur(income)}. Tu n’as saisi aucun revenu de placement : il n’y a rien à comparer.`)
    return render([{ title: 'Ta situation', lines: situationLines }])
  }
  situationLines.push(`Ton revenu imposable hors placements est de ${eur(income)}, et tes revenus de placements de l’année s’élèvent à ${eur(r.capital)} (${items.join(', ')}). Au barème, ta tranche marginale serait de ${p100(r.tmi)}.`)

  const calc = [
    `Avec la flat tax, tu paierais ${eur(r.pfu.total)} : ${eur(r.pfu.ir)} d’impôt et ${eur(r.social)} de prélèvements sociaux.`,
    `Avec le barème, tu paierais ${eur(r.scale.total)} : ${eur(r.scale.ir)} d’impôt${dividends > 0 ? ' (tes dividendes n’étant imposés que sur 60 % de leur montant)' : ''}, les mêmes ${eur(r.social)} de prélèvements sociaux${r.scale.csgRelief > 0 ? `, moins ${eur(r.scale.csgRelief)} d’impôt l’année suivante grâce à la CSG déductible` : ''}.`,
  ]
  if (r.best === 'bareme') {
    const why = r.tmi === 0
      ? 'avec une tranche à 0 %, ces revenus ne sont pas ou presque pas imposés au barème'
      : `avec une tranche à ${p100(r.tmi)}, l’impôt au barème reste inférieur aux 12,8 % de la flat tax`
    calc.push(`Le barème est donc l’option la moins chère, de ${eur(r.gap)} : ${why}.`)
  } else {
    calc.push(`La flat tax est donc l’option la moins chère, de ${eur(r.gap)} : avec une tranche à ${p100(r.tmi)}, le barème taxe ces revenus plus lourdement que les 12,8 % de la flat tax${dividends > 0 ? ', même après l’abattement de 40 % sur les dividendes' : ''}.`)
  }
  if (r.gap < 50) calc.push('L’écart est faible : une variation de tes revenus ou de ta situation pourrait inverser le résultat.')
  if (crossover) calc.push(`Avec ta situation, le barème cesse d’être avantageux vers ${eur(crossover)} de revenu imposable hors placements.`)

  const check = [
    'L’option pour le barème (case 2OP) vaut pour tous tes revenus et plus-values de placements de l’année : le calcul doit inclure l’ensemble de tes montants.',
    'Le prélèvement de 12,8 % effectué en cours d’année est un acompte : il est déduit de l’impôt final, ou remboursé s’il est trop élevé.',
  ]
  if (gains > 0) check.push('Pour des titres achetés avant 2018, des abattements pour durée de détention peuvent s’appliquer au barème : ils ne sont pas pris en compte ici.')
  check.push('Tes revenus de placements comptent dans ton revenu fiscal de référence avec les deux options : ce choix ne modifie pas tes droits aux aides.')

  return render([
    { title: 'Ta situation', lines: situationLines },
    { title: 'Ce que montre le calcul', lines: calc },
    { title: 'Points à vérifier', lines: check.slice(0, 4).map((l) => `- ${l}`) },
  ])
}

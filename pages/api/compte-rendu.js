// Compte rendu rédigé par l'IA à partir d'une simulation fiscale.
// - Le navigateur envoie uniquement des chiffres (aucun texte libre, aucune donnée d'identité).
// - Les chiffres sont validés ici, puis transformés en faits rédigés côté serveur.
// - Rien n'est enregistré par Grapheko.
// Nécessite la variable d'environnement ANTHROPIC_API_KEY (Vercel).

import { rateLimited } from '../../lib/rateLimit'

export const config = { api: { bodyParser: { sizeLimit: '8kb' } } }

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5'
const LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } // 5 comptes rendus par IP toutes les 10 minutes

const eur = (v) => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(v).replace(/ /g, ' ')} €`
const pct = (v, d = 0) => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: d }).format(v)} %`

// Schémas : champ → [min, max] (nombres) ou liste de valeurs autorisées
const SCHEMAS = {
  per: {
    situation: ['single', 'couple'], enfants: [0, 6], isole: [0, 1], revenuMode: ['salaires', 'avis'], parts: [1, 10],
    revenu: [0, 1e6], versement: [0, 1e6], plafond: [0, 1e6], plafondMode: ['auto', 'manuel'], deduit: [0, 1e6], excedent: [0, 1e6],
    impotAvant: [0, 1e6], impotApres: [0, 1e6], economie: [0, 1e6], tauxEffectif: [0, 100], tmi: [0, 45], tmiRetraite: [0, 45],
    impotSortie: [0, 1e6], gainNet: [-1e6, 1e6],
  },
  flat_tax: {
    situation: ['single', 'couple'], enfants: [0, 6], isole: [0, 1], revenuMode: ['salaires', 'avis'], parts: [1, 10],
    revenu: [0, 1e6], dividendes: [0, 1e6], interets: [0, 1e6], plusValues: [0, 1e6],
    pfuImpot: [0, 1e6], prelevementsSociaux: [0, 1e6], pfuTotal: [0, 1e6], baremeImpot: [0, 1e6], csgDeductible: [0, 1e6],
    baremeTotal: [0, 1e6], meilleure: ['bareme', 'pfu', 'aucune'], ecart: [0, 1e6], tmi: [0, 45],
  },
}

function validate(tool, data) {
  const schema = SCHEMAS[tool]
  if (!schema || !data || typeof data !== 'object') return null
  const out = {}
  for (const [k, rule] of Object.entries(schema)) {
    const v = data[k]
    if (typeof rule[0] === 'string') {
      if (!rule.includes(v)) return null
      out[k] = v
    } else {
      const n = Number(v)
      if (!Number.isFinite(n) || n < rule[0] || n > rule[1]) return null
      out[k] = Math.round(n * 100) / 100
    }
  }
  return out
}

const foyer = (d) => [
  `Situation : ${d.situation === 'couple' ? 'couple marié ou pacsé' : 'personne seule'}${d.isole ? ', parent qui élève seul ses enfants (case T)' : ''}`,
  `Enfants à charge : ${d.enfants}, soit ${String(d.parts).replace('.', ',')} parts fiscales`,
  `Revenu imposable retenu : ${eur(d.revenu)} (${d.revenuMode === 'salaires' ? 'calculé à partir des salaires, après la déduction de 10 %' : 'saisi depuis l’avis d’impôt'})`,
]

function facts(tool, d) {
  if (tool === 'per') {
    return [
      'Simulateur : économie d’impôt d’un versement sur un plan d’épargne retraite (PER), barème 2026 sur les revenus 2025.',
      ...foyer(d),
      `Versement envisagé : ${eur(d.versement)}`,
      `Plafond de déduction ${d.plafondMode === 'auto' ? 'estimé' : 'indiqué par la personne'} : ${eur(d.plafond)}`,
      `Montant déductible : ${eur(d.deduit)}${d.excedent > 0 ? `, dont ${eur(d.excedent)} au-dessus du plafond, non déductibles` : ''}`,
      `Impôt sur le revenu avant versement : ${eur(d.impotAvant)}, après versement : ${eur(d.impotApres)}`,
      `Impôt économisé : ${eur(d.economie)}, soit ${pct(d.tauxEffectif, 1)} du montant déduit. Tranche marginale actuelle : ${pct(d.tmi)}`,
      `Hypothèse de tranche à la retraite : ${pct(d.tmiRetraite)}. Impôt estimé à la sortie en capital sur ce versement : ${eur(d.impotSortie)}. Ordre de grandeur du gain net : ${eur(d.gainNet)}`,
      'Règles générales utiles : versement à faire avant le 31 décembre ; un versement de 2026 réduit l’impôt payé en 2027 (barème 2027 pas encore voté, relevé de 2,1 % dans le projet de loi) ; l’argent est bloqué jusqu’à la retraite sauf cas de déblocage anticipé (achat de la résidence principale, accidents de la vie) ; les versements après 70 ans ne sont plus déductibles depuis 2026 ; les plafonds non utilisés générés à partir de 2026 se reportent sur 5 ans ; on peut renoncer à la déduction à l’entrée pour ne pas être imposé sur le capital à la sortie ; le plafond exact figure sur l’avis d’impôt ; la décote et le quotient familial peuvent rendre l’économie inférieure à la tranche marginale.',
    ]
  }
  return [
    'Simulateur : choix entre la flat tax (PFU à 31,4 % en 2026 : 12,8 % d’impôt et 18,6 % de prélèvements sociaux) et l’option pour le barème progressif, pour des revenus de placements sur un compte-titres.',
    ...foyer(d),
    `Revenus de placements de l’année : dividendes ${eur(d.dividendes)}, intérêts ${eur(d.interets)}, plus-values ${eur(d.plusValues)}`,
    `Avec la flat tax : ${eur(d.pfuImpot)} d’impôt et ${eur(d.prelevementsSociaux)} de prélèvements sociaux, soit ${eur(d.pfuTotal)}`,
    `Avec le barème : ${eur(d.baremeImpot)} d’impôt supplémentaire, ${eur(d.prelevementsSociaux)} de prélèvements sociaux, moins ${eur(d.csgDeductible)} d’impôt l’année suivante grâce à la CSG déductible, soit ${eur(d.baremeTotal)}`,
    d.meilleure === 'aucune' ? 'Aucun revenu de placement saisi.' : `Option la moins chère : ${d.meilleure === 'bareme' ? 'le barème' : 'la flat tax'}, avec ${eur(d.ecart)} d’écart. Tranche marginale avec ces revenus : ${pct(d.tmi)}`,
    'Règles générales utiles : l’option pour le barème (case 2OP) est globale pour tous les revenus et plus-values mobiliers de l’année et se choisit à la déclaration ; le prélèvement de 12,8 % fait en cours d’année est un acompte ; les dividendes bénéficient d’un abattement de 40 % au barème ; le revenu fiscal de référence inclut ces revenus avec les deux options, donc le choix ne change pas les aides sous conditions de ressources ; PEA et assurance-vie ont leur propre fiscalité et ne sont pas concernés ; les abattements pour durée de détention sur les titres achetés avant 2018 ne sont pas pris en compte dans le calcul.',
  ]
}

const SYSTEM = `Tu es l'assistant pédagogique de Grapheko, un média éducatif français sur l'argent. Tu rédiges un compte rendu court, en français, en tutoyant, à partir des résultats d'un simulateur fiscal.

Règles impératives :
- Utilise uniquement les chiffres et les règles fournis. N'invente aucun montant, taux, date ou règle, et ne refais pas les calculs.
- Explique simplement ce que les chiffres signifient pour cette personne.
- Tu n'es pas un conseiller en investissement ni un conseiller fiscal. Ne recommande jamais d'acheter, de vendre, d'ouvrir ou d'alimenter un produit, ni un montant précis à verser. Présente les pistes comme des points à vérifier ou des questions à se poser.
- Ne cite aucun établissement, aucune marque, aucun produit commercial.
- Format : texte brut de 170 à 250 mots, exactement trois sections, avec ces titres sur leur propre ligne : « ## Ta situation », « ## Ce que montre le calcul », « ## Points à vérifier ». La dernière section contient 2 à 4 puces commençant par « - ». Pas de gras, pas de tableau, pas d'emoji, pas de formule de politesse.`

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Méthode non autorisée' }) }
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(503).json({ error: 'Le compte rendu par IA n’est pas encore activé.' })

  const origin = req.headers.origin || ''
  if (origin && !/^https:\/\/(grapheko\.fr|[a-z0-9-]+\.vercel\.app)$|^http:\/\/localhost(:\d+)?$/.test(origin)) {
    return res.status(403).json({ error: 'Origine non autorisée' })
  }

  const { tool, data } = req.body || {}
  const clean = validate(tool, data)
  if (!clean) return res.status(400).json({ error: 'Données de simulation invalides' })

  if (rateLimited(req, 'compte-rendu', LIMIT)) return res.status(429).json({ error: 'Trop de demandes. Réessaie dans quelques minutes.' })

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: SYSTEM,
        messages: [{ role: 'user', content: `Voici les résultats de la simulation :\n${facts(tool, clean).map((f) => `- ${f}`).join('\n')}\n\nRédige le compte rendu.` }],
      }),
      signal: AbortSignal.timeout(25000),
    })
    if (!r.ok) {
      console.error('compte-rendu: API', r.status, (await r.text()).slice(0, 300))
      return res.status(502).json({ error: 'Le service d’IA ne répond pas. Réessaie plus tard.' })
    }
    const json = await r.json()
    const text = (json.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim()
    if (!text) return res.status(502).json({ error: 'Réponse vide du service d’IA.' })
    return res.status(200).json({ text })
  } catch (e) {
    console.error('compte-rendu:', e?.name, e?.message)
    return res.status(502).json({ error: 'Le service d’IA ne répond pas. Réessaie plus tard.' })
  }
}

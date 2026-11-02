import { useMemo } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import LineChart from '../../components/ui/LineChart'
import RangeField from '../../components/ui/RangeField'
import Counter from '../../components/ui/Counter'
import ShareButton from '../../components/ui/ShareButton'
import Faq from '../../components/ui/Faq'
import BaremeTable, { baremeRows } from '../../components/ui/BaremeTable'
import RecapPanel from '../../components/ui/RecapPanel'
import { perReport } from '../../lib/taxReport'
import StickyResult from '../../components/ui/StickyResult'
import { FoyerFields, RevenuFields, foyerFrom } from '../../components/ui/FoyerFields'
import { perSaving, perCurve, perCeilingEstimate, PER_MIN, PER_MAX, TAX_YEAR_LABEL, TAX_VERIFIED_AT } from '../../lib/tax'
import { eur, num } from '../../lib/format'
import { dateFr } from '../../lib/content/articles'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Tool.module.css'

const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: 'Économie d’impôt PER' }]

const FAQ = [
  {
    q: 'Combien d’impôt économise-t-on en versant sur un PER ?',
    a: 'Le versement est déduit du revenu imposable, dans la limite du plafond épargne retraite. L’économie dépend de la tranche marginale d’imposition : environ 11 % du versement dans la tranche à 11 %, 30 % dans la tranche à 30 %, 41 % ou 45 % au-delà. Si le versement fait changer de tranche ou réduit la décote, l’économie réelle est différente, d’où l’intérêt d’un calcul complet.',
  },
  {
    q: 'Jusqu’à quand verser sur un PER pour réduire ses impôts de l’année ?',
    a: 'Le versement doit être encaissé avant le 31 décembre pour être déduit des revenus de l’année. Les assureurs et courtiers fixent souvent une date limite quelques jours avant. Un versement de décembre 2026 réduit l’impôt payé en 2027 sur les revenus 2026.',
  },
  {
    q: 'Quel est le plafond de déduction du PER en 2026 ?',
    a: `Pour un salarié, il est égal à 10 % des revenus professionnels nets de 2025, avec un minimum de ${num(PER_MIN)} € et un maximum de ${num(PER_MAX)} €. Les plafonds non utilisés des années précédentes s’y ajoutent. Le montant exact figure sur l’avis d’imposition, rubrique « plafond épargne retraite ».`,
  },
  {
    q: 'Le PER est-il intéressant si je ne paie pas d’impôt ?',
    a: 'Non, du moins pas pour la déduction : sans impôt, il n’y a rien à réduire, et la sortie sera quand même imposée. Il est alors possible de renoncer à la déduction au moment du versement, ce qui rend le capital non imposable à la sortie (seuls les gains le seront).',
  },
]

export default function Per({ aiEnabled }) {
  const [st, set] = useToolState(
    'economie_per',
    { situation: 'single', enfants: 0, isole: 0, revenuMode: 'salaires', salaire1: 50000, salaire2: 30000, revenu: 45000, versement: 4000, plafondMode: 'auto', plafond: 6000, tmiRetraite: 11 },
    { syncUrl: false, trackKeys: ['situation', 'enfants', 'isole', 'revenuMode', 'plafondMode', 'tmiRetraite'] }
  )
  const foyer = foyerFrom(st)
  const { couple, parts, isolated, income } = foyer
  const estimated = foyer.fromSalaries
    ? perCeilingEstimate(foyer.net1) + (couple ? perCeilingEstimate(foyer.net2) : 0)
    : couple ? 2 * perCeilingEstimate(income / 2) : perCeilingEstimate(income)
  const ceiling = st.plafondMode === 'auto' ? estimated : st.plafond

  const r = useMemo(
    () => perSaving({ income, parts, situation: st.situation, isolated, payment: st.versement, ceiling }),
    [income, parts, st.situation, isolated, st.versement, ceiling]
  )
  const curve = useMemo(
    () => perCurve({ income, parts, situation: st.situation, isolated, ceiling, max: Math.max(ceiling * 1.25, st.versement * 1.2) }),
    [income, parts, st.situation, isolated, ceiling, st.versement]
  )
  const exitTax = r.deductible * (st.tmiRetraite / 100)
  const netGain = r.saving - exitTax
  const noTax = r.before === 0

  const situationTxt = `${couple ? 'Marié(e) ou pacsé(e)' : 'Seul(e)'}${isolated ? ', parent isolé (case T)' : ''}`
  const partsTxt = `${num(parts, parts % 1 ? 1 : 0)} part${parts > 1 ? 's' : ''} fiscale${parts > 1 ? 's' : ''}`
  const recap = {
    tool: 'per',
    title: 'Économie d’impôt d’un versement sur un PER',
    lede: `Simulation Grapheko avec le ${TAX_YEAR_LABEL}.`,
    highlight: { label: 'Impôt économisé', value: eur(r.saving) },
    params: [
      ['Situation', situationTxt],
      ['Enfants à charge', `${st.enfants} (${partsTxt})`],
      ...(foyer.fromSalaries
        ? [[couple ? 'Ton salaire annuel net imposable' : 'Salaire annuel net imposable', eur(st.salaire1)], ...(couple ? [['Salaire annuel du conjoint', eur(st.salaire2)]] : [])]
        : []),
      ['Revenu imposable du foyer', `${eur(income)}${foyer.fromSalaries ? ' (après déduction de 10 %)' : ' (avis d’impôt)'}`],
      ['Versement sur le PER', eur(st.versement)],
      [`Plafond de déduction (${st.plafondMode === 'auto' ? 'estimé' : 'indiqué'})`, eur(ceiling)],
      ['Tranche d’imposition prévue à la retraite', `${st.tmiRetraite} %`],
    ],
    results: [
      ['Montant déduit du revenu imposable', eur(r.deductible)],
      ['Impôt sur le revenu avant versement', eur(r.before)],
      ['Impôt sur le revenu après versement', eur(r.after)],
      ['Impôt économisé', eur(r.saving), true],
      ['Coût réel du versement', eur(r.netCost)],
      ['Tranche marginale d’imposition actuelle', `${num(r.tmi * 100)} %`],
      ['Impôt estimé à la sortie en capital sur ce versement', eur(exitTax)],
      ['Ordre de grandeur du gain net (en euros actuels)', eur(netGain)],
    ],
    notes: [
      ...(r.excess > 0 ? [`${eur(r.excess)} dépassent ton plafond et ne sont pas déductibles cette année.`] : []),
      ...(noTax ? ['Avec ces paramètres, tu ne paies pas d’impôt sur le revenu : la déduction ne rapporte rien.'] : []),
    ],
    baremeTitle: `Le barème utilisé : ${TAX_YEAR_LABEL}`,
    bareme: baremeRows(r.tmi),
    method: `Impôt calculé avec le ${TAX_YEAR_LABEL} (loi de finances pour 2026) : plafonnement du quotient familial et décote compris. Un versement fait en 2026 réduit l’impôt 2027 sur les revenus 2026, dont le barème n’est pas encore voté (relèvement de 2,1 % prévu). Le plafond exact figure sur ton avis d’impôt. Les gains du PER seront imposés à la sortie à la flat tax de 31,4 %. Règles vérifiées le ${dateFr(TAX_VERIFIED_AT)}.`,
    url: 'https://grapheko.fr/simulateurs/per',
  }
  const aiData = {
    situation: st.situation, enfants: st.enfants, isole: isolated ? 1 : 0, revenuMode: st.revenuMode, parts,
    revenu: Math.round(income), versement: st.versement, plafond: Math.round(ceiling), plafondMode: st.plafondMode,
    deduit: Math.round(r.deductible), excedent: Math.round(r.excess), impotAvant: r.before, impotApres: r.after, economie: r.saving,
    tauxEffectif: Math.round(r.effectiveRate * 1000) / 10, tmi: Math.round(r.tmi * 100), tmiRetraite: st.tmiRetraite,
    impotSortie: Math.round(exitTax), gainNet: Math.round(netGain),
  }

  return (
    <>
      <Seo
        title="Simulateur PER 2026 : combien d’impôt économiser avant le 31 décembre ?"
        description="Calcule l’économie d’impôt d’un versement sur un plan d’épargne retraite selon ton salaire, ta situation familiale et ton plafond. Barème officiel, quotient familial et décote inclus."
        jsonLd={[crumbsJsonLd(crumbs), faqJsonLd(FAQ)]}
      />
      <PageIntro
        crumbs={crumbs}
        title="Combien d’impôt économise ton versement sur un PER ?"
        lede="Chaque euro versé sur un plan d’épargne retraite avant le 31 décembre est déduit de ton revenu imposable. Le calcul complet, avec le barème officiel, le quotient familial et la décote, et ce que tu repaieras à la sortie."
        wide
      />
      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
            <h2>Ton foyer</h2>
            <FoyerFields st={st} set={set} foyer={foyer} />
            <RevenuFields st={st} set={set} foyer={foyer} />
            <hr className="rule" />
            <h2>Ton versement</h2>
            <RangeField label="Versement sur le PER" value={st.versement} onChange={set('versement')} min={0} max={50000} step={100} suffix="€" />
            <div className="field">
              <span className="label" id="plaf-label">Plafond de déduction</span>
              <div className="segmented" role="group" aria-labelledby="plaf-label">
                <button type="button" aria-pressed={st.plafondMode === 'auto'} onClick={() => set('plafondMode')('auto')}>Estimer</button>
                <button type="button" aria-pressed={st.plafondMode === 'manuel'} onClick={() => set('plafondMode')('manuel')}>Je le connais</button>
              </div>
              {st.plafondMode === 'auto' && (
                <span className="hint">
                  Estimé à {eur(estimated)} : 10 % des revenus d’activité, entre {eur(PER_MIN)} et {eur(PER_MAX)} par personne
                  {couple ? (foyer.fromSalaries ? ', calculé pour chacun de vous deux puis additionné' : ', en supposant des revenus égaux entre vous deux') : ''}.
                  Retraité(e) ou sans activité : {eur(PER_MIN)}. Ton avis d’impôt donne le montant exact, avec les plafonds non utilisés des années passées.
                </span>
              )}
            </div>
            {st.plafondMode === 'manuel' && (
              <RangeField label="Plafond disponible" value={st.plafond} onChange={set('plafond')} min={0} max={200000} step={100} suffix="€" hint="Rubrique « plafond épargne retraite » de ton dernier avis d’imposition, à additionner pour un couple." />
            )}
            <hr className="rule" />
            <div className="field">
              <span className="label" id="tmi-label">Ta tranche d’imposition à la retraite (estimation)</span>
              <div className="segmented" role="group" aria-labelledby="tmi-label">
                {[0, 11, 30, 41].map((t) => (
                  <button key={t} type="button" aria-pressed={st.tmiRetraite === t} onClick={() => set('tmiRetraite')(t)}>{t} %</button>
                ))}
              </div>
              <span className="hint">Sert à estimer l’impôt payé à la sortie sur ce versement.</span>
            </div>
          </form>

          <div className={s.results} aria-live="polite">
            <dl className={s.kpis} id="resultat">
              <div className={`${s.kpi} ${s.kpiMain}`}>
                <dt>Impôt économisé</dt>
                <dd className="figure">
                  <Counter value={r.saving} format={(v) => eur(v)} />
                  <span className={s.sub} style={{ color: '#BDBFD6' }}>
                    {r.deductible > 0 ? `soit ${num(r.effectiveRate * 100, 1)} % du montant déduit` : 'aucun montant déduit'}
                  </span>
                </dd>
              </div>
              <div className={s.kpi}>
                <dt>Coût réel du versement</dt>
                <dd className="figure"><Counter value={r.netCost} format={(v) => eur(v)} /></dd>
              </div>
              <div className={s.kpi}>
                <dt>Ton impôt après versement</dt>
                <dd className="figure">
                  <Counter value={r.after} format={(v) => eur(v)} />
                  <span className={s.sub} style={{ color: 'var(--fg-muted)' }}>au lieu de {eur(r.before)}</span>
                </dd>
              </div>
            </dl>

            {r.excess > 0 && (
              <p className={s.alert}>
                <strong>{eur(r.excess)} dépassent ton plafond</strong> et ne sont pas déductibles cette année. Ils restent sur ton PER, mais sans avantage fiscal à l’entrée.
              </p>
            )}
            {noTax && (
              <p className={s.alert}>
                <strong>Tu ne paies pas d’impôt sur le revenu</strong> avec ces paramètres : la déduction ne rapporte rien. Il est possible de renoncer à la déduction lors du versement, pour ne pas être imposé sur le capital à la sortie.
              </p>
            )}

            <div className={s.chartPanel}>
              <h2 className={s.chartTitle}>Impôt économisé selon le montant versé</h2>
              <LineChart
                animateKey={`${income}-${parts}-${st.situation}-${ceiling}`}
                labels={curve.map((p) => p.payment)}
                series={[{ key: 'saving', label: 'Impôt économisé', color: 'var(--outremer)', values: curve.map((p) => p.saving), area: true }]}
                formatX={(v) => eur(v)}
                formatY={(v) => eur(v)}
                minZero
                ariaLabel="Économie d’impôt en fonction du montant versé sur le PER"
              />
              <p className="small muted" style={{ marginTop: 14 }}>
                La courbe s’aplatit quand le versement dépasse ton plafond ({eur(ceiling)}), et ralentit quand il te fait descendre d’une tranche.
              </p>
            </div>

            <BaremeTable tmi={r.tmi} parts={parts} note="Un versement fait en 2026 réduira l’impôt 2027 sur les revenus 2026 : son barème, relevé de 2,1 % dans le projet de loi de finances 2027, n’est pas encore voté." />

            <RecapPanel toolName="economie_per" recap={recap} aiTool="per" aiData={aiData} aiEnabled={aiEnabled} report={perReport({ situation: st.situation, enfants: st.enfants, isolated, parts, income, payment: st.versement, ceiling, plafondMode: st.plafondMode, r, tmiRetraite: st.tmiRetraite, exitTax, netGain })} />

            <div className={s.reading}>
              <div>
                <h3>À la sortie, l’impôt revient</h3>
                <p>
                  La déduction n’est pas un cadeau, c’est un report. Si tu récupères ce versement en capital à la retraite, il sera ajouté à tes revenus de l’année :
                  environ {eur(exitTax)} d’impôt avec une tranche à {st.tmiRetraite} %. Les gains, eux, seront soumis à la flat tax de 31,4 %.
                  {r.saving > 0 && (
                    <> Ordre de grandeur du gain net : <strong>{eur(netGain)}</strong> (économie d’aujourd’hui moins impôt de demain, en euros actuels, pour une sortie en capital).</>
                  )}
                </p>
              </div>
              <div>
                <h3>L’argent est bloqué jusqu’à la retraite</h3>
                <p>
                  Sauf achat de la résidence principale, invalidité, décès du conjoint, surendettement ou fin de droits au chômage. Depuis 2026, les versements faits après 70 ans ne sont plus déductibles.
                  <Link href="/glossaire/plan-epargne-retraite"> Le PER expliqué</Link>.
                </p>
              </div>
            </div>

            <div className={s.actions}>
              <ShareButton toolName="economie_per" label="Partager ce simulateur" />
              <Link className="btn" href="/simulateurs/flat-tax-ou-bareme">Flat tax ou barème ?</Link>
              <Link className="btn" href="/calendrier">Les dates fiscales</Link>
            </div>

            <p className={s.method}>
              <strong>Méthode.</strong> Impôt calculé avec le {TAX_YEAR_LABEL} : tranches à 0, 11, 30, 41 et 45 %, plafonnement du quotient familial (1 807 € par demi-part, cas général) et décote.
              Un versement fait en 2026 réduit l’impôt sur les revenus 2026, payé en 2027 avec un barème que le projet de loi de finances 2027 prévoit de relever de 2,1 % : l’économie réelle peut varier de quelques euros.
              Cas particuliers non pris en compte : garde alternée, demi-parts pour invalidité ou ancien combattant, revenus exceptionnels, contribution sur les hauts revenus. À partir des salaires, la déduction forfaitaire de 10 % est appliquée à chacun (entre 509 € et 14 555 €).
              Règles vérifiées le {dateFr(TAX_VERIFIED_AT)} (loi de finances pour 2026). Aucune donnée saisie n’est enregistrée ni transmise. Outil pédagogique, pas un conseil en investissement.
            </p>

            <Faq items={FAQ} />
          </div>
        </div>
      </div>
      <StickyResult targetId="resultat" label="Impôt économisé" value={eur(r.saving)} />
    </>
  )
}

function faqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  }
}

export async function getStaticProps() {
  return { props: { aiEnabled: Boolean(process.env.ANTHROPIC_API_KEY), tracking: { tool_name: 'economie_per' } } }
}

import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import { toolJsonLd } from '../../lib/jsonld'
import RangeField from '../../components/ui/RangeField'
import ShareButton from '../../components/ui/ShareButton'
import Faq from '../../components/ui/Faq'
import StickyResult from '../../components/ui/StickyResult'
import { FoyerFields, foyerFrom } from '../../components/ui/FoyerFields'
import { netSalary } from '../../lib/tax'
import {
  ZONES, lepCeiling, lepEligibility, yearlyInterest,
  LEP_RATE, LIVRET_A_RATE, LEP_MAX_DEPOSIT, LEP_CEILING_YEAR, LEP_VERIFIED_AT, RATES_UNTIL, LATEST_NOTICE, PREVIOUS_NOTICE,
} from '../../lib/lep'
import { eur, num } from '../../lib/format'
import { dateFr } from '../../lib/content/articles'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Tool.module.css'
import t from '../../components/ui/BaremeTable.module.css'

const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: 'Test d’éligibilité LEP' }]

const rate = (v) => `${num(v * 100, 1)} %`
const partsText = (p) => `${num(p, p % 1 ? 2 : 0).replace(/(,\d)0$/, '$1')} part${p > 1 ? 's' : ''}`

const FAQ = [
  {
    q: 'Quel revenu maximum pour ouvrir un LEP en 2026 ?',
    a: `En métropole, le revenu fiscal de référence ne doit pas dépasser ${eur(lepCeiling(1))} pour 1 part, ${eur(lepCeiling(2))} pour 2 parts et ${eur(lepCeiling(3))} pour 3 parts. Les plafonds sont plus élevés en outre-mer.`,
  },
  {
    q: 'Quel avis d’impôt faut-il regarder ?',
    a: `Pour une demande en ${LEP_CEILING_YEAR}, la banque peut retenir le revenu ${PREVIOUS_NOTICE.income} (avis reçu en ${PREVIOUS_NOTICE.notice}) ou le revenu ${LATEST_NOTICE.income} (avis reçu en ${LATEST_NOTICE.notice}). Il suffit que l’un des deux passe sous le plafond.`,
  },
  {
    q: 'Où trouver mon revenu fiscal de référence ?',
    a: 'Sur ton avis d’impôt, à la ligne « Revenu fiscal de référence ». C’est un montant différent du revenu imposable et de ton salaire. Le nombre de parts figure aussi sur cet avis.',
  },
  {
    q: 'Combien rapporte un LEP ?',
    a: `${rate(LEP_RATE)} par an jusqu’au ${RATES_UNTIL}, sans impôt ni prélèvements sociaux, contre ${rate(LIVRET_A_RATE)} pour le Livret A. Les versements sont limités à ${eur(LEP_MAX_DEPOSIT)}, mais les intérêts peuvent faire dépasser ce montant. Sur ${eur(LEP_MAX_DEPOSIT)} placés une année pleine, cela représente ${eur(yearlyInterest(LEP_MAX_DEPOSIT, LEP_RATE))} d’intérêts.`,
  },
  {
    q: 'Un couple peut-il ouvrir deux LEP ?',
    a: `Oui. Les époux et les partenaires de Pacs imposés ensemble peuvent détenir un LEP chacun, soit ${eur(LEP_MAX_DEPOSIT * 2)} de versements au total. Une même personne ne peut en avoir qu’un seul.`,
  },
  {
    q: 'Un étudiant ou un apprenti peut-il ouvrir un LEP ?',
    a: 'Pas tant qu’il est rattaché au foyer fiscal de ses parents. Il peut en ouvrir un une fois qu’il déclare ses revenus séparément, si son revenu passe sous le plafond.',
  },
  {
    q: 'Que se passe-t-il si mes revenus dépassent le plafond plus tard ?',
    a: 'Un seul dépassement ne suffit pas à fermer le livret : tu peux le garder si le revenu de l’année suivante repasse sous le plafond. Après deux années consécutives au-dessus, la fermeture est obligatoire.',
  },
]

const VERDICTS = {
  yes: { title: 'Oui', sub: 'Ton revenu passe sous le plafond.' },
  yesPrevious: { title: 'Oui', sub: `Grâce à ton avis ${PREVIOUS_NOTICE.notice}, qui passe sous le plafond.` },
  likely: { title: 'Probablement', sub: 'D’après une estimation : ton avis d’impôt tranchera.' },
  likelyNot: { title: 'Sans doute pas', sub: 'D’après une estimation : ton avis d’impôt tranchera.' },
  no: { title: 'Non', sub: 'Ton revenu dépasse le plafond.' },
  attached: { title: 'Pas encore', sub: 'Il faut d’abord déclarer tes revenus séparément.' },
}

export default function EligibiliteLep() {
  const [st, set] = useToolState(
    'test_lep',
    {
      zone: 'metropole', revenuMode: 'avis', situation: 'single', enfants: 0, isole: 0,
      partsAvis: 1, rfr: 18000, avisPrecedent: 0, rfrPrecedent: 18000,
      salaire1: 20000, salaire2: 20000, rattache: 0, montant: 5000,
    },
    // Rien sur les revenus ni sur le résultat, qui trahirait le niveau de revenu du foyer
    { syncUrl: false, trackKeys: ['zone', 'revenuMode', 'situation', 'enfants', 'isole'] }
  )

  const fromNotice = st.revenuMode === 'avis'
  const foyer = foyerFrom({ ...st, revenuMode: 'salaires' })
  const couple = st.situation === 'couple'
  const parts = fromNotice ? st.partsAvis : foyer.parts
  const estimate = couple ? netSalary(st.salaire1) + netSalary(st.salaire2) : netSalary(st.salaire1)
  const latest = fromNotice ? st.rfr : Math.round(estimate)
  const previous = fromNotice && st.avisPrecedent === 1 ? st.rfrPrecedent : null
  const attached = st.rattache === 1
  const r = lepEligibility({ latest, previous, parts, zone: st.zone, attached })

  let verdict = 'no'
  if (attached) verdict = 'attached'
  else if (!fromNotice) verdict = r.latestOk ? 'likely' : 'likelyNot'
  else if (r.latestOk) verdict = 'yes'
  else if (r.previousOk) verdict = 'yesPrevious'
  const v = VERDICTS[verdict]
  const canOpen = verdict === 'yes' || verdict === 'yesPrevious' || verdict === 'likely'

  const maxDeposit = couple ? LEP_MAX_DEPOSIT * 2 : LEP_MAX_DEPOSIT
  const amount = Math.min(st.montant, maxDeposit)
  const lepGain = yearlyInterest(amount, LEP_RATE)
  const livretGain = yearlyInterest(amount, LIVRET_A_RATE)
  const scale = Math.max(r.ceiling, latest) * 1.15
  const rows = [...new Set([1, 1.5, 2, 2.5, 3, 3.5, 4, 5, parts])].sort((a, b) => a - b)

  return (
    <>
      <Seo
        title="Éligible au LEP en 2026 ? Le test avec les plafonds officiels"
        description={`Vérifie si tu peux ouvrir un livret d’épargne populaire : plafonds 2026 selon tes parts et ton lieu de vie (${eur(lepCeiling(1))} pour 1 part en métropole), et ce qu’il rapporte face au Livret A.`}
        jsonLd={[crumbsJsonLd(crumbs), faqJsonLd(FAQ), toolJsonLd({ name: 'Test d’éligibilité au LEP', description: 'Vérifie si ton revenu fiscal de référence permet d’ouvrir un livret d’épargne populaire, avec les plafonds 2026 selon tes parts et ton lieu de vie.', path: '/simulateurs/eligibilite-lep' })]}
      />
      <PageIntro
        crumbs={crumbs}
        title="Peux-tu ouvrir un LEP ?"
        lede={`Le livret d’épargne populaire rapporte ${rate(LEP_RATE)} par an, sans impôt, contre ${rate(LIVRET_A_RATE)} pour le Livret A. Il est réservé aux foyers sous un plafond de revenus : vérifie où tu te situes.`}
        wide
      />
      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du test">
            <h2>Ta situation</h2>
            <div className="field">
              <span className="label" id="zone-label">Ton domicile fiscal</span>
              <div className="segmented" role="group" aria-labelledby="zone-label">
                {Object.entries(ZONES).map(([key, z]) => (
                  <button key={key} type="button" aria-pressed={st.zone === key} onClick={() => set('zone')(key)}>{z.label}</button>
                ))}
              </div>
            </div>
            <label className="check">
              <input type="checkbox" checked={attached} onChange={(e) => set('rattache')(e.target.checked ? 1 : 0)} />
              <span>Je suis rattaché(e) au foyer fiscal de mes parents</span>
            </label>
            <hr className="rule" />
            <h2>Tes revenus</h2>
            <div className="field">
              <span className="label" id="source-label">Comment veux-tu répondre ?</span>
              <div className="segmented" role="group" aria-labelledby="source-label">
                <button type="button" aria-pressed={fromNotice} onClick={() => set('revenuMode')('avis')}>J’ai mon avis d’impôt</button>
                <button type="button" aria-pressed={!fromNotice} onClick={() => set('revenuMode')('salaires')}>Estimer depuis mon salaire</button>
              </div>
            </div>
            {fromNotice ? (
              <>
                <div className="field">
                  <span className="label" id="sit-label">Situation</span>
                  <div className="segmented" role="group" aria-labelledby="sit-label">
                    <button type="button" aria-pressed={!couple} onClick={() => set('situation')('single')}>Seul(e)</button>
                    <button type="button" aria-pressed={couple} onClick={() => set('situation')('couple')}>Marié(e) ou pacsé(e)</button>
                  </div>
                </div>
                <RangeField label="Nombre de parts" value={st.partsAvis} onChange={set('partsAvis')} min={1} max={8} step={0.25} hint="Indiqué sur ton avis d’impôt." />
                <RangeField
                  label={`Revenu fiscal de référence ${LATEST_NOTICE.income}`}
                  value={st.rfr}
                  onChange={set('rfr')}
                  min={0}
                  max={150000}
                  step={100}
                  suffix="€"
                  hint={`La ligne « Revenu fiscal de référence » de ton avis reçu en ${LATEST_NOTICE.notice}. Ce n’est ni ton salaire, ni le revenu imposable.`}
                />
                <label className="check">
                  <input type="checkbox" checked={st.avisPrecedent === 1} onChange={(e) => set('avisPrecedent')(e.target.checked ? 1 : 0)} />
                  <span>Ajouter mon avis reçu en {PREVIOUS_NOTICE.notice} <span className="hint">(utile si tes revenus ont baissé ou monté)</span></span>
                </label>
                {st.avisPrecedent === 1 && (
                  <RangeField label={`Revenu fiscal de référence ${PREVIOUS_NOTICE.income}`} value={st.rfrPrecedent} onChange={set('rfrPrecedent')} min={0} max={150000} step={100} suffix="€" />
                )}
              </>
            ) : (
              <>
                <FoyerFields st={st} set={set} foyer={foyer} />
                <RangeField
                  label={couple ? 'Ton salaire annuel' : 'Salaire annuel'}
                  value={st.salaire1}
                  onChange={set('salaire1')}
                  min={0}
                  max={150000}
                  step={500}
                  suffix="€"
                  hint="Le cumul « net imposable » de ta fiche de paie de décembre."
                />
                {couple && (
                  <RangeField label="Salaire annuel de ton conjoint" value={st.salaire2} onChange={set('salaire2')} min={0} max={150000} step={500} suffix="€" />
                )}
                <p className="hint" style={{ marginTop: -8 }}>
                  Revenu estimé : <strong>{eur(latest)}</strong>, après la déduction de 10 % pour frais professionnels. Tes autres revenus (loyers, pensions, placements…) s’y ajouteraient.
                </p>
              </>
            )}
          </form>

          <div className={s.results} aria-live="polite">
            <dl className={s.kpis} id="resultat">
              <div className={`${s.kpi} ${s.kpiMain}`}>
                <dt>Peux-tu ouvrir un LEP ?</dt>
                <dd className="figure">
                  {v.title}
                  <span className={s.sub} style={{ color: '#BDBFD6' }}>{v.sub}</span>
                </dd>
              </div>
              <div className={s.kpi}>
                <dt>Ton plafond {LEP_CEILING_YEAR}</dt>
                <dd className="figure num">{eur(r.ceiling)}<span className={s.sub} style={{ color: 'var(--fg-muted)' }}>pour {partsText(parts)}</span></dd>
              </div>
              <div className={s.kpi}>
                <dt>{r.margin >= 0 ? 'Marge sous le plafond' : 'Dépassement'}</dt>
                <dd className="figure num">{eur(Math.abs(r.margin))}<span className={s.sub} style={{ color: 'var(--fg-muted)' }}>revenu {fromNotice ? LATEST_NOTICE.income : 'estimé'}</span></dd>
              </div>
            </dl>

            {attached && (
              <p className={s.alert}>
                <strong>Tant que tu es rattaché(e) à tes parents, tu ne peux pas ouvrir de LEP</strong>, quel que soit ton revenu. Le calcul ci-dessous te montre où tu te situerais en déclarant séparément.
              </p>
            )}
            {!attached && !fromNotice && !r.latestOk && (
              <p className={s.alert}>
                <strong>Vérifie sur ton avis d’impôt.</strong> Cette estimation ne connaît pas tous tes revenus ni tes charges déductibles, et la banque se fonde uniquement sur le revenu fiscal de référence.
              </p>
            )}
            {verdict === 'no' && st.avisPrecedent === 0 && (
              <p className={s.alert}>
                <strong>Tes revenus ont baissé ou monté récemment ?</strong> La banque peut aussi retenir ton avis reçu en {PREVIOUS_NOTICE.notice}. Ajoute-le dans le formulaire : il suffit qu’un seul des deux passe sous le plafond.
              </p>
            )}

            <div className={s.chartPanel}>
              <h2 className={s.chartTitle} style={{ marginBottom: 24 }}>Ton revenu face au plafond</h2>
              <div className={s.bar}>
                <div className={s.barHead}>
                  <span className={s.barName}>{fromNotice ? `Revenu fiscal de référence ${LATEST_NOTICE.income}` : 'Revenu estimé'}</span>
                  <span className={s.barTotal}>{eur(latest)}</span>
                </div>
                <div className={s.limitWrap}>
                  <div className={s.track} aria-hidden="true">
                    <span style={{ width: `${(latest / scale) * 100}%`, background: r.latestOk ? 'var(--outremer)' : 'var(--baisse)' }} />
                  </div>
                  <i className={s.limit} style={{ left: `${(r.ceiling / scale) * 100}%` }} aria-hidden="true" />
                </div>
                <p className={s.barDetail}>
                  Le trait marque le plafond de {eur(r.ceiling)} ({ZONES[st.zone].label}, {partsText(parts)}).
                  {previous !== null ? ` Ton revenu ${PREVIOUS_NOTICE.income} de ${eur(previous)} est ${r.previousOk ? 'sous' : 'au-dessus de'} ce plafond.` : ''}
                </p>
              </div>
            </div>

            <div className={s.chartPanel}>
              <h2 className={s.chartTitle} style={{ marginBottom: 24 }}>Ce que ça change face au Livret A</h2>
              <RangeField
                label="Montant placé"
                value={amount}
                onChange={set('montant')}
                min={0}
                max={maxDeposit}
                step={100}
                suffix="€"
                hint={couple ? `Un LEP par personne, soit ${eur(maxDeposit)} de versements à deux.` : `Versements limités à ${eur(LEP_MAX_DEPOSIT)}.`}
              />
              <div className={s.compare} style={{ marginTop: 20 }}>
                <div className={s.bar}>
                  <div className={s.barHead}>
                    <span className={s.barName}>LEP à {rate(LEP_RATE)}</span>
                    <span className={s.barTotal}>{eur(lepGain)}</span>
                  </div>
                  <div className={s.track} aria-hidden="true"><span style={{ width: '100%', background: 'var(--outremer)' }} /></div>
                </div>
                <div className={s.bar}>
                  <div className={s.barHead}>
                    <span className={s.barName}>Livret A à {rate(LIVRET_A_RATE)}</span>
                    <span className={s.barTotal}>{eur(livretGain)}</span>
                  </div>
                  <div className={s.track} aria-hidden="true"><span style={{ width: `${(LIVRET_A_RATE / LEP_RATE) * 100}%`, background: 'var(--encre-3)' }} /></div>
                </div>
              </div>
              <p className="small muted" style={{ marginTop: 14 }}>
                {eur(lepGain - livretGain)} d’écart sur une année pleine si les taux ne changeaient pas. Ils sont fixés jusqu’au {RATES_UNTIL}, puis revus.
              </p>
            </div>

            <section className={t.box} aria-labelledby="plafonds-title">
              <div>
                <h2 id="plafonds-title" className={t.title}>Les plafonds {LEP_CEILING_YEAR}</h2>
                <p className={t.sub}>{ZONES[st.zone].label}. Revenu fiscal de référence à ne pas dépasser.</p>
              </div>
              <table className={t.table}>
                <thead>
                  <tr><th scope="col">Nombre de parts</th><th scope="col">Plafond</th></tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p} className={p === parts ? t.mine : ''} aria-current={p === parts ? 'true' : undefined}>
                      <td>{partsText(p)}</td>
                      <td className={t.rate}>{eur(lepCeiling(p, st.zone))}{p === parts && <span className={t.badge}>Ton foyer</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={t.foot}>
                <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F2367" target="_blank" rel="noopener noreferrer">Source : service-public.gouv.fr</a>
              </p>
            </section>

            <div className={s.reading}>
              {canOpen ? (
                <div>
                  <h3>Pour l’ouvrir</h3>
                  <p>
                    Demande à ta banque si elle le propose, avec ton dernier avis d’impôt ou de non-imposition. Elle vérifie ton revenu, parfois directement auprès de l’administration fiscale. Le premier versement est d’au moins 30 €.
                  </p>
                </div>
              ) : (
                <div>
                  <h3>Si tu n’y as pas droit</h3>
                  <p>
                    Le Livret A et le LDDS sont ouverts à tous, sans condition de revenus, avec le même avantage fiscal. Leur taux est plus bas : {rate(LIVRET_A_RATE)}.
                  </p>
                </div>
              )}
              <div>
                <h3>Si tes revenus montent ensuite</h3>
                <p>
                  Un seul dépassement ne ferme pas le livret si le revenu de l’année suivante repasse sous le plafond. Après deux années consécutives au-dessus, la fermeture est obligatoire.
                </p>
              </div>
            </div>

            <div className={s.actions}>
              <ShareButton toolName="test_lep" label="Partager ce test" />
              <Link className="btn" href="/simulateurs/rendement-reel">Ton livret face à l’inflation</Link>
              <Link className="btn" href="/glossaire/lep">Le LEP expliqué</Link>
            </div>

            <p className={s.method}>
              <strong>Méthode.</strong> Plafonds {LEP_CEILING_YEAR} publiés par service-public.gouv.fr, comparés au revenu fiscal de référence (art. R221-33 du code monétaire et financier) : un revenu égal au plafond reste éligible.
              L’estimation depuis le salaire applique la déduction de 10 % pour frais professionnels et ignore les autres revenus et charges. Intérêts calculés sur une année pleine ; la banque compte par quinzaines, donc un versement en cours d’année rapporte un peu moins.
              Plafonds valables pour une demande en {LEP_CEILING_YEAR}. Règles vérifiées le {dateFr(LEP_VERIFIED_AT)}. Aucune donnée saisie n’est enregistrée ni transmise. Seule ta banque peut confirmer l’ouverture. Outil pédagogique, pas un conseil financier.
            </p>

            <Faq items={FAQ} />
          </div>
        </div>
      </div>
      <StickyResult targetId="resultat" label="Peux-tu ouvrir un LEP ?" value={`${v.title} · plafond ${eur(r.ceiling)}`} />
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
  return { props: { tracking: { tool_name: 'test_lep' } } }
}

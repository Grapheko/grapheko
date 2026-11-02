import { useMemo } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import LineChart from '../../components/ui/LineChart'
import RangeField from '../../components/ui/RangeField'
import Counter from '../../components/ui/Counter'
import ShareButton from '../../components/ui/ShareButton'
import Faq from '../../components/ui/Faq'
import BaremeTable from '../../components/ui/BaremeTable'
import { flatTaxVsScale, TAX_YEAR_LABEL, TAX_VERIFIED_AT } from '../../lib/tax'
import { eur, num } from '../../lib/format'
import { dateFr } from '../../lib/content/articles'
import { useToolState } from '../../lib/useToolState'
import s from '../../styles/Tool.module.css'

const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: 'Flat tax ou barème' }]

const FAQ = [
  {
    q: 'Quand vaut-il mieux opter pour le barème plutôt que la flat tax ?',
    a: 'En règle générale quand ta tranche marginale d’imposition est de 0 % ou 11 %, surtout pour des dividendes, qui bénéficient d’un abattement de 40 % au barème. Dans la tranche à 30 % et au-delà, la flat tax est presque toujours plus avantageuse. Les cas proches d’un changement de tranche méritent un calcul complet.',
  },
  {
    q: 'Quel est le taux de la flat tax en 2026 ?',
    a: '31,4 % : 12,8 % d’impôt sur le revenu et 18,6 % de prélèvements sociaux. Le taux est passé de 30 % à 31,4 % au 1er janvier 2026 avec la hausse de la CSG décidée par la loi de financement de la sécurité sociale pour 2026. L’assurance-vie n’est pas concernée par cette hausse.',
  },
  {
    q: 'Comment opter pour le barème progressif ?',
    a: 'En cochant la case 2OP de la déclaration de revenus. L’option est globale : elle vaut pour tous les dividendes, intérêts et plus-values sur titres du foyer pour l’année. Les plus-values sur cryptos ont leur propre option, indépendante.',
  },
  {
    q: 'Les prélèvements sociaux changent-ils selon l’option ?',
    a: 'Non, ils restent de 18,6 % dans les deux cas. Mais au barème, une partie de la CSG (6,8 points) est déductible du revenu imposable de l’année suivante, ce qui réduit un peu l’impôt suivant.',
  },
]

export default function FlatTaxOuBareme() {
  const [st, set] = useToolState(
    'flat_tax_bareme',
    { situation: 'single', parts: 1, revenu: 25000, dividendes: 2000, interets: 0, plusValues: 0 },
    { syncUrl: false, trackKeys: ['situation', 'parts'], resultParams: () => ({}) }
  )
  const couple = st.situation === 'couple'
  const parts = Math.max(couple ? 2 : 1, st.parts)
  const input = { income: st.revenu, parts, situation: st.situation, dividends: st.dividendes, interest: st.interets, gains: st.plusValues }
  const r = useMemo(() => flatTaxVsScale(input), [st.revenu, parts, st.situation, st.dividendes, st.interets, st.plusValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const curve = useMemo(() => {
    const top = Math.max(60000, Math.round((st.revenu * 2) / 10000) * 10000)
    return Array.from({ length: 31 }, (_, i) => {
      const income = Math.round((top * i) / 30 / 500) * 500
      const c = flatTaxVsScale({ ...input, income })
      return { income, pfu: c.pfu.total, scale: c.scale.total }
    })
  }, [st.revenu, parts, st.situation, st.dividendes, st.interets, st.plusValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const crossover = curve.find((p, i) => i > 0 && curve[i - 1].scale < curve[i - 1].pfu && p.scale >= p.pfu)
  const max = Math.max(r.pfu.total, r.scale.total, 1)
  const w = (v) => `${Math.max(0, (v / max) * 100)}%`
  const bestLabel = r.best === 'bareme' ? 'le barème' : 'la flat tax'

  const setSituation = (v) => {
    set('situation')(v)
    if (v === 'couple' && st.parts < 2) set('parts')(2)
    if (v === 'single' && st.parts === 2) set('parts')(1)
  }

  return (
    <>
      <Seo
        title="Flat tax ou barème en 2026 : le simulateur pour dividendes et plus-values"
        description="PFU à 31,4 % ou option pour le barème progressif ? Compare l’impôt sur tes dividendes, intérêts et plus-values selon ton revenu et ta situation familiale, avec l’abattement de 40 % et la CSG déductible."
        jsonLd={[crumbsJsonLd(crumbs), faqJsonLd(FAQ)]}
      />
      <PageIntro
        crumbs={crumbs}
        title="Flat tax ou barème : lequel te fait payer le moins ?"
        lede="Dividendes, intérêts et plus-values sont taxés à 31,4 % par défaut. Tu peux choisir le barème de l’impôt sur le revenu à la place. Selon ta tranche, l’écart peut aller dans un sens ou dans l’autre."
        wide
      />
      <div className={`wrap ${s.more}`}>
        <div className={s.layout}>
          <form className={`panel ${s.controls}`} onSubmit={(e) => e.preventDefault()} aria-label="Paramètres du calcul">
            <h2>Ton foyer</h2>
            <div className="field">
              <span className="label" id="sit-label">Situation</span>
              <div className="segmented" role="group" aria-labelledby="sit-label">
                <button type="button" aria-pressed={!couple} onClick={() => setSituation('single')}>Seul(e)</button>
                <button type="button" aria-pressed={couple} onClick={() => setSituation('couple')}>Marié(e) ou pacsé(e)</button>
              </div>
            </div>
            <RangeField label="Nombre de parts" value={parts} onChange={set('parts')} min={couple ? 2 : 1} max={6} step={0.5} />
            <RangeField label="Revenu net imposable, hors placements" value={st.revenu} onChange={set('revenu')} min={0} max={250000} step={500} suffix="€" hint="Salaires, pensions… après l’abattement de 10 %." />
            <hr className="rule" />
            <h2>Tes revenus de placements</h2>
            <RangeField label="Dividendes" value={st.dividendes} onChange={set('dividendes')} min={0} max={100000} step={100} suffix="€" hint="Montant brut, sur un compte-titres." />
            <RangeField label="Intérêts" value={st.interets} onChange={set('interets')} min={0} max={100000} step={100} suffix="€" hint="Compte à terme, livret bancaire fiscalisé, obligations…" />
            <RangeField label="Plus-values sur titres" value={st.plusValues} onChange={set('plusValues')} min={0} max={100000} step={100} suffix="€" hint="Après imputation des moins-values. Actions, ETF, fonds sur un compte-titres." />
          </form>

          <div className={s.results} aria-live="polite">
            <dl className={s.kpis}>
              <div className={`${s.kpi} ${s.kpiMain}`}>
                <dt>{r.best ? `Le plus avantageux : ${bestLabel}` : 'Saisis tes revenus de placements'}</dt>
                <dd className="figure">
                  <Counter value={r.gap} format={(v) => eur(v)} />
                  <span className={s.sub} style={{ color: '#BDBFD6' }}>{r.best ? 'd’économie sur l’année' : 'pour comparer'}</span>
                </dd>
              </div>
              <div className={s.kpi}>
                <dt>Flat tax</dt>
                <dd className="figure"><Counter value={r.pfu.total} format={(v) => eur(v)} /><span className={s.sub} style={{ color: 'var(--fg-muted)' }}>{num(r.pfu.rate * 100, 1)} % des revenus</span></dd>
              </div>
              <div className={s.kpi}>
                <dt>Barème</dt>
                <dd className="figure"><Counter value={r.scale.total} format={(v) => eur(v)} /><span className={s.sub} style={{ color: 'var(--fg-muted)' }}>{num(r.scale.rate * 100, 1)} % des revenus</span></dd>
              </div>
            </dl>

            <div className={s.chartPanel}>
              <h2 className={s.chartTitle} style={{ marginBottom: 24 }}>Ce que tu paies, poste par poste</h2>
              <div className={s.compare}>
                <div className={s.bar}>
                  <div className={s.barHead}>
                    <span className={s.barName}>Flat tax (PFU){r.best === 'pfu' && <span className={s.barBest}>Le moins cher</span>}</span>
                    <span className={s.barTotal}>{eur(r.pfu.total)}</span>
                  </div>
                  <div className={s.track} aria-hidden="true">
                    <span style={{ width: w(r.pfu.ir), background: 'var(--encre)' }} />
                    <span style={{ width: w(r.social), background: 'var(--encre-3)' }} />
                  </div>
                  <p className={s.barDetail}>{eur(r.pfu.ir)} d’impôt (12,8 %) + {eur(r.social)} de prélèvements sociaux (18,6 %)</p>
                </div>
                <div className={s.bar}>
                  <div className={s.barHead}>
                    <span className={s.barName}>Barème progressif{r.best === 'bareme' && <span className={s.barBest}>Le moins cher</span>}</span>
                    <span className={s.barTotal}>{eur(r.scale.total)}</span>
                  </div>
                  <div className={s.track} aria-hidden="true">
                    <span style={{ width: w(r.scale.ir), background: 'var(--outremer)' }} />
                    <span style={{ width: w(r.social - r.scale.csgRelief), background: 'var(--encre-3)' }} />
                  </div>
                  <p className={s.barDetail}>
                    {eur(r.scale.ir)} d’impôt sur {eur(r.scale.taxable)} imposables{st.dividendes > 0 ? ' (dividendes après abattement de 40 %)' : ''} + {eur(r.social)} de prélèvements sociaux
                    {r.scale.csgRelief > 0 ? `, moins ${eur(r.scale.csgRelief)} d’impôt l’année suivante grâce à la CSG déductible` : ''}
                  </p>
                </div>
              </div>
            </div>

            {r.capital > 0 && (
              <div className={s.chartPanel}>
                <h2 className={s.chartTitle}>Et si ton revenu était différent ?</h2>
                <LineChart
                  animateKey={`${parts}-${st.situation}-${r.capital}`}
                  labels={curve.map((p) => p.income)}
                  series={[
                    { key: 'pfu', label: 'Flat tax', color: 'var(--encre)', values: curve.map((p) => p.pfu), dashed: true, width: 2 },
                    { key: 'scale', label: 'Barème', color: 'var(--outremer)', values: curve.map((p) => p.scale) },
                  ]}
                  formatX={(v) => eur(v)}
                  formatY={(v) => eur(v)}
                  minZero
                  ariaLabel="Impôt et prélèvements sur les revenus de placements selon le revenu du foyer, flat tax et barème"
                />
                <p className="small muted" style={{ marginTop: 14 }}>
                  Impôt total sur ces mêmes revenus de placements, selon le revenu imposable du foyer.
                  {crossover ? ` Avec ta situation, le barème cesse d’être avantageux vers ${eur(crossover.income)} de revenu imposable.` : ''}
                </p>
              </div>
            )}

            <BaremeTable tmi={r.tmi} parts={parts} note="Les revenus de placements perçus en 2026 seront imposés en 2027 avec un barème relevé de 2,1 % dans le projet de loi de finances 2027, pas encore voté." />

            <div className={s.reading}>
              <div>
                <h3>Une option pour toute l’année</h3>
                <p>
                  L’option pour le barème (case 2OP) s’applique à tous les dividendes, intérêts et plus-values sur titres du foyer de l’année.
                  Elle se choisit au moment de la déclaration, au printemps : le prélèvement de 12,8 % fait en cours d’année est un acompte, remboursé s’il est trop élevé.
                </p>
              </div>
              <div>
                <h3>PEA et assurance-vie à part</h3>
                <p>
                  Ces enveloppes ont leur propre fiscalité : après 5 ans, les gains d’un <Link href="/glossaire/pea">PEA</Link> ne paient que les prélèvements sociaux, et l’assurance-vie a ses abattements après 8 ans.
                  Les plus-values sur cryptos ont aussi leur option propre.
                </p>
              </div>
            </div>

            <div className={s.actions}>
              <ShareButton toolName="flat_tax_bareme" label="Partager ce simulateur" />
              <Link className="btn" href="/simulateurs/per">Simulateur PER</Link>
              <Link className="btn" href="/glossaire/flat-tax">La flat tax expliquée</Link>
            </div>

            <p className={s.method}>
              <strong>Méthode.</strong> Flat tax : 12,8 % d’impôt et 18,6 % de prélèvements sociaux sur le montant brut. Barème : les revenus de placements s’ajoutent au revenu du foyer, après abattement de 40 % sur les dividendes,
              et l’impôt supplémentaire est calculé avec le {TAX_YEAR_LABEL}, plafonnement du quotient familial et décote compris. La CSG déductible (6,8 % du brut) est valorisée sur l’impôt de l’année suivante, à revenus identiques.
              Non pris en compte : abattements pour durée de détention sur les titres achetés avant 2018, contribution exceptionnelle sur les hauts revenus, cas du parent isolé.
              Règles vérifiées le {dateFr(TAX_VERIFIED_AT)}. Aucune donnée saisie n’est enregistrée ni transmise. Outil pédagogique, pas un conseil fiscal.
            </p>

            <Faq items={FAQ} />
          </div>
        </div>
      </div>
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
  return { props: { tracking: { tool_name: 'flat_tax_bareme' } } }
}

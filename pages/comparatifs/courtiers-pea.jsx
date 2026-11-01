import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import RangeField from '../../components/ui/RangeField'
import Faq from '../../components/ui/Faq'
import { faqJsonLd } from '../../lib/faq'
import { useToolState } from '../../lib/useToolState'
import { BROKERS, VERIFIED_AT, brokerLabel, yearlyCost } from '../../lib/content/brokers'
import { dateFr } from '../../lib/content/articles'
import { eur, num } from '../../lib/format'
import { trackOutboundClick } from '../../lib/gtm'
import s from '../../components/comparatifs/Courtiers.module.css'

const AMOUNTS = [100, 500, 2000]
const fee2 = (v) => (v === 0 ? '0 €' : eur(v, 2))

const FAQ = [
  {
    q: 'Quel est le courtier le moins cher pour un PEA en 2026 ?',
    a: 'Cela dépend du montant de chaque achat. Pour un versement mensuel automatique, les plans programmés gratuits de Trade Republic coûtent 0 €. Jusqu’à 500 € par mois, le premier ordre mensuel gratuit de Fortuneo Starter coûte aussi 0 €. Pour des ordres de plus de 1 000 €, la grille de Bourse Direct est la plus basse de ce comparatif.',
  },
  {
    q: 'Les frais de courtage sont-ils plafonnés sur un PEA ?',
    a: 'Oui. Pour un ordre passé en ligne, les frais de courtage sur un PEA ne peuvent pas dépasser 0,5 % du montant de l’ordre. Un courtier qui facture 1 € ne peut donc prendre que 0,50 € sur un achat de 100 €.',
  },
  {
    q: 'Peut-on transférer son PEA chez un autre courtier ?',
    a: 'Oui, sans perdre son antériorité fiscale : la date d’ouverture du plan est conservée. Le courtier de départ peut facturer des frais de transfert, plafonnés par la réglementation, que certains courtiers d’arrivée remboursent.',
  },
]

export default function CourtiersPea() {
  const crumbs = [{ href: '/comparatifs', label: 'Comparatifs' }, { label: 'Courtiers PEA' }]
  const [st, set] = useToolState('comparatif_courtiers_pea', { montant: 200 })
  const m = st.montant

  const ranking = BROKERS
    .map((b) => ({ b, year: yearlyCost(b, m), perOrder: b.programmedFee ? b.programmedFee(m) : b.fee(m, true) }))
    .sort((a, b) => a.year - b.year)
  const max = Math.max(...ranking.map((r) => r.year), 1)
  const withReferral = BROKERS.filter((b) => b.referral)

  return (
    <>
      <Seo
        title="Courtiers PEA 2026 : comparatif des frais de courtage"
        description="Bourse Direct, BoursoBank, Fortuneo, Trade Republic : combien coûte un achat sur PEA selon le montant, avec un calculateur du coût annuel. Tarifs officiels vérifiés."
        jsonLd={[crumbsJsonLd(crumbs), faqJsonLd(FAQ)].filter(Boolean)}
      />
      <PageIntro
        crumbs={crumbs}
        title="Courtiers PEA : combien coûte vraiment un achat ?"
        lede={`Les frais de courtage de quatre courtiers, calculés pour ton montant. Grilles officielles vérifiées le ${dateFr(VERIFIED_AT)}, plafond légal de 0,5 % sur PEA appliqué.`}
        wide
      />

      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        {/* Calculateur */}
        <section className={`theme-encre ${s.sim}`} aria-labelledby="sim-title">
          <div className={s.simHead}>
            <h2 id="sim-title" className={s.simTitle}>Ce que te coûtent tes achats sur un an</h2>
            <p className={s.simLede}>Un achat d’ETF ou d’action par mois, sur Euronext Paris. Hors frais annuels de l’ETF et écart achat-vente.</p>
          </div>
          <div className={s.simField}>
            <RangeField label="Montant investi chaque mois" value={m} onChange={set('montant')} min={50} max={3000} step={10} suffix="€" />
          </div>
          <ol className={s.ranking} aria-live="polite">
            {ranking.map(({ b, year, perOrder }, i) => (
              <li key={b.id} className={s.row}>
                <span className={s.rank}>{i + 1}</span>
                <span className={s.rowName}>
                  {brokerLabel(b)}
                  {b.programmedFee && <small>plan programmé</small>}
                </span>
                <span className={s.barWrap} aria-hidden="true">
                  <span className={s.bar} style={{ width: `${Math.max(year > 0 ? 2 : 0, (year / max) * 100)}%` }} />
                </span>
                <span className={s.rowCost}>
                  <strong>{year === 0 ? '0 €' : eur(year, year < 100 ? 2 : 0)}</strong>
                  <small>{fee2(perOrder)} par achat · {num((perOrder / m) * 100, 2)} %</small>
                </span>
              </li>
            ))}
          </ol>
          <p className={s.simNote}>
            Sur 12 achats de {eur(m)}, soit {eur(m * 12)} investis. Fortuneo Starter : premier ordre du mois gratuit jusqu’à 500 €.
            BoursoBank : grille standard, sans l’offre d’ETF à 0 € (voir la fiche).
          </p>
        </section>

        {/* Tableau */}
        <section className={s.block} aria-labelledby="table-title">
          <h2 id="table-title" className={s.h2}>Les frais pour un ordre ponctuel</h2>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className="sr-only">Frais de courtage sur PEA par courtier et montant d’ordre</caption>
              <thead>
                <tr>
                  <th scope="col">Courtier</th>
                  {AMOUNTS.map((a) => <th key={a} scope="col" className={s.r}>Ordre de {eur(a)}</th>)}
                  <th scope="col">Achat programmé</th>
                  <th scope="col">Garde</th>
                  <th scope="col">Inactivité</th>
                </tr>
              </thead>
              <tbody>
                {BROKERS.map((b) => (
                  <tr key={b.id}>
                    <th scope="row"><a href={`#${b.id}`}>{brokerLabel(b)}</a></th>
                    {AMOUNTS.map((a) => <td key={a} className={`num ${s.r}`}>{fee2(b.fee(a, true))}</td>)}
                    <td>{b.programmed}</td>
                    <td>{b.custody}</td>
                    <td>{b.inactivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={s.small}>Fortuneo Starter : montants indiqués pour le premier ordre du mois. Pour un deuxième ordre dans le mois : 0,35 € pour 100 €, 1,75 € pour 500 €.</p>
        </section>

        {/* Fiches */}
        <section className={s.block} aria-labelledby="fiches-title">
          <h2 id="fiches-title" className={s.h2}>Courtier par courtier</h2>
          <div className={s.cards}>
            {BROKERS.map((b) => (
              <article key={b.id} id={b.id} className={s.card}>
                <h3 className={s.cardTitle}>{b.name}{b.offer && b.offer !== 'Tarif unique' && b.offer !== 'Ordre ponctuel' && <span> · {b.offer}</span>}</h3>
                <p className={s.grid}>{b.grid}</p>
                <ul className={s.notes}>{b.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                <p className={s.source}>
                  Source : <a href={b.source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick(b.source.url, `source_${b.id}`)}>{b.source.label}</a>
                </p>
                {b.referral && (
                  <div className={s.referral}>
                    <p className={s.refLabel}>Lien de parrainage Grapheko</p>
                    {b.referral.code && <p className={s.code}>Code : <strong>{b.referral.code}</strong></p>}
                    {b.referral.url && (
                      <a
                        className="btn"
                        href={b.referral.url}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        onClick={() => trackOutboundClick(b.referral.url, `parrainage_${b.id}`)}
                      >
                        Ouvrir un compte {b.name}
                      </a>
                    )}
                    {b.referral.terms && <p className={s.small}>{b.referral.terms}</p>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Ce que le comparatif ne mesure pas */}
        <section className={s.block} aria-labelledby="limits-title">
          <h2 id="limits-title" className={s.h2}>Ce que ce comparatif ne mesure pas</h2>
          <div className={s.limits}>
            <div><h3>Les frais de l’ETF</h3><p>Un ETF à 0,4 % par an coûte bien plus, sur 20 ans, que quelques euros de courtage. <Link href="/simulateurs/frais">Calculer l’effet des frais</Link>.</p></div>
            <div><h3>Le choix d’ETF</h3><p>Le nombre d’ETF éligibles au PEA varie fortement d’un courtier à l’autre. Vérifie que celui que tu vises est disponible avant d’ouvrir.</p></div>
            <div><h3>L’écart achat-vente</h3><p>Le prix payé peut s’écarter légèrement du cours affiché, en particulier hors des heures d’ouverture de la Bourse.</p></div>
            <div><h3>La sécurité</h3><p>Vérifie que le courtier est autorisé sur le <a href="https://www.regafi.fr" target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick('https://www.regafi.fr', 'regafi')}>registre REGAFI</a>. Tes titres restent à ton nom, même en cas de difficulté du courtier.</p></div>
          </div>
        </section>

        <section className={s.block}>
          <Faq items={FAQ} title="Questions fréquentes" />
        </section>

        <section className={s.method} aria-labelledby="method-title">
          <h2 id="method-title">Méthode et transparence</h2>
          <p>
            Frais calculés pour un ordre d’achat en ligne sur Euronext Paris dans un PEA, à partir des grilles tarifaires publiées par chaque courtier,
            vérifiées le {dateFr(VERIFIED_AT)}. Le plafond légal de 0,5 % du montant de l’ordre est appliqué. Les offres promotionnelles temporaires
            ne sont pas prises en compte. Les tarifs changent : vérifie toujours la grille en vigueur avant d’ouvrir un compte.
          </p>
          <p>
            {withReferral.length
              ? `Certains courtiers proposent un lien ou un code de parrainage de Grapheko (${withReferral.map((b) => b.name).join(', ')}). Il est signalé comme tel. Il peut rapporter un avantage à Grapheko et à toi, et n’a aucune influence sur l’ordre ni sur les calculs, qui dépendent uniquement des tarifs.`
              : 'Aucun lien de ce comparatif ne rapporte de commission à Grapheko. Si un lien de parrainage est ajouté, il sera signalé comme tel et n’aura aucune influence sur l’ordre ni sur les calculs.'}
            {' '}Ce comparatif est informatif et ne constitue pas un conseil en investissement.
          </p>
          <p><Link href="/comparatifs">Tous les comparatifs</Link> · <Link href="/blog/pea-100000-euros-combien-investir-par-mois">Combien investir chaque mois sur un PEA</Link> · <Link href="/quiz/bourse-debutant">Quiz Bourse débutant</Link></p>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'comparatif_courtiers_pea' } } }
}

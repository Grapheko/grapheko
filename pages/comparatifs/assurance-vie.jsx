import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import RangeField from '../../components/ui/RangeField'
import Faq from '../../components/ui/Faq'
import { faqJsonLd } from '../../lib/faq'
import { useToolState } from '../../lib/useToolState'
import { CONTRACTS, VERIFIED_AT, ucValue } from '../../lib/content/lifeInsurance'
import { dateFr } from '../../lib/content/articles'
import { eur, num } from '../../lib/format'
import { trackOutboundClick } from '../../lib/gtm'
import s from '../../components/comparatifs/Courtiers.module.css'

const RATE = 5 // rendement annuel supposé des supports en UC, avant frais du contrat

const FAQ = [
  {
    q: 'Quels frais regarder sur une assurance-vie en ligne ?',
    a: 'D’abord les frais sur versement, nuls sur tous les contrats de ce comparatif, puis les frais de gestion annuels sur les unités de compte, de 0,50 % à 0,75 % ici. S’y ajoutent les frais propres à chaque support, par exemple ceux d’un ETF, et les frais du fonds en euros.',
  },
  {
    q: 'Quel fonds en euros a le mieux rapporté en 2025 ?',
    a: 'Dans ce comparatif, sans condition particulière : Objectif Climat sur Linxea Spirit 2 (3,26 %, capital garanti à 98 %) et Euro Exclusif sur BoursoVie (3 %). Les taux les plus élevés, jusqu’à 4,5 % sur Fortuneo Vie, exigent une forte part d’unités de compte. Un taux passé ne garantit pas le suivant.',
  },
  {
    q: 'Peut-on transférer son assurance-vie vers un autre contrat ?',
    a: 'Pas d’un assureur à l’autre sans clôturer le contrat, ce qui fait perdre son antériorité fiscale. Ouvrir un second contrat tôt permet de prendre date : les 8 ans courent dès le premier versement.',
  },
  {
    q: 'Une assurance-vie en ligne est-elle sûre ?',
    a: 'Les contrats de ce comparatif sont assurés par de grands assureurs français. En cas de défaillance d’un assureur, le Fonds de garantie des assurances de personnes couvre les sommes jusqu’à 70 000 € par assuré et par assureur. Les unités de compte, elles, ne garantissent pas le capital.',
  },
]

export default function AssuranceVie() {
  const crumbs = [{ href: '/comparatifs', label: 'Comparatifs' }, { label: 'Assurances-vie en ligne' }]
  const [st, set] = useToolState('comparatif_assurance_vie', { montant: 20000, duree: 20 })
  const gross = st.montant * Math.pow(1 + RATE / 100, st.duree)
  const ranking = CONTRACTS
    .map((c) => {
      const value = ucValue(c, { amount: st.montant, years: st.duree, ratePct: RATE })
      return { c, value, fees: gross - value }
    })
    .sort((a, b) => a.fees - b.fees)
  const maxFees = Math.max(...ranking.map((r) => r.fees), 1)
  const withReferral = CONTRACTS.filter((c) => c.referral)

  return (
    <>
      <Seo
        title="Assurance-vie en ligne 2026 : comparatif des frais et fonds en euros"
        description="Linxea Spirit 2, Lucya Cardif, Placement-direct Vie, BoursoVie, Fortuneo Vie : frais, rendement 2025 des fonds en euros, conditions et calculateur du coût des frais. Sources officielles."
        jsonLd={[crumbsJsonLd(crumbs), faqJsonLd(FAQ)].filter(Boolean)}
      />
      <PageIntro
        crumbs={crumbs}
        title="Assurances-vie en ligne : frais et fonds en euros comparés"
        lede={`Cinq contrats sans frais sur versement, comparés sur ce qui compte sur la durée : les frais annuels et le fonds en euros. Données officielles vérifiées le ${dateFr(VERIFIED_AT)}.`}
        wide
      />

      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        {/* Calculateur */}
        <section className={`theme-encre ${s.sim}`} aria-labelledby="sim-title">
          <div className={s.simHead}>
            <h2 id="sim-title" className={s.simTitle}>Ce que te coûtent les frais du contrat</h2>
            <p className={s.simLede}>
              Une somme placée en unités de compte, par exemple des ETF, avec un rendement de {RATE} % par an avant frais.
              Seuls changent les frais de gestion annuels du contrat.
            </p>
          </div>
          <div className={s.simField}>
            <RangeField label="Montant placé en unités de compte" value={st.montant} onChange={set('montant')} min={1000} max={200000} step={1000} suffix="€" />
          </div>
          <div className={s.simField}>
            <RangeField label="Durée" value={st.duree} onChange={set('duree')} min={5} max={30} step={1} suffix="ans" />
          </div>
          <ol className={s.ranking} aria-live="polite">
            {ranking.map(({ c, value, fees }, i) => (
              <li key={c.id} className={s.row}>
                {/* Ex aequo : même rang pour les mêmes frais */}
                <span className={s.rank}>{ranking.findIndex((r) => Math.abs(r.fees - fees) < 0.5) + 1}</span>
                <span className={s.rowName}>
                  {c.name}
                  <small>{num(c.ucFee, 2)}{'\u00a0'}% par an</small>
                </span>
                <span className={s.barWrap} aria-hidden="true">
                  <span className={s.bar} style={{ width: `${Math.max(2, (fees / maxFees) * 100)}%` }} />
                </span>
                <span className={s.rowCost}>
                  <strong>{eur(fees)}</strong>
                  <small>de frais · {eur(value)} au bout de {st.duree} ans</small>
                </span>
              </li>
            ))}
          </ol>
          <p className={s.simNote}>
            Sans frais de contrat, {eur(st.montant)} deviendraient {eur(gross)} en {st.duree} ans à {RATE} % par an.
            Hors frais propres aux supports, prélèvements sociaux et impôt. Hypothèse de rendement constant, qui ne prédit rien.
          </p>
        </section>

        {/* Tableau */}
        <section className={s.block} aria-labelledby="table-title">
          <h2 id="table-title" className={s.h2}>Frais et fonds en euros</h2>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className="sr-only">Frais et fonds en euros des assurances-vie en ligne comparées</caption>
              <thead>
                <tr>
                  <th scope="col">Contrat</th>
                  <th scope="col" className={s.r}>Frais sur UC</th>
                  <th scope="col">Fonds en euros, net 2025</th>
                  <th scope="col">Frais du fonds en euros</th>
                  <th scope="col" className={s.r}>Ouverture dès</th>
                  <th scope="col">Gestion pilotée</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACTS.map((c) => (
                  <tr key={c.id}>
                    <th scope="row"><a href={`#${c.id}`}>{c.name}</a></th>
                    <td className={`num ${s.r}`} style={{ whiteSpace: 'nowrap' }}>{num(c.ucFee, 2)}{'\u00a0'}%</td>
                    <td>{c.euroRate2025}</td>
                    <td>{c.euroFee}</td>
                    <td className={`num ${s.r}`} style={{ whiteSpace: 'nowrap' }}>{eur(c.minDeposit)}</td>
                    <td>{c.managed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={s.small}>Aucun frais sur versement ni sur arbitrage en ligne pour les cinq contrats (hors frais d’opération sur certains supports, précisés dans les fiches). Taux nets de frais de gestion, avant prélèvements sociaux de 17,2 %.</p>
        </section>

        {/* Fiches */}
        <section className={s.block} aria-labelledby="fiches-title">
          <h2 id="fiches-title" className={s.h2}>Contrat par contrat</h2>
          <div className={s.cards}>
            {CONTRACTS.map((c) => (
              <article key={c.id} id={c.id} className={s.card}>
                <h3 className={s.cardTitle}>{c.name}<span> · {c.insurer}</span></h3>
                <p className={s.grid}>
                  UC : {num(c.ucFee, 2)} % par an · Fonds en euros : {c.euroRate2025} en 2025.<br />
                  {c.euroAccess}.<br />
                  {c.supports}.
                </p>
                <ul className={s.notes}>{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                <p className={s.source}>
                  Source : <a href={c.source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick(c.source.url, `source_${c.id}`)}>{c.source.label}</a>
                </p>
                {c.referral && (
                  <div className={s.referral}>
                    <p className={s.refLabel}>Lien de parrainage Grapheko</p>
                    {c.referral.code && <p className={s.code}>Code : <strong>{c.referral.code}</strong></p>}
                    <a
                      className="btn"
                      href={c.referral.url}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      onClick={() => trackOutboundClick(c.referral.url, `parrainage_${c.id}`)}
                    >
                      {c.referral.label}
                    </a>
                    <p className={s.small}>{c.referral.terms}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Limites */}
        <section className={s.block} aria-labelledby="limits-title">
          <h2 id="limits-title" className={s.h2}>Ce que ce comparatif ne mesure pas</h2>
          <div className={s.limits}>
            <div><h3>Les frais des supports</h3><p>Un fonds actif peut coûter 2 % par an, un ETF 0,1 %. Ces frais s’ajoutent à ceux du contrat. <Link href="/comparer/etf-ou-fonds-actif">ETF ou fonds actif ?</Link></p></div>
            <div><h3>Le rendement futur</h3><p>Les taux 2025 des fonds en euros ne garantissent rien pour les années suivantes, et les bonus sont temporaires.</p></div>
            <div><h3>La garantie</h3><p>Certains fonds en euros garantissent 97 ou 98 % du capital, pas 100 %. Les unités de compte ne garantissent rien.</p></div>
            <div><h3>Ta situation</h3><p>Le bon contrat dépend de ce que tu veux y mettre. <Link href="/comparer/assurance-vie-ou-per">Assurance-vie ou PER ?</Link> <Link href="/comparer/pea-ou-assurance-vie">PEA ou assurance-vie ?</Link></p></div>
          </div>
        </section>

        <section className={s.block}>
          <Faq items={FAQ} title="Questions fréquentes" />
        </section>

        <section className={s.method} aria-labelledby="method-title">
          <h2 id="method-title">Méthode et transparence</h2>
          <p>
            Contrats en gestion libre, souscrits en ligne, sans frais sur versement. Frais et taux relevés sur les pages officielles des assureurs et des
            distributeurs, vérifiés le {dateFr(VERIFIED_AT)}. Taux des fonds en euros nets de frais de gestion, avant prélèvements sociaux. Le calculateur
            applique un rendement constant de {RATE} % par an et les seuls frais de gestion du contrat sur les unités de compte, prélevés chaque année.
            Les offres changent : vérifie toujours les conditions en vigueur avant de souscrire.
          </p>
          <p>
            {withReferral.length
              ? `Certains contrats sont accompagnés d’un lien de parrainage de Grapheko (${withReferral.map((c) => c.name).join(', ')}). Il est signalé comme tel. Il peut rapporter un avantage à Grapheko et à toi, et n’a aucune influence sur l’ordre ni sur les calculs.`
              : 'Aucun lien de ce comparatif ne rapporte de commission à Grapheko.'}
            {' '}Ce comparatif est informatif et ne constitue pas un conseil en investissement.
          </p>
          <p><Link href="/comparatifs">Tous les comparatifs</Link> · <Link href="/glossaire/assurance-vie">L’assurance-vie expliquée</Link> · <Link href="/blog/assurance-vie-abattement-4600-avant-31-decembre">L’abattement de 4 600 €</Link></p>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'comparatif_assurance_vie' } } }
}

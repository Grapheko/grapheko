import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import RangeField from '../../components/ui/RangeField'
import Faq from '../../components/ui/Faq'
import { faqJsonLd } from '../../lib/faq'
import { useToolState } from '../../lib/useToolState'
import { PLATFORMS, VERIFIED_AT, AMF_LIST_URL, yearlyFees } from '../../lib/content/cryptoPlatforms'
import { dateFr } from '../../lib/content/articles'
import { eur, num } from '../../lib/format'
import { trackOutboundClick } from '../../lib/gtm'
import s from '../../components/comparatifs/Courtiers.module.css'

const pct = (v) => `${num(v, 2)} %`

const FAQ = [
  {
    q: 'Quelles plateformes crypto sont autorisées en France ?',
    a: 'Depuis le 1er juillet 2026, une plateforme doit être agréée au titre du règlement européen MiCA pour servir des clients en France. L’AMF publie la liste des prestataires autorisés, français ou agréés dans un autre pays de l’Union : c’est la première chose à vérifier avant d’ouvrir un compte.',
  },
  {
    q: 'Pourquoi Binance n’est-il pas dans ce comparatif ?',
    a: 'Ce comparatif ne retient que des plateformes présentes sur la liste blanche de l’AMF. Aucune entité Binance n’y figurait lors de notre vérification du 8 novembre 2026.',
  },
  {
    q: 'Quelle est la façon la moins chère d’acheter du bitcoin ?',
    a: 'Passer par le carnet d’ordres d’une plateforme, aussi appelé mode avancé, plutôt que par l’achat simple de l’application. Dans ce comparatif, Revolut X (0,09 %) et Bitvavo (0,25 %) sont les moins chers. L’achat simple ajoute souvent un écart de prix, qui ne figure pas dans les frais affichés.',
  },
  {
    q: 'Faut-il déclarer un compte crypto ouvert sur une plateforme étrangère ?',
    a: 'Oui, chaque année, même sans vente, avec le formulaire 3916-3916 bis. L’amende est de 750 € par compte non déclaré, 1 500 € si sa valeur a dépassé 50 000 € dans l’année. Les ventes se déclarent avec le formulaire 2086.',
  },
  {
    q: 'L’agrément MiCA protège-t-il mon argent ?',
    a: 'Il garantit que la plateforme respecte des règles de sécurité, de conservation et d’information. Il ne protège pas contre la baisse des cours, et les cryptos ne sont pas couvertes par la garantie des dépôts bancaires. Retirer ses cryptos vers son propre wallet réduit le risque lié à la plateforme.',
  },
]

export default function PlateformesCrypto() {
  const crumbs = [{ href: '/comparatifs', label: 'Comparatifs' }, { label: 'Plateformes crypto' }]
  const [st, set] = useToolState('comparatif_plateformes_crypto', { montant: 100, mode: 'simple' })
  const book = st.mode === 'avance'
  const ranking = PLATFORMS
    .map((p) => {
      const fee = book ? p.bookFee : p.simpleFee
      return { p, fee, year: yearlyFees(fee, st.montant) }
    })
    .sort((a, b) => (a.year === null) - (b.year === null) || a.year - b.year)
  const ranked = ranking.filter((r) => r.year !== null)
  const max = Math.max(...ranked.map((r) => r.year), 1)
  const withReferral = PLATFORMS.filter((p) => p.referral)
  const secondary = PLATFORMS.filter((p) => p.source.secondary)

  return (
    <>
      <Seo
        title="Plateformes crypto agréées MiCA 2026 : comparatif des frais"
        description="Bitvavo, Bitpanda, Kraken, Revolut, Coinhouse, Coinbase : agrément MiCA vérifié sur la liste de l’AMF, frais d’achat simple et en carnet d’ordres, achats programmés, retrait vers ton wallet."
        jsonLd={[crumbsJsonLd(crumbs), faqJsonLd(FAQ)].filter(Boolean)}
      />
      <PageIntro
        crumbs={crumbs}
        title="Plateformes crypto agréées MiCA : frais comparés"
        lede={`Six plateformes autorisées en France, toutes vérifiées sur la liste blanche de l’AMF. Frais relevés le ${dateFr(VERIFIED_AT)}, pour acheter du bitcoin en euros.`}
        wide
      />

      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        {/* Calculateur */}
        <section className={`theme-encre ${s.sim}`} aria-labelledby="sim-title">
          <div className={s.simHead}>
            <h2 id="sim-title" className={s.simTitle}>Ce que te coûtent tes achats sur un an</h2>
            <p className={s.simLede}>Un achat de bitcoin par mois, payé en euros. Frais annoncés par chaque plateforme, hors écart de prix et frais de réseau.</p>
          </div>
          <div className={s.simField}>
            <RangeField label="Montant acheté chaque mois" value={st.montant} onChange={set('montant')} min={10} max={2000} step={10} suffix="€" />
          </div>
          <div className="field">
            <span className="label" id="mode-label">Façon d’acheter</span>
            <div className="segmented" role="group" aria-labelledby="mode-label">
              <button type="button" aria-pressed={!book} onClick={() => set('mode')('simple')}>Achat simple dans l’application</button>
              <button type="button" aria-pressed={book} onClick={() => set('mode')('avance')}>Carnet d’ordres (mode avancé)</button>
            </div>
          </div>
          <ol className={s.ranking} aria-live="polite">
            {ranking.map(({ p, fee, year }) => (
              <li key={p.id} className={s.row}>
                <span className={s.rank}>{year === null ? '–' : ranked.findIndex((r) => Math.abs(r.year - year) < 0.005) + 1}</span>
                <span className={s.rowName}>
                  {p.name}
                  <small>{fee === null ? (book && p.id === 'coinhouse' ? 'pas de carnet d’ordres' : 'frais non publiés') : `${pct(fee)} par achat`}</small>
                </span>
                <span className={s.barWrap} aria-hidden="true">
                  {year !== null && <span className={s.bar} style={{ width: `${Math.max(2, (year / max) * 100)}%` }} />}
                </span>
                <span className={s.rowCost}>
                  <strong>{year === null ? '—' : eur(year, year < 100 ? 2 : 0)}</strong>
                  <small>{year === null ? 'voir la fiche' : `sur ${eur(st.montant * 12)} achetés`}</small>
                </span>
              </li>
            ))}
          </ol>
          <p className={s.simNote}>
            {book
              ? 'Tarif d’un achat immédiat (« taker ») au premier palier de volume. Un ordre en attente coûte souvent moins cher.'
              : 'Achat fait à la main chaque mois. En achat programmé, Coinhouse facture 1,79\u00a0%. Kraken, Revolut et Coinbase ajoutent un écart de prix, non publié, au prix affiché dans l’application : le coût réel y est plus élevé que ces chiffres.'}
            {' '}Coinbase ne publie pas de pourcentage fixe pour la France : l’aperçu avant achat affiche les frais.
          </p>
        </section>

        {/* Tableau */}
        <section className={s.block} aria-labelledby="table-title">
          <h2 id="table-title" className={s.h2}>Frais et services</h2>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className="sr-only">Frais et services des plateformes crypto agréées MiCA</caption>
              <thead>
                <tr>
                  <th scope="col">Plateforme</th>
                  <th scope="col">Agréée en</th>
                  <th scope="col">Achat simple</th>
                  <th scope="col">Carnet d’ordres</th>
                  <th scope="col">Achats programmés</th>
                  <th scope="col">Retrait vers ton wallet</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((p) => (
                  <tr key={p.id}>
                    <th scope="row"><a href={`#${p.id}`}>{p.name}</a></th>
                    <td>{p.country}</td>
                    <td>{p.simpleLabel}</td>
                    <td>{p.bookLabel}</td>
                    <td>{p.programmed}</td>
                    <td>{p.withdrawal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={s.small}>Toutes les plateformes figurent sur la liste blanche des prestataires de services sur cryptoactifs de l’AMF (agrément MiCA en France ou dans un autre pays de l’Union, valable en France).</p>
        </section>

        {/* Fiches */}
        <section className={s.block} aria-labelledby="fiches-title">
          <h2 id="fiches-title" className={s.h2}>Plateforme par plateforme</h2>
          <div className={s.cards}>
            {PLATFORMS.map((p) => (
              <article key={p.id} id={p.id} className={s.card}>
                <h3 className={s.cardTitle}>{p.name}<span> · {p.entity}, {p.country}</span></h3>
                <p className={s.grid}>
                  Achat simple : {p.simpleLabel}.<br />
                  Carnet d’ordres : {p.bookLabel}.<br />
                  {p.foreign ? 'Compte à déclarer chaque année (formulaire 3916-3916 bis).' : 'Compte ouvert en France : pas de formulaire 3916-3916 bis.'}
                </p>
                <ul className={s.notes}>{p.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                <p className={s.source}>
                  Source : <a href={p.source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick(p.source.url, `source_${p.id}`)}>{p.source.label}</a>
                </p>
                {p.referral && (
                  <div className={s.referral}>
                    <p className={s.refLabel}>Lien de parrainage Grapheko</p>
                    <a className="btn" href={p.referral.url} target="_blank" rel="sponsored noopener noreferrer" onClick={() => trackOutboundClick(p.referral.url, `parrainage_${p.id}`)}>
                      {p.referral.label}
                    </a>
                    <p className={s.small}>{p.referral.terms}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Risques et limites */}
        <section className={s.block} aria-labelledby="limits-title">
          <h2 id="limits-title" className={s.h2}>Avant d’acheter des cryptos</h2>
          <div className={s.limits}>
            <div><h3>Le risque</h3><p>Le bitcoin a déjà perdu plus de 70 % de sa valeur à plusieurs reprises. N’y place que de l’argent dont tu n’as pas besoin, et que tu peux te permettre de perdre.</p></div>
            <div><h3>L’écart de prix</h3><p>Dans l’achat simple, le prix affiché peut être un peu plus élevé que le cours du marché. Ce coût caché s’ajoute aux frais annoncés.</p></div>
            <div><h3>La garde</h3><p>Laisser ses cryptos sur une plateforme, c’est lui faire confiance. Un wallet personnel supprime ce risque, mais la perte de ta phrase de récupération est définitive.</p></div>
            <div><h3>Les impôts</h3><p>Les plus-values sont taxées à 31,4 % au-delà de 305 € de ventes par an. <Link href="/blog/acheter-bitcoin-france-2026">Acheter des cryptos en France : l’essentiel</Link>.</p></div>
          </div>
        </section>

        <section className={s.block}>
          <Faq items={FAQ} title="Questions fréquentes" />
        </section>

        <section className={s.method} aria-labelledby="method-title">
          <h2 id="method-title">Méthode et transparence</h2>
          <p>
            Seules figurent des plateformes inscrites sur la{' '}
            <a href={AMF_LIST_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick(AMF_LIST_URL, 'amf_liste_blanche')}>liste blanche de l’AMF</a>,
            vérifiée le {dateFr(VERIFIED_AT)}. Frais relevés à la même date pour un achat de bitcoin en euros, sur les grilles publiées par les plateformes.
            {secondary.length > 0 && ` Pour ${secondary.map((p) => p.name).join(', ')}, la grille officielle n’était pas accessible : les frais viennent d’une source indépendante datée, indiquée sur la fiche.`}
            {' '}Le calculateur applique le pourcentage annoncé à chaque achat. Il ne compte ni l’écart de prix, ni les frais de dépôt, ni les frais de réseau.
            Les tarifs changent souvent : vérifie l’aperçu des frais avant chaque achat.
          </p>
          <p>
            {withReferral.length
              ? `Certaines plateformes sont accompagnées d’un lien de parrainage de Grapheko (${withReferral.map((p) => p.name).join(', ')}). Il est signalé comme tel et n’a aucune influence sur l’ordre ni sur les calculs.`
              : 'Aucun lien de ce comparatif ne rapporte de commission à Grapheko.'}
            {' '}Ce comparatif est informatif et ne constitue pas un conseil en investissement.
          </p>
          <p><Link href="/comparatifs">Tous les comparatifs</Link> · <Link href="/glossaire/mica">MiCA expliqué</Link> · <Link href="/glossaire/wallet">Le wallet expliqué</Link> · <Link href="/simulateurs/dca/bitcoin">Simuler un achat régulier de bitcoin</Link></p>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'comparatif_plateformes_crypto' } } }
}

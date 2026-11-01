import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import Faq from '../../components/ui/Faq'
import { faqJsonLd } from '../../lib/faq'
import { useToolState } from '../../lib/useToolState'
import { BANKS, BANK_FILTERS, BANKS_VERIFIED_AT } from '../../lib/content/banks'
import { dateFr } from '../../lib/content/articles'
import { trackOutboundClick } from '../../lib/gtm'
import s from '../../components/comparatifs/Banques.module.css'
import c from '../../components/comparatifs/Courtiers.module.css'

const ROWS = [
  ['monthly', 'Coût'],
  ['usage', 'Condition d’utilisation'],
  ['income', 'Revenus exigés'],
  ['foreignPay', 'Paiements hors zone euro'],
  ['foreignCash', 'Retraits hors zone euro'],
  ['euroCash', 'Retraits en euros'],
  ['overdraft', 'Découvert'],
]

const FAQ = [
  {
    q: 'Quelle est la banque en ligne la moins chère en 2026 ?',
    a: 'Plusieurs banques proposent un compte et une carte à 0 € par mois : BoursoBank, Fortuneo, Hello bank!, N26, Revolut ou Trade Republic. La différence se fait sur les conditions : utiliser la carte au moins une fois par mois, frais à l’étranger, découvert ou non.',
  },
  {
    q: 'Banque en ligne ou néobanque : quelle différence ?',
    a: 'Une banque en ligne (BoursoBank, Fortuneo, Hello bank!) propose une gamme complète : découvert, épargne, crédit immobilier, chéquier. Une néobanque (N26, Revolut, Nickel) se concentre sur le compte et la carte depuis une application, souvent sans découvert ni crédit.',
  },
  {
    q: 'Faut-il un minimum de revenus pour ouvrir un compte en ligne ?',
    a: 'Pas forcément. Les offres d’entrée de gamme de BoursoBank, Fortuneo, Hello bank!, N26, Revolut, Trade Republic et Nickel ne demandent pas de revenus minimum. Les cartes haut de gamme en exigent souvent, par exemple 2 200 € nets par mois pour la Gold de Fortuneo.',
  },
]

export default function BanquesEnLigne() {
  const crumbs = [{ href: '/comparatifs', label: 'Comparatifs' }, { label: 'Banques en ligne' }]
  const [st, set] = useToolState('comparatif_banques', { besoins: '' })
  const active = st.besoins ? st.besoins.split(',').filter(Boolean) : []
  const toggle = (k) => set('besoins')((active.includes(k) ? active.filter((x) => x !== k) : [...active, k]).join(','))
  const shown = BANKS.filter((b) => active.every((k) => b.tags.includes(k)))
  const featured = BANKS.filter((b) => b.referral)

  return (
    <>
      <Seo
        title="Banques en ligne et néobanques 2026 : le comparatif"
        description="BoursoBank, Fortuneo, Hello bank!, Monabanq, N26, Revolut, Nickel, Trade Republic : frais, conditions, étranger, découvert. Grilles officielles vérifiées, filtres par besoin."
        jsonLd={[crumbsJsonLd(crumbs), faqJsonLd(FAQ)].filter(Boolean)}
      />
      <PageIntro
        crumbs={crumbs}
        title="Banques en ligne et néobanques : laquelle pour toi ?"
        lede={`Huit offres comparées sur ce qui compte vraiment : le coût réel, les conditions cachées, l’étranger et le découvert. Grilles officielles vérifiées le ${dateFr(BANKS_VERIFIED_AT)}.`}
        wide
      />

      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        {featured.map((b) => (
          <aside key={b.id} className={`theme-encre ${s.featured}`} aria-label={`Offre de parrainage ${b.name}`}>
            <div>
              <p className={s.featLabel}>Offre de parrainage Grapheko</p>
              <h2 className={s.featTitle}>{b.referral.headline}</h2>
              {b.referral.terms && <p className={s.featTerms}>{b.referral.terms}</p>}
            </div>
            <div className={s.featActions}>
              {b.referral.code && <p className={s.featCode}>Code <strong>{b.referral.code}</strong></p>}
              {b.referral.url && (
                <a className="btn btn--plein" href={b.referral.url} target="_blank" rel="sponsored noopener noreferrer" onClick={() => trackOutboundClick(b.referral.url, `parrainage_${b.id}`)}>
                  Ouvrir un compte {b.name}
                </a>
              )}
              <a href={`#${b.id}`} className={s.featMore}>Voir la fiche complète</a>
            </div>
          </aside>
        ))}

        {/* Filtres */}
        <section className={s.filters} aria-labelledby="filters-title">
          <h2 id="filters-title" className={c.h2}>Ce dont tu as besoin</h2>
          <div className={s.chips} role="group" aria-label="Filtrer par besoin">
            {BANK_FILTERS.map((f) => (
              <button key={f.key} type="button" className={s.chip} aria-pressed={active.includes(f.key)} onClick={() => toggle(f.key)}>
                {f.label}
              </button>
            ))}
            {active.length > 0 && <button type="button" className={s.reset} onClick={() => set('besoins')('')}>Tout effacer</button>}
          </div>
          <p className={s.count} aria-live="polite">
            {shown.length} offre{shown.length > 1 ? 's' : ''} sur {BANKS.length}{active.length ? ' correspondent à tous tes critères' : ''}. Classement alphabétique.
          </p>
        </section>

        {/* Fiches */}
        <div className={s.cards}>
          {shown.map((b) => (
            <article key={b.id} id={b.id} className={`${s.card} ${b.referral ? s.cardRef : ''}`}>
              <header className={s.cardHead}>
                <p className={s.kind}>{b.kind}</p>
                <h3 className={s.cardTitle}>{b.name} <span>{b.offer}</span></h3>
              </header>
              <dl className={s.facts}>
                {ROWS.map(([k, label]) => (
                  <div key={k}><dt>{label}</dt><dd>{b[k]}</dd></div>
                ))}
              </dl>
              {b.extra && <p className={s.extra}>{b.extra}</p>}
              <p className={c.source}>
                Source : <a href={b.source.url} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick(b.source.url, `source_${b.id}`)}>{b.source.label}</a>
              </p>
              {b.referral && (
                <div className={c.referral}>
                  <p className={c.refLabel}>Offre de parrainage Grapheko</p>
                  {b.referral.code && <p className={c.code}>Code : <strong>{b.referral.code}</strong></p>}
                  {b.referral.url && (
                    <a className="btn" href={b.referral.url} target="_blank" rel="sponsored noopener noreferrer" onClick={() => trackOutboundClick(b.referral.url, `parrainage_${b.id}`)}>
                      Ouvrir un compte {b.name}
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
          {shown.length === 0 && (
            <p className={s.empty}>Aucune offre ne coche tous ces critères à la fois. Retire un filtre pour voir les plus proches.</p>
          )}
        </div>

        {/* Points de vigilance */}
        <section className={c.block} aria-labelledby="watch-title">
          <h2 id="watch-title" className={c.h2}>Les pièges à connaître</h2>
          <div className={c.limits}>
            <div><h3>La condition d’utilisation</h3><p>« Gratuit » veut souvent dire « gratuit si tu paies au moins une fois par mois avec la carte ». Sinon, 3 à 9 € par mois selon la banque.</p></div>
            <div><h3>Les frais à l’étranger</h3><p>Payer en devises est souvent gratuit, retirer des espèces beaucoup moins. Regarde le nombre de retraits gratuits avant de partir.</p></div>
            <div><h3>Le découvert</h3><p>La plupart des néobanques n’en proposent pas : un prélèvement sur un compte vide est alors rejeté, avec des frais possibles.</p></div>
            <div><h3>La garantie des dépôts</h3><p>Dans l’Union européenne, les dépôts sont garantis jusqu’à 100 000 € par personne et par banque, par le fonds du pays où la banque est agréée.</p></div>
          </div>
        </section>

        <section className={c.block}>
          <Faq items={FAQ} title="Questions fréquentes" />
        </section>

        <section className={c.method} aria-labelledby="method-title">
          <h2 id="method-title">Méthode et transparence</h2>
          <p>
            Pour chaque banque, l’offre d’entrée de gamme est comparée à partir de la grille tarifaire ou de la page officielle citée, vérifiées le {dateFr(BANKS_VERIFIED_AT)}.
            Quand une information ne figure pas dans la source officielle, elle est indiquée « Non communiqué » plutôt que devinée. Les offres de bienvenue
            temporaires ne sont pas comparées. Les tarifs évoluent : vérifie la grille en vigueur avant d’ouvrir un compte.
          </p>
          <p>
            {featured.length
              ? `L’offre de parrainage ${featured.map((b) => b.name).join(', ')} est celle de Grapheko : elle peut rapporter un avantage à Grapheko et à toi. Elle est signalée comme telle et ne change ni l’ordre, alphabétique, ni les filtres.`
              : 'Aucun lien de ce comparatif ne rapporte de commission à Grapheko. Un éventuel lien de parrainage sera signalé comme tel et ne changera ni l’ordre, alphabétique, ni les filtres.'}
            {' '}Ce comparatif est informatif et ne constitue pas un conseil.
          </p>
          <p><Link href="/comparatifs">Tous les comparatifs</Link> · <Link href="/comparatifs/courtiers-pea">Courtiers PEA</Link> · <Link href="/glossaire/epargne-de-precaution">L’épargne de précaution</Link></p>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'comparatif_banques' } } }
}

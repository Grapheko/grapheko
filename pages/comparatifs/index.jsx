import Seo from '../../components/layout/Seo'
import PageIntro from '../../components/ui/PageIntro'
import NewsletterForm from '../../components/ui/NewsletterForm'
import { trackOutboundClick } from '../../lib/gtm'
import s from '../../styles/Comparatifs.module.css'

// Structure prête pour les comparatifs. Aucune donnée d'offre n'est publiée tant
// qu'elle n'a pas été vérifiée, et aucun lien affilié n'est actif.
const CATEGORIES = [
  {
    title: 'Courtiers pour PEA et compte-titres',
    criteria: ['Frais de courtage réels pour 100 €, 500 € et 2 000 € investis', 'Frais de tenue de compte et de change', 'Disponibilité du PEA et des ETF éligibles', 'Investissement programmé possible', 'Pays d’enregistrement et démarches fiscales'],
  },
  {
    title: 'Plateformes crypto',
    criteria: ['Agrément MiCA délivré ou reconnu par l’AMF', 'Frais d’achat, de vente et spread affiché', 'Possibilité de retirer vers son propre wallet', 'Achats programmés', 'Documents fiscaux fournis'],
  },
  {
    title: 'Assurances-vie en ligne',
    criteria: ['Frais sur versements et frais de gestion annuels', 'Nombre et frais des ETF disponibles', 'Rendement du fonds en euros et conditions d’accès', 'Gestion libre ou pilotée', 'Versement minimum'],
  },
]

export default function Comparatifs() {
  return (
    <>
      <Seo
        title="Comparatifs : méthode et critères"
        description="Courtiers, plateformes crypto, assurances-vie : les critères que Grapheko utilisera pour comparer les offres, sans classement sponsorisé."
      />
      <PageIntro
        crumbs={[{ label: 'Comparatifs' }]}
        title="Comparer sur des critères, pas sur des promesses."
        lede="Les comparatifs Grapheko sont en préparation. Avant de publier le moindre classement, voici les critères que nous vérifierons pour chaque offre."
        wide
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <div className={s.grid}>
          {CATEGORIES.map((c) => (
            <section key={c.title} className={s.card}>
              <p className={s.status}>En préparation</p>
              <h2 className={s.title}>{c.title}</h2>
              <ul className={s.criteria}>{c.criteria.map((k) => <li key={k}>{k}</li>)}</ul>
            </section>
          ))}
        </div>

        <section className={s.rules} aria-labelledby="rules">
          <h2 id="rules">Nos règles</h2>
          <div className={s.ruleGrid}>
            <div><h3>Les critères avant le classement</h3><p>Chaque comparatif publie sa grille et la date de vérification des données.</p></div>
            <div><h3>L’affiliation est signalée</h3><p>Quand un lien rapporte une commission à Grapheko, c’est indiqué à côté du lien. Elle ne change ni l’ordre ni les notes.</p></div>
            <div><h3>Les sources officielles d’abord</h3>
              <p>
                Avant d’ouvrir un compte, vérifie que le prestataire est autorisé sur le{' '}
                <a href="https://www.regafi.fr" target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick('https://www.regafi.fr', 'regafi')}>registre REGAFI</a>
                {' '}ou sur le site de l’<a href="https://www.amf-france.org" target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundClick('https://www.amf-france.org', 'amf')}>AMF</a>.
              </p>
            </div>
          </div>
        </section>

        <section className={`theme-encre ${s.nl}`} aria-labelledby="nl-comp">
          <h2 id="nl-comp">Être prévenu à la sortie des comparatifs.</h2>
          <NewsletterForm location="comparatifs" compact />
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: {} }
}

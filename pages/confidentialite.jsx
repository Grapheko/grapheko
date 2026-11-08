import Seo from '../components/layout/Seo'
import PageIntro from '../components/ui/PageIntro'
import { openConsentSettings } from '../lib/consent'
import s from '../styles/Simple.module.css'

export default function Confidentialite() {
  return (
    <>
      <Seo title="Confidentialité et cookies" noindex />
      <PageIntro crumbs={[{ label: 'Confidentialité et cookies' }]} title="Confidentialité et cookies" lede="Ce que Grapheko collecte, pourquoi, combien de temps, et comment changer d’avis." />
      <div className={`wrap prose ${s.legal}`}>
        <p><button className="btn" onClick={openConsentSettings}>Modifier mes choix de cookies</button></p>

        <h2>Données collectées</h2>
        <table className={s.table}>
          <thead><tr><th>Donnée</th><th>Finalité</th><th>Base légale</th><th>Durée</th></tr></thead>
          <tbody>
            <tr><td>E-mail et prénom (newsletter)</td><td>Envoi de la newsletter via Brevo</td><td>Consentement</td><td>Jusqu’à la désinscription</td></tr>
            <tr><td>Nom, e-mail, message (contact)</td><td>Répondre à ta demande</td><td>Intérêt légitime</td><td>3 ans après le dernier échange</td></tr>
            <tr><td>Mesure d’audience (Google Analytics 4)</td><td>Savoir quels contenus et outils sont utiles</td><td>Consentement</td><td>Cookies : 13 mois maximum</td></tr>
            <tr><td>Chiffres d’une simulation fiscale (compte rendu par IA)</td><td>Rédiger le compte rendu que tu demandes, uniquement si tu cliques sur le bouton prévu</td><td>Exécution de ta demande</td><td>Non conservés par Grapheko : transmis à Anthropic le temps de la rédaction</td></tr>
            <tr><td>Choix de cookies</td><td>Mémoriser ta décision</td><td>Obligation légale</td><td>Stocké dans ton navigateur, 6 mois</td></tr>
          </tbody>
        </table>

        <h2>Cookies et traceurs</h2>
        <p>
          Google Tag Manager et Google Analytics ne sont chargés qu’une fois la mesure d’audience acceptée : sans ton accord,
          aucun cookie n’est déposé et aucune donnée n’est envoyée à Google. Ton choix est conservé 6 mois, puis la question t’est reposée.
          Tu peux le modifier à tout moment avec le bouton ci-dessus ou le lien « Gérer les cookies » en bas de chaque page ;
          si tu retires ton accord, les cookies de Google Analytics sont supprimés.
        </p>

        <h2>Simulateurs</h2>
        <p>
          Les montants saisis dans les simulateurs restent dans ton navigateur : ils ne sont ni enregistrés, ni envoyés à Google Analytics.
          Le récapitulatif PDF est fabriqué directement dans ton navigateur. Seule exception, à ta demande : le compte rendu par IA des simulateurs
          fiscaux envoie les chiffres de ta simulation (sans nom, e-mail ni autre information d’identité) à Anthropic, qui rédige le texte.
          Grapheko ne conserve ni ces chiffres ni le texte produit.
        </p>

        <h2>Sous-traitants</h2>
        <p>Vercel (hébergement), Brevo (newsletter et e-mails), Google (mesure d’audience), Anthropic (rédaction des comptes rendus par IA, à ta demande). Certains peuvent traiter des données hors de l’Union européenne, dans le cadre des garanties prévues par le RGPD.</p>

        <h2>Tes droits</h2>
        <p>
          Tu disposes d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité. Écris à{' '}
          <a href="mailto:contact@grapheko.fr">contact@grapheko.fr</a> : réponse sous un mois. En cas de désaccord, tu peux saisir la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
        </p>
      </div>
    </>
  )
}

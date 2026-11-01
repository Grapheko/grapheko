import Link from 'next/link'
import Seo from '../components/layout/Seo'
import PageIntro from '../components/ui/PageIntro'
import s from '../styles/Simple.module.css'

export default function MentionsLegales() {
  return (
    <>
      <Seo title="Mentions légales" noindex />
      <PageIntro crumbs={[{ label: 'Mentions légales' }]} title="Mentions légales" />
      <div className={`wrap prose ${s.legal}`}>
        <h2>Avertissement</h2>
        <p>
          Grapheko est un site d’information et d’éducation financière. Ses contenus et simulateurs ont une vocation exclusivement pédagogique.
          Ils ne constituent ni un conseil en investissement, ni une recommandation personnalisée au sens de la directive MIF II, ni une incitation à acheter
          ou vendre un instrument financier. Grapheko n’est pas enregistré comme Conseiller en investissements financiers (CIF) auprès de l’AMF.
          Tout investissement comporte un risque de perte en capital ; les performances passées ne préjugent pas des performances futures. Les cryptoactifs sont particulièrement volatils.
        </p>

        <h2>Éditeur</h2>
        <p>
          Site grapheko.fr, édité à titre personnel par une personne physique. Contact : <a href="mailto:contact@grapheko.fr">contact@grapheko.fr</a>.
          Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004 (LCEN), les coordonnées complètes de l’éditeur sont communiquées à l’hébergeur et disponibles sur demande.
        </p>

        <h2>Hébergement</h2>
        <p>Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
        <p>Nom de domaine : Gandi SAS, 63-65 boulevard Masséna, 75013 Paris, France.</p>

        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, graphiques, simulateurs, logo, identité visuelle et code source de Grapheko sont protégés par le droit d’auteur. Toute reproduction sans
          autorisation écrite est interdite (articles L.335-2 et suivants du Code de la propriété intellectuelle). La citation courte est autorisée avec la mention
          « Grapheko, grapheko.fr » et un lien vers la page d’origine.
        </p>

        <h2>Données de marché</h2>
        <p>
          Les cours affichés proviennent de sources tierces (classement CoinGecko et flux publics Binance pour les cryptos, Yahoo Finance pour les indices et l’or, données Euronext pour le CAC 40) et sont fournis sans garantie d’exactitude ni d’exhaustivité.
          Les cours des indices et de l’or sont différés d’au moins 15 minutes. Ils peuvent être incomplets ou temporairement indisponibles.
        </p>

        <h2>Liens d’affiliation</h2>
        <p>Certains liens pourront à l’avenir être des liens d’affiliation. Ils seront signalés comme tels et n’influencent pas le contenu éditorial.</p>

        <h2>Données personnelles</h2>
        <p>Voir la page <Link href="/confidentialite">Confidentialité et cookies</Link>.</p>

        <h2>Droit applicable</h2>
        <p>Les présentes mentions sont régies par le droit français.</p>
      </div>
    </>
  )
}

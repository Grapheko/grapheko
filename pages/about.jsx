import Link from 'next/link'
import Seo from '../components/layout/Seo'
import PageIntro from '../components/ui/PageIntro'
import s from '../styles/Simple.module.css'

export default function About() {
  return (
    <>
      <Seo title="À propos" description="Grapheko est un média éducatif indépendant sur la Bourse, la crypto et l’épargne, construit sur des données vérifiables." />
      <PageIntro
        crumbs={[{ label: 'À propos' }]}
        title="Apprendre à lire l’argent, données à l’appui."
        lede="Grapheko est un média éducatif indépendant. Son pari : on comprend mieux la finance en manipulant de vrais chiffres qu’en lisant des promesses."
        wide
      />
      <div className="wrap">
        <div className="prose">
          <p>
            La plupart des contenus sur l’investissement vendent quelque chose : une formation, une plateforme, une méthode miracle. Grapheko prend le chemin inverse.
            Les simulateurs utilisent de vrais historiques de marché, les définitions donnent les chiffres réglementaires en vigueur, et chaque calcul explique sa méthode et ses limites.
          </p>
          <p>
            Le site s’adresse d’abord à ceux qui débutent : pas besoin de connaître le jargon pour s’en servir, le <Link href="/glossaire">glossaire</Link> est là pour ça.
          </p>
        </div>
        <div className={s.values}>
          <div><h2>Des chiffres vérifiables</h2><p>Les sources sont citées, les dates de mise à jour affichées, les hypothèses écrites noir sur blanc.</p></div>
          <div><h2>Aucun conseil déguisé</h2><p>Grapheko explique, compare et simule. Il ne dit pas quoi acheter, et ne publie aucun classement sponsorisé.</p></div>
          <div><h2>Les erreurs se corrigent</h2><p>Une erreur repérée ? <Link href="/contact">Signale-la</Link> : elle est corrigée, et la page affiche sa nouvelle date de mise à jour.</p></div>
        </div>
      </div>
    </>
  )
}

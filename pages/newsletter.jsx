import Seo from '../components/layout/Seo'
import PageIntro from '../components/ui/PageIntro'
import NewsletterForm from '../components/ui/NewsletterForm'
import s from '../styles/Simple.module.css'

export default function Newsletter() {
  return (
    <>
      <Seo title="Newsletter" description="Chaque dimanche, un graphique expliqué : ce qu’il montre, ce qu’il ne montre pas. Cinq minutes, sans conseil déguisé." />
      <PageIntro
        crumbs={[{ label: 'Newsletter' }]}
        title="Une courbe expliquée, chaque dimanche."
        lede="Un graphique sur la Bourse, la crypto ou l’épargne, ce qu’il montre et ce qu’il ne montre pas. Cinq minutes de lecture, sans conseil déguisé ni promotion."
        wide
      />
      <div className={`wrap ${s.split}`}>
        <div className="panel"><NewsletterForm location="page_newsletter" /></div>
        <aside className={s.aside}>
          <h2 className={s.h3}>Ce que tu reçois</h2>
          <p className="muted">Un e-mail le dimanche matin, avec un graphique, son explication et un lien vers un simulateur ou une définition pour aller plus loin.</p>
          <h2 className={s.h3}>Ce que tu ne reçois pas</h2>
          <p className="muted">Pas de « bon plan » sponsorisé, pas de recommandation d’achat, pas de revente de ton adresse.</p>
        </aside>
      </div>
    </>
  )
}

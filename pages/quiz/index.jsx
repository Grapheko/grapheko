import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import { QUIZZES } from '../../lib/content/quizzes'
import { trackClick } from '../../lib/gtm'
import s from '../../components/quiz/QuizHub.module.css'

export default function QuizHub() {
  const crumbs = [{ label: 'Quiz' }]
  return (
    <>
      <Seo
        title="Quiz finance et crypto : teste tes connaissances"
        description="Trois quiz gratuits : ton profil d’investisseur, les bases de la crypto, les bases de la Bourse. Correction expliquée, sans inscription."
        jsonLd={[crumbsJsonLd(crumbs)]}
      />
      <PageIntro
        crumbs={crumbs}
        title="Trois quiz pour savoir où tu en es."
        lede="Un quiz de profil pour savoir par où commencer, deux quiz de connaissances pour vérifier tes bases. Deux à trois minutes chacun, aucune donnée enregistrée."
        wide
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <ol className={s.grid}>
          {QUIZZES.map((q, i) => (
            <li key={q.slug}>
              <Link href={`/quiz/${q.slug}`} className={s.card} style={{ '--quiz-tone': q.tone }} onClick={() => trackClick(q.slug, 'quiz_hub', 'quiz')}>
                <span className={s.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className={s.meta}>{q.type === 'profil' ? 'Profil' : 'Connaissances'} · {q.count || q.questions.length} questions · {q.minutes} min</span>
                <span className={s.title}>{q.title}</span>
                <span className={s.text}>{q.teaser}</span>
                <span className={`btn btn--plein ${s.cta}`}>Commencer</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}

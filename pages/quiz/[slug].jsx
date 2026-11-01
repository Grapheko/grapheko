import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import QuizRunner from '../../components/quiz/QuizRunner'
import { QUIZZES, getQuiz } from '../../lib/content/quizzes'
import { getTerm } from '../../lib/content/glossary'

export default function QuizPage({ quiz, terms }) {
  const crumbs = [{ href: '/quiz', label: 'Quiz' }, { label: quiz.short }]
  // Quiz de connaissances : questions et réponses en données structurées
  const quizLd = quiz.type === 'connaissances' && {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: quiz.title,
    about: quiz.short,
    inLanguage: 'fr-FR',
    educationalLevel: 'débutant',
    hasPart: quiz.questions.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: `${q.a[q.ok]}. ${q.why}` },
    })),
  }
  return (
    <>
      <Seo title={quiz.seoTitle} description={quiz.seoDescription} jsonLd={[crumbsJsonLd(crumbs), quizLd].filter(Boolean)} />
      <PageIntro crumbs={crumbs} title={quiz.title} lede={quiz.lede} />
      <div style={{ paddingBottom: 'var(--section)' }}>
        <QuizRunner key={quiz.slug} quiz={quiz} terms={terms} />
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: QUIZZES.map((q) => ({ params: { slug: q.slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const quiz = getQuiz(params.slug)
  const terms = {}
  ;(quiz.questions || []).forEach((q) => {
    const t = getTerm(q.term)
    if (t) terms[q.term] = t.term
  })
  return { props: { quiz, terms, tracking: { tool_name: `quiz_${quiz.name}` } } }
}

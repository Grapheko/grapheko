import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro from '../../components/ui/PageIntro'
import { QUESTIONS, PROFILES, computeProfile } from '../../lib/content/quiz'
import { trackQuiz } from '../../lib/gtm'
import s from '../../styles/Quiz.module.css'

export default function Quiz() {
  const [step, setStep] = useState(-1) // -1 = accueil, QUESTIONS.length = résultat
  const [answers, setAnswers] = useState([])
  const [dir, setDir] = useState(1)
  const headingRef = useRef(null)

  // Place le focus sur la question à chaque étape (lecteurs d'écran, clavier)
  useEffect(() => { if (step >= 0) headingRef.current?.focus() }, [step])

  const start = () => { setStep(0); setAnswers([]); trackQuiz('start') }
  const pick = (i) => {
    const next = [...answers]
    next[step] = i
    setAnswers(next)
    setDir(1)
    trackQuiz('answer', { quiz_step: step + 1, quiz_question: QUESTIONS[step].id, quiz_answer: i + 1 })
    if (step + 1 === QUESTIONS.length) {
      const res = computeProfile(next)
      trackQuiz('complete', { quiz_result: res.key })
    }
    setStep(step + 1)
  }
  const back = () => { setDir(-1); setStep(Math.max(0, step - 1)) }
  const restart = () => { trackQuiz('restart'); start() }

  const done = step === QUESTIONS.length
  const result = done ? computeProfile(answers) : null
  const profile = result ? PROFILES[result.key] : null

  return (
    <>
      <Seo
        title="Quiz : quel investisseur es-tu ?"
        description="Sept questions sur ton horizon, ton épargne et ta réaction face à une baisse pour savoir par où commencer. Gratuit, sans inscription."
      />
      <PageIntro
        crumbs={[{ label: 'Quiz profil investisseur' }]}
        title="Quel investisseur es-tu ?"
        lede="Sept questions, deux minutes. Le résultat ne te dit pas quoi acheter : il t’aide à savoir par où commencer, et ce qu’il faut vérifier avant."
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <div className={s.box}>
          {step === -1 && (
            <div className={s.welcome}>
              <ul className={s.facts}>
                <li><strong>7</strong> questions</li>
                <li><strong>2</strong> minutes</li>
                <li><strong>0</strong> donnée enregistrée</li>
              </ul>
              <button className="btn btn--plein" onClick={start}>Commencer le quiz</button>
            </div>
          )}

          {step >= 0 && !done && (
            <div key={step} className={`${s.step} ${dir > 0 ? s.fromRight : s.fromLeft}`}>
              <div className={s.progress} role="progressbar" aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-valuenow={step + 1} aria-label="Progression">
                <span style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
              </div>
              <p className={s.counter}>Question {step + 1} sur {QUESTIONS.length}</p>
              <h2 ref={headingRef} tabIndex={-1} className={s.q}>{QUESTIONS[step].q}</h2>
              <div className={s.answers}>
                {QUESTIONS[step].a.map((a, i) => (
                  <button key={a.label} type="button" className={`${s.answer} ${answers[step] === i ? s.selected : ''}`} onClick={() => pick(i)}>
                    {a.label}
                  </button>
                ))}
              </div>
              {step > 0 && <button type="button" className={s.back} onClick={back}>Question précédente</button>}
            </div>
          )}

          {done && profile && (
            <div className={`${s.result} ${s.fromRight}`}>
              <p className={s.counter}>Ton résultat</p>
              <h2 ref={headingRef} tabIndex={-1} className={s.resultTitle}>{profile.title}</h2>
              <p className={s.resultText}>{profile.text}</p>
              <div className={s.next}>
                {profile.next.map((n) => <Link key={n.href} href={n.href} className="btn">{n.label}</Link>)}
              </div>
              <p className={s.disclaimer}>
                Ce quiz est un outil pédagogique simplifié. Il ne remplace pas l’évaluation de ta situation par un conseiller en investissement
                financier, qui tient compte de l’ensemble de ton patrimoine et de tes objectifs.
              </p>
              <button type="button" className={s.back} onClick={restart}>Refaire le quiz</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'quiz_profil_investisseur' } } }
}

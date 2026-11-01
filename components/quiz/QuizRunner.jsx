import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Counter from '../ui/Counter'
import { trackQuiz, trackToolShare } from '../../lib/gtm'
import { QUESTIONS as PROFIL_QUESTIONS, PROFILES, computeProfile } from '../../lib/content/quiz'
import { QUIZZES, scoreLevel } from '../../lib/content/quizzes'
import s from './Quiz.module.css'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

// Ordre des réponses mélangé de façon stable (identique serveur et navigateur),
// pour que la bonne réponse ne soit pas toujours au même endroit.
function stableOrder(id, n) {
  let h = 2166136261
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const order = [...Array(n).keys()]
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0
    const j = h % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

// Normalise les deux formats de questions en { id, q, options:[{label, orig}], ok?, why?, term? }
function useQuestions(quiz, terms) {
  return useMemo(() => {
    if (quiz.type === 'profil') {
      return PROFIL_QUESTIONS.map((q) => ({ id: q.id, q: q.q, options: q.a.map((a, i) => ({ label: a.label, orig: i })) }))
    }
    return quiz.questions.map((q) => ({
      ...q,
      options: stableOrder(q.id, q.a.length).map((i) => ({ label: q.a[i], orig: i })),
      termLabel: terms[q.term] || null,
    }))
  }, [quiz, terms])
}

function Ring({ score, total }) {
  const r = 52
  const c = 2 * Math.PI * r
  const [p, setP] = useState(0)
  useEffect(() => { const t = requestAnimationFrame(() => setP(score / total)); return () => cancelAnimationFrame(t) }, [score, total])
  return (
    <div className={s.ring}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r={r} className={s.ringTrack} />
        <circle cx="60" cy="60" r={r} className={s.ringValue} strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
      </svg>
      <p className={s.ringLabel}>
        <Counter value={score} format={(v) => Math.round(v)} duration={900} className={s.ringScore} />
        <span>/{total}</span>
      </p>
    </div>
  )
}

function ShareScore({ quiz, text }) {
  const [done, setDone] = useState(false)
  const share = async () => {
    const url = `${window.location.origin}/quiz/${quiz.slug}`
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ url, text, title: quiz.title })
        trackToolShare(`quiz_${quiz.name}`, 'native')
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        trackToolShare(`quiz_${quiz.name}`, 'copy_link')
        setDone(true)
        setTimeout(() => setDone(false), 2400)
      }
    } catch {}
  }
  return <button type="button" className="btn" onClick={share} aria-live="polite">{done ? 'Copié' : 'Partager mon score'}</button>
}

export default function QuizRunner({ quiz, terms = {} }) {
  const questions = useQuestions(quiz, terms)
  const total = questions.length
  const knowledge = quiz.type === 'connaissances'
  const [step, setStep] = useState(-1) // -1 accueil, total = résultat
  const [answers, setAnswers] = useState([]) // index d'origine choisi pour chaque question
  const [revealed, setRevealed] = useState(false)
  const stageRef = useRef(null)
  const focusRef = useRef(null)
  const nextRef = useRef(null)

  const done = step === total
  const current = step >= 0 && !done ? questions[step] : null

  // Focus sur la question (clavier, lecteurs d'écran) et stage visible
  useEffect(() => {
    if (step < 0) return
    focusRef.current?.focus({ preventScroll: true })
    // Défilement vertical uniquement (scrollIntoView peut aussi décaler horizontalement)
    const el = stageRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    if (top < 0 || top > window.innerHeight * 0.4) {
      const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
      window.scrollTo({ top: window.scrollY + top - offset, behavior: 'smooth' })
    }
  }, [step])
  useEffect(() => { if (revealed) nextRef.current?.focus({ preventScroll: true }) }, [revealed])

  const start = () => { setStep(0); setAnswers([]); setRevealed(false); trackQuiz('start', {}, quiz.name) }
  const restart = () => { trackQuiz('restart', {}, quiz.name); start() }

  const finish = useCallback((all) => {
    if (knowledge) {
      const score = questions.reduce((n, q, i) => n + (all[i] === q.ok ? 1 : 0), 0)
      trackQuiz('complete', { quiz_result: `${score}/${total}` }, quiz.name)
    } else {
      trackQuiz('complete', { quiz_result: computeProfile(all).key }, quiz.name)
    }
  }, [knowledge, questions, total, quiz.name])

  const pick = useCallback((orig) => {
    if (!current || revealed) return
    const next = [...answers]
    next[step] = orig
    setAnswers(next)
    // quiz_answer : la lettre affichée (A, B, C, D), celle que voit l'utilisateur.
    // L'ordre étant le même pour tout le monde, une lettre désigne toujours la même réponse.
    const shown = current.options.findIndex((o) => o.orig === orig)
    const params = { quiz_step: step + 1, quiz_question: current.id, quiz_answer: LETTERS[shown] }
    if (knowledge) {
      trackQuiz('answer', { ...params, quiz_correct: orig === current.ok ? 'oui' : 'non' }, quiz.name)
      setRevealed(true)
      if (step + 1 === total) finish(next)
    } else {
      trackQuiz('answer', params, quiz.name)
      if (step + 1 === total) finish(next)
      setTimeout(() => setStep((v) => v + 1), 260)
    }
  }, [current, revealed, answers, step, knowledge, total, finish, quiz.name])

  const goNext = useCallback(() => { setRevealed(false); setStep((v) => v + 1) }, [])
  const back = () => { setRevealed(false); setStep((v) => Math.max(0, v - 1)) }

  // Raccourcis : 1-4 ou A-D pour répondre, Entrée pour continuer
  useEffect(() => {
    if (!current) return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      const idx = /^[1-5]$/.test(k) ? Number(k) - 1 : LETTERS.indexOf(k)
      if (!revealed && idx >= 0 && idx < current.options.length) { e.preventDefault(); pick(current.options[idx].orig) }
      else if (revealed && e.key === 'Enter' && document.activeElement !== nextRef.current) { e.preventDefault(); goNext() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, revealed, pick, goNext])

  const score = knowledge && done ? questions.reduce((n, q, i) => n + (answers[i] === q.ok ? 1 : 0), 0) : 0
  const level = knowledge && done ? scoreLevel(score, total) : null
  const profileResult = !knowledge && done ? computeProfile(answers) : null
  const profile = profileResult ? PROFILES[profileResult.key] : null
  const others = QUIZZES.filter((q) => q.slug !== quiz.slug)

  // Corrections : erreurs d'abord
  const review = knowledge && done
    ? questions.map((q, i) => ({ q, i, mine: answers[i], good: answers[i] === q.ok })).sort((a, b) => a.good - b.good || a.i - b.i)
    : []

  return (
    <>
      <div className="wrap">
      <section ref={stageRef} className={`theme-encre ${s.stage}`} style={{ '--quiz-tone': quiz.tone }} aria-label={quiz.title}>
        {/* Barre du haut : nom du quiz, progression */}
        <div className={s.top}>
          <span className={s.pill}>{quiz.short}</span>
          {step >= 0 && !done && <span className={s.count}><b>{String(step + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}</span>}
        </div>
        <ol className={s.segments} aria-hidden="true">
          {questions.map((q, i) => {
            const state = i < step || (i === step && revealed) || done
              ? (knowledge ? (answers[i] === q.ok ? s.segOk : s.segKo) : s.segDone)
              : i === step ? s.segNow : ''
            return <li key={q.id} className={state} />
          })}
        </ol>

        {/* Accueil */}
        {step === -1 && (
          <div className={`${s.screen} ${s.enter}`}>
            <p className={s.kicker}>{knowledge ? 'Quiz de connaissances' : 'Quiz de profil'}</p>
            <h2 className={s.welcomeTitle}>{knowledge ? 'Prêt à tester tes bases ?' : 'Deux minutes pour savoir par où commencer.'}</h2>
            <ul className={s.facts}>
              <li><strong>{total}</strong> questions</li>
              <li><strong>{quiz.minutes}</strong> minutes</li>
              <li><strong>0</strong> donnée enregistrée</li>
            </ul>
            <div className={s.actions}>
              <button className="btn btn--plein" onClick={start}>Commencer</button>
              {knowledge && <span className={s.hint}>Astuce : réponds avec les touches 1 à 4.</span>}
            </div>
          </div>
        )}

        {/* Question */}
        {current && (
          <div key={current.id} className={`${s.screen} ${s.enter}`}>
            <h2 ref={focusRef} tabIndex={-1} className={s.question}>{current.q}</h2>
            <div className={s.options} role="group" aria-label="Réponses">
              {current.options.map((o, i) => {
                const chosen = answers[step] === o.orig
                let state = ''
                if (knowledge && revealed) state = o.orig === current.ok ? s.isOk : chosen ? s.isKo : s.isDim
                else if (chosen) state = s.isChosen
                return (
                  <button
                    key={o.orig}
                    type="button"
                    className={`${s.option} ${state}`}
                    onClick={() => pick(o.orig)}
                    aria-pressed={chosen}
                    disabled={knowledge && revealed}
                  >
                    <span className={s.letter} aria-hidden="true">{LETTERS[i]}</span>
                    <span>{o.label}</span>
                    {knowledge && revealed && o.orig === current.ok && <span className="sr-only"> (bonne réponse)</span>}
                  </button>
                )
              })}
            </div>

            {knowledge && revealed && (
              <div className={s.feedback} role="status">
                <p className={`${s.verdict} ${answers[step] === current.ok ? s.verdictOk : s.verdictKo}`}>
                  {answers[step] === current.ok ? 'Bonne réponse.' : 'Pas tout à fait.'}
                </p>
                <p className={s.why}>{current.why}</p>
                <div className={s.feedbackActions}>
                  <button ref={nextRef} type="button" className="btn btn--plein" onClick={goNext}>
                    {step + 1 === total ? 'Voir mon score' : 'Question suivante'}
                  </button>
                  {current.termLabel && <Link href={`/glossaire/${current.term}`} className={s.termLink}>Définition : {current.termLabel}</Link>}
                </div>
              </div>
            )}

            {!knowledge && step > 0 && <button type="button" className={s.back} onClick={back}>Question précédente</button>}
          </div>
        )}

        {/* Résultat : quiz de connaissances */}
        {done && knowledge && level && (
          <div className={`${s.screen} ${s.enter} ${s.result}`}>
            <Ring score={score} total={total} />
            <div>
              <p className={s.kicker}>Ton score</p>
              <h2 ref={focusRef} tabIndex={-1} className={s.resultTitle}>{level.title}</h2>
              <p className={s.resultText}>{level.text}</p>
              <div className={s.actions}>
                <a href="#correction" className="btn btn--plein">Voir la correction</a>
                <ShareScore quiz={quiz} text={`J’ai eu ${score}/${total} au ${quiz.title.split(' :')[0].toLowerCase()} de Grapheko.`} />
                <button type="button" className={s.back} onClick={restart}>Refaire le quiz</button>
              </div>
            </div>
          </div>
        )}

        {/* Résultat : quiz de profil */}
        {done && !knowledge && profile && (
          <div className={`${s.screen} ${s.enter}`}>
            <p className={s.kicker}>Ton résultat</p>
            <h2 ref={focusRef} tabIndex={-1} className={s.resultTitle}>{profile.title}</h2>
            {profileResult.max && (
              <div className={s.gauge} aria-label={`Position sur l’échelle de prise de risque : ${Math.round((profileResult.score / profileResult.max) * 100)} sur 100`}>
                <div className={s.gaugeBar}><span style={{ left: `${(profileResult.score / profileResult.max) * 100}%` }} /></div>
                <div className={s.gaugeLabels}><span>Prudent</span><span>Équilibré</span><span>Dynamique</span></div>
              </div>
            )}
            <p className={s.resultText}>{profile.text}</p>
            <div className={s.actions}>
              {profile.next.map((n, i) => <Link key={n.href} href={n.href} className={`btn ${i === 0 ? 'btn--plein' : ''}`}>{n.label}</Link>)}
              <button type="button" className={s.back} onClick={restart}>Refaire le quiz</button>
            </div>
            <p className={s.disclaimer}>
              Ce quiz est un outil pédagogique simplifié. Il ne remplace pas l’évaluation de ta situation par un conseiller en investissement
              financier, qui tient compte de l’ensemble de ton patrimoine et de tes objectifs.
            </p>
          </div>
        )}
      </section>
      </div>

      {/* Correction détaillée */}
      {done && knowledge && (
        <section id="correction" className={`wrap ${s.review}`} aria-labelledby="correction-title">
          <h2 id="correction-title" className={s.reviewTitle}>La correction</h2>
          <ol className={s.reviewList}>
            {review.map(({ q, i, mine, good }) => (
              <li key={q.id} className={`${s.reviewItem} ${good ? s.reviewOk : s.reviewKo}`}>
                <span className={s.reviewMark} aria-hidden="true">{good ? '✓' : '✕'}</span>
                <div>
                  <p className={s.reviewNum}>Question {i + 1} · {good ? 'juste' : 'à revoir'}</p>
                  <h3 className={s.reviewQ}>{q.q}</h3>
                  {!good && <p className={s.reviewMine}>Ta réponse : {q.a[mine]}</p>}
                  <p className={s.reviewGood}>Bonne réponse : <strong>{q.a[q.ok]}</strong></p>
                  <p className={s.reviewWhy}>{q.why}</p>
                  {q.termLabel && <Link href={`/glossaire/${q.term}`} className="link-arrow">{q.termLabel}</Link>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Autres quiz */}
      <section className={`wrap ${s.others}`} aria-labelledby="autres-quiz">
        <h2 id="autres-quiz" className={s.reviewTitle}>Les autres quiz</h2>
        <div className={s.otherGrid}>
          {others.map((o) => (
            <Link key={o.slug} href={`/quiz/${o.slug}`} className={s.otherCard} style={{ '--quiz-tone': o.tone }}>
              <span className={s.otherMeta}>{o.count || o.questions?.length} questions · {o.minutes} min</span>
              <span className={s.otherTitle}>{o.title}</span>
              <span className={s.otherText}>{o.teaser}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

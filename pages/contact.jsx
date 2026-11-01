import { useState } from 'react'
import Seo from '../components/layout/Seo'
import PageIntro from '../components/ui/PageIntro'
import { trackContactSubmit } from '../lib/gtm'
import s from '../styles/Simple.module.css'

const SUBJECTS = ['Partenariat', 'Presse', 'Question sur un contenu', 'Signaler une erreur', 'Autre']
const ERRORS = {
  email: 'Cette adresse e-mail ne semble pas valide. Vérifie le format (exemple : prenom@domaine.fr).',
  message: 'Le message est trop court : écris au moins une phrase.',
  default: 'Le message n’a pas pu être envoyé. Écris-nous directement à contact@grapheko.fr.',
}

export default function Contact() {
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const v = (n) => f.elements.namedItem(n)?.value || ''
    const body = { name: v('name'), email: v('email'), message: v('message'), website: v('website'), subject }
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setStatus('done')
      trackContactSubmit(subject)
    } catch (err) {
      setStatus('idle')
      setError(ERRORS[err.message] || ERRORS.default)
    }
  }

  return (
    <>
      <Seo title="Contact" description="Écrire à Grapheko : partenariat, presse, question sur un contenu ou signalement d’une erreur." />
      <PageIntro crumbs={[{ label: 'Contact' }]} title="Écrire à Grapheko." lede="Une question sur un article, une erreur repérée, une proposition de partenariat : réponse sous quelques jours." />
      <div className={`wrap ${s.split}`}>
        {status === 'done' ? (
          <div className="panel" role="status">
            <h2 className={s.h2}>Message envoyé.</h2>
            <p className="muted">Merci. Une réponse arrive à l’adresse indiquée, en général sous quelques jours.</p>
          </div>
        ) : (
          <form className={`panel ${s.form}`} onSubmit={submit} noValidate>
            <fieldset className="field">
              <legend style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: 8 }}>Sujet</legend>
              <div className="segmented">
                {SUBJECTS.map((x) => <button key={x} type="button" aria-pressed={subject === x} onClick={() => setSubject(x)}>{x}</button>)}
              </div>
            </fieldset>
            <div className={s.two}>
              <div className="field"><label htmlFor="name">Nom <span className="faint">(facultatif)</span></label><input id="name" name="name" className="input" autoComplete="name" /></div>
              <div className="field"><label htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" className="input" required autoComplete="email" /></div>
            </div>
            <div className="field"><label htmlFor="message">Message</label><textarea id="message" name="message" className="input" required /></div>
            <div className="sr-only" aria-hidden="true"><label htmlFor="website">Ne pas remplir</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
            {error && <p role="alert" style={{ color: 'var(--baisse)', fontSize: 'var(--fs-sm)' }}>{error}</p>}
            <div><button className="btn btn--plein" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Envoi…' : 'Envoyer le message'}</button></div>
            <p className="faint xsmall">Ton adresse sert uniquement à te répondre. Elle n’est pas ajoutée à la newsletter.</p>
          </form>
        )}
        <aside className={s.aside}>
          <h2 className={s.h3}>Par e-mail</h2>
          <p><a href="mailto:contact@grapheko.fr">contact@grapheko.fr</a></p>
          <h2 className={s.h3}>Une erreur dans un contenu ?</h2>
          <p className="muted">Indique la page et la phrase concernées. Les corrections sont faites rapidement et la date de mise à jour de la page est modifiée.</p>
        </aside>
      </div>
    </>
  )
}

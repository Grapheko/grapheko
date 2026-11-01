import { useState } from 'react'
import Link from 'next/link'
import { trackNewsletterSignup } from '../../lib/gtm'
import s from './NewsletterForm.module.css'

export default function NewsletterForm({ location = 'inline', compact = false }) {
  const [email, setEmail] = useState('')
  const [prenom, setPrenom] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Cette adresse e-mail ne semble pas valide. Vérifie le format (exemple : prenom@domaine.fr).')
      return
    }
    setError('')
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, prenom, source: location }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setStatus('done')
      trackNewsletterSignup(location)
    } catch {
      setStatus('idle')
      setError('L’inscription n’est pas passée. Réessaie dans un instant, ou écris-nous via la page contact.')
    }
  }

  if (status === 'done') {
    return (
      <div className={s.done} role="status">
        <p className={s.doneTitle}>Inscription confirmée{prenom ? `, ${prenom}` : ''}.</p>
        <p className="muted">La prochaine édition arrive dimanche matin dans ta boîte mail.</p>
      </div>
    )
  }

  return (
    <form className={`${s.form} ${compact ? s.compact : ''}`} onSubmit={submit} noValidate>
      {!compact && (
        <div className="field">
          <label htmlFor={`prenom-${location}`}>Prénom <span className="faint">(facultatif)</span></label>
          <input id={`prenom-${location}`} className="input" value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" />
        </div>
      )}
      <div className="field">
        <label htmlFor={`email-${location}`}>Adresse e-mail</label>
        <div className={s.row}>
          <input
            id={`email-${location}`}
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={!!error}
            aria-describedby={error ? `err-${location}` : undefined}
          />
          <button className="btn btn--plein" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Inscription…' : 'S’inscrire'}
          </button>
        </div>
      </div>
      {error && <p id={`err-${location}`} className={s.error} role="alert">{error}</p>}
      <p className={s.legal}>
        Une édition par semaine, désinscription en un clic. <Link href="/confidentialite">Données personnelles</Link>
      </p>
    </form>
  )
}

import { useState } from 'react'
import Link from 'next/link'
import { trackNewsletterSignup } from '../../lib/gtm'
import s from './NewsletterForm.module.css'

// external : formulaire affiché dans un simulateur intégré sur un autre site (liens ouverts dans un nouvel onglet)
export default function NewsletterForm({ location = 'inline', compact = false, external = false }) {
  const [email, setEmail] = useState('')
  const [prenom, setPrenom] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [website, setWebsite] = useState('')

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
        body: JSON.stringify({ email, prenom, source: location, website }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setPending(Boolean(data.pending))
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
        <p className={s.doneTitle}>{pending ? `Plus qu’une étape${prenom ? `, ${prenom}` : ''}.` : `Inscription confirmée${prenom ? `, ${prenom}` : ''}.`}</p>
        <p className="muted">{pending ? 'Clique sur le lien de confirmation que tu viens de recevoir par e-mail (pense à regarder dans les indésirables).' : 'La prochaine édition arrive dimanche matin dans ta boîte mail.'}</p>
      </div>
    )
  }

  return (
    <form className={`${s.form} ${compact ? s.compact : ''}`} onSubmit={submit} noValidate>
      {!compact && (
        <div className="field">
          <label htmlFor={`prenom-${location}`}>Prénom <span className="faint">(facultatif)</span></label>
          <input id={`prenom-${location}`} className="input" maxLength={40} value={prenom} onChange={(e) => setPrenom(e.target.value)} autoComplete="given-name" />
        </div>
      )}
      {/* Champ piège pour les robots : invisible et ignoré par les humains */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={`website-${location}`}>Site web</label>
        <input id={`website-${location}`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
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
        Une édition par semaine, désinscription en un clic.{' '}
        {external
          ? <a href="https://grapheko.fr/confidentialite" target="_blank" rel="noopener">Données personnelles</a>
          : <Link href="/confidentialite">Données personnelles</Link>}
      </p>
    </form>
  )
}

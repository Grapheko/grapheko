import { useEffect, useState } from 'react'
import Link from 'next/link'
import { readConsent, saveConsent, OPEN_EVENT } from '../../lib/consent'
import s from './ConsentBanner.module.css'

// Bannière conforme aux recommandations CNIL : "Refuser" aussi visible
// qu'"Accepter", aucun dépôt avant choix, choix modifiable à tout moment.
export default function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const existing = readConsent()
    if (!existing) setOpen(true)
    else { setAnalytics(existing.analytics); setMarketing(existing.marketing) }
    const reopen = () => { setDetails(true); setOpen(true) }
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  if (!open) return null

  const close = (choice) => { saveConsent(choice); setOpen(false); setDetails(false) }

  return (
    <div className={s.banner} role="dialog" aria-labelledby="consent-title" aria-live="polite">
      <h2 id="consent-title" className={s.title}>Des cookies pour mesurer l'audience</h2>
      <p className={s.text}>
        Grapheko utilise Google Analytics pour savoir quels outils et articles sont utiles. Rien n'est déposé tant que tu n'as pas choisi.{' '}
        <Link href="/confidentialite">En savoir plus</Link>
      </p>

      {details && (
        <div className={s.details}>
          <label className={s.row}>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            <span><strong>Mesure d'audience</strong><br /><span className="faint xsmall">Google Analytics 4, données agrégées.</span></span>
          </label>
          <label className={s.row}>
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span><strong>Publicité et affiliation</strong><br /><span className="faint xsmall">Mesure des clics vers les partenaires.</span></span>
          </label>
        </div>
      )}

      <div className={s.actions}>
        <button className="btn" onClick={() => close({ analytics: false, marketing: false })}>Tout refuser</button>
        <button className="btn" onClick={() => close({ analytics: true, marketing: true })}>Tout accepter</button>
        {details
          ? <button className={s.more} onClick={() => close({ analytics, marketing })}>Enregistrer mes choix</button>
          : <button className={s.more} onClick={() => setDetails(true)}>Personnaliser</button>}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { trackToolShare } from '../../lib/gtm'

export default function ShareButton({ toolName, label = 'Copier le lien de ce calcul' }) {
  const [done, setDone] = useState(false)
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ url, title: document.title })
        trackToolShare(toolName, 'native')
      } else {
        await navigator.clipboard.writeText(url)
        trackToolShare(toolName, 'copy_link')
        setDone(true)
        setTimeout(() => setDone(false), 2400)
      }
    } catch {}
  }
  return (
    <button type="button" className="btn" onClick={share} aria-live="polite">
      {done ? 'Lien copié' : label}
    </button>
  )
}

import { useEffect, useState } from 'react'
import s from './StickyResult.module.css'

// Sur mobile, le résultat principal reste visible en bas de l'écran tant que
// le bloc de résultats est plus bas dans la page (pendant le réglage des paramètres).
export default function StickyResult({ targetId, label, value }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top > 0), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [targetId])
  const go = () => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <button type="button" className={`${s.bar} ${show ? s.on : ''}`} onClick={go} aria-hidden={!show} tabIndex={show ? 0 : -1}>
      <span className={s.label}>{label}</span>
      <span className={s.value}>{value}</span>
      <span className={s.go} aria-hidden="true">Voir le détail ↓</span>
    </button>
  )
}

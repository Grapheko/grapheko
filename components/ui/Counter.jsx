import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../lib/motion'

// Nombre qui roule vers sa nouvelle valeur (réponse à une action de l'utilisateur)
export default function Counter({ value, format = (v) => Math.round(v), duration = 700, className }) {
  const [display, setDisplay] = useState(value)
  const from = useRef(value)
  const raf = useRef()

  useEffect(() => {
    if (!Number.isFinite(value)) { setDisplay(value); return }
    if (prefersReducedMotion()) { setDisplay(value); from.current = value; return }
    const start = performance.now()
    const a = Number.isFinite(from.current) ? from.current : value
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const e = 1 - Math.pow(1 - t, 4)
      setDisplay(a + (value - a) * e)
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else from.current = value
    }
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])

  return <span className={className}>{format(display)}</span>
}

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Pas de curseur custom sur mobile
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let raf
    let visible = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) {
        dot.style.opacity = '1'
        ring.style.opacity = '1'
        visible = true
      }
    }

    const animate = () => {
      dot.style.left = mx - 4 + 'px'
      dot.style.top = my - 4 + 'px'
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx - 16 + 'px'
      ring.style.top = ry - 16 + 'px'
      raf = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(animate)

    // Hover sur éléments interactifs
    const handleEnter = () => {
      ring.style.width = '48px'
      ring.style.height = '48px'
      ring.style.borderColor = 'rgba(0,255,136,.8)'
    }
    const handleLeave = () => {
      ring.style.width = '32px'
      ring.style.height = '32px'
      ring.style.borderColor = 'rgba(0,255,136,.4)'
    }

    const bindHover = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', handleEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    }

    // Rebind après chaque navigation
    bindHover()
    const observer = new MutationObserver(bindHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed',
        width: '8px', height: '8px',
        background: '#00FF88',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        boxShadow: '0 0 12px #00FF88, 0 0 24px rgba(0,255,136,.3)',
        transition: 'opacity .3s',
        top: 0, left: 0,
      }} />
      <div ref={ringRef} style={{
        position: 'fixed',
        width: '32px', height: '32px',
        border: '1.5px solid rgba(0,255,136,.4)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: 0,
        transition: 'width .2s, height .2s, border-color .2s, opacity .3s',
        top: 0, left: 0,
      }} />
    </>
  )
}

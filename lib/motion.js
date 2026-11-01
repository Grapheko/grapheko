// ══════════════════════════════════════════════════════════════
// Système d'animation : Lenis (défilement fluide à la molette)
// + GSAP ScrollTrigger (animations liées au scroll).
// Tout est désactivé si l'utilisateur préfère réduire les animations.
// ══════════════════════════════════════════════════════════════
import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { SplitText } from 'gsap/dist/SplitText'
import Lenis from 'lenis'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger }

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initSmoothScroll() {
  if (typeof window === 'undefined' || lenis || prefersReducedMotion()) return () => {}
  // Pas de lissage sur écrans tactiles : le scroll natif y est meilleur
  if (window.matchMedia('(pointer: coarse)').matches) return () => {}
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export function scrollToElement(el) {
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -120 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

// Révélations génériques, scannées à chaque changement de page.
// [data-reveal-lines] : titre découpé en lignes qui montent (réservé aux titres de section).
// [data-reveal]       : élément qui apparaît une fois (à utiliser avec parcimonie).
export function initReveals(root = document) {
  if (typeof window === 'undefined') return () => {}
  if (prefersReducedMotion()) return () => {}
  document.documentElement.classList.add('js-motion')

  const splits = []
  const ctx = gsap.context(() => {
    root.querySelectorAll('[data-reveal-lines]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', linesClass: 'line', mask: 'lines' })
      splits.push(split)
      gsap.set(el, { opacity: 1 })
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.05,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })

    root.querySelectorAll('[data-reveal]').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: parseFloat(el.dataset.revealDelay || 0),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    })
  }, root)

  // Recalcule après le chargement des polices (la hauteur des titres change)
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())

  return () => {
    ctx.revert()
    splits.forEach((s) => s.revert())
  }
}

// Hook utilitaire : exécute des animations GSAP scoppées à un conteneur
export function useScrollFx(ref, setup, deps = []) {
  useIsoLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    let cleanup
    const ctx = gsap.context(() => { cleanup = setup(ref.current) }, ref)
    return () => { if (typeof cleanup === 'function') cleanup(); ctx.revert() }
  }, deps)
}

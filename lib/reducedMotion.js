// Utilitaires d'animation légers, sans GSAP : importables partout sans alourdir la page.
import { useEffect, useLayoutEffect } from 'react'

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

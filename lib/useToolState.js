import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { trackToolStart, trackToolResult } from './gtm'

// État d'un simulateur synchronisé avec l'URL (lien partageable)
// + tracking : tool_start à la première modification, tool_result après 1,2 s d'inactivité.
export function useToolState(toolName, defaults, { resultParams } = {}) {
  const router = useRouter()
  const [state, setState] = useState(defaults)
  const ready = useRef(false)
  const touched = useRef(false)

  // Lecture des paramètres d'URL au chargement
  useEffect(() => {
    if (!router.isReady || ready.current) return
    const next = { ...defaults }
    Object.keys(defaults).forEach((k) => {
      const v = router.query[k]
      if (v == null) return
      next[k] = typeof defaults[k] === 'number' ? (Number.isFinite(parseFloat(v)) ? parseFloat(v) : defaults[k]) : String(v)
    })
    setState(next)
    ready.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  // Écriture dans l'URL + tracking (avec délai)
  useEffect(() => {
    if (!ready.current || !touched.current) return
    const t = setTimeout(() => {
      const query = { ...router.query, ...Object.fromEntries(Object.entries(state).map(([k, v]) => [k, String(v)])) }
      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false })
      trackToolResult(toolName, { ...prefix(state), ...(resultParams ? resultParams() : {}) })
    }, 1200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const set = (key) => (value) => {
    if (!touched.current) { touched.current = true; trackToolStart(toolName) }
    setState((s) => ({ ...s, [key]: value }))
  }

  return [state, set]
}

// Préfixe les paramètres pour éviter les collisions dans le dataLayer
const prefix = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [`tool_${k}`, v]))

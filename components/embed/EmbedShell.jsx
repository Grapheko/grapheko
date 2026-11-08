import { useEffect, useRef } from 'react'
import Head from 'next/head'
import NewsletterForm from '../ui/NewsletterForm'
import s from '../../styles/Embed.module.css'

// Cadre commun des simulateurs intégrables (/integrer/<outil>) : pas d'en-tête,
// pas de bandeau cookies, pas de mesure d'audience. Envoie sa hauteur à la page
// hôte pour que l'iframe s'ajuste (voir le code fourni sur /integrer).
// cta : lien vers la page Grapheko qui prolonge le calcul (comparatif, simulateur complet)
export default function EmbedShell({ tool, title, fullPath, cta, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.parent === window) return undefined
    const send = () => {
      const height = Math.ceil(ref.current?.getBoundingClientRect().height || 0)
      if (height) window.parent.postMessage({ type: 'grapheko:height', tool, height }, '*')
    }
    send()
    const ro = new ResizeObserver(send)
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [tool])

  const utm = (content) => `utm_source=integration&utm_medium=widget&utm_campaign=${tool}&utm_content=${content}`
  const href = `https://grapheko.fr${fullPath}?${utm('credit')}`

  return (
    <>
      <Head>
        <title>{`${title} | Grapheko`}</title>
        <meta name="robots" content="noindex" />
        <style>{'html, body { background: transparent; }'}</style>
      </Head>
      <div ref={ref} className={s.shell}>
        {children}
        {cta && (
          <p className={s.next}>
            <span>{cta.question}</span>
            <a className="btn btn--plein" href={`https://grapheko.fr${cta.href}?${utm('cta')}`} target="_blank" rel="noopener">{cta.label} →</a>
          </p>
        )}
        <div className={s.nl}>
          <p className={s.nlTitle}>Un calcul comme celui-ci, chaque dimanche</p>
          <p className={s.nlText}>La newsletter Grapheko : un graphique, expliqué simplement. Gratuite.</p>
          <NewsletterForm location={`widget-${tool}`} compact external />
        </div>
        <p className={s.credit}>
          <a href={href} target="_blank" rel="noopener">
            Simulateur gratuit proposé par <strong>Grapheko</strong> →
          </a>
          <span>Outil pédagogique, pas un conseil en investissement.</span>
        </p>
      </div>
    </>
  )
}

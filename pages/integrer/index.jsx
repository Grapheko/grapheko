import { useEffect, useState } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import { trackClick } from '../../lib/gtm'
import s from '../../styles/Embed.module.css'

const SITE = 'https://grapheko.fr'

const WIDGETS = [
  {
    id: 'interets-composes',
    name: 'Simulateur d’intérêts composés',
    text: 'Capital de départ, versement mensuel, rendement et durée : le capital final, les intérêts gagnés et la courbe année par année.',
    full: '/simulateurs/interets-composes',
    params: 'capital=1000&mensuel=150&taux=5&duree=20',
  },
  {
    id: 'cout-des-frais',
    name: 'Simulateur du coût des frais',
    text: 'Deux niveaux de frais annuels comparés sur la durée : l’écart en euros entre un ETF et un fonds plus cher, par exemple.',
    full: '/simulateurs/frais',
    params: 'mensuel=200&taux=6&duree=30&fraisA=0.2&fraisB=2',
  },
]

// Code à coller : l'iframe, le lien texte vers Grapheko (obligatoire) et un petit
// script qui ajuste la hauteur de l'iframe à son contenu.
const embedCode = (w) => `<iframe id="grapheko-${w.id}" src="${SITE}/integrer/${w.id}" title="${w.name}" width="100%" height="1000" style="border:0;max-width:760px;display:block" loading="lazy"></iframe>
<p style="font-size:13px;margin:6px 0 0"><a href="${SITE}${w.full}">${w.name}</a> par Grapheko</p>
<script>window.addEventListener("message",function(e){if(e.origin!=="${SITE}"||!e.data||e.data.type!=="grapheko:height")return;var f=document.getElementById("grapheko-"+e.data.tool);if(f)f.style.height=e.data.height+"px"});</script>`

function CopyButton({ text, id }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
      trackClick(`copier_code_${id}`, 'integration', 'copier', id)
    } catch {}
  }
  return <button type="button" className="btn btn--plein" onClick={copy}>{done ? 'Code copié' : 'Copier le code'}</button>
}

export default function Integrer() {
  // Les aperçus envoient leur hauteur, comme sur un site hôte
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'grapheko:height') return
      const f = document.querySelector(`iframe[data-tool="${e.data.tool}"]`)
      if (f) f.style.height = `${e.data.height}px`
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])
  const crumbs = [{ href: '/simulateurs', label: 'Simulateurs' }, { label: 'Intégrer un simulateur' }]
  return (
    <>
      <Seo
        title="Intégrer un simulateur Grapheko sur ton site"
        description="Ajoute gratuitement un simulateur d’intérêts composés ou du coût des frais à ton blog ou ton site : un code à copier, une hauteur qui s’ajuste toute seule."
        jsonLd={[crumbsJsonLd(crumbs)]}
      />
      <PageIntro
        crumbs={crumbs}
        title="Ajoute un simulateur à ton site, gratuitement."
        lede="Tu écris sur l’épargne ou l’investissement ? Intègre un simulateur Grapheko à ton article : copie le code, colle-le dans ta page. Aucun compte, aucune publicité, aucun cookie."
        wide
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <div className={s.list}>
          {WIDGETS.map((w) => (
            <section key={w.id} className={s.item} aria-labelledby={`w-${w.id}`}>
              <iframe className={s.preview} data-tool={w.id} src={`/integrer/${w.id}`} title={`Aperçu : ${w.name}`} loading="lazy" />
              <div className={s.code}>
                <h2 id={`w-${w.id}`}>{w.name}</h2>
                <p>{w.text}</p>
                <pre><code>{embedCode(w)}</code></pre>
                <div><CopyButton text={embedCode(w)} id={w.id} /></div>
                <p className="xsmall faint">
                  Valeurs de départ réglables dans l’adresse de l’iframe, par exemple <code>/integrer/{w.id}?{w.params}</code>.
                  La dernière ligne ajuste la hauteur toute seule ; si ton site refuse les scripts, garde les deux premières et règle <code>height</code> à la main (environ 1 000 sur ordinateur, 1 450 sur mobile).
                </p>
              </div>
            </section>
          ))}
        </div>

        <div className={s.rules}>
          <div><h3>Gratuit, sans compte</h3><p>Les simulateurs sont gratuits, sans publicité ni cookie. Les calculs sont les mêmes que sur Grapheko.</p></div>
          <div><h3>Une condition</h3><p>Garder visible le lien « par Grapheko » placé sous le simulateur. Il fait partie du code à copier.</p></div>
          <div><h3>Une question ?</h3><p>Une couleur à adapter, un autre simulateur à intégrer ? <Link href="/contact">Écris-nous</Link>.</p></div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { tracking: { tool_name: 'integration' } } }
}

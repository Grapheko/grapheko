import { fr } from '../../lib/format'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro from '../../components/ui/PageIntro'
import ToolVisual from '../../components/ui/ToolVisual'
import { TOOLS } from '../../lib/content/tools'
import { ASSETS } from '../../lib/assets'
import { trackClick } from '../../lib/gtm'
import s from '../../styles/Hub.module.css'

export default function Simulateurs() {
  return (
    <>
      <Seo
        title="Simulateurs d’investissement"
        description="DCA rétroactif sur vrais historiques, intérêts composés, coût des frais, rendement réel, économie d’impôt PER, flat tax ou barème : des simulateurs gratuits pour comprendre avant d’investir."
      />
      <PageIntro
        crumbs={[{ label: 'Simulateurs' }]}
        title="Des calculs pour comprendre, pas pour promettre."
        lede="Chaque simulateur répond à une question précise et explique sa méthode. Les calculs sur le passé utilisent de vrais cours de marché, convertis en euros."
        wide
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <div className={s.toolGrid}>
          {TOOLS.map((t, i) => (
            <Link key={t.slug} href={t.href} className={`${s.tool} ${i === 0 ? s.toolWide : ''}`} style={{ background: t.tone }} onClick={() => trackClick(t.slug, 'hub_simulateurs', 'simulateur')}>
              <span className={s.toolName}>{t.name}</span>
              <h2 className={s.toolQ}>{fr(t.title)}</h2>
              <div className={s.toolVisual}><ToolVisual kind={t.visual} /></div>
              <p className={s.toolText}>{t.text}</p>
            </Link>
          ))}
        </div>

        <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="dca-assets">
          <h2 id="dca-assets" className={s.subTitle}>Le DCA rétroactif, actif par actif</h2>
          <ul className={s.list}>
            {ASSETS.map((a) => (
              <li key={a.slug}>
                <Link href={`/simulateurs/dca/${a.slug}`} className={s.row}>
                  <span className={s.rowTitle}>DCA sur {a.name}</span>
                  <span className={s.rowMeta}>{a.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

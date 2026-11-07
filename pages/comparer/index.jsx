import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import { VERSUS } from '../../lib/content/versus'
import { CAT_LABEL } from '../../lib/content/articles'
import { fr } from '../../lib/format'
import s from '../../styles/Versus.module.css'

const crumbs = [{ label: 'Comparer' }]

export default function ComparerIndex({ items }) {
  return (
    <>
      <Seo
        title="Comparer : PEA ou CTO, ETF capitalisant ou distribuant…"
        description="Deux notions de la Bourse, de l’épargne ou de la crypto face à face : un tableau, les cas où choisir l’une ou l’autre, et des exemples chiffrés."
        jsonLd={crumbsJsonLd(crumbs)}
      />
      <PageIntro
        crumbs={crumbs}
        title="Deux notions face à face."
        lede="Un tableau pour voir les différences d’un coup d’œil, puis les situations où l’une convient mieux que l’autre."
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <ul className={s.hubList}>
          {items.map((v) => (
            <li key={v.slug}>
              <Link href={`/comparer/${v.slug}`} className={s.hubItem}>
                <span className={`tag tag--${v.cat}`}>{CAT_LABEL[v.cat]}</span>
                <span className={s.hubTitle}>{fr(v.title)}</span>
                <span className={s.hubText}>{v.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { items: VERSUS.map(({ slug, title, description, cat }) => ({ slug, title, description, cat })) } }
}

import { useState } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro from '../../components/ui/PageIntro'
import { ARTICLES, CAT_LABEL, dateFr } from '../../lib/content/articles'
import { trackArticleClick, trackBlogFilter } from '../../lib/gtm'
import { fr } from '../../lib/format'
import s from '../../styles/Blog.module.css'

export default function Blog({ articles }) {
  const [cat, setCat] = useState('tout')
  const list = articles.filter((a) => cat === 'tout' || a.cat === cat)
  const [first, ...rest] = list

  return (
    <>
      <Seo title="Articles : Bourse, crypto et épargne expliquées" description="Guides et analyses pour comprendre la Bourse, la crypto et l’épargne, avec des chiffres sourcés et à jour." />
      <PageIntro crumbs={[{ label: 'Articles' }]} title="Lire avant d’investir." lede="Des guides pour poser les bases, et des analyses pour aller plus loin. Chaque article indique sa date de mise à jour." />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <div className="segmented" role="group" aria-label="Filtrer les articles" style={{ marginBottom: 32 }}>
          {[['tout', 'Tous'], ...Object.entries(CAT_LABEL)].map(([k, label]) => (
            <button key={k} type="button" aria-pressed={cat === k} onClick={() => { setCat(k); trackBlogFilter(k) }}>{label}</button>
          ))}
        </div>

        {first && (
          <Link href={`/blog/${first.slug}`} className={s.lead} onClick={() => trackArticleClick(first.title, first.cat)}>
            <span className={`tag tag--${first.cat}`}>{CAT_LABEL[first.cat]}</span>
            <h2 className={s.leadTitle}>{fr(first.title)}</h2>
            <p className={s.leadText}>{first.description}</p>
            <span className={s.meta}>{first.readTime} min de lecture, mis à jour le {dateFr(first.updated)}</span>
          </Link>
        )}

        <ul className={s.list}>
          {rest.map((a) => (
            <li key={a.slug}>
              <Link href={`/blog/${a.slug}`} className={s.item} onClick={() => trackArticleClick(a.title, a.cat)}>
                <span className={`tag tag--${a.cat}`}>{CAT_LABEL[a.cat]}</span>
                <span className={s.itemTitle}>{fr(a.title)}</span>
                <span className={s.itemText}>{a.description}</span>
                <span className={s.meta}>{a.readTime} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { articles: ARTICLES.map(({ blocks, ...a }) => a) } }
}

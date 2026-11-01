import { useRef } from 'react'
import Link from 'next/link'
import Seo from '../../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../../components/ui/PageIntro'
import NewsletterForm from '../../components/ui/NewsletterForm'
import { ARTICLES, getArticle, CAT_LABEL, dateFr } from '../../lib/content/articles'
import { getTerm } from '../../lib/content/glossary'
import { useScrollFx, gsap } from '../../lib/motion'
import { trackArticleClick, trackClick } from '../../lib/gtm'
import s from '../../styles/Blog.module.css'

function Block({ b }) {
  if (b.t === 'h2') return <h2>{b.text}</h2>
  if (b.t === 'h3') return <h3>{b.text}</h3>
  if (b.t === 'quote') return <blockquote>{b.text}</blockquote>
  if (b.t === 'ul') return <ul>{b.items.map((i) => <li key={i.slice(0, 30)}>{i}</li>)}</ul>
  return <p>{b.text}</p>
}

export default function Article({ article, related, terms }) {
  const ref = useRef(null)
  const crumbs = [{ href: '/blog', label: 'Articles' }, { label: article.title }]

  // Barre de progression de lecture liée au scroll
  useScrollFx(ref, (root) => {
    gsap.fromTo(root.querySelector('[data-progress]'), { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: root.querySelector('[data-body]'), start: 'top 40%', end: 'bottom 60%', scrub: true },
    })
  }, [article.slug])

  return (
    <div ref={ref}>
      <Seo
        title={article.title}
        description={article.description}
        jsonLd={[
          crumbsJsonLd(crumbs),
          {
            '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description,
            datePublished: article.date, dateModified: article.updated, inLanguage: 'fr-FR',
            author: { '@type': 'Organization', name: 'Grapheko' }, publisher: { '@type': 'Organization', name: 'Grapheko' },
            mainEntityOfPage: `https://grapheko.fr/blog/${article.slug}`,
          },
        ]}
      />
      <div className={s.progress} data-progress aria-hidden="true" />
      <PageIntro crumbs={crumbs} title={article.title} wide>
        <p className={s.articleMeta}>
          <span className={`tag tag--${article.cat}`}>{CAT_LABEL[article.cat]}</span>
          <span>{article.readTime} min de lecture</span>
          <span>Publié le {dateFr(article.date)}, mis à jour le {dateFr(article.updated)}</span>
        </p>
      </PageIntro>

      <div className={`wrap ${s.articleGrid}`}>
        <article className="prose" data-body>
          <p className={s.intro}>{article.intro}</p>
          {article.blocks.map((b, i) => <Block key={i} b={b} />)}
          <p className={s.disclaimer}>
            Cet article a une vocation pédagogique et ne constitue pas un conseil en investissement personnalisé.
            Investir comporte un risque de perte en capital.
          </p>
        </article>

        <aside className={s.side}>
          <div className={s.sideTool}>
            <p className={s.sideLabel}>Passer à la pratique</p>
            <Link href={article.tool.href} className="btn btn--plein" onClick={() => trackClick('outil_article', 'article', article.slug)}>{article.tool.label}</Link>
          </div>
          <div>
            <p className={s.sideLabel}>Les mots de l’article</p>
            <ul className={s.sideTerms}>
              {terms.map((t) => <li key={t.slug}><Link href={`/glossaire/${t.slug}`}>{t.term}</Link></li>)}
            </ul>
          </div>
        </aside>
      </div>

      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <section className={`theme-encre ${s.nl}`} aria-labelledby="nl-article">
          <h2 id="nl-article">Recevoir le prochain article dimanche.</h2>
          <NewsletterForm location={`article_${article.slug}`} compact />
        </section>

        <h2 className={s.relatedTitle}>À lire ensuite</h2>
        <ul className={s.list}>
          {related.map((a) => (
            <li key={a.slug}>
              <Link href={`/blog/${a.slug}`} className={s.item} onClick={() => trackArticleClick(a.title, a.cat)}>
                <span className={`tag tag--${a.cat}`}>{CAT_LABEL[a.cat]}</span>
                <span className={s.itemTitle}>{a.title}</span>
                <span className={s.itemText}>{a.description}</span>
                <span className={s.meta}>{a.readTime} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  return { paths: ARTICLES.map((a) => ({ params: { slug: a.slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const article = getArticle(params.slug)
  const related = ARTICLES.filter((a) => a.slug !== article.slug)
    .sort((a, b) => (b.cat === article.cat) - (a.cat === article.cat))
    .slice(0, 3)
    .map(({ blocks, ...a }) => a)
  const terms = article.terms.map(getTerm).filter(Boolean).map(({ slug, term }) => ({ slug, term }))
  return { props: { article, related, terms, tracking: { article_category: article.cat } } }
}

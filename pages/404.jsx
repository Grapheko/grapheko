import Link from 'next/link'
import Seo from '../components/layout/Seo'
import s from '../styles/Simple.module.css'

export default function NotFound() {
  return (
    <>
      <Seo title="Page introuvable" noindex />
      <div className={`wrap ${s.nf}`}>
        <h1 className={s.nfTitle}>Cette page est sortie du graphique.</h1>
        <p className="lede">L’adresse a peut-être changé avec la nouvelle version du site. Les simulateurs et le glossaire sont toujours là.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/" className="btn btn--plein">Revenir à l’accueil</Link>
          <Link href="/simulateurs" className="btn">Voir les simulateurs</Link>
          <Link href="/glossaire" className="btn">Ouvrir le glossaire</Link>
        </div>
      </div>
    </>
  )
}

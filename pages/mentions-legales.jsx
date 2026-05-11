import Head from 'next/head'
import Link from 'next/link'

const Section = ({ num, title, children, id }) => (
  <div style={{ marginBottom: '48px' }} id={id}>
    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--neon)', letterSpacing: '.15em', marginBottom: '8px' }}>{num}</div>
    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '0.5px solid var(--border)' }}>{title}</h2>
    {children}
  </div>
)

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', gap: '16px', padding: '8px 0', borderBottom: '0.5px solid var(--border)', fontSize: '13px', flexWrap: 'wrap' }}>
    <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-secondary)', minWidth: '180px' }}>{label}</span>
    <span style={{ color: 'var(--text-primary)', lineHeight: 1.6, flex: 1 }}>{children}</span>
  </div>
)

const P = ({ children }) => (
  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>{children}</p>
)

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions Légales — Grapheko</title>
        <meta name="description" content="Mentions légales du site Grapheko — éditeur, hébergeur, propriété intellectuelle et avertissements légaux." />
        <meta name="robots" content="noindex, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{maxWidth:'800px',margin:'0 auto',padding:'100px 24px 80px',position:'relative',zIndex:1}}>

        <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#1A3A2A',marginBottom:'16px'}}><span style={{color:'var(--neon)'}}>[ ✓ ]</span> mentions-legales.sh --load juridique</div>
        <h1 style={{fontFamily:'var(--mono)',fontSize:'clamp(24px,4vw,48px)',fontWeight:500,letterSpacing:'-1.5px',lineHeight:1,marginBottom:'12px'}}>
          <span style={{color:'var(--neon)'}}>{'>'}</span>./mentions-legales
          <span style={{display:'inline-block',width:'5px',height:'clamp(20px,3.5vw,42px)',background:'var(--neon)',verticalAlign:'middle',marginLeft:'3px',animation:'blink 1s step-end infinite',borderRadius:'1px'}}/>
        </h1>
        <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--text-secondary)',marginBottom:'48px'}}>
          Dernière mise à jour : <span style={{color:'var(--neon)'}}>Mai 2026</span> · Conformes au droit français
        </div>

        {/* DISCLAIMER */}
        <div style={{background:'var(--surface)',border:'0.5px solid var(--neon)',borderRadius:'8px',padding:'20px 24px',marginBottom:'48px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,var(--neon),transparent)'}}/>
          <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--neon)',letterSpacing:'.15em',marginBottom:'8px'}}>// AVERTISSEMENT IMPORTANT</div>
          <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.7}}>Grapheko est un site d'information et d'éducation financière. Les contenus publiés ont une vocation exclusivement informative et pédagogique. <strong style={{color:'var(--text-primary)'}}>Ils ne constituent en aucun cas un conseil en investissement, une recommandation personnalisée, ni une incitation à acheter ou vendre des instruments financiers.</strong> Tout investissement comporte des risques de perte en capital. Grapheko n'est pas enregistré en tant que Conseiller en Investissements Financiers (CIF) auprès de l'AMF.</p>
        </div>

        <Section num="// 01" title="Éditeur du site" id="editeur">
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'16px 20px',marginBottom:'16px'}}>
            <Row label="Nom du site">Grapheko</Row>
            <Row label="URL"><a href="https://grapheko.fr" style={{color:'var(--neon)',textDecoration:'none'}}>grapheko.fr</a> · <a href="https://grapheko.com" style={{color:'var(--neon)',textDecoration:'none'}}>grapheko.com</a></Row>
            <Row label="Statut">Personne physique — Éditeur à titre personnel</Row>
            <Row label="Pays">France</Row>
            <Row label="Email"><a href="mailto:contact@grapheko.fr" style={{color:'var(--neon)',textDecoration:'none'}}>contact@grapheko.fr</a></Row>
          </div>
          <P>Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 (LCEN), les coordonnées complètes de l'éditeur sont disponibles sur simple demande à contact@grapheko.fr.</P>
        </Section>

        <Section num="// 02" title="Hébergeur" id="hebergeur">
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'16px 20px',marginBottom:'16px'}}>
            <Row label="Société">Vercel Inc.</Row>
            <Row label="Adresse">340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</Row>
            <Row label="Site web"><a href="https://vercel.com" style={{color:'var(--neon)',textDecoration:'none'}}>vercel.com</a></Row>
            <Row label="Registrar">Gandi SAS — 63-65 boulevard Massena, 75013 Paris, France</Row>
          </div>
        </Section>

        <Section num="// 03" title="Propriété intellectuelle" id="propriete">
          <P>L'ensemble des contenus présents sur Grapheko — textes, articles, analyses, graphiques, logo, identité visuelle, code source — sont la propriété exclusive de l'éditeur et protégés par le droit d'auteur français et les conventions internationales.</P>
          <P>Toute reproduction sans autorisation préalable écrite constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.</P>
          <div style={{borderLeft:'2px solid var(--neon)',padding:'10px 16px',margin:'16px 0',background:'rgba(0,255,136,.04)',borderRadius:'0 4px 4px 0',fontFamily:'var(--mono)',fontSize:'12px',color:'var(--text-secondary)'}}>// Exception : citation partielle autorisée avec mention explicite "Grapheko — grapheko.fr" et lien actif vers l'article original.</div>
        </Section>

        <Section num="// 04" title="Limitation de responsabilité" id="responsabilite">
          <P>L'éditeur s'efforce de maintenir les informations aussi exactes et à jour que possible mais ne peut en garantir l'exhaustivité. Grapheko décline toute responsabilité pour tout dommage résultant de l'utilisation du site ou d'une décision d'investissement prise sur la base des contenus publiés.</P>
        </Section>

        <Section num="// 05" title="Avertissement financier" id="finances">
          <P><strong style={{color:'var(--text-primary)'}}>Nature des contenus :</strong> Les articles, analyses et guides ont une vocation exclusivement éducative et informative. Ils ne constituent pas des conseils en investissement personnalisés au sens de la directive MIF II.</P>
          <P><strong style={{color:'var(--text-primary)'}}>Statut :</strong> Grapheko n'est pas enregistré comme Conseiller en Investissements Financiers (CIF) auprès de l'AMF.</P>
          <P><strong style={{color:'var(--text-primary)'}}>Risques :</strong> Tout investissement comporte un risque de perte en capital. Les performances passées ne garantissent pas les performances futures. Les crypto-actifs sont particulièrement volatils.</P>
        </Section>

        <Section num="// 06" title="Données personnelles & RGPD" id="donnees">
          <P>Conformément au RGPD (UE 2016/679), Grapheko collecte : adresse email et prénom (newsletter), données de formulaire de contact, données analytiques anonymisées via Google Analytics 4.</P>
          <P>Vous disposez d'un droit d'accès, rectification, effacement et opposition. Contact : <a href="mailto:contact@grapheko.fr" style={{color:'var(--neon)'}}>contact@grapheko.fr</a>. En cas de litige : <a href="https://www.cnil.fr" style={{color:'var(--neon)'}}>cnil.fr</a>.</P>
        </Section>

        <Section num="// 07" title="Cookies & traceurs" id="cookies">
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'16px 20px',marginBottom:'16px'}}>
            <Row label="Google Analytics 4">Mesure d'audience — 13 mois — analytique</Row>
            <Row label="Google Tag Manager">Gestion des balises — session</Row>
            <Row label="Cookies techniques">Fonctionnement du site — session — nécessaires</Row>
          </div>
        </Section>

        <Section num="// 08" title="Liens & affiliation" id="liens">
          <P>Certains liens peuvent être des liens d'affiliation, signalés par la mention <strong style={{color:'var(--neon)'}}>[lien affilié]</strong>. Leur présence n'influence pas l'indépendance éditoriale de Grapheko.</P>
        </Section>

        <Section num="// 09" title="Droit applicable" id="droit">
          <P>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</P>
        </Section>

        <Section num="// 10" title="Contact" id="contact-legal">
          <div style={{background:'var(--surface)',border:'0.5px solid var(--border)',borderRadius:'8px',padding:'16px 20px'}}>
            <Row label="Email"><a href="mailto:contact@grapheko.fr" style={{color:'var(--neon)',textDecoration:'none'}}>contact@grapheko.fr</a></Row>
            <Row label="Délai de réponse">Sous 30 jours maximum (délai légal RGPD)</Row>
            <Row label="CNIL"><a href="https://www.cnil.fr" style={{color:'var(--neon)',textDecoration:'none'}}>cnil.fr</a></Row>
            <Row label="AMF"><a href="https://www.amf-france.org" style={{color:'var(--neon)',textDecoration:'none'}}>amf-france.org</a></Row>
          </div>
        </Section>

      </div>

      <footer style={{borderTop:'0.5px solid var(--border)',padding:'24px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',position:'relative',zIndex:1}}>
        <Link href="/" style={{fontFamily:'var(--mono)',fontSize:'14px',color:'var(--text-primary)',textDecoration:'none'}}>{'>'} graph<span style={{color:'var(--neon)'}}>eko</span>_</Link>
        <span style={{fontFamily:'var(--mono)',fontSize:'11px',color:'#222'}}>© 2026 <span style={{color:'var(--neon)'}}>grapheko</span></span>
      </footer>

      <style jsx global>{`
        @media (min-width: 768px) { nav { padding: 0 48px !important; } }
      `}</style>
    </>
  )
}

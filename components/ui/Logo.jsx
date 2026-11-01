// Le logo : le mot "grapheko" suivi d'une petite courbe qui monte.
export default function Logo({ size = 22, title = 'Grapheko' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: size * 0.18, fontFamily: 'var(--display)', fontWeight: 800, fontSize: size, letterSpacing: '-0.05em', lineHeight: 1 }}>
      <span aria-hidden="true">grapheko</span>
      <svg width={size * 1.1} height={size * 0.7} viewBox="0 0 30 19" aria-hidden="true" style={{ transform: 'translateY(1px)' }}>
        <path d="M2 16 L9 10 L14 13 L27 3" fill="none" stroke="var(--accent)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">{title}</span>
    </span>
  )
}

// Petites illustrations propres à chaque simulateur, dessinées en SVG
export default function ToolVisual({ kind }) {
  const stroke = 'var(--encre)'
  const accent = 'var(--outremer)'
  if (kind === 'dca') {
    const bars = [30, 26, 34, 22, 38, 31, 45, 40, 52, 47, 58, 64]
    return (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        {bars.map((b, i) => <rect key={i} x={6 + i * 19.5} y={118 - b * 0.55} width="11" height={b * 0.55} rx="3" fill={stroke} opacity=".14" />)}
        <path d="M6 96 L26 92 L45 100 L65 84 L84 90 L104 72 L123 78 L143 58 L162 66 L182 44 L201 50 L232 18" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (kind === 'compound') {
    return (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        <path d="M6 112 L234 64" stroke={stroke} strokeWidth="2.5" strokeDasharray="5 6" fill="none" opacity=".5" />
        <path d="M6 112 C 90 108, 160 92, 234 10" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'fees') {
    return (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        <path d="M6 112 C 90 104, 160 80, 234 14" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M6 112 C 90 108, 160 96, 234 56" stroke="var(--baisse)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M234 18 L234 52" stroke={stroke} strokeWidth="2" markerEnd="none" />
      </svg>
    )
  }
  if (kind === 'per') {
    // Un versement (barre pleine) dont une part revient en impôt économisé
    return (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={14 + i * 58} y={118 - (34 + i * 20)} width="34" height={34 + i * 20} rx="5" fill={stroke} opacity=".14" />
            <rect x={14 + i * 58} y={118 - (34 + i * 20) * 0.3} width="34" height={(34 + i * 20) * 0.3} rx="5" fill={accent} />
          </g>
        ))}
      </svg>
    )
  }
  if (kind === 'flat') {
    return (
      <svg viewBox="0 0 240 120" aria-hidden="true">
        <path d="M6 70 L234 70" stroke={stroke} strokeWidth="3" strokeDasharray="6 7" fill="none" opacity=".55" />
        <path d="M6 112 L70 98 L150 62 L234 22" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="132" cy="70" r="6" fill={accent} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 240 120" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={10 + i * 38} y={118 - (40 + i * 6)} width="14" height={40 + i * 6} rx="3" fill={stroke} opacity=".16" />
          <rect x={26 + i * 38} y={118 - (40 - i * 3)} width="14" height={40 - i * 3} rx="3" fill={accent} />
        </g>
      ))}
    </svg>
  )
}

import { useId } from 'react'

// Curseur + champ numérique synchronisés
export default function RangeField({ label, value, onChange, min, max, step = 1, suffix = '', hint }) {
  const id = useId()
  const clamp = (v) => Math.min(max, Math.max(min, v))
  return (
    <div className="field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <label htmlFor={id}>{label}</label>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input
            id={id}
            className="input num"
            style={{ width: 112, minHeight: 40, textAlign: 'right', padding: '0 12px' }}
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value === '' ? min : clamp(parseFloat(e.target.value)))}
          />
          {suffix && <span className="small muted" style={{ minWidth: 24 }}>{suffix}</span>}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      {hint && <span className="hint">{hint}</span>}
    </div>
  )
}

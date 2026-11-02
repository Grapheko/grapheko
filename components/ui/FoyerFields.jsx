import RangeField from './RangeField'
import { partsFor, netSalary } from '../../lib/tax'
import { eur, num } from '../../lib/format'

// Champs communs aux simulateurs fiscaux : situation, enfants, parent isolé, revenus.
// State attendu : situation ('single' | 'couple'), enfants, isole (0 | 1),
// revenuMode ('salaires' | 'avis'), salaire1, salaire2, revenu.

export function foyerFrom(st) {
  const couple = st.situation === 'couple'
  const isolated = !couple && st.isole === 1 && st.enfants > 0
  const parts = partsFor({ situation: st.situation, children: st.enfants, isolated })
  const net1 = netSalary(st.salaire1)
  const net2 = couple ? netSalary(st.salaire2) : 0
  const fromSalaries = st.revenuMode === 'salaires'
  const income = fromSalaries ? net1 + net2 : st.revenu
  return { couple, isolated, parts, income, fromSalaries, net1, net2 }
}

const partsLabel = (p) => `${num(p, p % 1 ? 1 : 0)} part${p > 1 ? 's fiscales' : ' fiscale'}`

export function FoyerFields({ st, set, foyer }) {
  const { couple, parts } = foyer
  return (
    <>
      <div className="field">
        <span className="label" id="sit-label">Situation</span>
        <div className="segmented" role="group" aria-labelledby="sit-label">
          <button type="button" aria-pressed={!couple} onClick={() => set('situation')('single')}>Seul(e)</button>
          <button type="button" aria-pressed={couple} onClick={() => set('situation')('couple')}>Marié(e) ou pacsé(e)</button>
        </div>
      </div>
      <RangeField
        label="Enfants à charge"
        value={st.enfants}
        onChange={set('enfants')}
        min={0}
        max={6}
        step={1}
        hint={`Ton foyer compte ${partsLabel(parts)}.`}
      />
      {!couple && st.enfants > 0 && (
        <label className="check">
          <input type="checkbox" checked={st.isole === 1} onChange={(e) => set('isole')(e.target.checked ? 1 : 0)} />
          <span>Je vis seul(e) avec mes enfants <span className="hint">(case T de la déclaration : une demi-part en plus)</span></span>
        </label>
      )}
    </>
  )
}

export function RevenuFields({ st, set, foyer, label = 'Tes revenus', extraHint }) {
  const { couple, fromSalaries, income } = foyer
  return (
    <>
      <div className="field">
        <span className="label" id="rev-label">{label}</span>
        <div className="segmented" role="group" aria-labelledby="rev-label">
          <button type="button" aria-pressed={fromSalaries} onClick={() => set('revenuMode')('salaires')}>À partir des salaires</button>
          <button type="button" aria-pressed={!fromSalaries} onClick={() => set('revenuMode')('avis')}>Depuis mon avis d’impôt</button>
        </div>
      </div>
      {fromSalaries ? (
        <>
          <RangeField
            label={couple ? 'Ton salaire annuel' : 'Salaire annuel'}
            value={st.salaire1}
            onChange={set('salaire1')}
            min={0}
            max={200000}
            step={500}
            suffix="€"
            hint={couple ? undefined : 'Le cumul « net imposable » de ta fiche de paie de décembre. Il est un peu supérieur au net versé sur ton compte.'}
          />
          {couple && (
            <RangeField
              label="Salaire annuel de ton conjoint"
              value={st.salaire2}
              onChange={set('salaire2')}
              min={0}
              max={200000}
              step={500}
              suffix="€"
              hint="Pour chacun, le cumul « net imposable » de la fiche de paie de décembre, un peu supérieur au net versé."
            />
          )}
          <p className="hint" style={{ marginTop: -8 }}>
            Revenu imposable retenu : <strong>{eur(income)}</strong>, après la déduction de 10 % pour frais professionnels.
            {extraHint ? ` ${extraHint}` : ''}
          </p>
        </>
      ) : (
        <RangeField
          label="Revenu imposable du foyer"
          value={st.revenu}
          onChange={set('revenu')}
          min={0}
          max={300000}
          step={500}
          suffix="€"
          hint={`La ligne « Revenu imposable » de ton dernier avis d’impôt (pas le revenu fiscal de référence). Idéal si tu es retraité(e) ou indépendant(e).${extraHint ? ` ${extraHint}` : ''}`}
        />
      )}
    </>
  )
}

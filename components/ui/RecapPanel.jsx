import { useMemo, useState } from 'react'
import Link from 'next/link'
import { downloadRecap } from '../../lib/recapPdf'
import { trackClick } from '../../lib/gtm'
import s from './RecapPanel.module.css'

// Récapitulatif téléchargeable + compte rendu rédigé par l'IA (à la demande).
// recap  : contenu du PDF (voir lib/recapPdf.js)
// aiTool : 'per' | 'flat_tax' ; aiData : chiffres envoyés à /api/compte-rendu
export default function RecapPanel({ toolName, recap, aiTool, aiData, aiEnabled }) {
  const [ai, setAi] = useState(null) // { text, key }
  const [state, setState] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')
  const [pdfBusy, setPdfBusy] = useState(false)
  const key = useMemo(() => JSON.stringify(aiData), [aiData])
  const stale = ai && ai.key !== key

  const pdf = async () => {
    setPdfBusy(true)
    trackClick('recap_pdf', toolName, ai && !stale ? 'avec_ia' : 'sans_ia')
    try { await downloadRecap(recap, ai && !stale ? ai.text : null) } finally { setPdfBusy(false) }
  }

  const ask = async () => {
    setState('loading'); setError('')
    trackClick('compte_rendu_ia', toolName, stale ? 'mise_a_jour' : 'demande')
    try {
      const r = await fetch('/api/compte-rendu', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ tool: aiTool, data: aiData }) })
      const json = await r.json().catch(() => ({}))
      if (!r.ok || !json.text) throw new Error(json.error || 'Le compte rendu n’a pas pu être rédigé.')
      setAi({ text: json.text, key })
      setState('idle')
    } catch (e) {
      setError(e.message); setState('error')
    }
  }

  return (
    <section className={s.panel} aria-labelledby="recap-title">
      <div className={s.head}>
        <div>
          <h2 id="recap-title" className={s.title}>Garde une trace de ta simulation</h2>
          <p className={s.sub}>
            Un PDF avec tes paramètres, tes résultats et le barème appliqué{aiEnabled ? ', et si tu le souhaites un compte rendu rédigé par l’IA' : ''}. Il est fabriqué dans ton navigateur.
          </p>
        </div>
        <div className={s.buttons}>
          <button type="button" className="btn btn--plein" onClick={pdf} disabled={pdfBusy}>
            {pdfBusy ? 'Préparation…' : ai && !stale ? 'Télécharger le PDF avec le compte rendu' : 'Télécharger le récapitulatif (PDF)'}
          </button>
          {aiEnabled && (!ai || stale) && (
            <button type="button" className="btn" onClick={ask} disabled={state === 'loading'}>
              {state === 'loading' ? 'Rédaction en cours…' : stale ? 'Mettre à jour le compte rendu' : 'Obtenir un compte rendu par l’IA'}
            </button>
          )}
        </div>
      </div>

      {aiEnabled && !ai && state !== 'loading' && (
        <p className={s.privacy}>
          Le compte rendu explique ta situation à partir de tes chiffres. Ceux-ci, sans nom ni e-mail, sont envoyés à notre fournisseur d’IA, Anthropic, et ne sont pas conservés par Grapheko.{' '}
          <Link href="/confidentialite">En savoir plus</Link>
        </p>
      )}
      {state === 'loading' && <div className={s.loading} aria-live="polite"><span /><span /><span /> Rédaction de ton compte rendu…</div>}
      {state === 'error' && <p className={s.error} role="alert">{error}</p>}

      {ai && (
        <article className={`${s.ai} ${stale ? s.stale : ''}`} aria-live="polite">
          <p className={s.aiLabel}>Compte rendu rédigé par l’IA</p>
          {stale && <p className={s.staleNote}>Tes paramètres ont changé : ce texte correspond à ta simulation précédente.</p>}
          <AiText text={ai.text} />
          <p className={s.aiFoot}>
            Texte généré automatiquement à partir des chiffres ci-dessus. Il peut contenir des erreurs et ne constitue pas un conseil fiscal ou en investissement personnalisé.
          </p>
        </article>
      )}
    </section>
  )
}

// Rendu minimal et sûr : « ## » titres, « - » puces, le reste en paragraphes (aucun HTML interprété)
function AiText({ text }) {
  const blocks = []
  let list = null
  text.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line, i) => {
    const plain = line.replace(/\*\*/g, '')
    if (plain.startsWith('- ')) {
      if (!list) { list = []; blocks.push({ type: 'ul', items: list, key: i }) }
      list.push(plain.slice(2))
      return
    }
    list = null
    if (plain.startsWith('#')) blocks.push({ type: 'h', text: plain.replace(/^#+\s*/, ''), key: i })
    else blocks.push({ type: 'p', text: plain, key: i })
  })
  return blocks.map((b) =>
    b.type === 'h' ? <h3 key={b.key}>{b.text}</h3>
      : b.type === 'ul' ? <ul key={b.key}>{b.items.map((t, j) => <li key={j}>{t}</li>)}</ul>
        : <p key={b.key}>{b.text}</p>
  )
}

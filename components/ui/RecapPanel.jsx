import { useMemo, useState } from 'react'
import Link from 'next/link'
import { downloadRecap } from '../../lib/recapPdf'
import { trackClick } from '../../lib/gtm'
import s from './RecapPanel.module.css'

// Compte rendu de la simulation + récapitulatif PDF.
// report : compte rendu rédigé par des règles (lib/taxReport.js), toujours affiché, gratuit.
// Option en sommeil : si ANTHROPIC_API_KEY est configurée (aiEnabled), un bouton propose
// une version rédigée par l'IA via /api/compte-rendu.
export default function RecapPanel({ toolName, recap, report, aiTool, aiData, aiEnabled }) {
  const [ai, setAi] = useState(null) // { text, key }
  const [state, setState] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')
  const [pdfBusy, setPdfBusy] = useState(false)
  const key = useMemo(() => JSON.stringify(aiData), [aiData])
  const aiFresh = ai && ai.key === key
  const shown = aiFresh ? { text: ai.text, kind: 'ia' } : { text: report, kind: 'auto' }

  const pdf = async () => {
    setPdfBusy(true)
    trackClick('recap_pdf', toolName, shown.kind === 'ia' ? 'avec_ia' : 'compte_rendu_auto')
    try { await downloadRecap(recap, shown) } finally { setPdfBusy(false) }
  }

  const ask = async () => {
    setState('loading'); setError('')
    trackClick('compte_rendu_ia', toolName, ai ? 'mise_a_jour' : 'demande')
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
          <h2 id="recap-title" className={s.title}>Ton compte rendu</h2>
          <p className={s.sub}>Ta simulation résumée en clair. Le PDF reprend ce compte rendu, tes paramètres, tes résultats et le barème appliqué. Il est fabriqué dans ton navigateur : rien n’est envoyé.</p>
        </div>
        <div className={s.buttons}>
          <button type="button" className="btn btn--plein" onClick={pdf} disabled={pdfBusy}>
            {pdfBusy ? 'Préparation…' : 'Télécharger le récapitulatif (PDF)'}
          </button>
          {aiEnabled && !aiFresh && (
            <button type="button" className="btn" onClick={ask} disabled={state === 'loading'}>
              {state === 'loading' ? 'Rédaction en cours…' : 'Version rédigée par l’IA'}
            </button>
          )}
        </div>
      </div>

      {aiEnabled && !aiFresh && state === 'idle' && (
        <p className={s.privacy}>
          La version IA envoie les chiffres de ta simulation, sans nom ni e-mail, à notre fournisseur d’IA, Anthropic. Grapheko ne les conserve pas.{' '}
          <Link href="/confidentialite">En savoir plus</Link>
        </p>
      )}
      {state === 'loading' && <div className={s.loading} aria-live="polite"><span /><span /><span /> Rédaction de ton compte rendu…</div>}
      {state === 'error' && <p className={s.error} role="alert">{error}</p>}

      <article className={s.ai} aria-live="polite">
        <p className={s.aiLabel}>{shown.kind === 'ia' ? 'Compte rendu rédigé par l’IA' : 'Compte rendu de ta simulation'}</p>
        <ReportText text={shown.text} />
        <p className={s.aiFoot}>
          {shown.kind === 'ia'
            ? 'Texte généré automatiquement à partir de tes chiffres. Il peut contenir des erreurs et ne constitue pas un conseil fiscal ou en investissement personnalisé.'
            : 'Rédigé automatiquement à partir de tes chiffres, il se met à jour à chaque modification. Explication pédagogique, pas un conseil fiscal ou en investissement personnalisé.'}
        </p>
      </article>
    </section>
  )
}

// Rendu minimal et sûr : « ## » titres, « - » puces, le reste en paragraphes (aucun HTML interprété)
function ReportText({ text }) {
  const blocks = []
  let list = null
  String(text || '').split('\n').map((l) => l.trim()).filter(Boolean).forEach((line, i) => {
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

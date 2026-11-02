// Récapitulatif de simulation en PDF, généré dans le navigateur (aucune donnée envoyée).
// recap : { tool, title, lede, params: [[label, valeur]], results: [[label, valeur]],
//           highlight: { label, value }, notes: [texte], bareme: [[tranche, taux, mine]], method, url }
// ai : texte du compte rendu IA (facultatif, format « ## Titre » / « - puce » / paragraphes)

const C = {
  encre: [18, 20, 43],
  encre2: [60, 63, 92],
  encre3: [108, 111, 135],
  jaune: [252, 236, 156],
  brume: [244, 240, 230],
  outremer: [47, 59, 245],
  ligne: [222, 216, 200],
}

// Les polices standard du PDF ne connaissent pas l'espace fine insécable (utilisée par Intl en français)
const clean = (t) => String(t ?? '').replace(/[  ]/g, ' ').replace(/‑/g, '-')

export async function downloadRecap(recap, ai) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 48
  const CW = W - M * 2
  let y = 0

  const color = (c) => doc.setTextColor(...c)
  const font = (style = 'normal', size = 10) => { doc.setFont('helvetica', style); doc.setFontSize(size) }
  const ensure = (h) => { if (y + h > H - 64) { footer(); doc.addPage(); y = M } }
  const text = (t, x, opts = {}) => {
    const lines = doc.splitTextToSize(clean(t), opts.width || CW)
    const lh = (opts.size || 10) * (opts.lh || 1.45)
    lines.forEach((line) => { ensure(lh); doc.text(line, x, y); y += lh })
  }
  const footer = () => {
    font('normal', 8); color(C.encre3)
    doc.text(clean('Grapheko est un média éducatif. Ce récapitulatif ne constitue pas un conseil en investissement ni un conseil fiscal personnalisé.'), M, H - 32)
    doc.text('grapheko.fr', W - M, H - 32, { align: 'right' })
  }

  // En-tête : bandeau jaune
  doc.setFillColor(...C.jaune); doc.rect(0, 0, W, 132, 'F')
  y = 46
  font('bold', 13); color(C.encre); doc.text('grapheko', M, y)
  font('normal', 9); color(C.encre2)
  doc.text(clean(`Récapitulatif du ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`), W - M, y, { align: 'right' })
  y = 84; font('bold', 20); color(C.encre); text(recap.title, M, { size: 20, lh: 1.15 })
  if (recap.lede) { font('normal', 10); color(C.encre2); y = Math.max(y, 112); text(recap.lede, M, { size: 10 }) }
  y = 160

  // Résultat principal
  if (recap.highlight) {
    doc.setFillColor(...C.encre); doc.roundedRect(M, y, CW, 70, 10, 10, 'F')
    font('normal', 10); doc.setTextColor(189, 191, 214); doc.text(clean(recap.highlight.label), M + 20, y + 26)
    font('bold', 22); doc.setTextColor(252, 250, 244); doc.text(clean(recap.highlight.value), M + 20, y + 54)
    y += 96
  }

  const table = (title, rows) => {
    if (!rows?.length) return
    ensure(48)
    font('bold', 12); color(C.encre); doc.text(clean(title), M, y); y += 14
    rows.forEach(([label, value, strong]) => {
      const labelLines = doc.splitTextToSize(clean(label), CW * 0.6)
      const h = Math.max(1, labelLines.length) * 14 + 10
      ensure(h)
      doc.setDrawColor(...C.ligne); doc.line(M, y, M + CW, y)
      y += 15
      font(strong ? 'bold' : 'normal', 10); color(C.encre2)
      labelLines.forEach((l, i) => doc.text(l, M, y + i * 14))
      font('bold', 10); color(C.encre); doc.text(clean(value), M + CW, y, { align: 'right' })
      y += h - 15
    })
    doc.setDrawColor(...C.ligne); doc.line(M, y, M + CW, y)
    y += 26
  }

  table('Tes paramètres', recap.params)
  table('Résultats', recap.results)

  if (recap.notes?.length) {
    recap.notes.forEach((n) => {
      font('normal', 10)
      const lines = doc.splitTextToSize(clean(n), CW - 28)
      const h = lines.length * 14.5 + 20
      ensure(h + 10)
      doc.setFillColor(...C.jaune); doc.roundedRect(M, y, CW, h, 8, 8, 'F')
      color(C.encre); lines.forEach((l, i) => doc.text(l, M + 14, y + 20 + i * 14.5))
      y += h + 12
    })
    y += 10
  }

  if (recap.bareme?.length) {
    ensure(140)
    font('bold', 12); color(C.encre); doc.text(clean(recap.baremeTitle || 'Le barème utilisé'), M, y); y += 16
    recap.bareme.forEach(([range, rate, mine]) => {
      ensure(22)
      if (mine) { doc.setFillColor(...C.jaune); doc.rect(M, y - 13, CW, 20, 'F') }
      font(mine ? 'bold' : 'normal', 10); color(C.encre2); doc.text(clean(range), M + 8, y)
      font('bold', 10); color(C.encre); doc.text(clean(rate + (mine ? '  (ta tranche)' : '')), M + CW - 8, y, { align: 'right' })
      y += 20
    })
    y += 14
  }

  if (ai) {
    ensure(80)
    doc.setDrawColor(...C.outremer); doc.setLineWidth(2); doc.line(M, y, M + 40, y); doc.setLineWidth(1)
    y += 20
    font('bold', 13); color(C.encre); doc.text(clean('Compte rendu de ta situation'), M, y); y += 14
    font('normal', 8.5); color(C.encre3); text('Rédigé par une intelligence artificielle à partir des chiffres de ta simulation. Peut contenir des erreurs : vérifie toujours avec les montants ci-dessus.', M, { size: 8.5 })
    y += 6
    String(ai).split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
      if (line.startsWith('## ')) { y += 6; font('bold', 11); color(C.encre); text(line.slice(3), M, { size: 11 }); y += 2 }
      else if (line.startsWith('- ')) { font('normal', 10); color(C.encre2); const yy = y; doc.text('•', M + 2, yy); text(line.slice(2), M + 14, { width: CW - 14 }) }
      else { font('normal', 10); color(C.encre2); text(line, M); y += 4 }
    })
    y += 14
  }

  if (recap.method) {
    ensure(60)
    font('bold', 9); color(C.encre2); doc.text('Méthode', M, y); y += 13
    font('normal', 8.5); color(C.encre3); text(recap.method, M, { size: 8.5 })
  }
  if (recap.url) {
    y += 8; ensure(20); font('normal', 9); color(C.outremer)
    doc.textWithLink(clean(`Refaire la simulation : ${recap.url}`), M, y, { url: recap.url })
  }
  footer()
  doc.save(`grapheko-${recap.tool}-${new Date().toISOString().slice(0, 10)}.pdf`)
}

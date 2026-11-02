// Mise en page e-mail d'une édition de la newsletter (tableaux + styles en ligne,
// compatible Gmail, Outlook et Apple Mail). {{ unsubscribe }} est remplacé par Brevo.
const SITE = 'https://grapheko.fr'
const C = { encre: '#12142B', texte: '#3C3F5C', doux: '#6C6F87', bleu: '#2F3BF5', fond: '#F4F0E6', blanc: '#FFFFFF', ligne: '#E6E3DA' }
const FONT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;"

const MOIS = 'janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre'
// Échappe le texte et rend insécables les espaces des nombres (« 1 350 € », « 30 % », « 31 décembre »)
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/(\d) (?=\d{3}(\D|$))/g, '$1&nbsp;')
  .replace(/ (€|%)/g, '&nbsp;$1')
  .replace(new RegExp(`(\\d) (${MOIS})`, 'g'), '$1&nbsp;$2')
// **gras** → <strong>, après échappement
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, `<strong style="color:${C.encre}">$1</strong>`)

const p = (html, extra = '') => `<p style="margin:0 0 16px;${FONT}font-size:16px;line-height:1.6;color:${C.texte};${extra}">${html}</p>`
const h = (txt) => `<p style="margin:28px 0 10px;${FONT}font-size:17px;font-weight:700;color:${C.encre}">${esc(txt)}</p>`
const list = (items) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items
    .map((it) => `<tr><td valign="top" style="width:18px;${FONT}font-size:16px;line-height:1.6;color:${C.bleu}">•</td><td style="padding:0 0 10px;${FONT}font-size:16px;line-height:1.6;color:${C.texte}">${rich(it)}</td></tr>`)
    .join('')}</table>`

export function newsletterHtml(n) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(n.subject)}</title></head>
<body style="margin:0;padding:0;background:${C.fond}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(n.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.fond}">
<tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.blanc};border-radius:16px">
<tr><td align="center" style="padding:32px 32px 8px"><a href="${SITE}/?utm_source=brevo&amp;utm_medium=email&amp;utm_campaign=newsletter-${n.date}&amp;utm_content=logo"><img src="${SITE}/email/logo.png" width="170" alt="Grapheko" style="display:block;border:0;width:170px;height:auto"></a></td></tr>
<tr><td style="padding:16px 32px 0">
<p style="margin:0 0 6px;${FONT}font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.bleu}">La courbe du dimanche</p>
<h1 style="margin:0 0 20px;${FONT}font-size:26px;line-height:1.2;color:${C.encre}">${esc(n.title)}</h1>
</td></tr>
<tr><td style="padding:0 16px"><img src="${SITE}${n.image}" width="568" alt="${esc(n.alt)}" style="display:block;border:0;width:100%;max-width:568px;height:auto;border-radius:8px"></td></tr>
<tr><td style="padding:24px 32px 8px">
${n.intro.map((t) => p(rich(t))).join('\n')}
${h('Ce que montre la courbe')}
${list(n.shows)}
${h('Ce qu’elle ne montre pas')}
${list(n.hides)}
${n.outro ? p(rich(n.outro), 'margin-top:12px;') : ''}
</td></tr>
<tr><td align="center" style="padding:12px 32px 28px">
<a href="${esc(n.cta.url)}" style="display:inline-block;background:${C.bleu};color:#ffffff;${FONT}font-size:16px;font-weight:700;text-decoration:none;padding:14px 26px;border-radius:999px">${esc(n.cta.label)}</a>
</td></tr>
<tr><td style="padding:0 32px 32px">
${p('Une question, une idée de sujet ? Réponds simplement à cet e-mail, je lis tout.')}
${p(`À dimanche prochain,<br><strong style="color:${C.encre}">Gauthier</strong>`, 'margin:0;')}
</td></tr>
</table>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
<tr><td align="center" style="padding:20px 24px;${FONT}font-size:12px;line-height:1.6;color:${C.doux}">
Grapheko est un média éducatif : ces contenus ne sont pas des conseils en investissement. Investir comporte un risque de perte en capital.<br>
Tu reçois cet e-mail car tu es inscrit(e) à la newsletter Grapheko. <a href="{{ unsubscribe }}" style="color:${C.doux}">Se désinscrire</a>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

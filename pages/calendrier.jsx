import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Seo from '../components/layout/Seo'
import PageIntro, { crumbsJsonLd } from '../components/ui/PageIntro'
import { EVENTS, ZONES, KINDS, CALENDAR_VERIFIED_AT, googleUrl, todayParis } from '../lib/content/calendar'
import { dateFr } from '../lib/content/articles'
import { trackClick } from '../lib/gtm'
import s from '../components/calendrier/Calendrier.module.css'

const FEED = 'grapheko.fr/calendrier.ics'
const WEEKDAY = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' })
const MONTH = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const HOUR = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })
const d = (iso) => new Date(`${iso}T12:00:00Z`)

export default function Calendrier({ events, builtOn }) {
  const crumbs = [{ label: 'Calendrier' }]
  const [zone, setZone] = useState('tout')
  const [kind, setKind] = useState('tout')
  const [today, setToday] = useState(builtOn)
  useEffect(() => { setToday(todayParis()) }, [])

  const shown = useMemo(
    () => events.filter((e) => e.date >= today && (zone === 'tout' || e.zone === zone) && (kind === 'tout' || e.kind === kind)),
    [events, today, zone, kind],
  )
  const months = useMemo(() => {
    const m = new Map()
    shown.forEach((e) => {
      const key = e.date.slice(0, 7)
      if (!m.has(key)) m.set(key, [])
      m.get(key).push(e)
    })
    return [...m.entries()]
  }, [shown])
  const next = shown.find((e) => e.confirmed)

  const track = (what, id) => trackClick(what, 'calendrier', id)

  return (
    <>
      <Seo
        title="Calendrier fiscal et financier 2026-2027 : BCE, Fed, impôts, Livret A"
        description="Toutes les grandes dates de l’épargnant : décisions de la BCE et de la Fed, révision du Livret A, déclaration de revenus, jours de fermeture de la Bourse. À ajouter à ton agenda en un clic."
        jsonLd={[crumbsJsonLd(crumbs)]}
      />
      <PageIntro
        crumbs={crumbs}
        title="Le calendrier des dates qui comptent pour ton argent."
        lede={`Décisions de taux, impôts, livrets, jours de Bourse : les échéances françaises, européennes et mondiales, à ajouter à ton agenda en un clic. Dates vérifiées le ${dateFr(CALENDAR_VERIFIED_AT)}.`}
        wide
      />

      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        {/* Abonnement */}
        <section className={`theme-encre ${s.sub}`} aria-labelledby="sub-title">
          <div>
            <p className={s.subLabel}>Abonnement gratuit</p>
            <h2 id="sub-title" className={s.subTitle}>Toutes ces dates dans ton agenda, mises à jour automatiquement.</h2>
            <p className={s.subText}>
              Abonne-toi une fois : chaque nouvelle date ou modification apparaît d’elle-même dans ton agenda. Les dates non confirmées n’y sont ajoutées qu’une fois officielles.
            </p>
          </div>
          <div className={s.subActions}>
            <a className="btn btn--plein" href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(`webcal://${FEED}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => track('abonnement_google', 'flux')}>
              Google Agenda
            </a>
            <a className="btn" href={`webcal://${FEED}`} onClick={() => track('abonnement_webcal', 'flux')}>Apple Calendrier ou Outlook</a>
            <a className={s.subLink} href="/calendrier.ics" download onClick={() => track('telechargement_ics', 'flux')}>Télécharger le fichier .ics</a>
          </div>
        </section>

        {next && (
          <p className={s.next}>
            Prochaine échéance : <strong>{next.title}</strong>, le {dateFr(next.date)}{next.utc ? ` à ${HOUR.format(new Date(next.utc))}` : ''}.
          </p>
        )}

        {/* Filtres */}
        <div className={s.filters}>
          <div className={s.group} role="group" aria-label="Zone">
            {[['tout', 'Toutes zones'], ...Object.entries(ZONES)].map(([k, l]) => (
              <button key={k} type="button" className={s.chip} aria-pressed={zone === k} onClick={() => setZone(k)}>{l}</button>
            ))}
          </div>
          <div className={s.group} role="group" aria-label="Thème">
            {[['tout', 'Tous thèmes'], ...Object.entries(KINDS)].map(([k, l]) => (
              <button key={k} type="button" className={s.chip} aria-pressed={kind === k} onClick={() => setKind(k)}>{l}</button>
            ))}
          </div>
        </div>

        {/* Liste par mois */}
        {months.map(([key, list]) => (
          <section key={key} className={s.month} aria-labelledby={`m-${key}`}>
            <h2 id={`m-${key}`} className={s.monthTitle}>{MONTH.format(d(`${key}-01`))}</h2>
            <ol className={s.list}>
              {list.map((e) => (
                <li key={e.id} className={`${s.event} ${e.confirmed ? '' : s.tbc}`}>
                  <div className={s.date} aria-hidden="true">
                    {e.confirmed ? (
                      <>
                        <span className={s.day}>{d(e.date).getUTCDate()}</span>
                        <span className={s.wd}>{WEEKDAY.format(d(e.date))}</span>
                      </>
                    ) : <span className={s.wd}>À confirmer</span>}
                  </div>
                  <div className={s.body}>
                    <p className={s.tags}>
                      <span className={`${s.tag} ${s[`z_${e.zone}`]}`}>{ZONES[e.zone]}</span>
                      <span className={s.tag}>{KINDS[e.kind]}</span>
                      {e.utc && <span className={s.time}>{HOUR.format(new Date(e.utc))} (heure de Paris)</span>}
                      {!e.confirmed && <span className={s.time}>{e.approx}</span>}
                    </p>
                    <h3 className={s.title}>{e.title}</h3>
                    <p className={s.note}>{e.note}</p>
                    {e.link && <p className={s.note}><Link href={e.link.href} onClick={() => track('lien_article', e.id)}>{e.link.label}</Link></p>}
                    <p className={s.source}>
                      Source : <a href={e.source.url} target="_blank" rel="noopener noreferrer">{e.source.label}</a>
                    </p>
                  </div>
                  <div className={s.add}>
                    {e.confirmed ? (
                      <>
                        <a className={s.addBtn} href={googleUrl(e)} target="_blank" rel="noopener noreferrer" onClick={() => track('ajout_google', e.id)}>+ Google</a>
                        <a className={s.addBtn} href={`/api/calendrier?id=${encodeURIComponent(e.id)}`} onClick={() => track('ajout_ics', e.id)}>+ Apple / Outlook</a>
                      </>
                    ) : <span className={s.addWait}>Ajout possible dès la date officielle</span>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
        {months.length === 0 && <p className={s.empty}>Aucune date à venir pour ces filtres.</p>}

        <section className={s.method}>
          <h2>Comment ce calendrier est tenu</h2>
          <p>
            Chaque date provient d’une source officielle (BCE, Réserve fédérale, Euronext, administration fiscale) et est vérifiée avant publication.
            Les dates de la Fed sont provisoires jusqu’à la réunion précédente, celles des impôts sont publiées au printemps : elles sont marquées
            « à confirmer » et n’entrent dans le flux agenda qu’une fois officielles. Les heures sont données en heure de Paris.
          </p>
          <p><Link href="/glossaire/taux-directeur">Le taux directeur, expliqué</Link> · <Link href="/glossaire/livret-a">Le Livret A</Link> · <Link href="/glossaire/fiscalite-crypto">La fiscalité des cryptos</Link></p>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { events: EVENTS, builtOn: todayParis(), tracking: { tool_name: 'calendrier' } }, revalidate: 86400 }
}

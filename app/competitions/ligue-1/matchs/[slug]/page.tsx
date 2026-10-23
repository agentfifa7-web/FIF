import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Info, MapPin } from 'lucide-react'
import type { RealLeagueMatchEvent, RealLeagueMatchSubstitution } from '@/lib/data/mock'
import { realLigue1Matches, getRealLeagueMatch, getClubByName } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { ClubCrest } from '@/components/site/cards'
import { formatDateLong } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export async function generateStaticParams() {
  await loadCms()
  return realLigue1Matches.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const match = getRealLeagueMatch(slug)
  return { title: match ? `${match.homeClub} — ${match.awayClub} — FIF` : 'Match' }
}

const eventLabel: Record<RealLeagueMatchEvent['type'], string> = {
  goal: 'BUT', yellow: 'CARTON JAUNE', red: 'CARTON ROUGE',
}

function subLabel(s: RealLeagueMatchSubstitution) {
  return s.playerOut ? `${s.playerOut} ➜ ${s.playerIn}` : `${s.playerIn} (entrée en jeu)`
}

export default async function LigueUnMatchPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const match = getRealLeagueMatch(slug)
  if (!match) notFound()
  const home = getClubByName(match.homeClub)
  const away = getClubByName(match.awayClub)
  const matchLabel = `${match.homeClub} vs ${match.awayClub}`

  return (
    <main>
      <section className="page-hero tone-forest">
        <div className="page-hero-content">
          <div style={{ padding: '0 0 8px' }}>
            <Breadcrumb items={[{ label: 'Compétitions', href: '/competitions' }, { label: 'Ligue 1', href: '/competitions/ligue-1' }, { label: matchLabel }]} />
          </div>
          <p className="eyebrow"><span /> Ligue 1 LONACI · Journée {match.matchday} · Terminé</p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)' }}>{matchLabel}</h1>
          <div className="page-hero-meta">
            <div><strong>{match.homeScore} - {match.awayScore}</strong><span>Score final</span></div>
            <div><strong>{formatDateLong(match.date)}</strong><span>Date</span></div>
            {match.venue && <div><strong>{match.venue}</strong><span>Stade</span></div>}
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="next-card" style={{ maxWidth: 560 }}>
          <div className="next-card-top"><span>J{match.matchday}</span><span>{formatDateLong(match.date).toUpperCase()}</span></div>
          <div className="teams">
            <div className="team">
              {home ? <Link href={`/clubs/${home.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}><div className="crest ivory" style={{ fontSize: 20 }}><ClubCrest club={home} size={32} /></div><strong>{match.homeClub}</strong></Link> : <strong>{match.homeClub}</strong>}
            </div>
            <div className="versus"><small style={{ color: 'var(--fif-orange-text)' }}>TERMINÉ</small><b style={{ fontSize: 28 }}>{match.homeScore} - {match.awayScore}</b>{match.venue && <span><MapPin size={11} style={{ verticalAlign: 'middle' }} /> {match.venue}</span>}</div>
            <div className="team">
              {away ? <Link href={`/clubs/${away.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}><div className="crest red" style={{ fontSize: 20 }}><ClubCrest club={away} size={32} /></div><strong>{match.awayClub}</strong></Link> : <strong>{match.awayClub}</strong>}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--fif-orange-text)' }}>Résultat</p>
        <div className="timeline" style={{ marginTop: 16, maxWidth: 640 }}>
          {match.events.map((e, i) => (
            <div key={i}>
              <b>{e.minute ? `${e.minute}'` : '—'}</b>
              <div>
                <strong>{eventLabel[e.type]}</strong>
                <span>{e.team === 'home' ? match.homeClub : match.awayClub}{e.player ? ` · ${e.player}` : ''}</span>
              </div>
            </div>
          ))}
          {!match.events.length && <p className="lede" >Aucun but ni carton recensé pour ce match.</p>}
        </div>
        {match.referee && (
          <p className="match-officials">
            Arbitre : {match.referee.name}{match.referee.assistants?.length ? ` · Assistants : ${match.referee.assistants.join(', ')}` : ''}{match.referee.fourthOfficial ? ` · 4e officiel : ${match.referee.fourthOfficial}` : ''}{match.referee.commissioner ? ` · Commissaire au match : ${match.referee.commissioner}` : ''}
          </p>
        )}
        {match.attendance && (
          <p className="match-officials">Affluence : {match.attendance.toLocaleString('fr-FR')} spectateurs</p>
        )}
        {match.sheetSource && <p className="match-officials">{match.sheetSource}</p>}
      </section>

      {match.lineups && (
        <section className="page-section tight">
          <p className="section-tag">{match.lineups.home.players ? 'Feuille de match' : 'Compositions de départ'}</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {(['home', 'away'] as const).map((side) => {
              const l = match.lineups![side]
              const club = side === 'home' ? match.homeClub : match.awayClub
              const row = (p: { name: string; number?: number; captain?: boolean; goalkeeper?: boolean }, i: number) => (
                <li key={i}><span className="lineup-num">{p.number ?? '–'}</span><span>{p.name}{p.captain && <em className="lineup-c"> (C)</em>}</span>{p.goalkeeper && <small>Gardien</small>}</li>
              )
              return (
                <div key={side} className="dashboard-panel lineup-col" style={{ borderTop: `3px solid ${side === 'home' ? 'var(--fif-orange)' : 'var(--fif-green-600)'}`, margin: 0 }}>
                  <h3>{club} {l.formation && <span style={{ color: 'var(--gray-500)', fontWeight: 400, fontSize: 14 }}>({l.formation})</span>}</h3>
                  {l.players ? (
                    <>
                      <p className="lineup-sub">Titulaires</p>
                      <ul>{l.players.filter((p) => p.starter).map(row)}</ul>
                      <p className="lineup-sub">Remplaçants</p>
                      <ul>{l.players.filter((p) => !p.starter).map(row)}</ul>
                      {l.coach && <p className="lineup-coach">Entraîneur : <b>{l.coach}</b></p>}
                    </>
                  ) : (
                    <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingLeft: 20 }}>
                      {l.startingXI.map((name, i) => <li key={i} style={{ fontSize: 15 }}>{name}</li>)}
                    </ol>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {match.substitutions && match.substitutions.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Remplacements</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            <div className="info-tile">
              <strong>{match.homeClub}</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {match.substitutions.filter((s) => s.team === 'home').map((s, i) => (
                  <span key={i} style={{ fontSize: 13 }}>{subLabel(s)}{s.minute ? ` · ${s.minute}'` : ''}</span>
                ))}
              </div>
            </div>
            <div className="info-tile">
              <strong>{match.awayClub}</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {match.substitutions.filter((s) => s.team === 'away').map((s, i) => (
                  <span key={i} style={{ fontSize: 13 }}>{subLabel(s)}{s.minute ? ` · ${s.minute}'` : ''}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="page-section tight">
        <p className="press-source-note"><Info size={13} /> {match.source}</p>
      </section>

      <section className="page-section tight">
        <Link href="/competitions/ligue-1" className="button-outline">Retour à la Ligue 1</Link>
      </section>
    </main>
  )
}

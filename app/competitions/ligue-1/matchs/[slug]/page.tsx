import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Info, MapPin } from 'lucide-react'
import type { RealLeagueMatchEvent, RealLeagueMatchSubstitution } from '@/lib/data/mock'
import { realLigue1Matches, getRealLeagueMatch, getClubByName } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { ClubCrest } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDateLong } from '@/lib/format'

export function generateStaticParams() {
  return realLigue1Matches.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const match = getRealLeagueMatch(slug)
  return { title: match ? `${match.homeClub} — ${match.awayClub} — FIF Digital` : 'Match' }
}

const eventLabel: Record<RealLeagueMatchEvent['type'], string> = {
  goal: 'BUT', yellow: 'CARTON JAUNE', red: 'CARTON ROUGE',
}

function subLabel(s: RealLeagueMatchSubstitution) {
  return s.playerOut ? `${s.playerOut} ➜ ${s.playerIn}` : `${s.playerIn} (entrée en jeu)`
}

export default async function LigueUnMatchPage({ params }: { params: Promise<{ slug: string }> }) {
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
            <div className="versus"><small>TERMINÉ</small><b style={{ fontSize: 28 }}>{match.homeScore} - {match.awayScore}</b>{match.venue && <span><MapPin size={11} style={{ verticalAlign: 'middle' }} /> {match.venue}</span>}</div>
            <div className="team">
              {away ? <Link href={`/clubs/${away.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}><div className="crest red" style={{ fontSize: 20 }}><ClubCrest club={away} size={32} /></div><strong>{match.awayClub}</strong></Link> : <strong>{match.awayClub}</strong>}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Résultat</p>
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
          {!match.events.length && <p className="lede" style={{ color: '#cfe0d6' }}>Aucun but ni carton recensé pour ce match.</p>}
        </div>
        {match.referee && (
          <p className="lede" style={{ color: '#8fa79a', marginTop: 24, fontSize: 12 }}>
            Arbitre : {match.referee.name}{match.referee.assistants?.length ? ` · Assistants : ${match.referee.assistants.join(', ')}` : ''}{match.referee.fourthOfficial ? ` · 4e arbitre : ${match.referee.fourthOfficial}` : ''}
          </p>
        )}
        {match.attendance && (
          <p className="lede" style={{ color: '#8fa79a', marginTop: 8, fontSize: 12 }}>Affluence : {match.attendance.toLocaleString('fr-FR')} spectateurs</p>
        )}
      </section>

      {match.lineups && (
        <section className="page-section tight">
          <p className="section-tag">Compositions de départ</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            <div className="dashboard-panel" style={{ borderTop: '3px solid var(--orange)', margin: 0 }}>
              <h3>{match.homeClub} {match.lineups.home.formation && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>({match.lineups.home.formation})</span>}</h3>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingLeft: 20 }}>
                {match.lineups.home.startingXI.map((name, i) => <li key={i} style={{ fontSize: 14 }}>{name}</li>)}
              </ol>
            </div>
            <div className="dashboard-panel" style={{ borderTop: '3px solid var(--green)', margin: 0 }}>
              <h3>{match.awayClub} {match.lineups.away.formation && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13 }}>({match.lineups.away.formation})</span>}</h3>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, paddingLeft: 20 }}>
                {match.lineups.away.startingXI.map((name, i) => <li key={i} style={{ fontSize: 14 }}>{name}</li>)}
              </ol>
            </div>
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

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

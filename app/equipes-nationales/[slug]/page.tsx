import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, MapPin, Trophy } from 'lucide-react'
import { getTeam, nationalTeams, nationalSquads, getPlayerById, getCoachById, nextFixtureFor, getStadiumById, getClubById } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubCrest } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate, formatTime, age } from '@/lib/format'

export function generateStaticParams() {
  return nationalTeams.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const team = getTeam(slug)
  return { title: team ? `${team.name} — FIF Digital` : 'Équipe nationale' }
}

const positionOrder = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'] as const

export default async function NationalTeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const team = getTeam(slug)
  if (!team) notFound()
  const squad = nationalSquads[team.id] ?? []
  const coach = team.coachId ? getCoachById(team.coachId) : null
  const fixture = nextFixtureFor(team.id)
  const fixtureStadium = fixture ? getStadiumById(fixture.stadiumId) : null

  const squadByPosition = positionOrder.map((pos) => ({
    position: pos,
    entries: squad
      .map((s) => ({ ...s, player: getPlayerById(s.playerId) }))
      .filter((s) => s.player && s.player.position === pos),
  }))

  return (
    <main>
      <PageHero
        eyebrow={team.category === 'A' ? 'Équipe fanion' : `Catégorie ${team.category}`}
        title={team.name}
        subtitle={`Sélectionneur : ${coach?.name ?? 'à confirmer'}${team.ranking ? ` · Classement FIFA : ${team.ranking}ᵉ` : ''}`}
        breadcrumb={[{ label: 'Équipes nationales', href: '/equipes-nationales' }, { label: team.name }]}
        meta={[
          { value: String(squad.length), label: 'Joueurs sélectionnés' },
          { value: String(team.honours.length), label: 'Titres majeurs' },
          { value: team.gender === 'F' ? 'Féminin' : 'Masculin', label: 'Catégorie' },
        ]}
      />

      {fixture && (
        <section className="page-section tight">
          <p className="section-tag">Prochain rendez-vous</p>
          <div className="next-card" style={{ maxWidth: 520, marginTop: 16 }}>
            <div className="next-card-top"><span>{fixture.competition.toUpperCase()}</span><span>{formatDate(fixture.date).toUpperCase()}</span></div>
            <div className="teams">
              <div className="team"><div className="crest ivory">CI</div><strong>Côte<br />d&apos;Ivoire</strong></div>
              <div className="versus"><small>{formatTime(fixture.date)}</small><b>VS</b><span>{fixtureStadium?.name}<br />{fixture.home ? 'Domicile' : 'Extérieur'}</span></div>
              <div className="team"><div className="crest red">{fixture.opponent.slice(0, 2).toUpperCase()}</div><strong>{fixture.opponent}</strong></div>
            </div>
          </div>
        </section>
      )}

      <section className="page-section tight">
        <p className="section-tag">Effectif — données de démonstration</p>
        {squadByPosition.map((group) => (
          <div key={group.position} style={{ marginTop: 20 }}>
            <b style={{ fontSize: 12, letterSpacing: '.06em', color: 'var(--muted)', textTransform: 'uppercase' }}>{group.position}s</b>
            <div className="card-grid cols-4" style={{ marginTop: 12 }}>
              {group.entries.map(({ player, caps, goals }) => {
                if (!player) return null
                const club = getClubById(player.clubId)
                return (
                  <Link key={player.id} href={`/joueurs/${player.slug}`} className="entity-card player-card">
                    <span className="avatar-wrap">
                      <span className="avatar" style={{ background: club?.colors[0] }}>{player.name.split(' ').map((n) => n[0]).join('')}</span>
                      {club && <span className="avatar-crest-badge avatar-crest-badge-sm"><ClubCrest club={club} size={16} /></span>}
                    </span>
                    <div>
                      <strong>{player.name}</strong>
                      <span>{age(player.birthdate)} ans · {caps} sél. · {goals} buts</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {team.honours.length > 0 && (
        <section className="page-section tight dark-section">
          <p className="section-tag" style={{ color: 'var(--orange)' }}>Palmarès</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {team.honours.map((h, i) => (
              <div className="info-tile" key={i}>
                <Trophy />
                <strong>{h.title}</strong>
                <p>{h.year}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

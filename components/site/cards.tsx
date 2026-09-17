import Link from 'next/link'
import { ArrowRight, MapPin, CalendarDays, Play, Trophy } from 'lucide-react'
import type { Article, Club, Competition, Match, Player, Video } from '@/lib/data/types'
import { getClubById, getStadiumById, cityName } from '@/lib/data/mock'
import { formatDate, formatTime, age } from '@/lib/format'

export function ClubCrest({ club, size = 44 }: { club: Club; size?: number }) {
  return (
    <span
      className="club-crest"
      style={{ width: size, height: size, background: club.colors[0], color: club.colors[1], fontSize: size * 0.34 }}
    >
      {club.crestInitials}
    </span>
  )
}

export function MatchCard({ match }: { match: Match }) {
  const home = getClubById(match.homeClubId)
  const away = getClubById(match.awayClubId)
  const stadium = getStadiumById(match.stadiumId)
  if (!home || !away) return null
  return (
    <Link href={`/matches/${match.id}`} className={`match-card status-${match.status === 'Live' ? 'live' : match.status === 'Terminé' ? 'done' : 'upcoming'}`}>
      <div className="match-card-top">
        <span>{formatDate(match.date)} · {formatTime(match.date)}</span>
        {match.status === 'Live' ? <b className="live-pill"><i /> {match.minute}&apos;</b> : <b>{match.status}</b>}
      </div>
      <div className="match-card-teams">
        <div><ClubCrest club={home} size={36} /><span>{home.shortName}</span></div>
        <strong>{match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : 'VS'}</strong>
        <div><ClubCrest club={away} size={36} /><span>{away.shortName}</span></div>
      </div>
      <div className="match-card-bottom"><MapPin /> {stadium?.name ?? ''}</div>
    </Link>
  )
}

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link href={`/clubs/${club.slug}`} className="entity-card">
      <ClubCrest club={club} size={52} />
      <div>
        <strong>{club.name}</strong>
        <span>{cityName(club.cityId)} · {club.category}</span>
      </div>
      <ArrowRight />
    </Link>
  )
}

export function PlayerCard({ player }: { player: Player }) {
  const club = getClubById(player.clubId)
  return (
    <Link href={`/joueurs/${player.slug}`} className="entity-card player-card">
      <span className="avatar" style={{ background: club?.colors[0] }}>{player.name.split(' ').map((n) => n[0]).join('')}</span>
      <div>
        <strong>{player.name}</strong>
        <span>{player.position} · {age(player.birthdate)} ans · {club?.shortName}</span>
      </div>
      <ArrowRight />
    </Link>
  )
}

export function NewsCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article className={featured ? 'news-card featured' : 'news-card'}>
      <Link href={`/actualites/${article.slug}`} className="news-image" style={{ backgroundImage: `url(${article.image})` }}>
        <span>{article.category}</span>
      </Link>
      <div className="news-body">
        <small>{formatDate(article.date).toUpperCase()}</small>
        <h3><Link href={`/actualites/${article.slug}`}>{article.title}</Link></h3>
        <Link href={`/actualites/${article.slug}`} aria-label={`Lire : ${article.title}`}><ArrowRight /></Link>
      </div>
    </article>
  )
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/fif-tv/${video.slug}`} className="video-card">
      <div className="video-thumb" style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.4),transparent),url(${video.image})` }}>
        <button aria-label="Lire la vidéo" type="button"><Play fill="currentColor" /></button>
        <span>{video.duration}</span>
      </div>
      <small>{video.category.toUpperCase()}</small>
      <h3>{video.title}</h3>
    </Link>
  )
}

export function CompetitionCard({ competition, clubCount }: { competition: Competition; clubCount: number }) {
  return (
    <Link href={`/competitions/${competition.slug}`} className="entity-card competition-card">
      <span className="comp-badge"><Trophy /></span>
      <div>
        <strong>{competition.name}</strong>
        <span>{competition.category} · {clubCount} équipes · {competition.season}</span>
      </div>
      <ArrowRight />
    </Link>
  )
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
      {hint && <small>{hint}</small>}
    </div>
  )
}

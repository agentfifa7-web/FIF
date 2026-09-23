import Link from 'next/link'
import { ArrowRight, MapPin, CalendarDays, Play, Trophy } from 'lucide-react'
import type { Article, Club, Competition, Match, Player, Video } from '@/lib/data/types'
import { getClubById, getStadiumById, cityName } from '@/lib/data/mock'
import { formatDate, formatTime, age } from '@/lib/format'

const SHIELD_PATH = 'M12,6 L88,6 L88,50 C88,73 70,89 50,96 C30,89 12,73 12,50 Z'

export function ClubCrest({ club, size = 44 }: { club: Club; size?: number }) {
  if (club.crestUrl) {
    return (
      <img
        src={club.crestUrl}
        alt={`Écusson ${club.name}`}
        width={size}
        height={size}
        className="club-crest"
        style={{ flexShrink: 0, height: size, objectFit: 'contain', width: size }}
      />
    )
  }

  const idNum = parseInt(club.id.replace(/\D/g, ''), 10) || 0
  const diagonal = idNum % 2 === 1
  const clipId = `crest-clip-${club.id}`
  const [primary, secondary] = club.colors
  const textColor = secondary && secondary.toLowerCase() !== primary.toLowerCase() ? secondary : '#fff'
  const hasHonours = club.honours.length > 0

  return (
    <svg
      className="club-crest"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Écusson ${club.name}`}
      style={{ flexShrink: 0 }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={SHIELD_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="100" height="100" fill={primary} />
        {diagonal ? (
          <polygon points="100,0 100,100 0,100" fill={secondary} opacity="0.92" />
        ) : (
          <rect x="50" y="0" width="50" height="100" fill={secondary} opacity="0.92" />
        )}
        <path d={SHIELD_PATH} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
      </g>
      <path d={SHIELD_PATH} fill="none" stroke="rgba(4,27,18,.35)" strokeWidth="2.5" />
      {hasHonours && (
        <path
          d="M50,14 L53,21 L61,21 L54.5,25.6 L57,33 L50,28.4 L43,33 L45.5,25.6 L39,21 L47,21 Z"
          fill={textColor}
          opacity="0.9"
        />
      )}
      <text
        x="50"
        y={hasHonours ? 66 : 58}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="30"
        fontWeight="800"
        fontFamily="var(--font-heading), Arial, sans-serif"
        fill={textColor}
      >
        {club.crestInitials.slice(0, 3)}
      </text>
    </svg>
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
      <span className="avatar-wrap">
        <span className="avatar" style={{ background: club?.colors[0] }}>{player.name.split(' ').map((n) => n[0]).join('')}</span>
        {club && <span className="avatar-crest-badge avatar-crest-badge-sm"><ClubCrest club={club} size={16} /></span>}
      </span>
      <div>
        <strong>{player.squadNumber ? `N°${player.squadNumber} ` : ''}{player.name}</strong>
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

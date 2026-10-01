'use client'

import { cityName } from '@/lib/data/mock'
import { supportClub, supportTeamName } from '@/lib/data/supporters'
import { fanLevelProgress, type FanProfile } from '@/lib/fan'
import { PersonPortrait } from './PersonPortrait'

export function FanIdCard({ profile, compact = false }: { profile: FanProfile; compact?: boolean }) {
  const { level, next, progressPct, xpToNext } = fanLevelProgress(profile.xp)
  const team = supportTeamName(profile.favoriteTeamId)
  const club = supportClub(profile.favoriteClubId)
  const since = new Date(profile.createdAt).getFullYear()

  return (
    <div className={`fan-id-card${compact ? ' compact' : ''}`}>
      <div className="fan-id-card-top">
        <span>FIF FAN ID</span>
        <span>{profile.fifId}</span>
      </div>
      <div className="fan-id-card-body">
        <PersonPortrait seed={profile.photoSeed} size={compact ? 56 : 84} />
        <div>
          <strong>{profile.pseudo}</strong>
          {profile.cityId && <span>{cityName(profile.cityId)}</span>}
          <span className="fan-id-level">{level.icon} {level.name}</span>
        </div>
      </div>
      <div className="fan-id-teams">
        {team && <span>🇨🇮 {team}</span>}
        {club && <span>{club.crestUrl ? <img src={club.crestUrl} alt="" /> : '⚽'} {club.name}</span>}
        {!team && !club && <span>Équipe à choisir</span>}
      </div>
      <div className="fan-id-card-progress">
        <div className="gauge-track"><div className="gauge-fill" style={{ width: `${progressPct}%` }} /></div>
        <span>{profile.xp.toLocaleString('fr-FR')} XP{next ? ` · ${xpToNext.toLocaleString('fr-FR')} XP avant ${next.name}` : ' · Niveau maximum'}</span>
      </div>
      <div className="fan-id-card-foot">
        <span>Supporter depuis {since}</span>
        <span>{profile.badges.length} badge{profile.badges.length > 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

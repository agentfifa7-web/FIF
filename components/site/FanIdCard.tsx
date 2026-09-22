'use client'

import { cityName, nationalTeams } from '@/lib/data/mock'
import { fanLevelProgress, type FanProfile } from '@/lib/fan'
import { PersonPortrait } from './PersonPortrait'

function fanIdNumber(pseudo: string, createdAt: string) {
  let h = 0
  const s = pseudo + createdAt
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return `CI-${String(h % 100000000).padStart(8, '0')}`
}

export function FanIdCard({ profile, compact = false }: { profile: FanProfile; compact?: boolean }) {
  const { level, next, progressPct, xpToNext } = fanLevelProgress(profile.xp)
  const team = nationalTeams.find((t) => t.id === profile.favoriteTeamId)
  const since = new Date(profile.createdAt).getFullYear()

  return (
    <div className={`fan-id-card${compact ? ' compact' : ''}`}>
      <div className="fan-id-card-top">
        <span>FIF FAN ID</span>
        <span>{fanIdNumber(profile.pseudo, profile.createdAt)}</span>
      </div>
      <div className="fan-id-card-body">
        <PersonPortrait seed={profile.photoSeed} size={compact ? 56 : 84} />
        <div>
          <strong>{profile.pseudo}</strong>
          <span>{cityName(profile.cityId)} · {team?.name ?? 'Éléphants'}</span>
          <span className="fan-id-level">{level.icon} {level.name}</span>
        </div>
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

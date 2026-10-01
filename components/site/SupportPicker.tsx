'use client'

import { Flag, Shield, Heart } from 'lucide-react'
import { supportClubGroups, supportNationalTeams } from '@/lib/data/supporters'

export type SupportMode = 'nation' | 'club' | 'both'

export function supportModeOf(nationalTeamId?: string, clubId?: string): SupportMode {
  if (nationalTeamId && clubId) return 'both'
  if (clubId) return 'club'
  return 'nation'
}

/** Choix de l'équipe supportée : une sélection nationale, un club, ou les deux. */
export function SupportPicker({ mode, nationalTeamId, clubId, onChange, idPrefix = 'sup' }: {
  mode: SupportMode
  nationalTeamId: string
  clubId: string
  onChange: (next: { mode: SupportMode; nationalTeamId: string; clubId: string }) => void
  idPrefix?: string
}) {
  const set = (patch: Partial<{ mode: SupportMode; nationalTeamId: string; clubId: string }>) => onChange({ mode, nationalTeamId, clubId, ...patch })
  const modes: { id: SupportMode; label: string; icon: React.ReactNode }[] = [
    { id: 'nation', label: 'Une équipe nationale', icon: <Flag size={15} /> },
    { id: 'club', label: 'Un club', icon: <Shield size={15} /> },
    { id: 'both', label: 'Les deux', icon: <Heart size={15} /> },
  ]
  return (
    <div className="support-picker">
      <div className="support-modes" role="radiogroup" aria-label="Je supporte">
        {modes.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} className={mode === m.id ? 'support-mode is-active' : 'support-mode'}
            onClick={() => set({ mode: m.id, nationalTeamId: m.id === 'club' ? '' : nationalTeamId || supportNationalTeams[0].id, clubId: m.id === 'nation' ? '' : clubId })}>
            {m.icon}{m.label}
          </button>
        ))}
      </div>
      {mode !== 'club' && (
        <div className="text-field">
          <label htmlFor={`${idPrefix}-nation`}>Équipe nationale</label>
          <select id={`${idPrefix}-nation`} required value={nationalTeamId} onChange={(e) => set({ nationalTeamId: e.target.value })}>
            <option value="" disabled>Choisir une sélection</option>
            {supportNationalTeams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}
      {mode !== 'nation' && (
        <div className="text-field">
          <label htmlFor={`${idPrefix}-club`}>Club</label>
          <select id={`${idPrefix}-club`} required value={clubId} onChange={(e) => set({ clubId: e.target.value })}>
            <option value="" disabled>Choisir un club</option>
            {supportClubGroups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

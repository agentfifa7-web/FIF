import { useEffect, useState } from 'react'
import { fanBadges, fanLevels, levelForXp, nextFanLevel } from './data/mock'

export interface FanPronostic {
  matchId: string
  homeScore: number
  awayScore: number
  submittedAt: string
}

export interface FanZoneDraft {
  id: string
  type: 'Photo' | 'Vidéo' | 'Chant' | 'Message' | 'Tifo'
  caption: string
  submittedAt: string
}

export interface FanMembership {
  tier: string
  memberNumber: string
  since: string
  giftedTo?: string
}

export interface FanProfile {
  pseudo: string
  cityId: string
  favoriteTeamId: string
  photoSeed: string
  createdAt: string
  xp: number
  quizAnswered: Record<string, boolean>
  pronostics: FanPronostic[]
  stadiumCheckIns: string[]
  chantsViewed: string[]
  fanZonePosts: FanZoneDraft[]
  badges: string[]
  membership: FanMembership | null
}

const STORAGE_KEY = 'fif-fan-profile-v1'
export const FAN_EVENT = 'fif-fan-updated'

function emptyProfile(pseudo: string, cityId: string, favoriteTeamId: string): FanProfile {
  return {
    pseudo,
    cityId,
    favoriteTeamId,
    photoSeed: `fan-${pseudo}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    xp: 0,
    quizAnswered: {},
    pronostics: [],
    stadiumCheckIns: [],
    chantsViewed: [],
    fanZonePosts: [],
    badges: [],
    membership: null,
  }
}

export function getFanProfile(): FanProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FanProfile) : null
  } catch {
    return null
  }
}

function save(profile: FanProfile) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new CustomEvent(FAN_EVENT, { detail: profile }))
}

export function createFanProfile(pseudo: string, cityId: string, favoriteTeamId: string): FanProfile {
  const profile = emptyProfile(pseudo, cityId, favoriteTeamId)
  save(profile)
  return profile
}

export function resetFanProfile() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent(FAN_EVENT, { detail: null }))
}

function evaluateBadges(profile: FanProfile): string[] {
  const earned = new Set(profile.badges)
  const matchesFollowed = profile.pronostics.length
  if (matchesFollowed >= 1) earned.add('premier-match')
  if (matchesFollowed >= 10) earned.add('10-matchs')
  if (matchesFollowed >= 50) earned.add('50-matchs')
  if (matchesFollowed >= 100) earned.add('100-matchs')
  if (profile.pronostics.length >= 20) earned.add('pronostiqueur')
  if (profile.stadiumCheckIns.length >= 1) earned.add('premier-stade')
  if (profile.stadiumCheckIns.length >= 3) earned.add('route-des-elephants')
  if (profile.chantsViewed.length >= 1) earned.add('chant-du-stade')
  if (profile.fanZonePosts.length >= 1) earned.add('photographe-fan-zone')
  if (profile.fanZonePosts.length >= 3) earned.add('createur')
  const quizCorrect = Object.values(profile.quizAnswered).filter(Boolean).length
  if (quizCorrect >= 20) earned.add('quiz-master')
  if (profile.xp >= 1000) earned.add('ambassadeur')
  return [...earned]
}

function applyXp(profile: FanProfile, amount: number): FanProfile {
  const updated: FanProfile = { ...profile, xp: profile.xp + amount }
  updated.badges = evaluateBadges(updated)
  const newlyEarned = updated.badges.filter((b) => !profile.badges.includes(b))
  if (newlyEarned.length) {
    const bonus = newlyEarned.reduce((sum, slug) => sum + (fanBadges.find((b) => b.slug === slug)?.xpReward ?? 0), 0)
    updated.xp += bonus
  }
  return updated
}

export function addXp(amount: number): FanProfile | null {
  const profile = getFanProfile()
  if (!profile) return null
  const updated = applyXp(profile, amount)
  save(updated)
  return updated
}

export function recordQuizAnswer(questionId: string, correct: boolean): FanProfile | null {
  const profile = getFanProfile()
  if (!profile) return null
  const updated: FanProfile = { ...profile, quizAnswered: { ...profile.quizAnswered, [questionId]: correct } }
  const withXp = applyXp(updated, 20 + (correct ? 50 : 0))
  save(withXp)
  return withXp
}

export function recordPronostic(matchId: string, homeScore: number, awayScore: number): FanProfile | null {
  const profile = getFanProfile()
  if (!profile) return null
  const withoutPrevious = profile.pronostics.filter((p) => p.matchId !== matchId)
  const updated: FanProfile = {
    ...profile,
    pronostics: [...withoutPrevious, { matchId, homeScore, awayScore, submittedAt: new Date().toISOString() }],
  }
  const withXp = applyXp(updated, 20)
  save(withXp)
  return withXp
}

export function checkInStadium(stadiumId: string): FanProfile | null {
  const profile = getFanProfile()
  if (!profile || profile.stadiumCheckIns.includes(stadiumId)) return profile
  const updated: FanProfile = { ...profile, stadiumCheckIns: [...profile.stadiumCheckIns, stadiumId] }
  const withXp = applyXp(updated, 40)
  save(withXp)
  return withXp
}

export function viewChant(chantId: string): FanProfile | null {
  const profile = getFanProfile()
  if (!profile || profile.chantsViewed.includes(chantId)) return profile
  const updated: FanProfile = { ...profile, chantsViewed: [...profile.chantsViewed, chantId] }
  const withXp = applyXp(updated, 10)
  save(withXp)
  return withXp
}

export function publishFanZonePost(type: FanZoneDraft['type'], caption: string): FanProfile | null {
  const profile = getFanProfile()
  if (!profile) return null
  const draft: FanZoneDraft = { id: `local-${Date.now()}`, type, caption, submittedAt: new Date().toISOString() }
  const updated: FanProfile = { ...profile, fanZonePosts: [draft, ...profile.fanZonePosts] }
  const withXp = applyXp(updated, 20)
  save(withXp)
  return withXp
}

export function subscribeMembership(tier: string, giftedTo?: string): FanProfile | null {
  const profile = getFanProfile()
  if (!profile) return null
  const membership: FanMembership = {
    tier,
    memberNumber: `CDS-${Date.now().toString(36).toUpperCase()}`,
    since: new Date().toISOString(),
    giftedTo: giftedTo || undefined,
  }
  const updated: FanProfile = { ...profile, membership }
  const withXp = applyXp(updated, 100)
  save(withXp)
  return withXp
}

export function fanLevelProgress(xp: number) {
  const level = levelForXp(xp)
  const next = nextFanLevel(xp)
  if (!next) return { level, next, progressPct: 100, xpToNext: 0 }
  const span = next.minXp - level.minXp
  const done = xp - level.minXp
  return { level, next, progressPct: Math.min(100, Math.round((done / span) * 100)), xpToNext: next.minXp - xp }
}

export function badgeCatalogWithStatus(profile: FanProfile | null) {
  return fanBadges.map((b) => ({ ...b, earned: profile?.badges.includes(b.slug) ?? false }))
}

export { fanLevels }

export function useFanProfile() {
  const [profile, setProfile] = useState<FanProfile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => { setProfile(getFanProfile()); setReady(true) }
    sync()
    window.addEventListener(FAN_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(FAN_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { profile, ready }
}

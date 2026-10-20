'use client'

import Link from 'next/link'
import { ArrowRight, IdCard } from 'lucide-react'
import { useFanProfile, fanLevelProgress } from '@/lib/fan'
import { FanIdCard } from './FanIdCard'

/** Bloc d'accueil du Fan Universe : carte Fan ID du supporter connecté,
 *  ou invitation à créer son FIF ID. */
export function FanWelcome() {
  const { profile, ready } = useFanProfile()
  if (!ready) return <div className="fan-welcome" aria-hidden />
  if (!profile) {
    return (
      <div className="fan-welcome">
        <div className="fan-welcome-text">
          <span className="fan-kicker"><IdCard aria-hidden /> Votre Fan ID</span>
          <h2>Un seul compte pour tout le football ivoirien</h2>
          <p>Votre Fan ID est inclus dans votre FIF ID. Choisissez votre sélection ou votre club, puis gagnez de l’XP et des badges en jouant aux quiz, en faisant vos pronostics et en visitant les stades.</p>
          <div className="button-group">
            <Link href="/inscription?next=/supporters" className="button button-primary">Créer mon FIF ID</Link>
            <Link href="/connexion?next=/supporters" className="button-outline">Se connecter</Link>
          </div>
        </div>
      </div>
    )
  }
  const { level, next, xpToNext } = fanLevelProgress(profile.xp)
  return (
    <div className="fan-welcome has-card">
      <FanIdCard profile={profile} />
      <div className="fan-welcome-text">
        <span className="fan-kicker"><IdCard aria-hidden /> Bonjour {profile.pseudo}</span>
        <h2>{level.icon} {level.name} · {profile.xp.toLocaleString('fr-FR')} XP</h2>
        <p>{next ? `Encore ${xpToNext.toLocaleString('fr-FR')} XP pour devenir « ${next.name} ».` : 'Vous avez atteint le niveau le plus élevé.'} {profile.badges.length} badge{profile.badges.length > 1 ? 's' : ''} obtenu{profile.badges.length > 1 ? 's' : ''}.</p>
        <div className="button-group">
          <Link href="/supporters/fan-id" className="button button-primary">Mon Fan ID <ArrowRight size={16} /></Link>
          <Link href="/supporters/badges" className="button-outline">Mes badges</Link>
        </div>
      </div>
    </div>
  )
}

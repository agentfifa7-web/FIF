'use client'

import Link from 'next/link'
import { ArrowRight, Gamepad2, Gift, IdCard, Sparkles, Ticket } from 'lucide-react'
import type { QuizQuestion } from '@/lib/data/types'
import { useFanProfile, fanLevelProgress } from '@/lib/fan'
import { FanIdCard } from './FanIdCard'

interface NextFixtureInfo {
  opponent: string
  competition: string
  date: string
  stadiumName: string
  home: boolean
}

interface FanZonePostPreview {
  authorName: string
  type: string
  caption: string
}

export function FanHomeDashboard({ nextFixture, dailyQuestion, recentPosts }: { nextFixture: NextFixtureInfo; dailyQuestion: QuizQuestion; recentPosts: FanZonePostPreview[] }) {
  const { profile, ready } = useFanProfile()

  if (!ready) return null

  return (
    <>
      <section className="page-section tight">
        {profile ? (
          <div className="card-grid cols-2">
            <FanIdCard profile={profile} />
            <div>
              <p className="section-tag">Bonjour {profile.pseudo} 👋</p>
              <p className="lede">{fanLevelProgress(profile.xp).level.icon} {fanLevelProgress(profile.xp).level.name} · {profile.xp.toLocaleString('fr-FR')} XP</p>
              <Link href="/supporters/fan-id" className="text-link" style={{ marginTop: 12, display: 'inline-flex' }}>Voir mon Fan ID complet <ArrowRight size={14} /></Link>
            </div>
          </div>
        ) : (
          <div className="fan-gate">
            <IdCard size={28} />
            <strong>Créez votre FIF Fan ID</strong>
            <p>Identité numérique, XP, badges, quiz, pronostics et avantages — gratuit, sans donnée bancaire, en quelques secondes.</p>
            <Link href="/supporters/fan-id" className="button button-primary">Créer mon Fan ID</Link>
          </div>
        )}
      </section>

      <section className="page-section tight">
        <div className="card-grid cols-2">
          <div className="entity-card" style={{ alignItems: 'flex-start', flexDirection: 'column', padding: 24 }}>
            <p className="section-tag">Prochain match — Éléphants</p>
            <strong style={{ fontSize: 18, margin: '8px 0 4px' }}>Côte d’Ivoire vs {nextFixture.opponent}</strong>
            <span className="muted-sm">{nextFixture.competition} · {nextFixture.stadiumName}</span>
            <Link href="/supporters/matchday" className="button button-primary" style={{ marginTop: 16 }}>Activer Matchday <Ticket size={14} /></Link>
          </div>
          <div className="entity-card" style={{ alignItems: 'flex-start', flexDirection: 'column', padding: 24 }}>
            <p className="section-tag">Défi du jour</p>
            <strong style={{ fontSize: 18, margin: '8px 0 4px' }}>{dailyQuestion.question}</strong>
            <span className="muted-sm">Catégorie {dailyQuestion.category} · +70 XP si réussi</span>
            <Link href="/supporters/arena/quiz" className="button button-primary" style={{ marginTop: 16 }}>Jouer <Gamepad2 size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="page-section-head">
          <div><p className="section-tag">Vos avantages</p><h2 style={{ fontSize: 24 }}>Billetterie, boutique, récompenses</h2></div>
        </div>
        <div className="info-tiles">
          <div className="info-tile"><Ticket /><strong>Billetterie</strong><p>Accès anticipé et zones dédiées aux supporters actifs.</p></div>
          <div className="info-tile"><Gift /><strong>Récompenses</strong><p>Échangez votre XP contre des goodies, expériences et contenus exclusifs.</p></div>
          <div className="info-tile"><Sparkles /><strong>Fan Pass</strong><p>Réductions chez les partenaires FIF selon votre niveau.</p></div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <div className="page-section-head">
          <div><p className="section-tag" style={{ color: 'var(--orange)' }}>Fan Zone</p><h2 style={{ fontSize: 24, color: '#fff' }}>Ça se passe maintenant</h2></div>
          <Link href="/supporters/fan-zone" className="text-link" style={{ color: '#fff' }}>Voir tout <ArrowRight size={14} /></Link>
        </div>
        <div className="card-grid" style={{ marginTop: 16 }}>
          {recentPosts.map((p, i) => (
            <div className="entity-card" key={i}>
              <div><strong>{p.authorName}</strong><span>{p.type} · {p.caption.slice(0, 60)}{p.caption.length > 60 ? '…' : ''}</span></div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

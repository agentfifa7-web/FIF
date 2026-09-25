import { CalendarDays, MapPin, QrCode, Tv } from 'lucide-react'
import { nextElephantsFixture, elephantsCallUp } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchdayVote } from '@/components/site/MatchdayVote'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDateLong } from '@/lib/format'

export const metadata = { title: 'Mode Matchday — FIF Digital' }

export default function MatchdayPage() {
  const fixture = nextElephantsFixture()
  const candidates = elephantsCallUp.slice(0, 6).map((p) => ({ id: p.slug, name: p.name }))

  return (
    <main>
      <PageHero
        eyebrow="🏟️ Fan Life"
        title="Mode Matchday"
        subtitle="Avant, pendant et après le match : le supporter reste connecté à l’expérience du football ivoirien."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Matchday' }]}
      />

      {fixture && (
        <section className="page-section tight">
          <div className="sim-panel" style={{ marginLeft: 0, marginRight: 0 }}>
            <p><CalendarDays size={15} /> Côte d’Ivoire vs {fixture.opponent} · {formatDateLong(fixture.date)}</p>
            <p><MapPin size={15} /> {fixture.venue}</p>
          </div>
        </section>
      )}

      <section className="page-section tight">
        <div className="timeline">
          <div><b>J-1</b><div><strong>Préparation</strong><span>Composition probable, interview, quiz, historique, informations pratiques.</span></div></div>
          <div><b>J-0</b><div><strong>Jour de match</strong><span>Itinéraire vers le stade, parking, portes, horaires, billetterie, animations, Fan Zone.</span></div></div>
          <div><b>Live</b><div><strong>Pendant le match</strong><span>Score en direct, statistiques, événements, vote « Joueur du match ».</span></div></div>
          <div><b>Après</b><div><strong>Résumé</strong><span>Photos, vidéos, classement, quiz post-match.</span></div></div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}><QrCode size={13} style={{ verticalAlign: 'middle' }} /> « Je suis au stade »</p>
        <p className="lede" style={{ color: '#a9b7af' }}>Le supporter scanne son billet vérifié à l’entrée du stade et passe en mode Matchday : quiz, sondages, vote joueur du match, caméra Fan Zone, chants, défis et animations.</p>
      </section>

      {candidates.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Vote « Joueur du match » — Choix des supporters</p>
          <p className="lede" style={{ marginBottom: 16 }}>Ce vote populaire des fans est distinct de toute distinction sportive officielle.</p>
          <MatchdayVote candidates={candidates} />
        </section>
      )}

      <section className="page-section tight">
        <div className="info-tiles">
          <div className="info-tile"><Tv /><strong>Et après le match ?</strong><p>J+1 résumé, J+2 quiz, J+3 défi, J+4 archive, J+5 interview, J+6 pronostic, J+7 nouveau Matchday.</p></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

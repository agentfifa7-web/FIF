import { Gift, MessageCircle, Ticket, Trophy } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Club des Supporters — FIF Digital' }

export default function SupportersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Club des Supporters FIF"
        title="Supporters"
        subtitle="Rejoignez la communauté officielle des supporters du football ivoirien : contenus exclusifs, jeux, concours et avantages."
        breadcrumb={[{ label: 'Supporters' }]}
      />

      <section className="page-section tight">
        <div className="info-tiles">
          <div className="info-tile"><Gift /><strong>Avantages</strong><p>Offres boutique, préventes billetterie et accès privilégiés à certains événements.</p></div>
          <div className="info-tile"><Trophy /><strong>Gamification</strong><p>Quiz, pronostics non financiers, badges et classements communautaires — aucun jeu d’argent.</p></div>
          <div className="info-tile"><MessageCircle /><strong>Fan Zone</strong><p>Photos, vidéos, chants et contenus communautaires modérés par la Fédération.</p></div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Carte Supporter FIF</p>
        <div className="fif-id-card" style={{ marginTop: 16 }}>
          <div className="fif-id-card-top"><span>FIF Supporter ID</span><Ticket /></div>
          <div className="fif-id-card-body">
            <span className="avatar" style={{ background: 'var(--orange)' }}>SF</span>
            <div><strong>Supporter FIF</strong><span>FIF-SUPP-000482</span></div>
          </div>
          <div className="fif-id-card-foot"><span>Membre depuis 2026</span><span className="status-pill ok">Actif</span></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

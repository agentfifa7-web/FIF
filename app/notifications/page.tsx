import { Bell } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Notifications — FIF Digital' }

const notifications = [
  { type: 'SQUAD_ANNOUNCEMENT', title: 'Nouvelle liste des Éléphants annoncée', time: 'Il y a 2 h' },
  { type: 'MATCH_START', title: 'Coup d’envoi : Étoile San-Pédro vs Avenir Man', time: 'Il y a 3 h' },
  { type: 'GOAL', title: 'BUT ! Étoile San-Pédro 1-0', time: 'Il y a 3 h' },
  { type: 'FULL_TIME', title: 'Fin de match : Étoile San-Pédro 2-1 Avenir Man', time: 'Il y a 3 h' },
  { type: 'TICKET', title: 'Votre billet pour le prochain match est disponible', time: 'Hier' },
  { type: 'LICENSE', title: 'Votre licence a été renouvelée', time: 'Hier' },
  { type: 'TRAINING', title: 'Nouvelle session de formation CAF C ouverte', time: 'Il y a 2 jours' },
  { type: 'TRANSFER', title: 'Un transfert vous concernant a été validé', time: 'Il y a 3 jours' },
  { type: 'NEWS', title: 'La FIF dévoile le calendrier de la saison', time: 'Il y a 4 jours' },
]

export default function NotificationsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Centre de notifications"
        title="FIF Notifications"
        subtitle="Toutes les notifications fédérales au même endroit : matchs, licences, formation, billetterie et transferts."
        breadcrumb={[{ label: 'Notifications' }]}
      />
      <section className="page-section tight">
        <div className="dashboard-panel">
          <div className="dashboard-list">
            {notifications.map((n, i) => (
              <div key={i}>
                <div><b><Bell size={13} style={{ verticalAlign: 'middle', marginRight: 8 }} />{n.title}</b><small>{n.type}</small></div>
                <small>{n.time}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

import Link from 'next/link'
import { CalendarDays, IdCard, Ticket, Users } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoNotice } from '@/components/site/DemoNotice'

export const metadata = { title: 'Club des Supporters — FIF Fan Universe', description: 'Le projet de Club des Supporters des Éléphants : principes et services envisagés.' }

const IDEAS = [
  { icon: IdCard, title: 'Carte de membre', text: 'Une carte de membre numérique rattachée au FIF ID.' },
  { icon: Ticket, title: 'Billetterie', text: 'Un accès facilité aux matchs des sélections nationales.' },
  { icon: CalendarDays, title: 'Rencontres', text: 'Des rendez-vous supporters autour des matchs et des entraînements ouverts.' },
  { icon: Users, title: 'Associations', text: 'Un lien direct avec les associations de supporters reconnues.' },
]

export default function ClubDesSupportersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Communauté"
        title="Club des Supporters"
        subtitle="Un programme d’adhésion pour soutenir les sélections nationales au plus près, rattaché à votre FIF ID."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Club des Supporters' }]}
        noPhotos
      />
      <section className="page-section">
        <DemoNotice title="Programme en préparation">Aucune formule d’adhésion n’est ouverte pour l’instant : les tarifs et avantages seront annoncés officiellement par la FIF. Les services ci-dessous sont des pistes de travail.</DemoNotice>
        <div className="svc-who" style={{ marginTop: 24 }}>
          {IDEAS.map((a) => <div key={a.title}><a.icon aria-hidden /><strong>{a.title}</strong><p>{a.text}</p></div>)}
        </div>
        <div className="button-group" style={{ marginTop: 32 }}>
          <Link href="/supporters/fan-id" className="button button-primary">Créer mon Fan ID</Link>
          <Link href="/supporters/associations" className="button-outline">Associations de supporters</Link>
          <Link href="/billetterie" className="button-outline">Billetterie</Link>
        </div>
      </section>
    </main>
  )
}

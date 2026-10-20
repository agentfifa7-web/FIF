import Link from 'next/link'
import { Handshake } from 'lucide-react'
import { partnerOffers } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'

export const metadata = { title: 'Avantages partenaires — FIF Fan Universe', description: 'Les avantages proposés aux supporters par les partenaires officiels de la FIF.' }

export default function PartenairesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Communauté"
        title="Avantages partenaires"
        subtitle="Les avantages réservés aux supporters par les partenaires officiels de la FIF, selon votre niveau de Fan ID."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Partenaires' }]}
        noPhotos
      />
      <section className="page-section">
        {partnerOffers.length ? (
          <div className="card-grid cols-2">
            {partnerOffers.map((o) => (
              <div className="entity-card" key={o.id}><Handshake size={18} aria-hidden /><div><strong>{o.title}</strong><span>{o.partner} · {o.discount}</span></div></div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Handshake aria-hidden />
            <strong>Aucun avantage partenaire n’est proposé pour l’instant</strong>
            <p>Les offres seront publiées ici uniquement lorsqu’un partenariat officiel aura été annoncé par la FIF. En attendant, progressez avec votre <Link href="/supporters/fan-id">Fan ID</Link> en jouant aux <Link href="/supporters/arena">quiz et pronostics</Link>.</p>
          </div>
        )}
      </section>
    </main>
  )
}

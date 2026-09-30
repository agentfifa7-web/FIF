import { clubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { TransfertWorkflow } from '@/components/site/TransfertWorkflow'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Transfer Center — FIF Digital' }

export default function TransfersPage() {
  const clubOptions = clubs.map((c) => ({ id: c.id, name: c.name }))

  return (
    <main>
      <PageHero
        eyebrow="FIF Transfer Center"
        title="Transferts"
        subtitle="Un circuit entièrement traçable pour les transferts de joueurs entre clubs affiliés."
        breadcrumb={[{ label: 'Transferts' }]}
      />

      <section className="page-section tight">
        <p className="section-tag">Déposer une demande de transfert</p>
        <TransfertWorkflow clubs={clubOptions} />
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Transferts récents</p>
        <p className="lede" style={{ color: '#cfe0d6', marginTop: 16 }}>Aucun transfert officiel n’a encore été enregistré sur la plateforme. Les transferts validés par la FIF apparaîtront ici.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

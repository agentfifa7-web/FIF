import { clubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubExplorer } from '@/components/site/ClubExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Clubs — FIF Digital' }

export default function ClubsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Trouver un club"
        title="Clubs"
        subtitle="Où souhaitez-vous jouer ? Explorez les clubs professionnels, féminins, jeunes et futsal affiliés à la FIF partout en Côte d’Ivoire."
        breadcrumb={[{ label: 'Clubs' }]}
        meta={[{ value: String(clubs.length), label: 'Clubs affiliés' }]}
      />
      <section className="page-section tight">
        <ClubExplorer clubs={clubs} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

import { clubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubExplorer } from '@/components/site/ClubExplorer'

export const metadata = { title: 'Clubs — FIF Digital' }

export default function ClubsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Trouver un club"
        title="Clubs"
        subtitle="Les clubs de Ligue 1 et de Ligue 2 de la saison 2026-2027. Les clubs féminins, jeunes, futsal et amateurs seront ajoutés à partir des listes officielles."
        breadcrumb={[{ label: 'Clubs' }]}
        meta={[{ value: String(clubs.length), label: 'Clubs affiliés' }]}
      />
      <section className="page-section tight">
        <ClubExplorer clubs={clubs} />
      </section>
    </main>
  )
}

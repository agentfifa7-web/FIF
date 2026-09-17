import { players } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { PlayerExplorer } from '@/components/site/PlayerExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Joueurs — FIF Digital' }

export default function PlayersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Annuaire fédéral"
        title="Joueurs"
        subtitle="Recherchez un joueur ou une joueuse licencié·e auprès de la FIF, tous clubs et catégories confondus."
        breadcrumb={[{ label: 'Joueurs' }]}
        meta={[{ value: String(players.length), label: 'Joueurs licenciés' }]}
      />
      <section className="page-section tight">
        <PlayerExplorer players={players} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

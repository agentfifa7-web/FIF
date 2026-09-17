import { articles, matches } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Archives — FIF Digital' }

const decades = ['2020s', '2010s', '2000s', '1990s', '1980s', '1960s-1970s']

export default function ArchivesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Archives du football ivoirien"
        title="Archives"
        subtitle="Années, compétitions, équipes, joueurs, palmarès, photos et vidéos qui ont marqué l’histoire du football ivoirien."
        breadcrumb={[{ label: 'Archives' }]}
        meta={[
          { value: String(articles.length), label: 'Articles archivés' },
          { value: String(matches.filter((m) => m.status === 'Terminé').length), label: 'Matchs archivés' },
        ]}
      />
      <section className="page-section tight">
        <div className="chip-row">
          {decades.map((d) => <span className="chip" key={d}>{d}</span>)}
        </div>
        <p className="lede" style={{ marginTop: 20 }}>La base d’archives historiques (résultats, photos et vidéos antérieurs à la saison en cours) sera enrichie progressivement à partir des fonds documentaires de la Fédération.</p>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

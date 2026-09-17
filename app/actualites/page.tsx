import { articles } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { NewsExplorer } from '@/components/site/NewsExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Actualités — FIF Digital' }

export default function NewsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Newsroom fédérale"
        title="Actualités"
        subtitle="Éléphants, football féminin, clubs, jeunes, compétitions, arbitrage, formation : toute l’actualité du football ivoirien."
        breadcrumb={[{ label: 'Actualités' }]}
        meta={[{ value: String(articles.length), label: 'Articles publiés' }]}
      />
      <section className="page-section tight">
        <NewsExplorer articles={articles} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

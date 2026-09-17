import { Info } from 'lucide-react'
import { articles } from '@/lib/data/mock'
import { getPressReview } from '@/lib/news/rss'
import { PageHero } from '@/components/site/PageHero'
import { NewsExplorer } from '@/components/site/NewsExplorer'
import { PressReview } from '@/components/site/PressReview'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Actualités — FIF Digital' }

export default async function NewsPage() {
  const press = await getPressReview()

  return (
    <main>
      <PageHero
        eyebrow="Newsroom fédérale"
        title="Actualités"
        subtitle="Éléphants, football féminin, clubs, jeunes, compétitions, arbitrage, formation : toute l’actualité du football ivoirien."
        breadcrumb={[{ label: 'Actualités' }]}
        meta={[{ value: String(articles.length), label: 'Articles publiés' }]}
      />

      <section className="page-section tight" id="revue-de-presse">
        <div className="page-section-head">
          <div><p className="section-tag">Revue de presse — médias ivoiriens</p><h2 style={{ fontSize: 24 }}>Le football ivoirien vu par la presse</h2></div>
        </div>
        <p className="press-source-note"><Info size={13} /> Titres et liens agrégés en temps réel depuis des médias sportifs ivoiriens (Fraternité Matin, Koaci, Abidjan.net, RTI, Afrik-Foot…) et la couverture internationale des Ivoiriens à l’étranger, via Google Actualités. Chaque lien ouvre l’article original chez l’éditeur.</p>
        <PressReview items={press.items} ok={press.ok} />
      </section>

      <section className="page-section tight">
        <div className="page-section-head">
          <div><p className="section-tag">Rédaction FIF Digital</p><h2 style={{ fontSize: 24 }}>Actualités fédérales</h2></div>
        </div>
        <NewsExplorer articles={articles} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

import { Info } from 'lucide-react'
import { articles } from '@/lib/data/mock'
import { getPressReview } from '@/lib/news/rss'
import { PageHero } from '@/components/site/PageHero'
import { NewsExplorer } from '@/components/site/NewsExplorer'
import { PressReview } from '@/components/site/PressReview'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Actualités — FIF' }

export default async function NewsPage() {
  await loadCms()
  const press = await getPressReview()

  return (
    <main>
      <PageHero
        eyebrow="Newsroom fédérale"
        title="Actualités"
        subtitle="Résultats des championnats et des sélections, classements et revue de presse : l’actualité réelle du football ivoirien, mise à jour plusieurs fois par jour."
        breadcrumb={[{ label: 'Actualités' }]}
        meta={[{ value: String(articles.length), label: 'Articles publiés' }]}
      />

      <section className="page-section tight">
        <div className="page-section-head">
          <div><span className="h-kicker">Rédaction FIF</span><h2>Actualités fédérales</h2></div>
        </div>
        <NewsExplorer articles={articles} />
      </section>
      <section className="page-section section-alt" id="revue-de-presse">
        <div className="page-section-head">
          <div><span className="h-kicker">Revue de presse</span><h2>Le football ivoirien vu par la presse</h2></div>
        </div>
        <p className="press-source-note"><Info size={13} /> Titres et liens agrégés en temps réel depuis des médias sportifs ivoiriens (Fraternité Matin, Koaci, Abidjan.net, RTI, Afrik-Foot…) et la couverture internationale des Ivoiriens à l’étranger, via Google Actualités. Chaque lien ouvre l’article original chez l’éditeur.</p>
        <PressReview items={press.items} ok={press.ok} />
      </section>

    </main>
  )
}

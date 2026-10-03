import { videos } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { VideoExplorer } from '@/components/site/VideoExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'FIF TV — FIF Digital' }

export default async function FifTvPage() {
  await loadCms()
  return (
    <main>
      <PageHero
        eyebrow="L’image du football ivoirien"
        title="FIF TV"
        subtitle="Live, matchs, résumés, interviews, conférences, documentaires et archives : toute la vidéo fédérale."
        breadcrumb={[{ label: 'FIF TV' }]}
        meta={[{ value: String(videos.length), label: 'Vidéos disponibles' }]}
      />
      <section className="page-section tight">
        <VideoExplorer videos={videos} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

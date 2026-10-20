import Link from 'next/link'
import { ExternalLink, Film, Mic, PlayCircle, Video } from 'lucide-react'
import { videos } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { VideoExplorer } from '@/components/site/VideoExplorer'
import { loadCms } from '@/lib/cms/server'
import { getSettings } from '@/lib/cms/runtime'

export const metadata = { title: 'FIF TV — FIF', description: 'Résumés des matchs, conférences de presse et coulisses des sélections ivoiriennes.' }

const RUBRIQUES = [
  { icon: PlayCircle, title: 'Résumés', text: 'Les buts et temps forts des Éléphants et des championnats.' },
  { icon: Mic, title: 'Conférences de presse', text: 'Sélectionneurs, joueurs et dirigeants face aux médias.' },
  { icon: Video, title: 'Coulisses', text: 'Au cœur des rassemblements et des vestiaires.' },
  { icon: Film, title: 'Archives', text: 'Les grandes heures du football ivoirien.' },
]

export default async function FifTvPage() {
  await loadCms()
  const settings = getSettings()
  return (
    <main>
      <PageHero
        eyebrow="Vidéothèque officielle"
        title="FIF TV"
        subtitle="Résumés, conférences de presse, coulisses et archives : le football ivoirien en images."
        breadcrumb={[{ label: 'FIF TV' }]}
        meta={[{ value: String(videos.length), label: 'Vidéos publiées' }]}
        actions={settings.youtube ? <a className="button button-primary" href={settings.youtube} target="_blank" rel="noopener noreferrer">Chaîne officielle <ExternalLink /></a> : undefined}
      />
      <section className="page-section">
        {videos.length > 0 ? (
          <VideoExplorer videos={videos} />
        ) : (
          <>
            <div className="empty-state" style={{ marginBottom: 32 }}>
              <strong>Les premières vidéos arrivent</strong>
              <span>Aucune vidéo officielle n’est encore publiée. Elles apparaîtront ici dès leur mise en ligne par la FIF{settings.youtube ? '' : ' (Administration → Vidéos)'}.</span>
            </div>
            <div className="card-grid cols-4">
              {RUBRIQUES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="app-feature"><Icon size={24} aria-hidden /><strong>{title}</strong><p>{text}</p></div>
              ))}
            </div>
          </>
        )}
      </section>
      <section className="page-section tight">
        <Link className="h-press" href="/application" style={{ marginTop: 0 }}>
          <PlayCircle aria-hidden />
          <div><strong>FIF TV dans votre poche</strong><span>Installez l’application FIF pour suivre les vidéos et les résultats.</span></div>
        </Link>
      </section>
    </main>
  )
}

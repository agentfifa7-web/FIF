import { notFound } from 'next/navigation'
import { Play } from 'lucide-react'
import { videos, getVideo } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { VideoCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

export function generateStaticParams() {
  return videos.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = getVideo(slug)
  return { title: video ? `${video.title} — FIF TV` : 'Vidéo' }
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = getVideo(slug)
  if (!video) notFound()
  const related = videos.filter((v) => v.category === video.category && v.id !== video.id).slice(0, 3)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF TV', href: '/fif-tv' }, { label: video.title }]} />
      </div>
      <section className="page-section tight">
        <div className="video-player" style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.5),transparent),url(${video.image})` }}>
          <button type="button" aria-label="Lire la vidéo"><Play fill="currentColor" /></button>
        </div>
        <p className="section-tag" style={{ marginTop: 24 }}>{video.category}</p>
        <h1 style={{ fontSize: 'clamp(24px,3.4vw,36px)', letterSpacing: '-.03em', margin: '8px 0' }}>{video.title}</h1>
        <p className="lede">{formatDate(video.date, { day: 'numeric', month: 'long', year: 'numeric' })} · Durée {video.duration}</p>
      </section>
      {related.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">À voir aussi</p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {related.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </section>
      )}
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

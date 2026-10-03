import { notFound } from 'next/navigation'
import { Play } from 'lucide-react'
import { videos, getVideo } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { VideoCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'
import { youtubeId } from '@/lib/cms/schema'

export async function generateStaticParams() {
  await loadCms()
  return videos.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const video = getVideo(slug)
  return { title: video ? `${video.title} — FIF TV` : 'Vidéo' }
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCms()
  const { slug } = await params
  const video = getVideo(slug)
  if (!video) notFound()
  const ytId = video.url ? youtubeId(video.url) : undefined
  const related = videos.filter((v) => v.category === video.category && v.id !== video.id).slice(0, 3)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF TV', href: '/fif-tv' }, { label: video.title }]} />
      </div>
      <section className="page-section tight">
        {ytId ? (
          <div className="video-embed"><iframe src={`https://www.youtube-nocookie.com/embed/${ytId}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
        ) : video.url && /\.(mp4|webm|ogg)(\?|$)/i.test(video.url) ? (
          <video className="video-embed" src={video.url} poster={video.image} controls />
        ) : video.url ? (
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-player" style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.5),transparent),url(${video.image})` }}>
            <span className="video-play-btn" aria-hidden><Play fill="currentColor" /></span>
          </a>
        ) : (
          <div className="video-player" style={{ backgroundImage: `linear-gradient(0deg,rgba(0,0,0,.5),transparent),url(${video.image})` }}>
            <button type="button" aria-label="Lire la vidéo"><Play fill="currentColor" /></button>
          </div>
        )}
        <p className="section-tag" style={{ marginTop: 24 }}>{video.category}</p>
        <h1 style={{ fontSize: 'clamp(24px,3.4vw,36px)', letterSpacing: '-.03em', margin: '8px 0' }}>{video.title}</h1>
        <p className="lede">{formatDate(video.date, { day: 'numeric', month: 'long', year: 'numeric' })}{video.duration ? ` · Durée ${video.duration}` : ''}</p>
        {video.description && <p className="lede" style={{ maxWidth: 760 }}>{video.description}</p>}
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

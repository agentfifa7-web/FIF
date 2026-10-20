'use client'

import { useMemo, useState } from 'react'
import type { Video } from '@/lib/data/types'
import { VideoCard } from './cards'
import { EmptyState } from './widgets'

export function VideoExplorer({ videos }: { videos: Video[] }) {
  const categories = ['Toutes', ...Array.from(new Set(videos.map((v) => v.category)))]
  const [category, setCategory] = useState('Toutes')
  const filtered = useMemo(() => (category === 'Toutes' ? videos : videos.filter((v) => v.category === category)), [videos, category])

  return (
    <div>
      <div className="filters" role="group" aria-label="Filtrer les vidéos">
        {categories.map((c) => (
          <button key={c} type="button" aria-pressed={category === c} className={category === c ? 'filter active' : 'filter'} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      {!filtered.length && <EmptyState title="Aucune vidéo" />}
      <div className="card-grid" style={{ marginTop: 24 }}>
        {filtered.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  )
}

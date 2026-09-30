'use client'

import { useState } from 'react'
import { PersonPortrait } from '@/components/site/PersonPortrait'

// Photo d'une personnalité de la Mémoire du football ivoirien. Les photos
// Wikimedia Commons sont chargées directement depuis Commons ; si l'image est
// indisponible, on bascule sur le portrait illustré (et le crédit disparaît).
export function MemoryPhoto({ name, src, sourceUrl, width, height, radius = 8, credit = false }: {
  name: string
  src?: string
  sourceUrl?: string
  width: number
  height: number
  radius?: number
  credit?: boolean
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return <PersonPortrait seed={name} size={Math.min(width, height)} />

  return (
    <figure style={{ flexShrink: 0, margin: 0, width }}>
      <img
        src={src}
        alt={name}
        width={width}
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={{ background: 'var(--cream, #f3efe6)', borderRadius: radius, display: 'block', height, objectFit: 'cover', objectPosition: 'center 20%', width }}
      />
      {credit && sourceUrl && (
        <figcaption style={{ color: 'var(--muted)', fontSize: 11, marginTop: 6 }}>
          Photo : <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>
        </figcaption>
      )}
    </figure>
  )
}

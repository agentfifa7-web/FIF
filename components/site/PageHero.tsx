'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link>
      {items.map((item, i) => (
        <span key={i}>
          <ChevronRight />
          {item.href ? <Link href={item.href}>{item.label}</Link> : <b>{item.label}</b>}
        </span>
      ))}
    </nav>
  )
}

// Éléphants photo pool (supplied by the FIF team) used across every page
// hero. Each page picks a deterministic 3-photo slice so the carousel
// varies across pages without needing per-page curation.
const HERO_PHOTO_POOL = Array.from({ length: 15 }, (_, i) => `/hero-photos/elephants-${String(i + 1).padStart(2, '0')}.jpg`)

function hashString(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function pickPhotos(seed: string, count = 3) {
  const start = hashString(seed) % HERO_PHOTO_POOL.length
  return Array.from({ length: count }, (_, i) => HERO_PHOTO_POOL[(start + i) % HERO_PHOTO_POOL.length])
}

export function HeroCarousel({ seed, images }: { seed: string; images?: string[] }) {
  const photos = images && images.length ? images : pickPhotos(seed)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 5000)
    return () => clearInterval(id)
  }, [photos.length])

  return (
    <div className="page-hero-media" aria-hidden="true">
      {photos.map((src, i) => (
        <div
          key={src + i}
          className={i === index ? 'page-hero-media-slide is-active' : 'page-hero-media-slide'}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="page-hero-scrim" />
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  meta,
  tone = 'forest',
  images,
  noPhotos = false,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href?: string }[]
  meta?: { label: string; value: string }[]
  tone?: 'forest' | 'cream'
  images?: string[]
  noPhotos?: boolean
}) {
  return (
    <section className={`page-hero tone-${tone}`}>
      {!noPhotos && <HeroCarousel seed={title} images={images} />}
      <div className="page-hero-content">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        {eyebrow && (
          <p className="eyebrow">
            <span /> {eyebrow}
          </p>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="page-hero-sub">{subtitle}</p>}
        {meta && meta.length > 0 && (
          <div className="page-hero-meta">
            {meta.map((m) => (
              <div key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

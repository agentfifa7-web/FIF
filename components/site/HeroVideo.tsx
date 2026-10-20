'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

/**
 * Vidéo d'accueil. L'image d'affiche s'affiche d'abord ; la vidéo (≈ 6 Mo) n'est
 * chargée que sur tablette et ordinateur, hors mode « économie de données » et
 * hors préférence « réduire les animations ». Un bouton permet de la mettre en pause.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(true)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const ok = window.matchMedia('(min-width: 761px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !conn?.saveData
    setEnabled(ok)
  }, [])

  function toggle() {
    const v = ref.current
    if (!v) return
    if (v.paused) { void v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }

  return (
    <>
      <div className="h-hero-media" aria-hidden="true">
        {enabled
          ? <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" />
          : <img src={poster} alt="" fetchPriority="high" />}
      </div>
      {enabled && (
        <button type="button" className="h-hero-pause" onClick={toggle} aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}>
          {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
        </button>
      )}
    </>
  )
}

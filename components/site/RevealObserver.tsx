'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Apparition douce des sections marquées `.reveal` au défilement. Désactivée
 *  si l'utilisateur préfère réduire les animations ; sans JavaScript, tout
 *  reste visible. Une section déjà dépassée (saut d'ancre, défilement rapide)
 *  est affichée immédiatement. */
export function RevealObserver() {
  const pathname = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('js-reveal')
    let frame = 0
    const check = () => {
      frame = 0
      const limit = window.innerHeight * 0.92
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add('is-visible')
      })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pathname])
  return null
}

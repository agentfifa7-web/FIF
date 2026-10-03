'use client'

import { useEffect } from 'react'
import { applyOverlay } from '@/lib/cms/apply'
import type { PublicOverlay } from '@/lib/cms/types'
import { MATCHSHEET_EVENT } from '@/lib/matchsheet'

export const CMS_EVENT = 'fif-cms-updated'

/** Applique les données du back-office dans le navigateur avant l'affichage des pages. */
export function CmsHydrator({ overlay, children }: { overlay: PublicOverlay; children: React.ReactNode }) {
  applyOverlay(overlay)
  useEffect(() => {
    window.dispatchEvent(new Event(MATCHSHEET_EVENT))
    window.dispatchEvent(new Event(CMS_EVENT))
  }, [overlay.version])
  return <>{children}</>
}

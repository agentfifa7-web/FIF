'use client'

import { useEffect, useState } from 'react'
import { getMatchSheet, MATCHSHEET_EVENT } from '@/lib/matchsheet'

export function MatchSheetIndicator({ matchId }: { matchId: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const check = () => setSaved(Boolean(getMatchSheet(matchId)))
    check()
    window.addEventListener(MATCHSHEET_EVENT, check)
    return () => window.removeEventListener(MATCHSHEET_EVENT, check)
  }, [matchId])

  if (!saved) return <span className="status-pill neutral">À saisir</span>
  return <span className="status-pill ok">Saisie ✓</span>
}

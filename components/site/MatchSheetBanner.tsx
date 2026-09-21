'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ClipboardList } from 'lucide-react'
import { getMatchSheet, MATCHSHEET_EVENT, type MatchSheetOverride } from '@/lib/matchsheet'

export function MatchSheetBanner({ matchId, homeName, awayName }: { matchId: string; homeName: string; awayName: string }) {
  const [sheet, setSheet] = useState<MatchSheetOverride | null>(null)

  useEffect(() => {
    const check = () => setSheet(getMatchSheet(matchId))
    check()
    window.addEventListener(MATCHSHEET_EVENT, check)
    return () => window.removeEventListener(MATCHSHEET_EVENT, check)
  }, [matchId])

  if (sheet) {
    return (
      <div className="sim-panel">
        <p><CheckCircle2 size={15} /> Feuille de match saisie : {homeName} {sheet.homeScore}-{sheet.awayScore} {awayName} (démonstration locale, {new Date(sheet.submittedAt).toLocaleDateString('fr-FR')}) — <Link href={`/admin/feuille-de-match/${matchId}`} className="text-link" style={{ display: 'inline-flex' }}>modifier</Link></p>
      </div>
    )
  }

  return (
    <div className="sim-panel">
      <p><ClipboardList size={15} /> Aucune feuille de match saisie pour l’instant — <Link href={`/admin/feuille-de-match/${matchId}`} className="text-link" style={{ display: 'inline-flex' }}>saisir la feuille de match</Link></p>
    </div>
  )
}

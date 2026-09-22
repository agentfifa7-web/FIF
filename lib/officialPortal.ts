import { useEffect, useState } from 'react'

// État local du Portail Officiels (démonstration) : disponibilité déclarée
// et rapports de match soumis par l'officiel connecté.

const AVAILABILITY_KEY = 'fif-official-availability-v1'
const REPORTS_KEY = 'fif-official-reports-v1'
export const OFFICIAL_PORTAL_EVENT = 'fif-official-portal-updated'

function loadAvailable(): boolean {
  if (typeof window === 'undefined') return true
  try { return JSON.parse(window.localStorage.getItem(AVAILABILITY_KEY) ?? 'true') } catch { return true }
}

function loadReports(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(REPORTS_KEY) ?? '[]') } catch { return [] }
}

export function setAvailability(available: boolean) {
  window.localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(available))
  window.dispatchEvent(new CustomEvent(OFFICIAL_PORTAL_EVENT))
}

export function submitReport(matchId: string) {
  const reports = loadReports()
  if (reports.includes(matchId)) return
  window.localStorage.setItem(REPORTS_KEY, JSON.stringify([...reports, matchId]))
  window.dispatchEvent(new CustomEvent(OFFICIAL_PORTAL_EVENT))
}

export function useOfficialPortal() {
  const [available, setAvailableState] = useState(true)
  const [reports, setReports] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => { setAvailableState(loadAvailable()); setReports(loadReports()); setReady(true) }
    sync()
    window.addEventListener(OFFICIAL_PORTAL_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(OFFICIAL_PORTAL_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { available, reports, ready }
}

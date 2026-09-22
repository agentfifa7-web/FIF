import { useEffect, useState } from 'react'

// Suivi local des inscriptions et de la progression e-learning (démonstration
// — pas de compte serveur), même schéma que lib/fan.ts / lib/workflows.ts.

export interface Enrollment {
  courseSlug: string
  courseTitle: string
  progressPct: number
  enrolledAt: string
  updatedAt: string
}

const STORAGE_KEY = 'fif-formation-v1'
export const FORMATION_EVENT = 'fif-formation-updated'

function load(): Enrollment[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(list: Enrollment[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent(FORMATION_EVENT))
}

export function getEnrollment(courseSlug: string): Enrollment | null {
  return load().find((e) => e.courseSlug === courseSlug) ?? null
}

export function enroll(courseSlug: string, courseTitle: string): Enrollment {
  const list = load()
  const existing = list.find((e) => e.courseSlug === courseSlug)
  if (existing) return existing
  const now = new Date().toISOString()
  const enrollment: Enrollment = { courseSlug, courseTitle, progressPct: 0, enrolledAt: now, updatedAt: now }
  save([enrollment, ...list])
  return enrollment
}

export function advanceProgress(courseSlug: string): Enrollment | null {
  const list = load()
  const enrollment = list.find((e) => e.courseSlug === courseSlug)
  if (!enrollment) return null
  enrollment.progressPct = Math.min(100, enrollment.progressPct + 25)
  enrollment.updatedAt = new Date().toISOString()
  save(list)
  return enrollment
}

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => { setEnrollments(load()); setReady(true) }
    sync()
    window.addEventListener(FORMATION_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(FORMATION_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return { enrollments, ready }
}

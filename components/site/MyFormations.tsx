'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { useEnrollments } from '@/lib/formation'

export function MyFormations() {
  const { enrollments, ready } = useEnrollments()
  if (!ready || enrollments.length === 0) return null

  return (
    <section className="page-section tight dark-section">
      <p className="section-tag" style={{ color: 'var(--orange)' }}>Mes formations</p>
      <div className="card-grid cols-2" style={{ marginTop: 16 }}>
        {enrollments.map((e) => (
          <Link href={`/formation/${e.courseSlug}`} className="entity-card" key={e.courseSlug}>
            <GraduationCap size={18} color="var(--orange)" />
            <div>
              <strong>{e.courseTitle}</strong>
              <span>{e.progressPct}% complété</span>
              <div className="gauge-track" style={{ marginTop: 6 }}><div className="gauge-fill" style={{ width: `${e.progressPct}%` }} /></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

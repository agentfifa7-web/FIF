import Link from 'next/link'
import { GraduationCap, MapPin, Users } from 'lucide-react'
import { trainingCourses } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Academy — Formation' }

export default function FormationPage() {
  return (
    <main>
      <PageHero
        eyebrow="FIF Academy"
        title="Formation"
        subtitle="Éducateurs, entraîneurs, arbitres, dirigeants, médecins du sport : tous les parcours de formation fédéraux."
        breadcrumb={[{ label: 'Formation' }]}
        meta={[{ value: String(trainingCourses.length), label: 'Sessions programmées' }]}
      />
      <section className="page-section tight">
        <div className="card-grid cols-2">
          {trainingCourses.map((c) => (
            <Link key={c.id} href={`/formation/${c.slug}`} className="course-card">
              <div className="course-card-top"><GraduationCap /><span>{c.level}</span></div>
              <strong>{c.title}</strong>
              <p><Users size={13} /> {c.audience} · <MapPin size={13} /> {c.location}</p>
              <div className="course-card-foot"><span>{c.dates}</span><b>{c.price}</b></div>
            </Link>
          ))}
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

import { notFound } from 'next/navigation'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { trainingCourses } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return trainingCourses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = trainingCourses.find((c) => c.slug === slug)
  return { title: course ? `${course.title} — FIF Academy` : 'Formation' }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = trainingCourses.find((c) => c.slug === slug)
  if (!course) notFound()

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Formation', href: '/formation' }, { label: course.title }]} />
      </div>
      <section className="page-section tight">
        <p className="section-tag">{course.level} · {course.audience}</p>
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '-.04em', margin: '10px 0 20px' }}>{course.title}</h1>
        <div className="chip-row">
          <span className="chip"><CalendarDays size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{course.dates}</span>
          <span className="chip"><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{course.location}</span>
          <span className="chip"><Users size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{course.seats} places</span>
          <span className="chip">{course.price}</span>
        </div>

        <div className="card-grid cols-2" style={{ marginTop: 32 }}>
          <div>
            <p className="section-tag">Programme</p>
            <ul className="module-list">
              {course.modules.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </div>
          <div className="dashboard-panel">
            <h3>Inscription</h3>
            <p className="lede">Durée : {course.duration}. Places limitées à {course.seats} participants.</p>
            <button type="button" className="button button-primary" style={{ justifyContent: 'center', marginTop: 16, width: '100%' }}>S’inscrire</button>
            <p className="form-foot">Confirmation par email + suivi de progression (0 → 100 %) dans votre espace Mon FIF.</p>
          </div>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

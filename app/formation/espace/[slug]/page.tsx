import { notFound } from 'next/navigation'
import { academyPrograms, getProgram } from '@/lib/data/academy'
import { Breadcrumb } from '@/components/site/PageHero'
import { LearningSpace } from '@/components/site/LearningSpace'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return academyPrograms.filter((p) => !p.applyOnly).map((p) => ({ slug: p.slug }))
}

export const metadata = { title: 'Mon espace de formation — FIF Academy' }

export default async function LearningPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProgram(slug)
  if (!p) notFound()
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF Academy', href: '/formation' }, { label: 'Mes formations', href: '/formation/mes-formations' }, { label: p.title }]} />
      </div>
      <section className="page-section tight"><LearningSpace program={p} /></section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

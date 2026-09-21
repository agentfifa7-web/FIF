import { notFound } from 'next/navigation'
import { FileText } from 'lucide-react'
import { transparencyRecords } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

export function generateStaticParams() {
  return transparencyRecords.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const record = transparencyRecords.find((t) => t.slug === slug)
  return { title: record ? `${record.title} — FIF Digital` : 'Transparence FIF' }
}

export default async function TransparencyRecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const record = transparencyRecords.find((t) => t.slug === slug)
  if (!record) notFound()

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Fédération', href: '/federation' }, { label: 'Transparence FIF', href: '/federation/transparence' }, { label: record.title }]} />
      </div>
      <section className="page-section tight">
        <div className="chip-row">
          <span className="chip">{record.category}</span>
          <span className="chip">{formatDate(record.date)}</span>
          {record.amount && <span className="chip">{record.amount}</span>}
        </div>
        <h1 style={{ fontSize: 'clamp(26px,3.6vw,40px)', letterSpacing: '-.03em', margin: '16px 0' }}>
          <FileText style={{ verticalAlign: 'middle', marginRight: 10 }} />{record.title}
        </h1>
        <p className="lede" style={{ maxWidth: 640 }}>{record.summary}</p>
        <div className="button-group" style={{ marginTop: 24 }}>
          <button type="button" className="button-outline" disabled>Télécharger le document (démonstration)</button>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

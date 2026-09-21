import { notFound } from 'next/navigation'
import { FileText } from 'lucide-react'
import { officialDocuments } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

export function generateStaticParams() {
  return officialDocuments.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = officialDocuments.find((d) => d.slug === slug)
  return { title: doc ? `${doc.title} — FIF Digital` : 'Document' }
}

export default async function DocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = officialDocuments.find((d) => d.slug === slug)
  if (!doc) notFound()

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Documents', href: '/documents' }, { label: doc.organization }, { label: doc.title }]} />
      </div>
      <section className="page-section tight">
        <div className="chip-row">
          <span className="chip">{doc.organization}</span>
          <span className="chip">{doc.category}</span>
          <span className="chip">{formatDate(doc.date)}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(26px,3.6vw,40px)', letterSpacing: '-.03em', margin: '16px 0' }}><FileText style={{ verticalAlign: 'middle', marginRight: 10 }} />{doc.title}</h1>
        <p className="lede" style={{ maxWidth: 640 }}>{doc.summary}</p>
        <div className="button-group" style={{ marginTop: 24 }}>
          <button type="button" className="button-outline" disabled>Télécharger le PDF (démonstration)</button>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

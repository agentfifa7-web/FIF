import Link from 'next/link'
import { FileText } from 'lucide-react'
import { officialDocuments } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

export const metadata = { title: 'Documents officiels — FIF Digital' }

const ORGS = ['FIF', 'CAF', 'FIFA'] as const
const ORG_LABEL: Record<(typeof ORGS)[number], string> = {
  FIF: 'Fédération Ivoirienne de Football',
  CAF: 'Confédération Africaine de Football',
  FIFA: 'Fédération Internationale de Football Association',
}

export default function DocumentsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Centre de documentation"
        title="Documents officiels"
        subtitle="Statuts, règlements, circulaires, procès-verbaux, calendriers, guides et rapports, classés par organisation."
        breadcrumb={[{ label: 'Documents' }]}
        meta={[{ value: String(officialDocuments.length), label: 'Textes référencés' }]}
      />
      <section className="page-section tight">
        {ORGS.map((org) => {
          const docs = officialDocuments.filter((d) => d.organization === org)
          return (
            <div key={org} style={{ marginBottom: 40 }}>
              <p className="section-tag">{org} — {ORG_LABEL[org]}</p>
              <div className="card-grid cols-2" style={{ marginTop: 12 }}>
                {docs.map((d) => (
                  <Link href={`/documents/${d.slug}`} className="entity-card" key={d.id}>
                    <FileText size={18} color="var(--orange)" />
                    <div><strong>{d.title}</strong><span>{d.category} · {formatDate(d.date)}</span></div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

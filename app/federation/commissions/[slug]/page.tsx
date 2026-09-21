import Link from 'next/link'
import { notFound } from 'next/navigation'
import { commissions, executiveCommittee, presidentPromises } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { PersonPortrait } from '@/components/site/PersonPortrait'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return commissions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const commission = commissions.find((c) => c.slug === slug)
  return { title: commission ? `${commission.name} — FIF Digital` : 'Commission' }
}

export default async function CommissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const commission = commissions.find((c) => c.slug === slug)
  if (!commission) notFound()
  const members = executiveCommittee.filter((m) => m.commissionIds.includes(commission.id))
  const promises = presidentPromises.filter((p) => p.commissionId === commission.id)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Fédération', href: '/federation' }, { label: 'Commissions', href: '/federation#commissions' }, { label: commission.name }]} />
      </div>
      <section className="page-section tight">
        <p className="section-tag">Commission fédérale</p>
        <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '-.03em', margin: '6px 0 16px' }}>{commission.name}</h1>
        <p className="lede">{commission.mission}</p>
      </section>

      {members.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Membres en charge</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {members.map((m) => (
              <Link key={m.id} href={`/federation/comite/${m.slug}`} className="entity-card">
                <PersonPortrait seed={m.name} size={44} />
                <div><strong>{m.name}</strong><span>{m.role}</span></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {promises.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Engagements portés par cette commission</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {promises.map((p) => (
              <div className="entity-card" key={p.id}>
                <div><strong>{p.title}</strong><span>{p.progress}% · {p.status}</span></div>
              </div>
            ))}
          </div>
          <Link href="/federation/transparence" className="text-link" style={{ marginTop: 16, display: 'inline-flex' }}>Voir le détail dans la Transparence FIF →</Link>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

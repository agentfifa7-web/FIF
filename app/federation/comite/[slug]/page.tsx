import Link from 'next/link'
import { notFound } from 'next/navigation'
import { executiveCommittee, getCommission } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { PersonPortrait } from '@/components/site/PersonPortrait'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return executiveCommittee.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = executiveCommittee.find((m) => m.slug === slug)
  return { title: member ? `${member.name} — FIF Digital` : 'Comité exécutif' }
}

export default async function ExecutiveMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = executiveCommittee.find((m) => m.slug === slug)
  if (!member) notFound()
  const memberCommissions = member.commissionIds.map((id) => getCommission(id)).filter(Boolean)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Fédération', href: '/federation' }, { label: 'Comité exécutif', href: '/federation#comite' }, { label: member.name }]} />
      </div>
      <section className="page-section tight">
        <div style={{ alignItems: 'center', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <PersonPortrait seed={member.name} size={110} />
          <div>
            <p className="section-tag">{member.role}</p>
            <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '-.03em', margin: '6px 0' }}>{member.name}</h1>
            <p className="lede" style={{ maxWidth: 620 }}>{member.bio}</p>
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Commissions supervisées</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {memberCommissions.map((c) => c && (
            <Link key={c.id} href={`/federation/commissions/${c.slug}`} className="entity-card">
              <div><strong>{c.name}</strong><span>{c.mission}</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

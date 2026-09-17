import { notFound } from 'next/navigation'
import { academies, getAcademy, cityName } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return academies.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getAcademy(slug)
  return { title: a ? `${a.name} — FIF Digital` : 'Académie' }
}

export default async function AcademyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const academy = getAcademy(slug)
  if (!academy) notFound()

  return (
    <main>
      <PageHero
        eyebrow={academy.status}
        title={academy.name}
        subtitle={`${cityName(academy.cityId)} · Fondée en ${academy.founded}.`}
        breadcrumb={[{ label: 'Académies', href: '/academies' }, { label: academy.name }]}
      />
      <section className="page-section tight">
        <p className="section-tag">Catégories encadrées</p>
        <div className="chip-row" style={{ marginTop: 12 }}>
          {academy.categories.map((c) => <span className="chip" key={c}>{c}</span>)}
        </div>
        <p className="lede" style={{ marginTop: 24 }}>Cette académie propose un encadrement structuré autour de la détection, la formation technique et le suivi scolaire de ses jeunes licenciés, en lien avec le programme FIF Football Development.</p>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

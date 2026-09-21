import Link from 'next/link'
import { Quote } from 'lucide-react'
import { presidentProfile, presidentPromises } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { PersonPortrait } from '@/components/site/PersonPortrait'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Le Président — FIF Digital' }

export default function PresidentPage() {
  const done = presidentPromises.filter((p) => p.status === 'Réalisée').length

  return (
    <main>
      <PageHero
        eyebrow="Gouvernance — Profil de démonstration"
        title={presidentProfile.name}
        subtitle={presidentProfile.role}
        breadcrumb={[{ label: 'Fédération', href: '/federation' }, { label: 'Le Président' }]}
        meta={[
          { value: String(presidentProfile.since), label: 'Président depuis' },
          { value: `${done}/${presidentPromises.length}`, label: 'Promesses réalisées' },
        ]}
      />

      <section className="page-section tight">
        <div className="card-grid cols-2">
          <div>
            <PersonPortrait seed={presidentProfile.photoSeed} size={220} />
          </div>
          <div>
            <p className="section-tag">Parcours</p>
            <ol className="cv-timeline">
              {presidentProfile.cv.map((c, i) => (
                <li key={i}><b>{c.year}</b><span>{c.label}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Mot du Président</p>
        <div className="president-quote">
          <Quote />
          <p>{presidentProfile.word}</p>
          <span>— {presidentProfile.name}</span>
        </div>
      </section>

      <section className="page-section tight">
        <div className="page-section-head">
          <div><p className="section-tag">Le programme du Président</p><h2 style={{ fontSize: 24 }}>Engagements de mandat</h2></div>
          <Link href="/federation/transparence" className="text-link">Suivre l’avancement en détail <span aria-hidden>→</span></Link>
        </div>
        <p className="lede">Retrouvez le détail de chaque engagement, sa progression et la commission qui le porte dans la Transparence FIF.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

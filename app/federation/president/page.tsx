import Link from 'next/link'
import { CheckCircle2, Info, Target } from 'lucide-react'
import { presidentProfile, presidentPromises } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { PersonPortrait } from '@/components/site/PersonPortrait'
import { DemoBadge } from '@/components/site/DemoBadge'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Le Président — FIF Digital' }

export default async function PresidentPage() {
  await loadCms()
  return (
    <main>
      <PageHero
        eyebrow="Gouvernance — Présidence"
        title={presidentProfile.name}
        subtitle={presidentProfile.role}
        breadcrumb={[{ label: 'Fédération', href: '/federation' }, { label: 'Le Président' }]}
        images={presidentProfile.heroImages}
        imageFit="side"
        meta={[
          { value: String(presidentProfile.since), label: 'Président depuis' },
          { value: '2026-2030', label: 'Mandat en cours' },
          { value: '123 / 149', label: 'Voix à l’élection de 2026' },
        ]}
      />

      <section className="page-section tight">
        <div className="card-grid cols-2" style={{ alignItems: 'start' }}>
          <div>
            {presidentProfile.photoUrl
              ? <img src={presidentProfile.photoUrl} alt={presidentProfile.name} width={220} height={223} style={{ borderRadius: 'var(--radius-md)', display: 'block', objectFit: 'cover' }} />
              : <PersonPortrait seed={presidentProfile.photoSeed} size={220} />}
            <p className="lede" style={{ fontSize: 13, marginTop: 12 }}>{presidentProfile.birth}</p>
            <p className="lede" style={{ marginTop: 12 }}>{presidentProfile.summary}</p>
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
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Bilan du premier mandat (2022-2026)</p>
        <div className="card-grid cols-3" style={{ marginTop: 16 }}>
          {presidentProfile.record.map((r, i) => (
            <div className="info-tile" key={i}><CheckCircle2 /><p>{r}</p></div>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <div className="page-section-head">
          <div>
            <p className="section-tag">Programme 2026-2030</p>
            <h2 style={{ fontSize: 24 }}>« {presidentProfile.programme.name} »</h2>
          </div>
          <Link href="/federation/transparence" className="text-link">Suivre les engagements <span aria-hidden>→</span></Link>
        </div>
        <p className="lede">{presidentProfile.programme.launched}. Le projet repose sur six priorités :</p>
        <div className="card-grid cols-3" style={{ marginTop: 16, alignItems: 'start' }}>
          {presidentProfile.programme.axes.map((a, i) => (
            <div className="info-tile" key={i}>
              <Target />
              <strong>{i + 1}. {a.title}</strong>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'disc', marginTop: 10, paddingLeft: 18 }}>
                {a.points.map((p, j) => <li key={j} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="lede" style={{ marginTop: 20 }}>{presidentPromises.length} engagements concrets annoncés — détail dans la Transparence FIF.</p>
      </section>

      <section className="page-section tight">
        <p className="press-source-note"><Info size={13} /> Informations réelles recoupées dans la presse ivoirienne et internationale (Abidjan.net, APAnews, Connectionivoirienne, Pulse CI, Jeune Afrique, Le Patriote, Wikipédia) — septembre 2026.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

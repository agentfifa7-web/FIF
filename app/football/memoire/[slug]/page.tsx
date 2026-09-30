import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Award, Camera, Info } from 'lucide-react'
import { memoryPeople, getMemoryPerson, memoryCategory, memoryPeopleIn, memoryPhotoSrc, memoryPhotoSource } from '@/lib/data/memoire'
import { Breadcrumb } from '@/components/site/PageHero'
import { MemoryPhoto } from '@/components/site/MemoryPhoto'
import { DemoBadge } from '@/components/site/DemoBadge'

export function generateStaticParams() {
  return memoryPeople.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const person = getMemoryPerson(slug)
  return { title: person ? `${person.name} — Mémoire du football ivoirien` : 'Mémoire du football ivoirien' }
}

export default async function MemoryPersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const person = getMemoryPerson(slug)
  if (!person) notFound()
  const category = memoryCategory(person.category)
  const others = memoryPeopleIn(person.category).filter((p) => p.slug !== person.slug).slice(0, 6)
  const dates = person.deceased
    ? (person.born || person.died ? `${person.born ?? '…'} — ${person.died ?? '…'}` : '')
    : person.born ? `Né${person.feminine ? 'e' : ''} en ${person.born}` : null

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Mémoire du football ivoirien', href: '/football' }, { label: category?.label ?? '', href: `/football#${person.category}` }, { label: person.name }]} />
      </div>

      <section className="page-section tight">
        <div style={{ alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: 28 }}>
          <MemoryPhoto name={person.name} src={memoryPhotoSrc(person)} sourceUrl={memoryPhotoSource(person)} width={200} height={250} radius={12} credit />
          <div style={{ flex: 1, minWidth: 260 }}>
            <p className="section-tag">{category?.label}</p>
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', margin: '6px 0' }}>{person.name}</h1>
            <p style={{ fontWeight: 700, margin: '4px 0 10px' }}>{person.title}</p>
            {(dates || person.deceased) && <span className={person.deceased ? 'status-pill neutral' : 'status-pill ok'}>{person.deceased ? `✝ ${dates ? `${dates} · ` : ''}${person.feminine ? 'Disparue' : 'Disparu'}` : dates}</span>}
            <p className="lede" style={{ marginTop: 16, maxWidth: 720 }}>{person.summary}</p>
            {(person.birth || person.death) && (
              <dl className="memory-facts">
                {person.birth && <div><dt>{person.feminine ? 'Née' : 'Né'} le</dt><dd>{person.birth}</dd></div>}
                {person.death && <div><dt>{person.feminine ? 'Décédée' : 'Décédé'} le</dt><dd>{person.death}</dd></div>}
              </dl>
            )}
            {person.related && (
              <Link href={person.related.href} className="text-link" style={{ display: 'inline-flex', marginTop: 12 }}>{person.related.label} <ArrowRight size={14} /></Link>
            )}
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="card-grid cols-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="section-tag">Rôles et parcours</p>
            <ol className="cv-timeline">
              {person.roles.map((r, i) => (
                <li key={i}><b>{r.period}</b><span>{r.label}</span></li>
              ))}
            </ol>
          </div>
          {person.highlights.length > 0 && (
            <div>
              <p className="section-tag">Contribution au football ivoirien</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                {person.highlights.map((h, i) => (
                  <div className="info-tile" key={i}><Award /><p>{h}</p></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {person.sources && person.sources.length > 0 && (
        <section className="page-section tight">
          <p className="press-source-note"><Info size={13} /> Sources : {person.sources.map((src, i) => (
            <span key={src.url}>{i > 0 ? ' · ' : ''}<a href={src.url} target="_blank" rel="noopener noreferrer">{src.label}</a></span>
          ))}.</p>
        </section>
      )}

      <section className="page-section tight">
        <div className="dashboard-panel" style={{ margin: 0, maxWidth: 760 }}>
          <h3><Camera size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--orange)' }} />Enrichir cet hommage</h3>
          <p className="lede" style={{ fontSize: 14, marginTop: 8 }}>Photos, archives, témoignages : aidez-nous à compléter la mémoire de {person.name}.</p>
          <a href={`mailto:contact@fif.ci?subject=${encodeURIComponent(`Mémoire du football ivoirien — ${person.name}`)}`} className="button-outline" style={{ marginTop: 14 }}>Envoyer une contribution</a>
        </div>
      </section>

      {others.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Dans la même catégorie</p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {others.map((p) => (
              <Link key={p.slug} href={`/football/memoire/${p.slug}`} className="entity-card">
                <MemoryPhoto name={p.name} src={memoryPhotoSrc(p)} width={44} height={52} />
                <div><strong>{p.name}</strong><span>{p.title}</span></div>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

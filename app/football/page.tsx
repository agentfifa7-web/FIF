import Link from 'next/link'
import { ArrowRight, Heart, Info } from 'lucide-react'
import { memoryCategories, memoryPeopleIn, memoryPeople, memorySources, type MemoryPerson } from '@/lib/data/memoire'
import { PageHero } from '@/components/site/PageHero'
import { PersonPortrait } from '@/components/site/PersonPortrait'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Mémoire du football ivoirien — FIF Digital' }

const PRACTICES = [
  { label: 'Football féminin', href: '/football/feminin' },
  { label: 'Football amateur', href: '/football/amateur' },
  { label: 'Football des jeunes', href: '/football/jeunes' },
  { label: 'Futsal & Beach Soccer', href: '/football/futsal' },
]

function lifespan(p: MemoryPerson) {
  if (p.deceased) return p.born || p.died ? `${p.born ?? '…'} — ${p.died ?? '…'}` : (p.feminine ? 'Disparue' : 'Disparu')
  return p.born ? `Né${p.feminine ? 'e' : ''} en ${p.born}` : ''
}

export default function FootballMemoryPage() {
  return (
    <main>
      <PageHero
        eyebrow="Football ivoirien"
        title="Mémoire du football ivoirien"
        subtitle="Hommage à celles et ceux qui ont construit le football ivoirien : chefs d’État, ministres, présidents de la FIF et des clubs, joueurs, entraîneurs, arbitres, supporters et journalistes — en activité, retirés ou disparus."
        breadcrumb={[{ label: 'Football' }]}
        meta={[
          { value: String(memoryPeople.length), label: 'Personnalités honorées' },
          { value: String(memoryCategories.length), label: 'Catégories' },
          { value: '1960', label: 'Depuis la création de la FIF' },
        ]}
      />

      <section className="page-section tight">
        <p className="lede" style={{ maxWidth: 820 }}>
          Cette mémoire rassemble les parcours, les rôles et les faits marquants de ceux qui ont fait évoluer le football ivoirien. Elle est appelée à s’enrichir : chaque famille, club ou acteur peut proposer des photos, des témoignages et de nouvelles personnalités à honorer.
        </p>
        <div className="chip-row" style={{ marginTop: 20 }}>
          {memoryCategories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="chip">{c.label} ({memoryPeopleIn(c.id).length})</a>
          ))}
        </div>
      </section>

      {memoryCategories.map((c, i) => {
        const list = memoryPeopleIn(c.id)
        if (!list.length) return null
        return (
          <section key={c.id} id={c.id} className={`page-section tight${i % 2 === 1 ? ' dark-section' : ''}`}>
            <p className="section-tag" style={i % 2 === 1 ? { color: 'var(--orange)' } : undefined}>{c.label}</p>
            <p className="lede" style={{ marginTop: 8, ...(i % 2 === 1 ? { color: '#cfe0d6' } : {}) }}>{c.description}</p>
            <div className="card-grid" style={{ marginTop: 16 }}>
              {list.map((p) => (
                <Link key={p.slug} href={`/football/memoire/${p.slug}`} className="entity-card memory-card">
                  {p.photoUrl
                    ? <img src={p.photoUrl} alt={p.name} width={52} height={62} style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    : <PersonPortrait seed={p.name} size={52} />}
                  <div>
                    <strong>{p.name}</strong>
                    <span>{p.title}</span>
                    {lifespan(p) && <span className={p.deceased ? 'memory-dates is-deceased' : 'memory-dates'}>{p.deceased ? '✝ ' : ''}{lifespan(p)}</span>}
                  </div>
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <section className="page-section tight">
        <div className="dashboard-panel" style={{ margin: 0, maxWidth: 760 }}>
          <h3><Heart size={16} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--orange)' }} />Proposer un hommage</h3>
          <p className="lede" style={{ fontSize: 14, marginTop: 8 }}>Vous détenez des photos, des archives ou un témoignage sur l’une de ces personnalités, ou souhaitez proposer une personne qui a contribué au football ivoirien ? Écrivez à la Fédération en précisant le nom, le rôle joué et vos sources.</p>
          <a href="mailto:contact@fif.ci?subject=M%C3%A9moire%20du%20football%20ivoirien" className="button button-primary" style={{ marginTop: 14 }}>Proposer un hommage <ArrowRight size={14} /></a>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Les pratiques du football</p>
        <div className="card-grid cols-4" style={{ marginTop: 16 }}>
          {PRACTICES.map((p) => (
            <Link key={p.href} href={p.href} className="entity-card"><div><strong>{p.label}</strong></div><ArrowRight /></Link>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <p className="press-source-note"><Info size={13} /> Faits recoupés dans la presse ivoirienne et internationale ainsi que dans les encyclopédies. Principales sources : {memorySources.map((s, i) => (
          <span key={s.url}>{i > 0 ? ' · ' : ''}<a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></span>
        ))}.</p>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

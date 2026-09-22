import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { nationalTeams, nextFixtureFor, elephantsFixtures } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { formatDate } from '@/lib/format'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Équipes nationales — FIF Digital' }

const groups: { title: string; ids: string[] }[] = [
  { title: 'Seniors', ids: ['nt-elephants', 'nt-elephantes'] },
  { title: 'Jeunes', ids: ['nt-u23', 'nt-u20', 'nt-u17'] },
  { title: 'Autres pratiques', ids: ['nt-futsal', 'nt-beach'] },
]

export default function NationalTeamsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Univers FIF"
        title="Équipes nationales"
        subtitle="Éléphants, Éléphantes, sélections jeunes, futsal et beach soccer : toutes les couleurs de la Côte d’Ivoire réunies dans un seul univers."
        breadcrumb={[{ label: 'Équipes nationales' }]}
        meta={[
          { value: String(nationalTeams.length), label: 'Sélections' },
          { value: '2027', label: 'Prochaine CAN' },
          { value: '39ᵉ', label: 'Classement FIFA Éléphants' },
        ]}
      />
      {groups.map((group) => (
        <section className="page-section tight" key={group.title}>
          <p className="section-tag">{group.title}</p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {group.ids.map((id) => {
              const team = nationalTeams.find((t) => t.id === id)
              if (!team) return null
              const fixture = team.id === 'nt-elephants' ? elephantsFixtures[0] : nextFixtureFor(team.id)
              return (
                <Link key={team.id} href={`/equipes-nationales/${team.slug}`} className="entity-card">
                  <span className="comp-badge"><Shield /></span>
                  <div>
                    <strong>{team.name}</strong>
                    <span>{fixture ? `Prochain match : ${formatDate(fixture.date)} vs ${fixture.opponent}` : 'Calendrier à venir'}</span>
                  </div>
                  <ArrowRight />
                </Link>
              )
            })}
          </div>
        </section>
      ))}
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

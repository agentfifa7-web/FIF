import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { nationalTeams, nextFixtureFor, nextElephantsFixture, lastElephantsFixture, lastResultsFor, elephantsNextWindow, nationalTeamNextWindow } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Équipes nationales — FIF Digital' }

const groups: { title: string; ids: string[] }[] = [
  { title: 'Seniors', ids: ['nt-elephants', 'nt-elephantes'] },
  { title: 'Jeunes', ids: ['nt-u23', 'nt-u20', 'nt-u17'] },
  { title: 'Autres pratiques', ids: ['nt-futsal', 'nt-beach'] },
]

export default async function NationalTeamsPage() {
  await loadCms()
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
          { value: `${nationalTeams.find((t) => t.id === 'nt-elephants')?.ranking ?? '—'}ᵉ`, label: 'Classement FIFA Éléphants (oct. 2026)' },
        ]}
      />
      {groups.map((group) => (
        <section className="page-section tight" key={group.title}>
          <p className="section-tag">{group.title}</p>
          <div className="card-grid" style={{ marginTop: 16 }}>
            {group.ids.map((id) => {
              const team = nationalTeams.find((t) => t.id === id)
              if (!team) return null
              const isElephants = team.id === 'nt-elephants'
              const fixture = isElephants ? nextElephantsFixture() : nextFixtureFor(team.id)
              const window = isElephants ? (elephantsNextWindow && `${elephantsNextWindow.opponent} — ${elephantsNextWindow.competition}, ${elephantsNextWindow.period}`) : nationalTeamNextWindow[team.id]
              const last = isElephants
                ? (() => { const f = lastElephantsFixture(); return f?.result ? `${formatDate(f.date)} : Côte d’Ivoire ${f.result.civScore}-${f.result.opponentScore} ${f.opponent}` : null })()
                : (() => { const f = lastResultsFor(team.id)[0]; return f?.result ? `${formatDate(f.date)} : Côte d’Ivoire ${f.result.civ}-${f.result.opp} ${f.opponent}` : null })()
              return (
                <Link key={team.id} href={`/equipes-nationales/${team.slug}`} className="entity-card">
                  <span className="comp-badge"><Shield /></span>
                  <div>
                    <strong>{team.name}</strong>
                    <span>{fixture ? `Prochain match : ${formatDate(fixture.date)} vs ${fixture.opponent}` : window ? `Prochain rendez-vous : ${window}` : 'Calendrier à venir'}</span>
                    {!fixture && last && <span>Dernier match — {last}</span>}
                  </div>
                  <ArrowRight />
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}

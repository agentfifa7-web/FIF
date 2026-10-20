import Link from 'next/link'
import {
  elephantsNextWindow, lastElephantsFixture, lastResultsFor, nationalTeamNextWindow, nationalTeams, nextElephantsFixture, nextFixtureFor,
} from '@/lib/data/mock'
import { formatDate } from '@/lib/format'

/** Grille des sept sélections : Éléphants mis en avant, prochain ou dernier match réel pour chacune. */
export function NationalTeamsGrid() {
  const elephants = nationalTeams.find((t) => t.id === 'nt-elephants')!
  const lastCiv = lastElephantsFixture()
  const nextCiv = nextElephantsFixture()
  return (
        <div className="h-teams">
          <Link href="/equipes-nationales/elephants" className="h-team h-team-feature" style={{ ['--feature-img' as string]: 'url(/hero-photos/elephants-09.jpg)' }}>
            <span>Équipe A masculine · Champions d’Afrique 2024</span>
            <strong>Les Éléphants</strong>
            {elephants.ranking && <div className="h-team-rank"><b>{elephants.ranking}ᵉ</b><span>au classement FIFA</span></div>}
            <span className="h-team-next">
              {nextCiv ? `Prochain match : ${nextCiv.opponent}, ${formatDate(nextCiv.date)}`
                : elephantsNextWindow ? `Prochain rendez-vous : ${elephantsNextWindow.opponent} — ${elephantsNextWindow.period}`
                : lastCiv?.result ? `Dernier match : ${lastCiv.result.civScore}-${lastCiv.result.opponentScore} contre ${lastCiv.opponent}` : ''}
            </span>
          </Link>
          {nationalTeams.filter((t) => t.id !== 'nt-elephants').map((t) => {
            const fx = nextFixtureFor(t.id)
            const last = lastResultsFor(t.id)[0]
            const windowNext = nationalTeamNextWindow[t.id]
            return (
              <Link key={t.id} href={`/equipes-nationales/${t.slug}`} className="h-team">
                <strong>{t.name}</strong>
                <span>{t.gender === 'F' ? 'Équipe A féminine' : t.category === 'A' ? 'Équipe A' : t.category}</span>
                <span className="h-team-next">
                  {fx ? `Prochain match : ${fx.opponent}, ${formatDate(fx.date)}`
                    : windowNext ? `Prochain : ${windowNext.split(' — ')[0]}`
                    : last?.result ? `Dernier match : ${last.result.civ}-${last.result.opp} contre ${last.opponent}` : 'Calendrier à venir'}
                </span>
              </Link>
            )
          })}
        </div>
  )
}

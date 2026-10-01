// Choix « Je supporte » proposés à chaque titulaire d'un FIF ID : une équipe
// nationale, un club, ou les deux. Uniquement les vrais clubs de Ligue 1 et
// de Ligue 2.
import { clubs, nationalTeams } from './mock'

export interface SupportOption { id: string; name: string; href: string; crestUrl?: string }

export const supportNationalTeams: SupportOption[] = nationalTeams.map((t) => ({ id: t.id, name: t.name, href: `/equipes-nationales/${t.slug}` }))

const pro = clubs.filter((c) => c.category === 'Professionnel')
const toOption = (c: (typeof clubs)[number]): SupportOption => ({ id: c.id, name: c.name, href: `/clubs/${c.slug}`, crestUrl: c.crestUrl })
const byName = (a: SupportOption, b: SupportOption) => a.name.localeCompare(b.name, 'fr')

export const supportClubGroups: { label: string; clubs: SupportOption[] }[] = [
  { label: 'Ligue 1', clubs: pro.filter((c) => !c.group).map(toOption).sort(byName) },
  { label: 'Ligue 2 — poule A', clubs: pro.filter((c) => c.group === 'A').map(toOption).sort(byName) },
  { label: 'Ligue 2 — poule B', clubs: pro.filter((c) => c.group === 'B').map(toOption).sort(byName) },
]

export function supportTeamName(id?: string) {
  return supportNationalTeams.find((t) => t.id === id)?.name
}
export function supportClub(id?: string) {
  return supportClubGroups.flatMap((g) => g.clubs).find((c) => c.id === id)
}

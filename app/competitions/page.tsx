import Link from 'next/link'
import { ArrowRight, CalendarDays, Trophy } from 'lucide-react'
import { competitions, getClubById, matches, standingsFor } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { SubNav } from '@/components/site/SubNav'
import { ClubCrest } from '@/components/site/cards'
import { loadCms } from '@/lib/cms/server'
import { awaitingScore, formatDate } from '@/lib/format'

export const metadata = { title: 'Compétitions — FIF', description: 'Ligue 1, Ligue 2, coupes, championnats féminins, jeunes, futsal et beach soccer : calendriers, résultats et classements.' }

const GROUPS = [
  { id: 'pro', label: 'Football professionnel', filter: (c: (typeof competitions)[number]) => c.category === 'Seniors' && c.practice === 'Professionnel' },
  { id: 'amateur', label: 'Football amateur', filter: (c: (typeof competitions)[number]) => c.category === 'Seniors' && c.practice === 'Amateur' },
  { id: 'feminin', label: 'Football féminin', filter: (c: (typeof competitions)[number]) => c.category === 'Féminin' },
  { id: 'jeunes', label: 'Jeunes', filter: (c: (typeof competitions)[number]) => c.category === 'Jeunes' },
  { id: 'futsal', label: 'Futsal et beach soccer', filter: (c: (typeof competitions)[number]) => c.category === 'Futsal' || c.category === 'Beach Soccer' },
]

function statusOf(id: string, clubCount: number) {
  const played = matches.filter((m) => m.competitionId === id && m.status === 'Terminé').length
  if (played) return { label: `En cours · ${played} matchs joués`, tone: 'badge-green' }
  if (clubCount) return { label: 'Clubs engagés publiés', tone: 'badge-orange' }
  return { label: 'Calendrier à publier', tone: 'badge-gray' }
}

export default async function CompetitionsPage() {
  await loadCms()
  const featured = competitions.filter((c) => c.id === 'comp-l1' || c.id === 'comp-l2')
  return (
    <main>
      <PageHero
        eyebrow="Saison 2026-2027"
        title="Compétitions"
        subtitle="Calendriers, résultats et classements de toutes les compétitions organisées par la Fédération Ivoirienne de Football."
        breadcrumb={[{ label: 'Compétitions' }]}
        meta={[
          { value: String(competitions.length), label: 'Compétitions' },
          { value: String(matches.filter((m) => m.status === 'Terminé').length), label: 'Matchs joués cette saison' },
        ]}
        actions={<><Link className="button button-primary" href="/matches"><CalendarDays /> Calendrier</Link><Link className="button-outline" href="/resultats">Résultats</Link></>}
      />
      <SubNav items={GROUPS.map((g) => ({ id: g.id, label: g.label }))} />

      <section className="page-section" id="pro">
        <h2>Football professionnel</h2>
        <div className="cx-featured">
          {featured.map((c) => {
            const rows = c.id === 'comp-l1' ? standingsFor(c.id).filter((r) => r.played > 0) : []
            const leader = rows[0] ? getClubById(rows[0].clubId) : null
            const next = matches.filter((m) => m.competitionId === c.id && m.status === 'À venir' && !awaitingScore(m)).sort((a, b) => a.date.localeCompare(b.date))[0]
            const lastDay = Math.max(0, ...matches.filter((m) => m.competitionId === c.id && m.status === 'Terminé').map((m) => m.matchday))
            return (
              <Link key={c.id} href={`/competitions/${c.slug}`} className="cx-card">
                <div className="cx-card-top"><span className="h-comp-icon"><Trophy size={22} aria-hidden /></span><span className="badge badge-green">{lastDay ? `${lastDay}e journée jouée` : 'Saison lancée'}</span></div>
                <strong>{c.name}</strong>
                <span>{c.clubIds.length} clubs · {c.format}</span>
                <div className="cx-card-facts">
                  {leader && <div><small>Leader</small><b><ClubCrest club={leader} size={22} /> {leader.name} · {rows[0].points} pts</b></div>}
                  {next && <div><small>Prochain match</small><b>{getClubById(next.homeClubId)?.name} – {getClubById(next.awayClubId)?.name}, {formatDate(next.date)}</b></div>}
                </div>
                <span className="text-link">Classement, résultats et calendrier <ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></span>
              </Link>
            )
          })}
        </div>
        <div className="cx-list" style={{ marginTop: 16 }}>
          {competitions.filter(GROUPS[0].filter).filter((c) => !featured.includes(c)).map((c) => <CompRow key={c.id} c={c} />)}
        </div>
      </section>

      {GROUPS.slice(1).map((g, i) => (
        <section key={g.id} id={g.id} className={i % 2 === 0 ? 'page-section tight section-alt' : 'page-section tight'}>
          <h2>{g.label}</h2>
          <div className="cx-list">{competitions.filter(g.filter).map((c) => <CompRow key={c.id} c={c} />)}</div>
        </section>
      ))}
    </main>
  )
}

function CompRow({ c }: { c: (typeof competitions)[number] }) {
  const st = statusOf(c.id, c.clubIds.length)
  return (
    <Link href={`/competitions/${c.slug}`} className="h-comp-link">
      <span className="h-comp-icon"><Trophy aria-hidden size={20} /></span>
      <div><strong>{c.name}</strong><span>{c.clubIds.length ? `${c.clubIds.length} équipes · ` : ''}{c.format}</span></div>
      <span className={`badge ${st.tone} cx-status`}>{st.label}</span>
      <ArrowRight aria-hidden />
    </Link>
  )
}

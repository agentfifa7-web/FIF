import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import { elephantsFixtures, internationalFixtures, nationalTeams } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { NationalTeamsGrid } from '@/components/site/NationalTeamsGrid'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Équipes nationales — FIF', description: 'Éléphants, Éléphantes, sélections jeunes, futsal et beach soccer : calendriers, résultats, effectifs et palmarès.' }

export default async function NationalTeamsPage() {
  await loadCms()
  // Résultats réels de toutes les sélections, du plus récent au plus ancien.
  const results = [
    ...elephantsFixtures.filter((f) => f.result).map((f) => ({ key: f.slug, team: 'Éléphants', date: f.date, opponent: f.opponent, score: `${f.result!.civScore}-${f.result!.opponentScore}`, competition: f.competition, href: `/equipes-nationales/elephants/matchs/${f.slug}` })),
    ...internationalFixtures.filter((f) => f.result).map((f) => ({ key: f.id, team: nationalTeams.find((t) => t.id === f.teamId)?.name ?? '', date: f.date, opponent: f.opponent, score: `${f.result!.civ}-${f.result!.opp}`, competition: f.competition, href: `/equipes-nationales/${nationalTeams.find((t) => t.id === f.teamId)?.slug}` })),
  ].sort((a, b) => b.date.localeCompare(a.date))
  const titles = nationalTeams.reduce((n, t) => n + t.honours.length, 0)

  return (
    <main>
      <PageHero
        eyebrow="Côte d’Ivoire"
        title="Équipes nationales"
        subtitle="Éléphants, Éléphantes, sélections jeunes, futsal et beach soccer : toutes les couleurs de la Côte d’Ivoire."
        breadcrumb={[{ label: 'Équipes nationales' }]}
        meta={[
          { value: String(nationalTeams.length), label: 'Sélections' },
          { value: `${nationalTeams.find((t) => t.id === 'nt-elephants')?.ranking ?? '—'}ᵉ`, label: 'Éléphants au classement FIFA' },
          { value: String(titles), label: 'Titres continentaux' },
        ]}
      />

      <section className="page-section">
        <NationalTeamsGrid />
      </section>

      <section className="page-section section-alt">
        <div className="h-head"><div><span className="h-kicker">Résultats</span><h2>Derniers matchs des sélections</h2></div></div>
        <div className="nt-results">
          {results.map((r) => (
            <Link key={r.key} href={r.href} className="nt-result">
              <span className="nt-result-date">{formatDate(r.date)}</span>
              <span><strong>{r.team}</strong> <small>{r.competition}</small></span>
              <span className="nt-result-score">Côte d’Ivoire <b>{r.score}</b> {r.opponent}</span>
              <ArrowRight aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section">
        <Link href="/palmares" className="h-press" style={{ marginTop: 0 }}>
          <Trophy aria-hidden />
          <div><strong>Palmarès</strong><span>Les titres des sélections et des clubs ivoiriens.</span></div>
          <ArrowRight aria-hidden />
        </Link>
      </section>
    </main>
  )
}

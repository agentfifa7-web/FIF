import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { competitions, matches, getClubById, elephantsFixtures, elephantsFlag } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { formatDate } from '@/lib/format'
import { MatchSheetIndicator } from '@/components/site/MatchSheetIndicator'

export const metadata = { title: 'Feuilles de match — FIF Digital Admin' }

export default function MatchSheetIndexPage() {
  // Tous les matchs officiels : à venir (feuille à saisir) et déjà joués (compositions à compléter).
  const eligible = [...matches].sort((a, b) => a.matchday - b.matchday || +new Date(a.date) - +new Date(b.date))

  return (
    <main>
      <PageHero
        eyebrow="FIF Command Center"
        title="Feuilles de match"
        subtitle="Pour chaque match officiel : listes des joueurs des deux équipes (titulaires, remplaçants, capitaine), score, buteurs, cartons et remplacements."
        breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Feuilles de match' }]}
        meta={[{ value: String(eligible.length + elephantsFixtures.length), label: 'Matchs officiels' }]}
      />

      <section className="page-section tight">
        <p className="section-tag">Équipes nationales — Éléphants</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {elephantsFixtures.map((f) => (
            <Link href={`/admin/feuille-de-match/elephants/${f.slug}`} className="entity-card" key={f.slug}>
              <ClipboardList size={18} color="var(--orange)" />
              <div>
                <strong>{elephantsFlag} Côte d’Ivoire vs {f.opponentFlag} {f.opponent}</strong>
                <span>{formatDate(f.date)} · {f.competition}</span>
              </div>
              <MatchSheetIndicator matchId={f.slug} />
            </Link>
          ))}
        </div>
      </section>

      {competitions.map((comp) => {
        const compMatches = eligible.filter((m) => m.competitionId === comp.id)
        if (!compMatches.length) return null
        return (
          <section className="page-section tight" key={comp.id}>
            <p className="section-tag">{comp.name}</p>
            <div className="card-grid cols-2" style={{ marginTop: 16 }}>
              {compMatches.map((m) => {
                const home = getClubById(m.homeClubId)
                const away = getClubById(m.awayClubId)
                return (
                  <Link href={`/admin/feuille-de-match/${m.id}`} className="entity-card" key={m.id}>
                    <ClipboardList size={18} color="var(--orange)" />
                    <div>
                      <strong>{home?.name} vs {away?.name}</strong>
                      <span>Journée {m.matchday} · {m.dateConfirmed === false ? 'date à confirmer' : formatDate(m.date)} · {m.status === 'Terminé' ? `joué (${m.homeScore}-${m.awayScore})` : 'à venir'}</span>
                    </div>
                    <MatchSheetIndicator matchId={m.id} />
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}

    </main>
  )
}

import Link from 'next/link'
import { Award, Trophy } from 'lucide-react'
import { nationalTeams, clubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ClubCrest } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'
import type { HonourRecord } from '@/lib/data/types'

export const metadata = { title: 'Palmarès — FIF Digital' }

const RESULT_ORDER: HonourRecord['result'][] = ['Champion', 'Finaliste', 'Podium (3e)', 'Demi-finaliste', 'Qualifié']
const RESULT_LABEL: Record<HonourRecord['result'], string> = {
  'Champion': 'titre(s)',
  'Finaliste': 'finale(s)',
  'Demi-finaliste': 'demi-finale(s)',
  'Qualifié': 'qualification(s)',
  'Podium (3e)': 'podium(s)',
}

function tally(achievements: HonourRecord[]) {
  const counts: Partial<Record<HonourRecord['result'], number>> = {}
  for (const a of achievements) counts[a.result] = (counts[a.result] ?? 0) + 1
  return counts
}

function championCount(achievements: HonourRecord[]) {
  return achievements.filter((a) => a.result === 'Champion').length
}

function summarize(achievements: HonourRecord[]) {
  const counts = tally(achievements)
  return RESULT_ORDER.filter((r) => counts[r]).map((r) => `${counts[r]} ${RESULT_LABEL[r]}`).join(' · ')
}

export default function PalmaresPage() {
  const rankedTeams = [...nationalTeams]
    .filter((t) => t.achievements.length > 0)
    .sort((a, b) => championCount(b.achievements) - championCount(a.achievements) || b.achievements.length - a.achievements.length)

  const rankedClubs = [...clubs]
    .filter((c) => c.achievements.length > 0)
    .sort((a, b) => championCount(b.achievements) - championCount(a.achievements) || b.achievements.length - a.achievements.length)

  return (
    <main>
      <PageHero
        eyebrow="Archives du football ivoirien"
        title="Palmarès"
        subtitle="Titres, finales, podiums et qualifications des équipes nationales et des clubs affiliés à la FIF — du plus titré au moins titré."
        breadcrumb={[{ label: 'Palmarès' }]}
        meta={[
          { value: String(rankedTeams.length), label: 'Sélections classées' },
          { value: String(rankedClubs.length), label: 'Clubs classés' },
        ]}
      />

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Équipes nationales</p>
        <p className="lede" style={{ color: '#a9b7af' }}>Cliquez sur une sélection pour dérouler l’historique complet de ses résultats en compétitions officielles.</p>
        <div className="rank-list" style={{ marginTop: 16 }}>
          {rankedTeams.map((t, i) => {
            const sorted = [...t.achievements].sort((a, b) => b.year - a.year)
            return (
              <details key={t.id}>
                <summary>
                  <span className={`rank-badge${i < 3 ? ` podium-${i + 1}` : ''}`}>{i + 1}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{summarize(t.achievements)}</span>
                  </div>
                  <Link href={`/equipes-nationales/${t.slug}`} className="chip">Fiche équipe</Link>
                </summary>
                <ul className="honour-list">
                  {sorted.map((a, ai) => (
                    <li key={ai}><Trophy size={13} /><b>{a.year}</b><span>{a.competition}</span><em>{a.result}</em></li>
                  ))}
                </ul>
              </details>
            )
          })}
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Clubs</p>
        <p className="lede">Classement du plus titré au moins titré. Cliquez sur un club pour voir le détail de son palmarès.</p>
        <div className="rank-list" style={{ marginTop: 16 }}>
          {rankedClubs.map((c, i) => {
            const sorted = [...c.achievements].sort((a, b) => b.year - a.year)
            return (
              <details key={c.id}>
                <summary>
                  <span className={`rank-badge${i < 3 ? ` podium-${i + 1}` : ''}`}>{i + 1}</span>
                  <ClubCrest club={c} size={36} />
                  <div>
                    <strong>{c.name}</strong>
                    <span>{summarize(c.achievements)}</span>
                  </div>
                  <Link href={`/clubs/${c.slug}`} className="chip">Fiche club</Link>
                </summary>
                <ul className="honour-list">
                  {sorted.map((a, ai) => (
                    <li key={ai}><Award size={13} /><b>{a.year}</b><span>{a.competition}</span><em>{a.result}</em></li>
                  ))}
                </ul>
              </details>
            )
          })}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

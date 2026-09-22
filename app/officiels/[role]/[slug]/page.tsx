import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QrCode } from 'lucide-react'
import {
  coaches, referees, officials, agents, matches,
  getClubById, getRegion, nationalTeams, getPlayerById,
} from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { PersonPortrait } from '@/components/site/PersonPortrait'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate, age } from '@/lib/format'

const ROLE_CONFIG = {
  entraineurs: { label: 'Entraîneur', dataset: coaches },
  arbitres: { label: 'Arbitre', dataset: referees },
  dirigeants: { label: 'Dirigeant', dataset: officials },
  agents: { label: 'Agent sportif', dataset: agents },
} as const

type RoleKey = keyof typeof ROLE_CONFIG

function isRoleKey(value: string): value is RoleKey {
  return value in ROLE_CONFIG
}

export function generateStaticParams() {
  return (Object.keys(ROLE_CONFIG) as RoleKey[]).flatMap((role) =>
    ROLE_CONFIG[role].dataset.map((p) => ({ role, slug: p.slug })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ role: string; slug: string }> }) {
  const { role, slug } = await params
  if (!isRoleKey(role)) return { title: 'Officiel — FIF Digital' }
  const person = ROLE_CONFIG[role].dataset.find((p) => p.slug === slug)
  return { title: person ? `${person.name} — FIF Digital` : 'Officiel' }
}

export default async function OfficialProfilePage({ params }: { params: Promise<{ role: string; slug: string }> }) {
  const { role, slug } = await params
  if (!isRoleKey(role)) notFound()
  const config = ROLE_CONFIG[role]
  const person = (config.dataset as readonly { slug: string; name: string; bio: string }[]).find((p) => p.slug === slug)
  if (!person) notFound()

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Portail Officiels', href: '/officiels' }, { label: config.label + 's', href: `/officiels?role=${role}` }, { label: person.name }]} />
      </div>

      <section className="page-section tight">
        <div style={{ alignItems: 'center', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <PersonPortrait seed={person.name} size={110} />
          <div>
            <p className="section-tag">{config.label}</p>
            <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '-.03em', margin: '6px 0' }}>{person.name}</h1>
            <p className="lede" style={{ maxWidth: 620 }}>{person.bio}</p>
          </div>
        </div>
      </section>

      {role === 'entraineurs' && <CoachDetails coach={person as (typeof coaches)[number]} />}
      {role === 'arbitres' && <RefereeDetails referee={person as (typeof referees)[number]} />}
      {role === 'dirigeants' && <OfficialDetails official={person as (typeof officials)[number]} />}
      {role === 'agents' && <AgentDetails agent={person as (typeof agents)[number]} />}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

function IdCard({ fifId, birthdate, rows }: { fifId: string; birthdate: string; rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="dashboard-panel" style={{ maxWidth: 460 }}>
      <h3>Identité fédérale</h3>
      <div className="dashboard-list">
        <div><small>FIF ID</small><b>{fifId}</b></div>
        <div><small>Date de naissance</small><b>{formatDate(birthdate)} · {age(birthdate)} ans</b></div>
        {rows.map((r, i) => <div key={i}><small>{r.label}</small><b>{r.value}</b></div>)}
      </div>
      <Link href={`/verifier/${fifId}`} className="button-outline" style={{ marginTop: 16 }}><QrCode size={14} /> Vérifier ce FIF ID</Link>
    </div>
  )
}

function CoachDetails({ coach }: { coach: (typeof coaches)[number] }) {
  const club = coach.clubId ? getClubById(coach.clubId) : null
  const team = nationalTeams.find((t) => t.coachId === coach.id)
  return (
    <>
      <section className="page-section tight">
        <IdCard
          fifId={coach.fifId}
          birthdate={coach.birthdate}
          rows={[
            { label: 'Licence', value: coach.license },
            { label: 'En poste depuis', value: coach.since },
            { label: 'Club', value: club ? <Link href={`/clubs/${club.slug}`}>{club.name}</Link> : '—' },
            ...(team ? [{ label: 'Sélection nationale', value: <Link href={`/equipes-nationales/${team.slug}`}>{team.name}</Link> }] : []),
          ]}
        />
      </section>
      {coach.history.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Équipes dirigées</p>
          <div className="card-grid cols-2" style={{ marginTop: 16 }}>
            {coach.history.map((h, i) => {
              const c = getClubById(h.clubId)
              return c ? (
                <Link key={i} href={`/clubs/${c.slug}`} className="entity-card">
                  <div><strong>{c.name}</strong><span>{h.from} — {h.to ?? 'aujourd’hui'}</span></div>
                </Link>
              ) : null
            })}
          </div>
        </section>
      )}
    </>
  )
}

function RefereeDetails({ referee }: { referee: (typeof referees)[number] }) {
  const region = getRegion(referee.regionId)
  const designations = matches.filter((m) => m.refereeId === referee.id && m.status === 'À venir').slice(0, 5)
  return (
    <>
      <section className="page-section tight">
        <IdCard
          fifId={referee.fifId}
          birthdate={referee.birthdate}
          rows={[
            { label: 'Catégorie', value: referee.category },
            { label: 'Région', value: region?.name ?? '—' },
            { label: 'Statut', value: <span className={`status-pill ${referee.status === 'Actif' ? 'ok' : referee.status === 'Suspendu' ? 'error' : 'neutral'}`}>{referee.status}</span> },
            { label: 'Matchs arbitrés', value: referee.matchesOfficiated },
          ]}
        />
      </section>

      <section className="page-section tight">
        <p className="section-tag">Prochaines désignations</p>
        {designations.length > 0 ? (
          <div className="dashboard-list" style={{ marginTop: 16, maxWidth: 620 }}>
            {designations.map((m) => (
              <div key={m.id}>
                <div><b>{getClubById(m.homeClubId)?.name} vs {getClubById(m.awayClubId)?.name}</b><small>{formatDate(m.date)}</small></div>
                <Link href={`/matches/${m.id}`} className="status-pill neutral">Détail</Link>
              </div>
            ))}
          </div>
        ) : <p className="lede" style={{ marginTop: 12 }}>Aucune désignation à venir pour l’instant.</p>}
      </section>

      {referee.trainings.length > 0 && (
        <section className="page-section tight">
          <p className="section-tag">Formations complétées</p>
          <div className="dashboard-list" style={{ marginTop: 16, maxWidth: 620 }}>
            {referee.trainings.map((t, i) => (
              <div key={i}>
                <div><b>{t.title}</b><small>{formatDate(t.date)}</small></div>
                <span className="status-pill ok">Validée</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function OfficialDetails({ official }: { official: (typeof officials)[number] }) {
  const club = official.clubId ? getClubById(official.clubId) : null
  const isMatchDelegate = official.role === 'Délégué de match' || official.role === 'Commissaire au match'
  const upcoming = isMatchDelegate ? matches.filter((m) => m.delegateId === official.id && m.status === 'À venir').slice(0, 5) : []
  const past = isMatchDelegate ? matches.filter((m) => m.delegateId === official.id && m.status === 'Terminé').slice(0, 5) : []
  return (
    <>
      <section className="page-section tight">
        <IdCard
          fifId={official.fifId}
          birthdate={official.birthdate}
          rows={[
            { label: 'Fonction', value: official.role },
            { label: 'Club', value: club ? <Link href={`/clubs/${club.slug}`}>{club.name}</Link> : 'Fédération' },
          ]}
        />
      </section>

      {isMatchDelegate && (
        <>
          <section className="page-section tight">
            <p className="section-tag">Prochaines désignations</p>
            {upcoming.length > 0 ? (
              <div className="dashboard-list" style={{ marginTop: 16, maxWidth: 620 }}>
                {upcoming.map((m) => (
                  <div key={m.id}>
                    <div><b>{getClubById(m.homeClubId)?.name} vs {getClubById(m.awayClubId)?.name}</b><small>{formatDate(m.date)}</small></div>
                    <Link href={`/matches/${m.id}`} className="status-pill neutral">Détail</Link>
                  </div>
                ))}
              </div>
            ) : <p className="lede" style={{ marginTop: 12 }}>Aucune désignation à venir pour l’instant.</p>}
          </section>

          {past.length > 0 && (
            <section className="page-section tight">
              <p className="section-tag">Historique des désignations</p>
              <div className="dashboard-list" style={{ marginTop: 16, maxWidth: 620 }}>
                {past.map((m) => (
                  <div key={m.id}>
                    <div><b>{getClubById(m.homeClubId)?.name} vs {getClubById(m.awayClubId)?.name}</b><small>{formatDate(m.date)}</small></div>
                    <span className="status-pill ok">Rapport transmis</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  )
}

function AgentDetails({ agent }: { agent: (typeof agents)[number] }) {
  const represented = agent.playerIds.map((id) => getPlayerById(id)).filter(Boolean)
  return (
    <section className="page-section tight">
      <IdCard
        fifId={agent.fifId}
        birthdate={agent.birthdate}
        rows={[
          { label: 'Licence', value: agent.license },
          { label: 'Statut', value: <span className={`status-pill ${agent.status === 'Actif' ? 'ok' : 'error'}`}>{agent.status}</span> },
          { label: 'Valide jusqu’au', value: formatDate(agent.validUntil) },
        ]}
      />
      {represented.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p className="section-tag">Joueurs représentés</p>
          <div className="card-grid cols-4" style={{ marginTop: 12 }}>
            {represented.map((p) => p && (
              <Link key={p.id} href={`/joueurs/${p.slug}`} className="entity-card">
                <div><strong>{p.name}</strong><span>{p.position}</span></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

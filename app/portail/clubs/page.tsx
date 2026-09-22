import Link from 'next/link'
import { Banknote, ClipboardList, FileText, GraduationCap, Repeat, ShieldCheck, Users } from 'lucide-react'
import { clubs, players, matchesOf, competitions, cityName } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchCard } from '@/components/site/cards'
import { ClubPortalTeams, ClubPortalRoster } from '@/components/site/ClubPortalTools'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Portail Clubs — FIF Digital' }

const statusTone: Record<string, string> = { Valide: 'ok', 'En attente': 'pending', Expirée: 'error' }

export default function ClubPortalPage() {
  const club = clubs[3]
  const roster = players.filter((p) => p.clubId === club.id)
  const pendingLicenses = roster.filter((p) => p.licenseStatus !== 'Valide')
  const clubMatches = matchesOf(club.id)
  const upcoming = clubMatches.filter((m) => m.status === 'À venir').slice(0, 3)
  const clubCompetitions = competitions.filter((c) => club.competitionIds.includes(c.id))
  const documents = [
    { name: 'Statuts du club', status: 'À jour' },
    { name: 'Licence fédérale 2025-2026', status: 'À jour' },
    { name: 'Rapport financier annuel', status: 'En attente' },
    { name: 'Liste des effectifs', status: 'À jour' },
  ]
  const requests = [
    { title: 'Demande de licence — Ismaël Zadi', status: 'pending' },
    { title: 'Aide FIF — Projet Club', status: 'ok' },
    { title: 'Modification de match J14', status: 'error' },
  ]

  return (
    <main>
      <PageHero
        eyebrow="Espace administratif club"
        title={`Portail Clubs — ${club.name}`}
        subtitle={`${cityName(club.cityId)} · Tableau de bord quotidien du club : effectifs, licences, compétitions, matchs, documents et demandes.`}
        breadcrumb={[{ label: 'Portail Clubs' }]}
      />

      <section className="page-section tight">
        <div className="dashboard-grid">
          <div className="dashboard-card"><strong>{roster.length}</strong><span>Licenciés</span></div>
          <div className="dashboard-card"><strong>{pendingLicenses.length}</strong><span>Licences en attente</span></div>
          <div className="dashboard-card"><strong>{clubCompetitions.length}</strong><span>Compétitions engagées</span></div>
          <div className="dashboard-card"><strong>{upcoming.length}</strong><span>Matchs à venir</span></div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="portal-layout" style={{ padding: 0 }}>
          <aside>
            <nav className="sidebar-nav">
              <a href="#effectifs" className="active"><Users size={15} /> Effectifs</a>
              <a href="#equipes"><Repeat size={15} /> Équipes</a>
              <a href="#licences"><ShieldCheck size={15} /> Licences</a>
              <a href="#competitions"><Repeat size={15} /> Compétitions & matchs</a>
              <a href="#feuille-de-match"><ClipboardList size={15} /> Feuille de match</a>
              <a href="#documents"><FileText size={15} /> Documents</a>
              <a href="#finances"><Banknote size={15} /> Finances & projets</a>
              <a href="#formation"><GraduationCap size={15} /> Formation</a>
            </nav>
          </aside>
          <div>
            <div className="dashboard-panel" id="effectifs">
              <h3>Effectifs — {roster.length} joueurs</h3>
              <div className="dashboard-list">
                {roster.slice(0, 6).map((p) => (
                  <div key={p.id}>
                    <div><b>{p.name}</b><small>{p.position}</small></div>
                    <span className={`status-pill ${statusTone[p.licenseStatus]}`}>{p.licenseStatus}</span>
                  </div>
                ))}
              </div>
              <Link href={`/clubs/${club.slug}`} className="text-link" style={{ marginTop: 16, display: 'inline-flex' }}>Voir la fiche club publique →</Link>
              <h3 style={{ marginTop: 24 }}>Ajouter un joueur / demander une licence ou un transfert</h3>
              <ClubPortalRoster />
            </div>

            <div className="dashboard-panel" id="equipes">
              <h3>Gestion des équipes</h3>
              <p className="lede">Activez les catégories d’équipes engagées par le club cette saison.</p>
              <ClubPortalTeams />
            </div>

            <div className="dashboard-panel" id="licences">
              <h3>Licences en attente de traitement</h3>
              {pendingLicenses.length ? (
                <div className="dashboard-list">
                  {pendingLicenses.map((p) => (
                    <div key={p.id}><div><b>{p.name}</b><small>{p.fifId}</small></div><span className={`status-pill ${statusTone[p.licenseStatus]}`}>{p.licenseStatus}</span></div>
                  ))}
                </div>
              ) : <p className="lede">Toutes les licences du club sont à jour.</p>}
            </div>

            <div className="dashboard-panel" id="competitions">
              <h3>Compétitions engagées</h3>
              <div className="chip-row">
                {clubCompetitions.map((c) => <Link key={c.id} href={`/competitions/${c.slug}`} className="chip">{c.name}</Link>)}
              </div>
              <h3 style={{ marginTop: 24 }}>Prochains matchs</h3>
              <div className="card-grid cols-2">
                {upcoming.length ? upcoming.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun match à venir.</p>}
              </div>
            </div>

            <div className="dashboard-panel" id="feuille-de-match">
              <h3>Feuille de match</h3>
              <p className="lede">Saisissez la composition, les événements et le rapport de vos prochaines rencontres.</p>
              {upcoming.length ? (
                <div className="dashboard-list">
                  {upcoming.map((m) => (
                    <div key={m.id}>
                      <div><b>vs {clubs.find((c) => c.id === (m.homeClubId === club.id ? m.awayClubId : m.homeClubId))?.name}</b><small>{new Date(m.date).toLocaleDateString('fr-FR')}</small></div>
                      <Link href={`/admin/feuille-de-match/${m.id}`} className="status-pill neutral">Saisir</Link>
                    </div>
                  ))}
                </div>
              ) : <p className="lede">Aucun match à venir.</p>}
            </div>

            <div className="dashboard-panel" id="documents">
              <h3>Documents du club</h3>
              <div className="dashboard-list">
                {documents.map((d, i) => (
                  <div key={i}><b>{d.name}</b><span className={`status-pill ${d.status === 'À jour' ? 'ok' : 'pending'}`}>{d.status}</span></div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel" id="finances">
              <h3>Demandes & suivi</h3>
              <div className="dashboard-list">
                {requests.map((r, i) => (
                  <div key={i}><b>{r.title}</b><span className={`status-pill ${r.status}`}>{r.status === 'ok' ? 'Validé' : r.status === 'pending' ? 'En cours' : 'Action requise'}</span></div>
                ))}
              </div>
              <h3 style={{ marginTop: 24 }}>Structurer le club</h3>
              <div className="button-group">
                <Link href="/projet-club" className="button-outline">Projet Club</Link>
                <Link href="/aides-projets" className="button-outline">Aides & financement</Link>
              </div>
            </div>

            <div className="dashboard-panel" id="formation">
              <h3>Formation du staff</h3>
              <p className="lede">Inscrivez vos éducateurs et dirigeants aux prochaines sessions FIF Academy.</p>
              <Link href="/formation" className="button-outline" style={{ marginTop: 12 }}>Voir le catalogue de formations</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

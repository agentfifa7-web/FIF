import Link from 'next/link'
import { Banknote, ClipboardList, FileText, GraduationCap, Lock, Repeat, ShieldCheck, Users } from 'lucide-react'
import { clubs, players, matchesOf, competitions, cityName } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { MatchCard } from '@/components/site/cards'
import { ClubPortalTeams, ClubPortalRoster } from '@/components/site/ClubPortalTools'
import { DemoNotice } from '@/components/site/DemoNotice'
import { ServiceSteps } from '@/components/site/ServiceSteps'
import { loadCms } from '@/lib/cms/server'
import { awaitingScore } from '@/lib/format'

export const metadata = { title: 'Portail Clubs — FIF', description: 'Espace réservé aux clubs affiliés : effectifs, licences, compétitions, feuilles de match, documents et demandes.' }

const FEATURES = [
  { icon: Users, title: 'Effectifs et licenciés', text: 'Gérer les joueurs, demander licences et transferts.' },
  { icon: Repeat, title: 'Équipes engagées', text: 'Activer les catégories du club pour la saison.' },
  { icon: ClipboardList, title: 'Feuilles de match', text: 'Saisir compositions, buts, cartons et rapport.' },
  { icon: FileText, title: 'Documents du club', text: 'Statuts, licence club, rapports annuels.' },
  { icon: Banknote, title: 'Aides et projets', text: 'Candidater aux programmes de la FIF.' },
  { icon: GraduationCap, title: 'Formation du staff', text: 'Inscrire éducateurs et dirigeants à la FIF Academy.' },
]

export default async function ClubPortalPage() {
  await loadCms()
  // Aperçu : club réel, uniquement avec ses données publiques (effectif publié, compétitions, matchs).
  const club = clubs[3]
  const roster = players.filter((p) => p.clubId === club.id)
  const upcoming = matchesOf(club.id).filter((m) => m.status === 'À venir').slice(0, 3)
  const clubCompetitions = competitions.filter((c) => club.competitionIds.includes(c.id))

  return (
    <main>
      <PageHero
        eyebrow="Espace professionnel"
        title="Portail Clubs"
        subtitle="L’espace de gestion réservé aux clubs affiliés : effectifs, licences, compétitions, feuilles de match, documents et demandes auprès de la FIF."
        breadcrumb={[{ label: 'Services', href: '/services' }, { label: 'Portail Clubs' }]}
        actions={<><a className="button button-primary" href="#apercu">Voir l’aperçu</a><Link className="button-outline" href="/connexion"><Lock size={16} /> Accès club</Link></>}
      />

      <section className="page-section">
        <div className="svc-layout">
          <div>
            <div className="svc-block">
              <h2>Ce que le portail permet</h2>
              <div className="svc-who">
                {FEATURES.map((f) => <div key={f.title}><f.icon aria-hidden /><strong>{f.title}</strong><p>{f.text}</p></div>)}
              </div>
            </div>
          </div>
          <aside className="svc-action" aria-label="Obtenir un accès">
            <h2>Obtenir un accès</h2>
            <ServiceSteps steps={[
              { title: 'Club affilié', text: 'Le club doit être affilié à la FIF pour la saison en cours.' },
              { title: 'Désignation', text: 'Le président désigne le ou les responsables du compte club.' },
              { title: 'Identifiants', text: 'La FIF remet les accès nominatifs au club.' },
            ]} />
          </aside>
        </div>
      </section>

      <section className="page-section section-alt" id="apercu">
        <h2>Aperçu de l’espace club</h2>
        <DemoNotice title="Aperçu en démonstration">Exemple construit avec les données publiques de {club.name} (effectif publié, compétitions et matchs). Les actions de gestion sont simulées dans ce navigateur et ne sont pas transmises à la FIF.</DemoNotice>
        <div className="dashboard-grid" style={{ margin: '20px 0' }}>
          <div className="dashboard-card"><strong>{roster.length}</strong><span>Joueurs à l’effectif publié</span></div>
          <div className="dashboard-card"><strong>{clubCompetitions.length}</strong><span>Compétition{clubCompetitions.length > 1 ? 's' : ''} engagée{clubCompetitions.length > 1 ? 's' : ''}</span></div>
          <div className="dashboard-card"><strong>{upcoming.length}</strong><span>Matchs à venir ou à compléter</span></div>
          <div className="dashboard-card"><strong>{cityName(club.cityId) || '—'}</strong><span>Ville</span></div>
        </div>
        <div className="portal-layout" style={{ padding: 0 }}>
          <aside>
            <nav className="sidebar-nav" aria-label="Rubriques de l’espace club">
              <a href="#effectifs"><Users size={15} /> Effectifs</a>
              <a href="#equipes"><Repeat size={15} /> Équipes</a>
              <a href="#competitions"><ShieldCheck size={15} /> Compétitions & matchs</a>
              <a href="#feuille-de-match"><ClipboardList size={15} /> Feuille de match</a>
              <a href="#documents"><FileText size={15} /> Documents</a>
              <a href="#finances"><Banknote size={15} /> Aides & projets</a>
            </nav>
          </aside>
          <div>
            <div className="dashboard-panel" id="effectifs">
              <h3>{club.name} — effectif ({roster.length} joueurs)</h3>
              <div className="dashboard-list">
                {roster.slice(0, 6).map((p) => (
                  <div key={p.id}><div><b>{p.name}</b><small>{p.position}</small></div><Link className="status-pill neutral" href={`/joueurs/${p.slug}`}>Fiche</Link></div>
                ))}
              </div>
              <Link href={`/clubs/${club.slug}`} className="text-link" style={{ marginTop: 16, display: 'inline-flex' }}>Voir la fiche club publique</Link>
              <h3 style={{ marginTop: 24 }}>Ajouter un joueur, demander une licence ou un transfert</h3>
              <ClubPortalRoster />
            </div>
            <div className="dashboard-panel" id="equipes">
              <h3>Gestion des équipes</h3>
              <p className="lede">Activez les catégories d’équipes engagées par le club cette saison.</p>
              <ClubPortalTeams />
            </div>
            <div className="dashboard-panel" id="competitions">
              <h3>Compétitions engagées</h3>
              <div className="chip-row">{clubCompetitions.map((c) => <Link key={c.id} href={`/competitions/${c.slug}`} className="chip">{c.name}</Link>)}</div>
              <h3 style={{ marginTop: 24 }}>Matchs à venir ou à compléter</h3>
              <div className="card-grid cols-2">{upcoming.length ? upcoming.map((m) => <MatchCard key={m.id} match={m} />) : <p className="lede">Aucun match programmé.</p>}</div>
            </div>
            <div className="dashboard-panel" id="feuille-de-match">
              <h3>Feuille de match</h3>
              <p className="lede">La saisie officielle des feuilles de match se fait depuis l’administration de la FIF.</p>
              {upcoming.length ? (
                <div className="dashboard-list">
                  {upcoming.map((m) => (
                    <div key={m.id}>
                      <div><b>vs {clubs.find((c) => c.id === (m.homeClubId === club.id ? m.awayClubId : m.homeClubId))?.name}</b><small>{awaitingScore(m) ? 'Score en attente' : m.dateConfirmed === false ? 'Date à confirmer' : new Date(m.date).toLocaleDateString('fr-FR')}</small></div>
                      <Link href={`/admin/feuille-de-match/${m.id}`} className="status-pill neutral">Saisir</Link>
                    </div>
                  ))}
                </div>
              ) : <p className="lede">Aucun match à compléter.</p>}
            </div>
            <div className="dashboard-panel" id="documents">
              <h3>Documents à tenir à jour</h3>
              <ul className="svc-docs">
                {['Statuts du club', 'Licence club de la saison', 'Rapport financier annuel', 'Liste des effectifs'].map((d) => <li key={d}><FileText size={18} aria-hidden /><div><strong>{d}</strong><span>Déposé auprès de la FIF</span></div></li>)}
              </ul>
            </div>
            <div className="dashboard-panel" id="finances">
              <h3>Aides et projets</h3>
              <div className="button-group">
                <Link href="/projet-club" className="button-outline">Diagnostic Projet Club</Link>
                <Link href="/aides-projets" className="button-outline">Aides & financement</Link>
                <Link href="/formation" className="button-outline">Formation du staff</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

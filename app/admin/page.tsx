import Link from 'next/link'
import {
  BarChart3, FileText, Film, Gavel, Newspaper, Settings, Shield, ShoppingBag,
  Ticket, Trophy, Users, Wallet,
} from 'lucide-react'
import {
  clubs, players, competitions, matches, referees, articles, videos, ticketEvents, products,
} from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF Command Center — Admin' }

const sections = [
  { id: 'news', icon: Newspaper, label: 'Actualités', count: articles.length },
  { id: 'videos', icon: Film, label: 'Vidéos', count: videos.length },
  { id: 'competitions', icon: Trophy, label: 'Compétitions', count: competitions.length },
  { id: 'matches', icon: BarChart3, label: 'Matchs', count: matches.length },
  { id: 'players', icon: Users, label: 'Joueurs', count: players.length },
  { id: 'clubs', icon: Shield, label: 'Clubs', count: clubs.length },
  { id: 'licenses', icon: FileText, label: 'Licences', count: players.filter((p) => p.licenseStatus !== 'Valide').length },
  { id: 'referees', icon: Gavel, label: 'Arbitres', count: referees.length },
  { id: 'tickets', icon: Ticket, label: 'Billetterie', count: ticketEvents.length },
  { id: 'store', icon: ShoppingBag, label: 'Boutique', count: products.length },
  { id: 'finance', icon: Wallet, label: 'Finances', count: 0 },
  { id: 'settings', icon: Settings, label: 'Paramètres', count: 0 },
]

export default function AdminPage() {
  const pendingLicenses = players.filter((p) => p.licenseStatus === 'En attente').slice(0, 6)
  const recentArticles = articles.slice(0, 6)
  const liveOrUpcoming = matches.filter((m) => m.status !== 'Terminé').slice(0, 6)

  return (
    <main>
      <PageHero
        eyebrow="Administration fédérale"
        title="FIF Command Center"
        subtitle="Vue d’ensemble de la plateforme : contenus, licences, compétitions, matchs, billetterie et boutique. Environnement de démonstration en lecture seule."
        breadcrumb={[{ label: 'Admin' }]}
      />

      <section className="page-section tight">
        <div className="dashboard-grid">
          <div className="dashboard-card"><strong>{clubs.length}</strong><span>Clubs actifs</span></div>
          <div className="dashboard-card"><strong>{players.length}</strong><span>Joueurs enregistrés</span></div>
          <div className="dashboard-card"><strong>{players.filter((p) => p.licenseStatus !== 'Valide').length}</strong><span>Dossiers licence en attente</span></div>
          <div className="dashboard-card"><strong>{matches.length}</strong><span>Matchs (saison)</span></div>
          <div className="dashboard-card"><strong>{competitions.length}</strong><span>Compétitions</span></div>
          <div className="dashboard-card"><strong>{referees.length}</strong><span>Arbitres</span></div>
          <div className="dashboard-card"><strong>{ticketEvents.length}</strong><span>Événements billetterie</span></div>
          <div className="dashboard-card"><strong>{articles.length}</strong><span>Articles publiés</span></div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Modules CMS</p>
        <div className="card-grid cols-4" style={{ marginTop: 16 }}>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="entity-card">
              <s.icon size={20} color="var(--orange)" />
              <div><strong>{s.label}</strong><span>{s.count} élément(s)</span></div>
            </a>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <div className="portal-layout" style={{ padding: 0 }}>
          <aside>
            <nav className="sidebar-nav">
              {sections.map((s) => <a key={s.id} href={`#${s.id}`}><s.icon size={15} /> {s.label}</a>)}
            </nav>
          </aside>
          <div>
            <div className="dashboard-panel" id="licenses">
              <h3>Dossiers de licence en attente</h3>
              <div className="dashboard-list">
                {pendingLicenses.map((p) => {
                  const club = clubs.find((c) => c.id === p.clubId)
                  return (
                    <div key={p.id}>
                      <div><b>{p.name}</b><small>{club?.name} · {p.fifId}</small></div>
                      <span className="status-pill pending">En attente</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="dashboard-panel" id="news">
              <h3>Dernières publications</h3>
              <div className="dashboard-list">
                {recentArticles.map((a) => (
                  <div key={a.id}>
                    <div><b>{a.title}</b><small>{a.category} · {a.author}</small></div>
                    <Link href={`/actualites/${a.slug}`} className="status-pill neutral">Voir</Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel" id="matches">
              <h3>Matchs à suivre</h3>
              <div className="dashboard-list">
                {liveOrUpcoming.map((m) => {
                  const home = clubs.find((c) => c.id === m.homeClubId)
                  const away = clubs.find((c) => c.id === m.awayClubId)
                  return (
                    <div key={m.id}>
                      <div><b>{home?.name} vs {away?.name}</b><small>{m.status}</small></div>
                      <Link href={`/matches/${m.id}`} className="status-pill neutral">Match Center</Link>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="dashboard-panel" id="clubs">
              <h3>Clubs</h3>
              <p className="lede">{clubs.length} clubs affiliés, tous statuts confondus. Gestion complète (validation, radiation, changement de catégorie) disponible dans la version connectée à la base de données fédérale.</p>
            </div>

            <div className="dashboard-panel" id="finance">
              <h3>Finances & audit</h3>
              <p className="lede">Les modules Finances, Analytics et Audit nécessitent une connexion à l’infrastructure fédérale réelle (base de données, paiements, journalisation) — non simulée dans ce prototype afin de ne jamais présenter de données financières fictives comme réelles.</p>
            </div>

            <div className="dashboard-panel" id="settings">
              <h3>Paramètres</h3>
              <div className="dashboard-list">
                <div><b>RBAC</b><span className="status-pill ok">12 rôles configurés</span></div>
                <div><b>Notifications</b><span className="status-pill ok">Actif</span></div>
                <div><b>Journal d’audit</b><span className="status-pill neutral">Non connecté (démo)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

import Link from 'next/link'
import { Bell, QrCode, Ticket, User } from 'lucide-react'
import { clubs, players, articles, upcomingMatches, cityName } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { NewsCard, MatchCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Mon FIF — FIF Digital' }

export default function AccountPage() {
  const favoriteClub = clubs[3]
  const favoritePlayers = players.filter((p) => p.clubId === favoriteClub.id).slice(0, 3)
  const nextMatch = upcomingMatches(1)[0]
  const notifications = [
    { title: 'Nouvelle liste des Éléphants annoncée', time: 'Il y a 2 h', type: 'SQUAD_ANNOUNCEMENT' },
    { title: `${favoriteClub.name} joue ce week-end`, time: 'Il y a 5 h', type: 'MATCH_START' },
    { title: 'Votre licence a été renouvelée', time: 'Hier', type: 'LICENSE' },
  ]

  return (
    <main>
      <PageHero
        eyebrow="Espace personnel"
        title="Bonjour, Supporter FIF"
        subtitle="Votre football, personnalisé : club favori, prochain match, notifications et FIF ID au même endroit."
        breadcrumb={[{ label: 'Mon FIF' }]}
      />

      <section className="page-section tight">
        <div className="dashboard-grid">
          <div className="dashboard-card"><strong>{favoriteClub.shortName}</strong><span>Club favori</span></div>
          <div className="dashboard-card"><strong>3</strong><span>Notifications non lues</span></div>
          <div className="dashboard-card"><strong>2</strong><span>Billets à venir</span></div>
          <div className="dashboard-card"><strong>Valide</strong><span>Statut FIF ID</span></div>
        </div>
      </section>

      <section className="page-section tight">
        <div className="portal-layout" style={{ padding: 0 }}>
          <aside>
            <nav className="sidebar-nav">
              <a href="#profil" className="active"><User size={15} /> Profil</a>
              <a href="#favoris">Favoris</a>
              <a href="#notifications"><Bell size={15} /> Notifications</a>
              <a href="#tickets"><Ticket size={15} /> Tickets</a>
              <a href="#fifid"><QrCode size={15} /> FIF ID</a>
              <Link href="/">Préférences</Link>
              <Link href="/documents">Confidentialité</Link>
            </nav>
          </aside>
          <div>
            <div className="dashboard-panel" id="profil">
              <h3>Prochain match à suivre</h3>
              {nextMatch ? <div className="card-grid cols-2"><MatchCard match={nextMatch} /></div> : <p className="lede">Aucun match programmé.</p>}
            </div>

            <div className="dashboard-panel" id="favoris">
              <h3>Vos favoris — {favoriteClub.name}</h3>
              <div className="card-grid cols-2">
                <Link href={`/clubs/${favoriteClub.slug}`} className="entity-card"><div><strong>{favoriteClub.name}</strong><span>{cityName(favoriteClub.cityId)} · Club favori</span></div></Link>
                {favoritePlayers.map((p) => (
                  <Link key={p.id} href={`/joueurs/${p.slug}`} className="entity-card"><div><strong>{p.name}</strong><span>{p.position} · Joueur suivi</span></div></Link>
                ))}
              </div>
            </div>

            <div className="dashboard-panel" id="notifications">
              <h3>Notifications récentes</h3>
              <div className="dashboard-list">
                {notifications.map((n, i) => (
                  <div key={i}><div><b>{n.title}</b><small>{n.type}</small></div><small>{n.time}</small></div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel" id="tickets">
              <h3>Mes billets</h3>
              <p className="lede">Aucun billet actif pour le moment. <Link href="/billetterie" className="text-link" style={{ display: 'inline-flex' }}>Découvrir la billetterie →</Link></p>
            </div>

            <div className="dashboard-panel" id="fifid">
              <h3>Mon FIF ID</h3>
              <div className="dashboard-list">
                <div><small>Identifiant</small><b>FIF-SUPP-000482</b></div>
                <div><small>Statut</small><span className="status-pill ok">Actif</span></div>
                <div><small>Type</small><b>Supporter</b></div>
              </div>
              <Link href="/fif-id" className="button-outline" style={{ marginTop: 16 }}>En savoir plus sur le FIF ID</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Actualités pour vous</p>
        <div className="news-grid" style={{ marginTop: 16 }}>
          {articles.slice(0, 3).map((a) => <NewsCard key={a.id} article={a} />)}
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

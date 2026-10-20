import Link from 'next/link'
import { Bell, CalendarDays, Newspaper } from 'lucide-react'
import { articles, realLigue1UpcomingFixtures, realLigue2UpcomingFixtures } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'FIF Notifications — FIF' }

// Notifications construites à partir des données réelles du site : derniers
// résultats publiés et prochains matchs programmés.
export default async function NotificationsPage() {
  await loadCms()
  const now = Date.now()
  const news = articles.slice(0, 8).map((a) => ({ icon: Newspaper, title: a.title, type: a.category.toUpperCase(), when: formatDate(a.date), href: `/actualites/${a.slug}` }))
  const upcoming = [...realLigue1UpcomingFixtures, ...realLigue2UpcomingFixtures]
    .filter((f) => f.date && +new Date(f.date) + 86400000 > now)
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
    .slice(0, 6)
    .map((f) => ({ icon: CalendarDays, title: `${f.homeClub} – ${f.awayClub}`, type: `${f.competitionId === 'comp-l1' ? 'LIGUE 1' : 'LIGUE 2'} · ${f.matchday}E JOURNÉE`, when: formatDate(f.date!), href: '/matches' }))

  return (
    <main>
      <PageHero
        eyebrow="Centre de notifications"
        title="FIF Notifications"
        subtitle="Derniers résultats publiés et prochains matchs programmés du football ivoirien."
        breadcrumb={[{ label: 'Notifications' }]}
      />
      <section className="page-section tight">
        <p className="section-tag">Prochains matchs</p>
        <div className="dashboard-panel" style={{ marginTop: 12 }}>
          <div className="dashboard-list">
            {upcoming.length ? upcoming.map((n, i) => (
              <div key={i}>
                <div><b><n.icon size={13} style={{ verticalAlign: 'middle', marginRight: 8 }} /><Link href={n.href}>{n.title}</Link></b><small>{n.type}</small></div>
                <small>{n.when}</small>
              </div>
            )) : <p className="lede">Aucun match programmé pour le moment.</p>}
          </div>
        </div>
      </section>
      <section className="page-section tight">
        <p className="section-tag">Derniers résultats et annonces</p>
        <div className="dashboard-panel" style={{ marginTop: 12 }}>
          <div className="dashboard-list">
            {news.map((n, i) => (
              <div key={i}>
                <div><b><Bell size={13} style={{ verticalAlign: 'middle', marginRight: 8 }} /><Link href={n.href}>{n.title}</Link></b><small>{n.type}</small></div>
                <small>{n.when}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

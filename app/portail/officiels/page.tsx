import Link from 'next/link'
import { CalendarDays, ClipboardCheck, FileText, GraduationCap } from 'lucide-react'
import { referees, matches, getClubById } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { AvailabilityToggle, ReportsList } from '@/components/site/OfficialPortalTools'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Portail Officiels — Mon espace — FIF Digital' }

export default async function OfficialPortalPage() {
  await loadCms()
  // Espace personnel : affiché seulement pour un officiel réellement enregistré.
  const official = referees[0]
  if (!official) {
    return (
      <main>
        <PageHero
          eyebrow="Portail Officiels — Espace personnel"
          title="Mon espace officiel"
          subtitle="Désignations, disponibilité et rapports de match des arbitres et officiels licenciés."
          breadcrumb={[{ label: 'Officiels', href: '/officiels' }, { label: 'Mon espace' }]}
        />
        <section className="page-section tight">
          <div className="dashboard-panel">
            <h3>Aucun officiel enregistré pour le moment</h3>
            <p className="lede">Cet espace s’ouvre aux arbitres, délégués et commissaires dès que leur fiche est créée à partir de la liste officielle de la Commission Centrale d’Arbitrage. Aucune désignation fictive n’est affichée.</p>
            <Link href="/arbitrage" className="button-outline" style={{ marginTop: 12 }}>Voir l’Arbitrage Center</Link>
          </div>
        </section>
      </main>
    )
  }
  const designations = matches.filter((m) => m.refereeId === official.id && m.status === 'À venir').slice(0, 5)
  const pastMatches = matches.filter((m) => m.refereeId === official.id && m.status === 'Terminé').slice(0, 5)

  const pastLabels = pastMatches.map((m) => ({
    id: m.id,
    label: `${getClubById(m.homeClubId)?.name} vs ${getClubById(m.awayClubId)?.name}`,
    date: formatDate(m.date),
  }))

  return (
    <main>
      <PageHero
        eyebrow="Portail Officiels — Espace personnel"
        title={`Mon espace — ${official.name}`}
        subtitle={`${official.category} · ${official.status} · Désignations, disponibilité et rapports de match.`}
        breadcrumb={[{ label: 'Officiels', href: '/officiels' }, { label: 'Mon espace' }]}
        meta={[
          { value: String(designations.length), label: 'Désignations à venir' },
          { value: String(official.matchesOfficiated), label: 'Matchs arbitrés' },
        ]}
      />

      <section className="page-section tight">
        <p className="section-tag">Ma disponibilité</p>
        <div style={{ marginTop: 12 }}><AvailabilityToggle /></div>
      </section>

      <section className="page-section tight">
        <div className="portal-layout" style={{ padding: 0 }}>
          <aside>
            <nav className="sidebar-nav">
              <a href="#designations" className="active"><CalendarDays size={15} /> Désignations</a>
              <a href="#rapports"><FileText size={15} /> Rapports</a>
              <a href="#formations"><GraduationCap size={15} /> Formations</a>
            </nav>
          </aside>
          <div>
            <div className="dashboard-panel" id="designations">
              <h3>Prochaines désignations</h3>
              {designations.length ? (
                <div className="dashboard-list">
                  {designations.map((m) => (
                    <div key={m.id}>
                      <div><b>{getClubById(m.homeClubId)?.name} vs {getClubById(m.awayClubId)?.name}</b><small>{formatDate(m.date)}</small></div>
                      <Link href={`/matches/${m.id}`} className="status-pill neutral">Détail</Link>
                    </div>
                  ))}
                </div>
              ) : <p className="lede">Aucune désignation à venir pour l’instant.</p>}
            </div>

            <div className="dashboard-panel" id="rapports">
              <h3><ClipboardCheck size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Rapports de match</h3>
              {pastLabels.length ? <ReportsList matches={pastLabels} /> : <p className="lede">Aucun match arbitré récemment.</p>}
            </div>

            <div className="dashboard-panel" id="formations">
              <h3>Formations & perfectionnement</h3>
              <p className="lede">Modules VAR, préparation physique et retours vidéo pour progresser dans votre catégorie.</p>
              <Link href="/arbitrage" className="button-outline" style={{ marginTop: 12 }}>Voir l’Arbitrage Center</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

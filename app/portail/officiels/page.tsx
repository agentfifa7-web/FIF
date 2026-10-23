import Link from 'next/link'
import { CalendarDays, ClipboardCheck, FileText, GraduationCap } from 'lucide-react'
import { referees, matches, getClubById } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { AvailabilityToggle, ReportsList } from '@/components/site/OfficialPortalTools'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Portail Officiels — Mon espace — FIF' }

export default async function OfficialPortalPage() {
  await loadCms()
  // Espace personnel : il faudrait un compte officiel authentifié, qui n'existe
  // pas encore. On n'affiche jamais la fiche d'un arbitre réel à sa place.
  const official = undefined as (typeof referees)[number] | undefined
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
            <p className="lede">Cet espace personnel (désignations, disponibilités, rapports) s’ouvrira aux arbitres, délégués et commissaires avec des identifiants fournis par la FIF. En attendant, les désignations publiées sur les feuilles de match sont consultables dans l’annuaire des officiels.</p>
            <div className="button-group" style={{ marginTop: 12 }}><Link href="/officiels?role=arbitres" className="button-outline">Annuaire des arbitres</Link><Link href="/arbitrage" className="button-outline">Arbitrage Center</Link></div>
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
              <div className="button-group" style={{ marginTop: 12 }}><Link href="/officiels?role=arbitres" className="button-outline">Annuaire des arbitres</Link><Link href="/arbitrage" className="button-outline">Arbitrage Center</Link></div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

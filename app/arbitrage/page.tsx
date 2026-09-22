import Link from 'next/link'
import { referees, matches, clubs } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { ArbitrageWorkflow } from '@/components/site/ArbitrageWorkflow'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Arbitrage Center — FIF Digital' }

export default function ArbitragePage() {
  const active = referees.filter((r) => r.status === 'Actif')
  const fifa = referees.filter((r) => r.category === 'FIFA')
  const designations = matches.filter((m) => m.status === 'À venir').slice(0, 6)

  return (
    <main>
      <PageHero
        eyebrow="Arbitrage Center"
        title="Arbitrage"
        subtitle="Formation, désignations, examens, évaluations et rapports pour le corps arbitral ivoirien."
        breadcrumb={[{ label: 'Arbitrage' }]}
        meta={[
          { value: String(referees.length), label: 'Arbitres licenciés' },
          { value: String(active.length), label: 'Actifs' },
          { value: String(fifa.length), label: 'Catégorie FIFA' },
        ]}
      />

      <section className="page-section tight">
        <p className="section-tag">Prochaines désignations</p>
        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="data-table">
            <thead><tr><th className="align-left">MATCH</th><th className="align-left">ARBITRE</th><th>DATE</th></tr></thead>
            <tbody>
              {designations.map((m) => {
                const home = clubs.find((c) => c.id === m.homeClubId)
                const away = clubs.find((c) => c.id === m.awayClubId)
                const ref = referees.find((r) => r.id === m.refereeId)
                return (
                  <tr key={m.id}>
                    <td className="align-left"><Link href={`/matches/${m.id}`}>{home?.name} vs {away?.name}</Link></td>
                    <td className="align-left">{ref?.name}</td>
                    <td>{new Date(m.date).toLocaleDateString('fr-FR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Se former à l’arbitrage</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          <div className="info-tile"><strong>Formation initiale</strong><p>Lois du jeu, gestion de match, examen théorique et pratique pour devenir arbitre régional.</p></div>
          <div className="info-tile"><strong>Perfectionnement</strong><p>Modules VAR, préparation physique et mentale, retours vidéo pour progresser vers la Fédérale 1.</p></div>
          <div className="info-tile"><strong>Évaluation continue</strong><p>Rapports d’observateurs, statistiques de performance et plan de progression individualisé.</p></div>
        </div>
        <Link href="/formation" className="button-outline" style={{ marginTop: 20, display: 'inline-flex' }}>Voir les sessions de formation arbitrage</Link>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Mon parcours arbitre</p>
        <p className="lede" style={{ color: '#a9b7af' }}>Inscription, formation initiale, examen théorique, examen pratique puis résultat — suivez votre parcours de candidat arbitre.</p>
        <ArbitrageWorkflow />
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

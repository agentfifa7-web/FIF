import { Landmark, ScrollText, Users2, Wallet } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'La Fédération — FIF Digital' }

const commissions = ['Commission des compétitions', 'Commission d’arbitrage', 'Commission de discipline', 'Commission du football féminin', 'Commission médicale', 'Commission marketing & communication']

export default function FederationPage() {
  return (
    <main>
      <PageHero
        eyebrow="Institution"
        title="La Fédération Ivoirienne de Football"
        subtitle="Gouvernance, missions, commissions et transparence : l’organisation qui structure le football ivoirien."
        breadcrumb={[{ label: 'Fédération' }]}
      />

      <section className="page-section tight" id="gouvernance">
        <p className="section-tag">Gouvernance</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          <div className="info-tile"><Landmark /><strong>Président</strong><p>Élu par l’Assemblée Générale, il représente la Fédération et préside le Comité Exécutif.</p></div>
          <div className="info-tile"><Users2 /><strong>Comité exécutif</strong><p>Organe de décision entre les Assemblées Générales, composé des membres élus et des présidents de commission.</p></div>
          <div className="info-tile"><ScrollText /><strong>Statuts & règlements</strong><p>Les textes fondateurs qui encadrent la gouvernance, les compétitions et la discipline.</p></div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Commissions</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {commissions.map((c) => <div className="info-tile" key={c}><strong>{c}</strong></div>)}
        </div>
      </section>

      <section className="page-section tight" id="transparence">
        <p className="section-tag">Transparence — FIF Transparence</p>
        <p className="lede">La Fédération publie, lorsqu’ils sont disponibles : rapports d’activité, budget, décisions des commissions, appels d’offres et statistiques institutionnelles.</p>
        <div className="info-tiles" style={{ marginTop: 20 }}>
          <div className="info-tile"><Wallet /><strong>Rapports & budget</strong><p>Rapports annuels et exécution budgétaire publiés après validation par l’Assemblée Générale.</p></div>
          <div className="info-tile"><ScrollText /><strong>Décisions</strong><p>Décisions des commissions (compétitions, discipline, arbitrage) rendues publiques dans le respect des règlements.</p></div>
          <div className="info-tile"><Landmark /><strong>Appels d’offres</strong><p>Marchés et partenariats publiés pour garantir l’équité et la transparence des procédures.</p></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

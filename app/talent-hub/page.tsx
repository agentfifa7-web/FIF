import { AlertTriangle } from 'lucide-react'
import { players } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { PlayerExplorer } from '@/components/site/PlayerExplorer'
import { DemoBadge } from '@/components/site/DemoBadge'
import { age } from '@/lib/format'

export const metadata = { title: 'Talent Hub — FIF Digital' }

export default function TalentHubPage() {
  const young = players.filter((p) => age(p.birthdate) <= 19)

  return (
    <main>
      <PageHero
        eyebrow="Portail de détection"
        title="Talent Hub"
        subtitle="Repérez les jeunes talents du football ivoirien par poste, âge, club et région."
        breadcrumb={[{ label: 'Talent Hub' }]}
        meta={[{ value: String(young.length), label: 'Profils U19 et moins' }]}
      />

      <section className="page-section tight">
        <div className="sim-panel" style={{ margin: 0 }}>
          <p><AlertTriangle size={15} /> Les statistiques affichées sont des données de démonstration. Aucune évaluation sportive présentée ici ne constitue une vérité automatique — les rapports de scouting restent des appréciations subjectives de leurs auteurs.</p>
        </div>
      </section>

      <section className="page-section tight">
        <PlayerExplorer players={young} />
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

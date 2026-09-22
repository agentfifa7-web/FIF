import Link from 'next/link'
import { ArrowRight, Calendar, Landmark, Mail, MapPin, Phone } from 'lucide-react'
import {
  presidentProfile, executiveCommittee, commissions, officialDocuments,
  federationDirections, federationMilestones,
  clubs, players, referees, stadiums, regions, competitions,
} from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { PersonPortrait } from '@/components/site/PersonPortrait'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'La Fédération — FIF Digital' }

const ORGS = ['FIF', 'CAF', 'FIFA'] as const

const MISSIONS = [
  'Structurer, développer et promouvoir le football sous toutes ses formes sur l’ensemble du territoire ivoirien.',
  'Représenter la Côte d’Ivoire auprès de la CAF et de la FIFA.',
  'Organiser les compétitions nationales et sélectionner les équipes nationales.',
  'Former et certifier les joueurs, entraîneurs, arbitres et dirigeants.',
  'Garantir l’éthique, l’intégrité et la bonne gouvernance du football ivoirien.',
]

export default function FederationPage() {
  return (
    <main>
      <PageHero
        eyebrow="Institution"
        title="La Fédération Ivoirienne de Football"
        subtitle="Gouvernance, présidence, comité exécutif, commissions, textes officiels et transparence : l’organisation qui structure le football ivoirien."
        breadcrumb={[{ label: 'Fédération' }]}
        meta={[
          { value: String(executiveCommittee.length + 1), label: 'Membres de gouvernance' },
          { value: String(commissions.length), label: 'Commissions' },
        ]}
      />

      <section className="page-section tight" id="missions">
        <p className="section-tag">Missions</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {MISSIONS.map((m, i) => (
            <div className="info-tile" key={i}><p>{m}</p></div>
          ))}
        </div>
      </section>

      <section className="page-section tight" id="chiffres-cles">
        <p className="section-tag">Chiffres clés</p>
        <div className="card-grid cols-4" style={{ marginTop: 16 }}>
          <div className="stat-card"><strong>{clubs.length}</strong><span>Clubs affiliés</span></div>
          <div className="stat-card"><strong>{players.length.toLocaleString('fr-FR')}</strong><span>Joueurs licenciés</span></div>
          <div className="stat-card"><strong>{referees.length}</strong><span>Arbitres</span></div>
          <div className="stat-card"><strong>{competitions.length}</strong><span>Compétitions organisées</span></div>
          <div className="stat-card"><strong>{stadiums.length}</strong><span>Stades homologués</span></div>
          <div className="stat-card"><strong>{regions.length}</strong><span>Régions couvertes</span></div>
        </div>
      </section>

      <section className="page-section tight" id="president">
        <p className="section-tag">Présidence</p>
        <Link href="/federation/president" className="president-preview">
          <PersonPortrait seed={presidentProfile.photoSeed} size={90} />
          <div>
            <strong>{presidentProfile.name}</strong>
            <span>{presidentProfile.role} · depuis {presidentProfile.since}</span>
            <p>{presidentProfile.word.slice(0, 140)}…</p>
          </div>
          <ArrowRight />
        </Link>
      </section>

      <section className="page-section tight" id="comite">
        <div className="page-section-head">
          <div><p className="section-tag">Comité exécutif</p><h2 style={{ fontSize: 24 }}>Gouvernance fédérale</h2></div>
        </div>
        <div className="card-grid" style={{ marginTop: 16 }}>
          {executiveCommittee.map((m) => (
            <Link key={m.id} href={`/federation/comite/${m.slug}`} className="entity-card">
              <PersonPortrait seed={m.name} size={44} />
              <div><strong>{m.name}</strong><span>{m.role}</span></div>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section tight dark-section" id="commissions">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Commissions</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {commissions.map((c) => (
            <Link href={`/federation/commissions/${c.slug}`} className="entity-card" key={c.id}>
              <div><strong>{c.name}</strong><span>{c.mission}</span></div>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section tight" id="directions">
        <div className="page-section-head">
          <div><p className="section-tag">Directions</p><h2 style={{ fontSize: 24 }}>Services administratifs et techniques</h2></div>
        </div>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          {federationDirections.map((d, i) => (
            <div className="entity-card" key={i}>
              <div><strong>{d.name}</strong><span>{d.mission}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight dark-section" id="historique">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Historique</p>
        <div className="checkin-list" style={{ marginTop: 16 }}>
          {federationMilestones.map((m, i) => (
            <div className="checkin-row" key={i}>
              <Calendar size={18} />
              <div><strong>{m.year}</strong><span>{m.event}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section tight" id="documents">
        <div className="page-section-head">
          <div><p className="section-tag">Statuts & règlements</p><h2 style={{ fontSize: 24 }}>Textes par organisation</h2></div>
          <Link href="/documents" className="text-link">Tous les documents <ArrowRight /></Link>
        </div>
        {ORGS.map((org) => (
          <div key={org} style={{ marginTop: 20 }}>
            <b style={{ fontSize: 12, letterSpacing: '.06em', color: 'var(--muted)', textTransform: 'uppercase' }}>{org}</b>
            <div className="card-grid cols-2" style={{ marginTop: 10 }}>
              {officialDocuments.filter((d) => d.organization === org).slice(0, 4).map((d) => (
                <Link href={`/documents/${d.slug}`} className="entity-card" key={d.id}>
                  <Landmark size={18} color="var(--orange)" />
                  <div><strong>{d.title}</strong><span>{d.category}</span></div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="page-section tight" id="transparence">
        <p className="section-tag">Transparence — FIF Transparence</p>
        <p className="lede">Programme du Président, budget, décisions, appels d’offres et statistiques institutionnelles : tout est consultable dans la Transparence FIF.</p>
        <Link href="/federation/transparence" className="button button-primary" style={{ marginTop: 16 }}>Ouvrir la Transparence FIF <ArrowRight /></Link>
      </section>

      <section className="page-section tight dark-section" id="contacts">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Contacts</p>
        <div className="card-grid cols-3" style={{ marginTop: 16 }}>
          <div className="info-tile"><MapPin /><strong>Siège fédéral</strong><p>Cocody, Abidjan — Côte d’Ivoire</p></div>
          <div className="info-tile"><Phone /><strong>Standard</strong><p>+225 27 22 00 00 00</p></div>
          <div className="info-tile"><Mail /><strong>Courriel</strong><p>contact@fif.ci</p></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

import Link from 'next/link'
import { QrCode, ShieldCheck, User, Users } from 'lucide-react'
import { players } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'FIF ID — FIF Digital' }

const types = ['Joueur', 'Entraîneur', 'Arbitre', 'Officiel', 'Agent', 'Club', 'Académie']

export default function FifIdPage() {
  const sample = players[12]

  return (
    <main>
      <PageHero
        eyebrow="Identité numérique fédérale"
        title="FIF ID"
        subtitle="Un identifiant numérique unique pour chaque acteur du football ivoirien : joueurs, entraîneurs, arbitres, officiels, agents, clubs et académies."
        breadcrumb={[{ label: 'FIF ID' }]}
        meta={[{ value: String(players.length + 1), label: 'Identités actives (démo)' }]}
      />

      <section className="page-section tight">
        <div className="card-grid cols-2">
          <div>
            <p className="lede">Chaque FIF ID associe une identité vérifiée, un QR code, un statut et un profil. Il devient la clé d’accès unique à tous les services fédéraux : licences, formation, billetterie, boutique et portails métiers.</p>
            <div className="chip-row" style={{ marginTop: 20 }}>
              {types.map((t) => <span className="chip" key={t}>{t}</span>)}
            </div>
            <div className="button-group" style={{ marginTop: 28 }}>
              <Link href="/verifier" className="button button-primary">Vérifier un FIF ID <ShieldCheck size={16} /></Link>
              <Link href="/inscription" className="button-outline">Créer mon FIF ID</Link>
            </div>
          </div>
          <div className="fif-id-card">
            <div className="fif-id-card-top"><span>FIF ID</span><QrCode /></div>
            <div className="fif-id-card-body">
              <span className="avatar" style={{ background: '#087443' }}>{sample.name.split(' ').map((n) => n[0]).join('')}</span>
              <div>
                <strong>{sample.name}</strong>
                <span>{sample.fifId}</span>
              </div>
            </div>
            <div className="fif-id-card-foot"><span>Type : Joueur</span><span className="status-pill ok">Actif</span></div>
          </div>
        </div>
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Comment ça marche</p>
        <div className="info-tiles" style={{ marginTop: 20 }}>
          <div className="info-tile"><User /><strong>1. Créer son identité</strong><p>Inscription en ligne ou via son club, sa ligue ou son district. Vérification par la FIF.</p></div>
          <div className="info-tile"><QrCode /><strong>2. Recevoir son FIF ID</strong><p>Identifiant unique, QR code et profil numérique consultables à tout moment.</p></div>
          <div className="info-tile"><Users /><strong>3. Accéder aux services</strong><p>Licences, transferts, formation, billetterie, boutique : un seul compte pour tout.</p></div>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

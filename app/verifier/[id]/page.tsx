import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { verifyIdentity } from '@/lib/data/mock'
import { Breadcrumb } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Vérification ${decodeURIComponent(id)} — FIF Digital` }
}

export default async function VerifyResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const identity = verifyIdentity(decodeURIComponent(id))

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF ID', href: '/fif-id' }, { label: 'Vérifier', href: '/verifier' }, { label: decodeURIComponent(id) }]} />
      </div>
      <section className="page-section tight">
        <div className="verify-result" style={{ borderColor: identity ? '#8fd6ab' : '#f3b3ae' }}>
          {identity ? <CheckCircle2 color="var(--green)" size={40} /> : <XCircle color="#c62828" size={40} />}
          <h1>{identity ? 'Identité vérifiée' : 'Identifiant introuvable'}</h1>
          {identity ? (
            <div className="dashboard-list" style={{ marginTop: 20, width: '100%', maxWidth: 420 }}>
              <div><small>Nom</small><b>{identity.name}</b></div>
              <div><small>Type</small><b>{identity.type}</b></div>
              <div><small>Statut</small><span className="status-pill ok">{identity.status}</span></div>
              <div><small>Valide jusqu’au</small><b>{formatDate(identity.validUntil)}</b></div>
            </div>
          ) : (
            <p className="lede">Aucune identité fédérale ne correspond à « {decodeURIComponent(id)} ». Vérifiez l’identifiant saisi.</p>
          )}
          <div className="button-group" style={{ marginTop: 24 }}>
            {identity && <Link href={identity.profileHref} className="button button-primary">Voir le profil public</Link>}
            <Link href="/verifier" className="button-outline">Nouvelle vérification</Link>
          </div>
        </div>
      </section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

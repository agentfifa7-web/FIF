import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { getClubById, verifyIdentity } from '@/lib/data/mock'
import { licences } from '@/lib/cms/private-data'
import { Breadcrumb } from '@/components/site/PageHero'
import { LocalVerify } from '@/components/site/LocalVerify'
import { formatDate } from '@/lib/format'
import { loadCms } from '@/lib/cms/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  await loadCms()
  const { id } = await params
  return { title: `Vérification ${decodeURIComponent(id)} — FIF Digital` }
}

export default async function VerifyResultPage({ params }: { params: Promise<{ id: string }> }) {
  await loadCms()
  const { id } = await params
  const identity = verifyIdentity(decodeURIComponent(id))
  const wanted = decodeURIComponent(id).trim().toUpperCase()
  const licence = identity ? undefined : licences.find((l) => l.number.toUpperCase() === wanted)

  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF ID', href: '/fif-id' }, { label: 'Vérifier', href: '/verifier' }, { label: decodeURIComponent(id) }]} />
      </div>
      <section className="page-section tight">
        {licence ? (
          <div className="verify-result" style={{ borderColor: licence.status === 'Valide' ? '#8fd6ab' : '#f3b3ae' }}>
            {licence.status === 'Valide' ? <CheckCircle2 color="var(--green)" size={40} /> : <XCircle color="#c62828" size={40} />}
            <h1>{licence.status === 'Valide' ? 'Licence valide' : `Licence ${licence.status.toLowerCase()}`}</h1>
            <div className="dashboard-list" style={{ marginTop: 20, width: '100%', maxWidth: 420 }}>
              <div><small>Numéro</small><b>{licence.number}</b></div>
              <div><small>Titulaire</small><b>{licence.holderName}</b></div>
              <div><small>Type</small><b>{licence.type}</b></div>
              {licence.clubId && <div><small>Club</small><b>{getClubById(licence.clubId)?.name ?? '—'}</b></div>}
              <div><small>Saison</small><b>{licence.season}</b></div>
              <div><small>Statut</small><span className={`status-pill ${licence.status === 'Valide' ? 'ok' : 'error'}`}>{licence.status}</span></div>
              {licence.expiresAt && <div><small>Valide jusqu’au</small><b>{formatDate(licence.expiresAt)}</b></div>}
            </div>
            <div className="button-group" style={{ marginTop: 24 }}><Link href="/verifier" className="button-outline">Nouvelle vérification</Link></div>
          </div>
        ) : identity ? (
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
        ) : <LocalVerify id={decodeURIComponent(id)} />}
      </section>
    </main>
  )
}

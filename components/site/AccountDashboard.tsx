'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CreditCard, IdCard, LogOut, Package, ShoppingBag, Ticket, UserRound } from 'lucide-react'
import { accountStatus, identityProgress, maskPhone, signOut, updateAccount, useAccount } from '@/lib/account'
import { FifIdCardFront } from './FifIdCard'
import { formatMoney } from '@/lib/format'
import type { ShopOrder } from '@/lib/cart'

interface ClubOption { id: string; name: string; slug: string }

// Espace personnel du titulaire d'un FIF ID connecté (supporter, joueur,
// dirigeant, entraîneur, arbitre, agent, journaliste).
export function AccountDashboard({ clubs, nextMatch, news }: { clubs: ClubOption[]; nextMatch: React.ReactNode; news: React.ReactNode }) {
  const { account, ready } = useAccount()
  const [orders, setOrders] = useState<ShopOrder[]>([])

  useEffect(() => {
    try { setOrders(JSON.parse(window.localStorage.getItem('fif-store-orders') ?? '[]')) } catch { setOrders([]) }
  }, [account])

  if (!ready) return null

  if (!account) {
    return (
      <div className="dashboard-panel" style={{ margin: 0, maxWidth: 720 }}>
        <h3><UserRound size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--orange)' }} />À qui s’adresse « Mon compte » ?</h3>
        <p className="lede" style={{ fontSize: 15 }}>
          « Mon compte » est l’espace personnel de toute personne qui possède un <b>FIF ID</b> : supporters, joueurs et joueuses, dirigeants de club, entraîneurs, arbitres, agents et journalistes.
          On y retrouve son identifiant FIF ID et son QR code, son club favori, ses commandes de la boutique, ses billets et les prochains matchs à suivre.
        </p>
        <p className="lede" style={{ fontSize: 15 }}>Le FIF ID se crée gratuitement avec un simple numéro de téléphone — sans email ni mot de passe.</p>
        <div className="button-group" style={{ marginTop: 18 }}>
          <Link href="/inscription" className="button button-primary">Créer mon FIF ID</Link>
          <Link href="/connexion" className="button-outline">Se connecter</Link>
        </div>
      </div>
    )
  }

  const status = accountStatus(account)
  const progress = identityProgress(account)
  const favorite = clubs.find((c) => c.id === account.favoriteClubId)
  const created = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(account.createdAt))

  return (
    <div className="account-grid">
      <div className="account-card-col">
        <Link href="/compte/carte" className="fid-sizer" aria-label="Ouvrir ma carte FIF ID"><FifIdCardFront account={account} /></Link>
        {!progress.complete ? (
          <div className="account-complete">
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(progress.done / progress.total) * 100}%` }} /></div>
            <p>Identité complétée à {Math.round((progress.done / progress.total) * 100)} % — complétez-la pour obtenir votre carte.</p>
            <Link href="/compte/identite" className="button button-primary">Compléter mon identité</Link>
          </div>
        ) : (
          <Link href="/compte/carte" className="button-outline" style={{ alignSelf: 'flex-start' }}><CreditCard size={14} /> Ma carte : recto, verso, carte physique</Link>
        )}
      </div>

      <div className="dashboard-panel" style={{ margin: 0 }}>
        <h3>Bonjour, {account.fullName.split(/\s+/)[0]}</h3>
        <div className="dashboard-list">
          <div><small>Téléphone</small><b>{maskPhone(account.phone)}</b></div>
          <div><small>Profil</small><b>{account.role}</b></div>
          {account.matricule && <div><small>Matricule</small><b>{account.matricule}</b></div>}
          <div><small>FIF ID créé le</small><b>{created}</b></div>
        </div>
        {status.tone !== 'ok' && (
          <p className="lede" style={{ fontSize: 13, marginTop: 12 }}>Votre profil {account.role.toLowerCase()} sera activé après vérification de votre matricule par la FIF.</p>
        )}
        <button type="button" className="button-outline" style={{ marginTop: 16 }} onClick={signOut}><LogOut size={14} /> Se déconnecter</button>
      </div>

      <div className="dashboard-panel" style={{ margin: 0 }}>
        <h3>Mon club favori</h3>
        <div className="text-field" style={{ marginBottom: 8 }}>
          <label htmlFor="fav-club">Choisir un club</label>
          <select id="fav-club" value={account.favoriteClubId ?? ''} onChange={(e) => updateAccount({ favoriteClubId: e.target.value || undefined })}>
            <option value="">— Aucun —</option>
            {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {favorite && <Link href={`/clubs/${favorite.slug}`} className="text-link">Voir la fiche de {favorite.name} →</Link>}
      </div>

      <div className="dashboard-panel" style={{ margin: 0 }}>
        <h3><Package size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Mes commandes boutique</h3>
        {orders.length === 0 ? (
          <p className="lede" style={{ fontSize: 14 }}>Aucune commande pour le moment. <Link href="/boutique" className="text-link" style={{ display: 'inline' }}>Découvrir la boutique →</Link></p>
        ) : (
          <div className="dashboard-list">
            {orders.slice(0, 5).map((o) => (
              <div key={o.ref}>
                <div><b>{o.ref}</b><small>{new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(o.date))} · {o.lines.reduce((n, l) => n + l.qty, 0)} article(s) · {o.payment}</small></div>
                <b>{formatMoney(o.total)}</b>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-panel" style={{ margin: 0 }}>
        <h3><Ticket size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Mes billets</h3>
        <p className="lede" style={{ fontSize: 14 }}>Aucun billet actif. <Link href="/billetterie" className="text-link" style={{ display: 'inline' }}>Voir la billetterie →</Link></p>
      </div>

      <div className="dashboard-panel" style={{ margin: 0 }}>
        <h3>Raccourcis</h3>
        <div className="chip-row">
          <Link href="/boutique/panier" className="chip"><ShoppingBag size={13} /> Mon panier</Link>
          {account.role === 'Supporter' && <Link href="/supporters/fan-id" className="chip"><IdCard size={13} /> Mon Fan ID supporter</Link>}
          {account.role === 'Dirigeant de club' && <Link href="/portail/clubs" className="chip">Portail Clubs</Link>}
          {['Entraîneur', 'Arbitre', 'Agent'].includes(account.role) && <Link href="/officiels" className="chip">Portail Officiels</Link>}
          {account.role === 'Joueur / Joueuse' && <Link href="/licences" className="chip">Ma licence</Link>}
          <Link href="/formation" className="chip">FIF Academy</Link>
        </div>
      </div>

      <div className="dashboard-panel account-wide" style={{ margin: 0 }}>
        <h3>Prochain match à suivre</h3>
        {nextMatch}
      </div>

      <div className="account-wide">
        <p className="section-tag">Actualités</p>
        <div style={{ marginTop: 16 }}>{news}</div>
      </div>
    </div>
  )
}

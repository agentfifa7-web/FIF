'use client'

import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { TRANSFERT_STAGES, submitTransfert, advanceTransfert, useDossiers } from '@/lib/workflows'
import { Stepper } from '@/components/site/widgets'
import { formatDate } from '@/lib/format'

interface ClubOption { id: string; name: string }

export function TransfertWorkflow({ clubs }: { clubs: ClubOption[] }) {
  const { transfert, ready } = useDossiers()
  const [joueur, setJoueur] = useState('')
  const [vendeur, setVendeur] = useState(clubs[0]?.name ?? '')
  const [acheteur, setAcheteur] = useState(clubs[1]?.name ?? clubs[0]?.name ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!joueur.trim() || vendeur === acheteur) return
    submitTransfert(joueur.trim(), vendeur, acheteur)
    setJoueur('')
  }

  return (
    <>
      <form className="form-card" style={{ margin: '16px 0 0', maxWidth: 480 }} onSubmit={handleSubmit}>
        <div className="text-field">
          <label htmlFor="trf-joueur">Joueur concerné</label>
          <input id="trf-joueur" type="text" required placeholder="Nom du joueur" value={joueur} onChange={(e) => setJoueur(e.target.value)} />
        </div>
        <div className="text-field">
          <label htmlFor="trf-vendeur">Club vendeur</label>
          <select id="trf-vendeur" value={vendeur} onChange={(e) => setVendeur(e.target.value)}>
            {clubs.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="text-field">
          <label htmlFor="trf-acheteur">Club acheteur</label>
          <select id="trf-acheteur" value={acheteur} onChange={(e) => setAcheteur(e.target.value)}>
            {clubs.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}>Créer la demande de transfert</button>
        </div>
        <p className="muted-sm" style={{ margin: '14px 0 0' }}>Démonstration locale : la demande est suivie dans votre navigateur.</p>
      </form>

      {ready && transfert.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 28 }}>
          {transfert.map((d) => (
            <div className="entity-card" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 24 }} key={d.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <strong>{d.joueur}</strong>
                  <span className="muted-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{d.clubVendeur} <ArrowRightLeft size={12} /> {d.clubAcheteur}</span>
                </div>
                {d.stage !== 'Statut mis à jour' && (
                  <button type="button" className="button-outline" onClick={() => advanceTransfert(d.id)}>Faire avancer le dossier</button>
                )}
              </div>
              <Stepper steps={[...TRANSFERT_STAGES]} active={TRANSFERT_STAGES.indexOf(d.stage)} />
              {d.stage === 'Statut mis à jour' && (
                <p className="pronostic-submitted" style={{ justifyContent: 'flex-start', marginTop: 16 }}>Transfert finalisé le {formatDate(d.updatedAt)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

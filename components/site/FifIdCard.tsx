'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Nfc } from 'lucide-react'
import { accountStatus, cardExpiry, EMPTY_IDENTITY, formatPhone, identityProgress, machineReadableLines, type FifAccount } from '@/lib/account'

const fmt = (iso?: string | null) => (iso ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso)) : '—')

export function verifyUrl(fifId: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fif.ci'
  return `${origin}/verifier/${encodeURIComponent(fifId)}`
}

function useQr(fifId: string) {
  const [qr, setQr] = useState('')
  useEffect(() => {
    QRCode.toDataURL(verifyUrl(fifId), { margin: 1, width: 320, errorCorrectionLevel: 'M', color: { dark: '#041b12', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(''))
  }, [fifId])
  return qr
}

function Field({ label, value, wide = false }: { label: string; value?: string; wide?: boolean }) {
  return (
    <div className={wide ? 'fid-field is-wide' : 'fid-field'}>
      <span>{label}</span>
      <b>{value?.trim() ? value : '—'}</b>
    </div>
  )
}

/** Recto de la carte FIF ID. */
export function FifIdCardFront({ account }: { account: FifAccount }) {
  const id = account.identity ?? EMPTY_IDENTITY
  const qr = useQr(account.fifId)
  const progress = identityProgress(account)
  const status = accountStatus(account)
  const initials = account.fullName.split(/\s+/).map((n) => n[0]).join('').slice(0, 3).toUpperCase()
  const watermark = !progress.complete ? 'Identité incomplète' : status.tone !== 'ok' ? 'En attente de vérification' : ''

  return (
    <div className="fid-card fid-front">
      <div className="fid-flag" aria-hidden><i /><i /><i /></div>
      <header className="fid-head">
        <img src="/fif-logo.png" alt="" />
        <div>
          <b>Fédération Ivoirienne de Football</b>
          <span>Carte d’identité fédérale · FIF ID</span>
        </div>
        <Nfc className="fid-nfc" aria-label="Sans contact" />
      </header>

      <div className="fid-main">
        <div className="fid-photo-col">
          <div className="fid-photo">
            {id.photo ? <img src={id.photo} alt={`Photo de ${account.fullName}`} /> : <span>{initials}</span>}
          </div>
          <div className="fid-chip" aria-hidden />
        </div>
        <div className="fid-fields">
          <Field label="Nom" value={id.lastName || account.fullName.split(/\s+/).slice(-1)[0]} wide />
          <Field label="Prénoms" value={id.firstNames || account.fullName.split(/\s+/).slice(0, -1).join(' ')} wide />
          <Field label="Né(e) le" value={id.birthDate ? fmt(id.birthDate) : ''} />
          <Field label="Sexe" value={id.sex} />
          <Field label="Lieu de naissance" value={id.birthPlace} />
          <Field label="Nationalité" value={id.nationality} />
          <Field label="Profil" value={account.role} />
          <Field label="Matricule" value={account.matricule ?? (account.role === 'Supporter' ? 'Non requis' : '')} />
        </div>
        <div className="fid-qr">
          {qr ? <img src={qr} alt="QR code de vérification" /> : <span />}
        </div>
      </div>

      <footer className="fid-foot">
        <div><span>N° FIF ID</span><b className="fid-number">{account.fifId}</b></div>
        <div><span>Émise le</span><b>{fmt(account.cardIssuedAt)}</b></div>
        <div><span>Expire le</span><b>{fmt(cardExpiry(account))}</b></div>
      </footer>

      {watermark && <div className="fid-watermark">{watermark}</div>}
    </div>
  )
}

/** Verso de la carte FIF ID. */
export function FifIdCardBack({ account }: { account: FifAccount }) {
  const id = account.identity ?? EMPTY_IDENTITY
  const qr = useQr(account.fifId)
  const mrz = machineReadableLines(account)

  return (
    <div className="fid-card fid-back">
      <div className="fid-stripe" aria-hidden />
      <div className="fid-back-body">
        <div className="fid-back-qr">
          {qr && <img src={qr} alt="QR code de vérification" />}
          <span>Scannez pour vérifier</span>
        </div>
        <div className="fid-back-info">
          <Field label="Pièce d’identité" value={id.idNumber ? `${id.idType.replace(/ \(.+\)/, '')} n° ${id.idNumber}` : ''} wide />
          <Field label="Résidence" value={[id.city, id.address].filter(Boolean).join(' — ')} wide />
          <Field label="Téléphone" value={formatPhone(account.phone)} />
          <Field label="Contact d’urgence" value={id.emergencyContact} />
          <div className="fid-signature"><span>Signature du titulaire</span></div>
        </div>
      </div>
      <p className="fid-legal">
        Carte personnelle et incessible, propriété de la Fédération Ivoirienne de Football. Elle identifie son titulaire auprès de la FIF, des ligues et des clubs.
        En cas de perte : contact@fif.ci. Fonction paiement activable avec le partenaire bancaire de la FIF.
      </p>
      <div className="fid-mrz" aria-label="Zone de lecture automatique">
        {mrz.map((l) => <div key={l}>{l}</div>)}
      </div>
    </div>
  )
}

/** Carte recto/verso qui se retourne au clic. */
export function FifIdCardFlip({ account }: { account: FifAccount }) {
  const [back, setBack] = useState(false)
  return (
    <div className="fid-flip-wrap">
      <button type="button" className={back ? 'fid-flip is-back' : 'fid-flip'} onClick={() => setBack((b) => !b)} aria-label={back ? 'Voir le recto de la carte' : 'Voir le verso de la carte'}>
        <div className="fid-flip-inner">
          <div className="fid-face"><FifIdCardFront account={account} /></div>
          <div className="fid-face fid-face-back"><FifIdCardBack account={account} /></div>
        </div>
      </button>
      <p className="fid-flip-hint">Touchez la carte pour la retourner ({back ? 'verso' : 'recto'})</p>
    </div>
  )
}

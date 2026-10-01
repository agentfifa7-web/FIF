'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Camera, CheckCircle2 } from 'lucide-react'
import { EMPTY_IDENTITY, ID_TYPES, saveIdentity, useAccount, type FifIdentity } from '@/lib/account'

const NATIONALITIES = ['Ivoirienne', 'Burkinabè', 'Malienne', 'Guinéenne', 'Sénégalaise', 'Ghanéenne', 'Nigériane', 'Libérienne', 'Béninoise', 'Togolaise', 'Nigérienne', 'Camerounaise', 'Française', 'Autre']

/** Redimensionne la photo (portrait 4:5) pour la stocker légèrement. */
function resizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const W = 360, H = 450
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('canvas'))
        const scale = Math.max(W / img.width, H / img.height)
        const w = img.width * scale, h = img.height * scale
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H)
        ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function IdentityForm() {
  const router = useRouter()
  const { account, ready } = useAccount()
  const [form, setForm] = useState<FifIdentity>(EMPTY_IDENTITY)
  const [error, setError] = useState('')
  const loaded = useRef(false)

  useEffect(() => {
    if (!account || loaded.current) return
    loaded.current = true
    const parts = account.fullName.split(/\s+/)
    setForm(account.identity ?? { ...EMPTY_IDENTITY, lastName: parts.slice(-1)[0]?.toUpperCase() ?? '', firstNames: parts.slice(0, -1).join(' ') })
  }, [account])

  if (!ready) return null
  if (!account) {
    return (
      <div className="dashboard-panel" style={{ margin: 0, maxWidth: 560 }}>
        <p className="lede">Connectez-vous pour compléter votre identité.</p>
        <Link href="/connexion" className="button button-primary">Se connecter</Link>
      </div>
    )
  }

  const set = <K extends keyof FifIdentity>(key: K, value: FifIdentity[K]) => setForm((f) => ({ ...f, [key]: value }))
  const today = new Date().toISOString().slice(0, 10)

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Choisissez une image (JPEG ou PNG).')
    try { set('photo', await resizePhoto(file)); setError('') } catch { setError('Impossible de lire cette image.') }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.photo) return setError('Ajoutez une photo d’identité : visage de face, fond clair.')
    if (form.birthDate && (form.birthDate > today || form.birthDate < '1900-01-01')) return setError('Date de naissance invalide.')
    if (!/^[A-Za-z0-9-/ ]{5,24}$/.test(form.idNumber.trim())) return setError('Numéro de pièce d’identité invalide.')
    setError('')
    saveIdentity(form)
    router.push('/compte/carte')
  }

  return (
    <form className="form-card" style={{ margin: 0, maxWidth: 760 }} onSubmit={submit}>
      <h3 style={{ margin: '0 0 6px' }}>Mon identité complète</h3>
      <p className="muted-sm" style={{ margin: '0 0 22px' }}>Ces informations figurent sur votre carte FIF ID et permettent de vous identifier avec certitude. Saisissez-les exactement comme sur votre pièce d’identité.</p>

      <div className="text-field">
        <label htmlFor="id-photo">Photo d’identité</label>
        <div className="photo-picker">
          <div className="fid-photo">{form.photo ? <img src={form.photo} alt="Aperçu de la photo" /> : <Camera size={26} />}</div>
          <div>
            <input id="id-photo" type="file" accept="image/*" capture="user" onChange={onPhoto} />
            <small className="field-hint" style={{ display: 'block', marginTop: 6 }}>Visage de face, tête nue, fond clair. Photo récente.</small>
          </div>
        </div>
      </div>

      <div className="identity-grid">
        <div className="text-field">
          <label htmlFor="id-last">Nom</label>
          <input id="id-last" required value={form.lastName} onChange={(e) => set('lastName', e.target.value.toUpperCase())} placeholder="KONÉ" autoComplete="family-name" />
        </div>
        <div className="text-field">
          <label htmlFor="id-first">Prénoms (tous)</label>
          <input id="id-first" required value={form.firstNames} onChange={(e) => set('firstNames', e.target.value)} placeholder="Awa Marie" autoComplete="given-name" />
        </div>
        <div className="text-field">
          <label htmlFor="id-sex">Sexe</label>
          <select id="id-sex" required value={form.sex} onChange={(e) => set('sex', e.target.value as FifIdentity['sex'])}>
            <option value="">—</option><option value="F">Féminin</option><option value="M">Masculin</option>
          </select>
        </div>
        <div className="text-field">
          <label htmlFor="id-birth">Date de naissance</label>
          <input id="id-birth" type="date" required max={today} min="1900-01-01" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} autoComplete="bday" />
        </div>
        <div className="text-field">
          <label htmlFor="id-place">Lieu de naissance</label>
          <input id="id-place" required value={form.birthPlace} onChange={(e) => set('birthPlace', e.target.value)} placeholder="Abidjan (Treichville)" />
        </div>
        <div className="text-field">
          <label htmlFor="id-nat">Nationalité</label>
          <select id="id-nat" required value={form.nationality} onChange={(e) => set('nationality', e.target.value)}>
            {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="text-field">
          <label htmlFor="id-type">Pièce d’identité</label>
          <select id="id-type" value={form.idType} onChange={(e) => set('idType', e.target.value)}>
            {ID_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="text-field">
          <label htmlFor="id-num">Numéro de la pièce</label>
          <input id="id-num" required value={form.idNumber} onChange={(e) => set('idNumber', e.target.value.toUpperCase())} placeholder="CI0001234567" />
        </div>
        <div className="text-field">
          <label htmlFor="id-city">Ville / commune de résidence</label>
          <input id="id-city" required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Cocody" autoComplete="address-level2" />
        </div>
        <div className="text-field">
          <label htmlFor="id-addr">Quartier / adresse (facultatif)</label>
          <input id="id-addr" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Riviera 3" />
        </div>
        <div className="text-field is-wide">
          <label htmlFor="id-urg">Contact d’urgence (facultatif)</label>
          <input id="id-urg" value={form.emergencyContact} onChange={(e) => set('emergencyContact', e.target.value)} placeholder="Nom et téléphone d’un proche" />
        </div>
      </div>

      {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}
      <div className="form-actions" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <button type="submit" className="button button-primary"><CheckCircle2 size={16} /> Enregistrer et voir ma carte</button>
        <Link href="/compte" className="button-outline">Annuler</Link>
      </div>
      <p className="muted-sm" style={{ margin: '14px 0 0' }}>Prototype : les données restent dans votre navigateur. En production, elles seraient vérifiées par la FIF et protégées conformément à la loi ivoirienne sur les données personnelles.</p>
    </form>
  )
}

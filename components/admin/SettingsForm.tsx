'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { saveSettingsAction } from '@/app/admin/cms-actions'
import type { SiteSettings } from '@/lib/cms/types'

type Key = keyof SiteSettings
const SECTIONS: { title: string; fields: { key: Key; label: string; type?: 'bool' | 'textarea'; hint?: string; placeholder?: string }[] }[] = [
  { title: 'Identité du site', fields: [
    { key: 'siteName', label: 'Nom du site' },
    { key: 'tagline', label: 'Slogan' },
    { key: 'season', label: 'Saison en cours', placeholder: '2026-2027' },
  ] },
  { title: 'Bandeau d’annonce', fields: [
    { key: 'alertEnabled', label: 'Afficher un bandeau d’annonce en haut de toutes les pages', type: 'bool' },
    { key: 'alertText', label: 'Texte du bandeau', type: 'textarea', placeholder: 'Billetterie ouverte pour Côte d’Ivoire – Cameroun !' },
    { key: 'alertLink', label: 'Lien (facultatif)', placeholder: '/billetterie' },
  ] },
  { title: 'Coordonnées', fields: [
    { key: 'contactEmail', label: 'Adresse e-mail de contact' },
    { key: 'contactPhone', label: 'Téléphone' },
    { key: 'address', label: 'Adresse' },
  ] },
  { title: 'Réseaux sociaux', fields: [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
    { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/…' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/…' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@…' },
  ] },
  { title: 'Ventes en ligne', fields: [
    { key: 'ticketingOpen', label: 'Billetterie ouverte (achat de billets possible)', type: 'bool' },
    { key: 'shopOpen', label: 'Boutique ouverte (commandes possibles)', type: 'bool' },
  ] },
]

export function SettingsForm({ initial, canWrite }: { initial: SiteSettings; canWrite: boolean }) {
  const [values, setValues] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok?: boolean; text: string } | null>(null)
  const router = useRouter()
  const set = (k: Key, v: string | boolean) => setValues((cur) => ({ ...cur, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    const res = await saveSettingsAction(values)
    setBusy(false)
    setMessage(res.error ? { text: res.error } : { ok: true, text: 'Paramètres enregistrés.' })
    if (!res.error) router.refresh()
  }

  return (
    <form onSubmit={submit} className="adm-settings">
      {SECTIONS.map((s) => (
        <fieldset key={s.title} className="adm-card">
          <legend>{s.title}</legend>
          <div className="adm-form-grid">
            {s.fields.map((f) => (
              <div key={f.key} className={`adm-field${f.type === 'bool' ? ' is-check is-wide' : ''}${f.type === 'textarea' ? ' is-wide' : ''}`}>
                {f.type === 'bool' ? (
                  <label className="adm-check"><input type="checkbox" checked={Boolean(values[f.key])} onChange={(e) => set(f.key, e.target.checked)} /> {f.label}</label>
                ) : (
                  <>
                    <label htmlFor={`s-${f.key}`}>{f.label}</label>
                    {f.type === 'textarea'
                      ? <textarea id={`s-${f.key}`} rows={2} value={String(values[f.key])} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
                      : <input id={`s-${f.key}`} value={String(values[f.key])} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />}
                  </>
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="adm-settings-foot">
        {message && <p className={message.ok ? 'adm-notice' : 'form-error'} role="status">{message.ok && <CheckCircle2 size={15} />} {message.text}</p>}
        <button type="submit" className="button button-primary" disabled={busy || !canWrite}>{busy ? 'Enregistrement…' : 'Enregistrer les paramètres'}</button>
      </div>
    </form>
  )
}

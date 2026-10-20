'use client'

import { useState } from 'react'
import { DemoNotice } from './DemoNotice'

type Field = { id: string; label: string; type?: 'text' | 'email' | 'textarea' | 'date'; required?: boolean; placeholder?: string }

/** Formulaire de demande générique : attribue un numéro de suivi conservé dans
 *  ce navigateur (service en démonstration, rien n'est transmis). */
export function DemoRequestForm({ prefix, fields, submitLabel, notice }: { prefix: string; fields: Field[]; submitLabel: string; notice?: React.ReactNode }) {
  const [ref, setRef] = useState<string | null>(null)
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const n = `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`
    try { localStorage.setItem(`fif:${prefix.toLowerCase()}:last`, JSON.stringify({ ref: n, at: new Date().toISOString() })) } catch {}
    setRef(n)
    e.currentTarget.reset()
  }
  return (
    <>
      <DemoNotice>{notice}</DemoNotice>
      {ref && <div className="svc-confirm" role="status" style={{ marginBottom: 16 }}><strong>Demande enregistrée</strong>Numéro de suivi : <code>{ref}</code></div>}
      <form className="form-card" onSubmit={submit}>
        {fields.map((f) => (
          <div className="text-field" key={f.id}>
            <label htmlFor={`f-${prefix}-${f.id}`}>{f.label}</label>
            {f.type === 'textarea'
              ? <textarea id={`f-${prefix}-${f.id}`} rows={4} required={f.required} placeholder={f.placeholder} />
              : <input id={`f-${prefix}-${f.id}`} type={f.type ?? 'text'} required={f.required} placeholder={f.placeholder} />}
          </div>
        ))}
        <div className="form-actions"><button type="submit" className="button button-primary">{submitLabel}</button></div>
      </form>
    </>
  )
}

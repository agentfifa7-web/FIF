'use client'

import { useMemo, useRef, useState } from 'react'
import { ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react'
import { uploadImageAction } from '@/app/admin/cms-actions'
import type { Field, FieldOption, FormValues, Refs } from '@/lib/cms/schema'

function optionsOf(field: Field, refs: Refs): FieldOption[] {
  const raw = field.ref ? refs[field.ref] : field.options ?? []
  return raw.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
}

/** Formulaire généré à partir de la description des champs d'un module. */
export function RecordForm({ fields, values, refs, onChange }: {
  fields: Field[]
  values: FormValues
  refs: Refs
  onChange: (name: string, value: unknown) => void
}) {
  return (
    <div className="adm-form-grid">
      {fields.map((f) => (
        <div key={f.name} className={`adm-field${f.wide || f.type === 'rows' || f.type === 'multiselect' || f.type === 'paragraphs' ? ' is-wide' : ''}${f.type === 'boolean' ? ' is-check' : ''}`}>
          {f.type !== 'boolean' && <label htmlFor={`f-${f.name}`}>{f.label}{f.required && <b aria-hidden> *</b>}</label>}
          <FieldInput field={f} value={values[f.name]} refs={refs} onChange={(v) => onChange(f.name, v)} />
          {f.hint && <small>{f.hint}</small>}
        </div>
      ))}
    </div>
  )
}

function FieldInput({ field: f, value, refs, onChange }: { field: Field; value: unknown; refs: Refs; onChange: (v: unknown) => void }) {
  const id = `f-${f.name}`
  const v = value ?? ''
  switch (f.type) {
    case 'textarea':
      return <textarea id={id} rows={3} value={String(v)} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
    case 'paragraphs':
      return <textarea id={id} rows={12} value={String(v)} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
    case 'number':
      return <input id={id} type="number" inputMode="decimal" min={f.min} max={f.max} value={String(v)} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
    case 'date':
    case 'time':
      return <input id={id} type={f.type} value={String(v)} onChange={(e) => onChange(e.target.value)} />
    case 'color':
      return <input id={id} type="color" value={String(v) || '#087443'} onChange={(e) => onChange(e.target.value)} />
    case 'boolean':
      return <label className="adm-check"><input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label>
    case 'select':
      return (
        <select id={id} value={String(v)} onChange={(e) => onChange(e.target.value)}>
          {(f.optional || !v) && <option value="">{f.optional ? '—' : 'Choisir…'}</option>}
          {optionsOf(f, refs).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    case 'multiselect':
      return <MultiSelect options={optionsOf(f, refs)} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
    case 'image':
      return <ImageField id={id} value={String(v)} onChange={onChange} />
    case 'rows':
      return <RowsField field={f} value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []} refs={refs} onChange={onChange} />
    default:
      return <input id={id} type={f.type === 'url' ? 'url' : 'text'} value={String(v)} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
  }
}

function MultiSelect({ options, value, onChange }: { options: FieldOption[]; value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState('')
  const shown = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())), [options, q])
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
  return (
    <div className="adm-multi">
      <div className="adm-multi-head">
        <input type="search" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span>{value.length} sélectionné{value.length > 1 ? 's' : ''}</span>
        <button type="button" onClick={() => onChange([...new Set([...value, ...shown.map((o) => o.value)])])}>Tout cocher</button>
        <button type="button" onClick={() => onChange(value.filter((x) => !shown.some((o) => o.value === x)))}>Tout décocher</button>
      </div>
      <div className="adm-multi-list">
        {shown.map((o) => (
          <label key={o.value}><input type="checkbox" checked={value.includes(o.value)} onChange={() => toggle(o.value)} /> {o.label}</label>
        ))}
        {!shown.length && <p className="muted-sm">Aucun résultat.</p>}
      </div>
    </div>
  )
}

function RowsField({ field, value, refs, onChange }: { field: Field; value: Record<string, unknown>[]; refs: Refs; onChange: (v: unknown) => void }) {
  const sub = field.fields ?? []
  const update = (i: number, name: string, v: unknown) => onChange(value.map((row, ri) => (ri === i ? { ...row, [name]: v } : row)))
  return (
    <div className="adm-rows">
      {value.map((row, i) => (
        <div key={i} className="adm-row">
          {sub.map((f) => (
            <div key={f.name} className="adm-field">
              <label>{f.label}</label>
              <FieldInput field={f} value={row[f.name]} refs={refs} onChange={(v) => update(i, f.name, v)} />
            </div>
          ))}
          <button type="button" className="adm-icon-btn is-danger" aria-label="Retirer la ligne" onClick={() => onChange(value.filter((_, ri) => ri !== i))}><Trash2 size={15} /></button>
        </div>
      ))}
      <button type="button" className="button-outline" onClick={() => onChange([...value, field.newRow?.() ?? {}])}><Plus size={14} /> Ajouter une ligne</button>
    </div>
  )
}

/** Réduit une image dans le navigateur (1600 px max) avant l'envoi. */
async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const png = file.type === 'image/png' && file.size < 400_000
  return canvas.toDataURL(png ? 'image/png' : 'image/jpeg', 0.82)
}

function ImageField({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function upload(file: File) {
    setError('')
    if (!file.type.startsWith('image/')) return setError('Choisissez un fichier image.')
    setBusy(true)
    try {
      const res = await uploadImageAction(await compressImage(file))
      if (res.error) setError(res.error)
      else if (res.url) onChange(res.url)
    } catch {
      setError('Envoi impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-image">
      {value ? <img src={value} alt="" /> : <div className="adm-image-empty">Aucune image</div>}
      <div className="adm-image-actions">
        <input id={id} type="text" placeholder="Adresse de l’image (https://… ou /…)" value={value} onChange={(e) => onChange(e.target.value)} />
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} />
        <button type="button" className="button-outline" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? <Loader2 size={14} className="adm-spin" /> : <ImagePlus size={14} />} {busy ? 'Envoi…' : 'Envoyer une photo'}
        </button>
        {value && <button type="button" className="adm-link-btn" onClick={() => onChange('')}>Retirer</button>}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

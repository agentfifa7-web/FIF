'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ExternalLink, Pencil, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react'
import { deleteRecordsAction, restoreRecordAction, saveRecordAction } from '@/app/admin/cms-actions'
import { recordToForm, SCHEMAS, type FormValues, type Refs } from '@/lib/cms/schema'
import type { CollectionKey } from '@/lib/cms/types'
import { RecordForm } from './RecordForm'

/* eslint-disable @typescript-eslint/no-explicit-any */
const PAGE = 40

export function AdminCollectionManager({ collection, records, refs, deleted, edited, canWrite }: {
  collection: CollectionKey
  records: any[]
  refs: Refs
  /** Éléments d'origine retirés (restaurables). */
  deleted: { id: string; title: string }[]
  /** Identifiants des éléments d'origine modifiés. */
  edited: string[]
  canWrite: boolean
}) {
  const schema = SCHEMAS[collection]
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const [selected, setSelected] = useState<string[]>([])
  const [editing, setEditing] = useState<{ id?: string; values: FormValues } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? records.filter((r) => schema.search(r).toLowerCase().includes(q)) : records
  }, [records, query, schema])
  const shown = filtered.slice(0, limit)
  const editedSet = new Set(edited)

  function flash(message: string) {
    setNotice(message)
    setTimeout(() => setNotice(''), 4000)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setBusy(true)
    setError('')
    const res = await saveRecordAction(collection, editing.values, editing.id)
    setBusy(false)
    if (res.error) return setError(res.error)
    setEditing(null)
    flash(editing.id ? 'Modifications enregistrées.' : `${capitalize(schema.singular)} ajouté${feminine(schema.singular) ? 'e' : ''}.`)
    router.refresh()
  }

  async function remove(ids: string[]) {
    const what = ids.length > 1 ? `ces ${ids.length} éléments` : `« ${schema.title(records.find((r) => r.id === ids[0]) ?? {})} »`
    if (!window.confirm(`Supprimer ${what} ? Ils ne seront plus visibles sur le site.`)) return
    setBusy(true)
    const res = await deleteRecordsAction(collection, ids)
    setBusy(false)
    if (res.error) return window.alert(res.error)
    setSelected([])
    flash(ids.length > 1 ? `${ids.length} éléments supprimés.` : 'Élément supprimé.')
    router.refresh()
  }

  async function restore(id: string) {
    setBusy(true)
    const res = await restoreRecordAction(collection, id)
    setBusy(false)
    if (res.error) return window.alert(res.error)
    flash('Élément restauré dans son état d’origine.')
    router.refresh()
  }

  const allShownSelected = shown.length > 0 && shown.every((r) => selected.includes(r.id))

  return (
    <div className="adm-manager">
      <div className="adm-toolbar">
        <div className="adm-search">
          <Search size={15} />
          <input type="search" placeholder={`Rechercher dans ${schema.label.toLowerCase()}…`} value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE) }} />
        </div>
        <span className="adm-count">{filtered.length} élément{filtered.length > 1 ? 's' : ''}</span>
        {selected.length > 0 && (
          <button type="button" className="adm-danger-btn" disabled={busy || !canWrite} onClick={() => remove(selected)}><Trash2 size={14} /> Supprimer la sélection ({selected.length})</button>
        )}
        <button type="button" className="button button-primary adm-add" disabled={!canWrite} onClick={() => { setError(''); setEditing({ values: schema.defaults() }) }}>
          <Plus size={16} /> Ajouter {articleFor(schema.singular)}{schema.singular}
        </button>
      </div>

      {notice && <p className="adm-notice" role="status"><CheckCircle2 size={15} /> {notice}</p>}

      <div className="adm-list" style={{ ["--cols" as string]: schema.columns.length } as React.CSSProperties}>
        <div className="adm-list-head">
          <label><input type="checkbox" aria-label="Tout sélectionner" checked={allShownSelected} onChange={() => setSelected(allShownSelected ? selected.filter((id) => !shown.some((r) => r.id === id)) : [...new Set([...selected, ...shown.map((r) => r.id)])])} /></label>
          <span>{schema.singular.charAt(0).toUpperCase() + schema.singular.slice(1)}</span>
          {schema.columns.map((c) => <span key={c.label} className="adm-col">{c.label}</span>)}
          <span />
        </div>
        {shown.map((r) => (
          <div key={r.id} className={`adm-item${selected.includes(r.id) ? ' is-selected' : ''}`}>
            <label><input type="checkbox" aria-label="Sélectionner" checked={selected.includes(r.id)} onChange={() => setSelected(selected.includes(r.id) ? selected.filter((x) => x !== r.id) : [...selected, r.id])} /></label>
            <div className="adm-item-title">
              <button type="button" onClick={() => { setError(''); setEditing({ id: r.id, values: recordToForm(schema, r) }) }}>{schema.title(r) || 'Sans titre'}</button>
              {r.__new && <em className="adm-badge is-new">Ajouté</em>}
              {editedSet.has(r.id) && <em className="adm-badge">Modifié</em>}
              <small className="adm-item-meta">{schema.columns.map((c) => c.value(r, refs)).filter(Boolean).join(' · ')}</small>
            </div>
            {schema.columns.map((c) => <span key={c.label} className="adm-col">{c.value(r, refs) || '—'}</span>)}
            <div className="adm-item-actions">
              {schema.links?.(r).map((l) => <Link key={l.href} href={l.href} className="adm-chip-link">{l.label}</Link>)}
              {schema.publicHref?.(r) && <a href={schema.publicHref(r)} target="_blank" rel="noopener noreferrer" className="adm-icon-btn" aria-label="Voir sur le site" title="Voir sur le site"><ExternalLink size={15} /></a>}
              <button type="button" className="adm-icon-btn" aria-label="Modifier" title="Modifier" onClick={() => { setError(''); setEditing({ id: r.id, values: recordToForm(schema, r) }) }}><Pencil size={15} /></button>
              {editedSet.has(r.id) && <button type="button" className="adm-icon-btn" aria-label="Annuler les modifications" title="Revenir à la version d’origine" disabled={busy || !canWrite} onClick={() => restore(r.id)}><RotateCcw size={15} /></button>}
              <button type="button" className="adm-icon-btn is-danger" aria-label="Supprimer" title="Supprimer" disabled={busy || !canWrite} onClick={() => remove([r.id])}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {!filtered.length && <p className="adm-empty">{query ? 'Aucun résultat pour cette recherche.' : `Aucun élément pour l’instant. Cliquez sur « Ajouter ${articleFor(schema.singular)}${schema.singular} ».`}</p>}
      </div>
      {filtered.length > limit && <button type="button" className="button-outline adm-more" onClick={() => setLimit(limit + PAGE)}>Afficher plus ({filtered.length - limit} restants)</button>}

      {deleted.length > 0 && (
        <details className="adm-deleted">
          <summary>Éléments supprimés ({deleted.length})</summary>
          <ul>
            {deleted.map((d) => (
              <li key={d.id}><span>{d.title}</span><button type="button" className="adm-link-btn" disabled={busy || !canWrite} onClick={() => restore(d.id)}><RotateCcw size={13} /> Restaurer</button></li>
            ))}
          </ul>
        </details>
      )}

      {editing && (
        <div className="adm-modal" role="dialog" aria-modal="true" aria-label={editing.id ? 'Modifier' : 'Ajouter'}>
          <form className="adm-panel" onSubmit={save}>
            <header>
              <h2>{editing.id ? `Modifier ${articleFor(schema.singular)}${schema.singular}` : `Ajouter ${articleFor(schema.singular)}${schema.singular}`}</h2>
              <button type="button" className="adm-icon-btn" aria-label="Fermer" onClick={() => setEditing(null)}><X size={18} /></button>
            </header>
            <div className="adm-panel-body">
              <RecordForm fields={schema.fields} values={editing.values} refs={refs} onChange={(name, value) => setEditing((cur) => (cur ? { ...cur, values: { ...cur.values, [name]: value } } : cur))} />
            </div>
            <footer>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button type="button" className="button-outline" onClick={() => setEditing(null)}>Annuler</button>
              <button type="submit" className="button button-primary" disabled={busy || !canWrite}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
            </footer>
          </form>
        </div>
      )}
    </div>
  )
}

const FEMININE = new Set(['actualité', 'vidéo', 'compétition', 'licence', 'opération', 'académie'])
function feminine(word: string) { return FEMININE.has(word) }
function articleFor(word: string) {
  if (/^[aeiouhéè]/i.test(word)) return 'un' + (feminine(word) ? 'e ' : ' ')
  return feminine(word) ? 'une ' : 'un '
}
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

import Link from 'next/link'
import { ArrowLeft, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { AdminCollectionManager } from '@/components/admin/AdminCollectionManager'
import { StorageNotice } from '@/components/admin/StorageNotice'
import { getAdminCollection } from '@/lib/cms/admin-data'

export const metadata = { title: 'Finances — Administration FIF' }

const fcfa = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} F CFA`

export default async function FinancesPage() {
  const data = await getAdminCollection('finances')
  const entries = data.records as { type: string; amount: number; category: string; date: string }[]
  const income = entries.filter((e) => e.type === 'Recette').reduce((s, e) => s + Number(e.amount || 0), 0)
  const spending = entries.filter((e) => e.type === 'Dépense').reduce((s, e) => s + Number(e.amount || 0), 0)
  const byCategory = new Map<string, { income: number; spending: number }>()
  for (const e of entries) {
    const row = byCategory.get(e.category) ?? { income: 0, spending: 0 }
    if (e.type === 'Recette') row.income += Number(e.amount || 0); else row.spending += Number(e.amount || 0)
    byCategory.set(e.category, row)
  }
  const byMonth = new Map<string, { income: number; spending: number }>()
  for (const e of entries) {
    const key = String(e.date).slice(0, 7)
    const row = byMonth.get(key) ?? { income: 0, spending: 0 }
    if (e.type === 'Recette') row.income += Number(e.amount || 0); else row.spending += Number(e.amount || 0)
    byMonth.set(key, row)
  }
  const months = [...byMonth.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 12)

  return (
    <main className="adm-page">
      <Link href="/admin" className="adm-back"><ArrowLeft size={15} /> Tableau de bord</Link>
      <h1>Finances</h1>
      <p className="adm-lede">Journal des recettes et des dépenses de la Fédération. Ces données restent strictement privées : elles ne sont jamais affichées sur le site public.</p>
      <StorageNotice mode={data.storage} />

      <div className="adm-kpis">
        <div className="adm-kpi is-in"><TrendingUp size={18} /><span>Recettes</span><strong>{fcfa(income)}</strong></div>
        <div className="adm-kpi is-out"><TrendingDown size={18} /><span>Dépenses</span><strong>{fcfa(spending)}</strong></div>
        <div className={`adm-kpi ${income - spending >= 0 ? 'is-in' : 'is-out'}`}><Wallet size={18} /><span>Solde</span><strong>{fcfa(income - spending)}</strong></div>
      </div>

      {entries.length > 0 && (
        <div className="adm-two">
          <div className="adm-card">
            <h2>Par catégorie</h2>
            <table className="adm-table">
              <thead><tr><th>Catégorie</th><th>Recettes</th><th>Dépenses</th></tr></thead>
              <tbody>{[...byCategory.entries()].sort((a, b) => (b[1].income + b[1].spending) - (a[1].income + a[1].spending)).map(([cat, v]) => (
                <tr key={cat}><td>{cat}</td><td>{v.income ? fcfa(v.income) : '—'}</td><td>{v.spending ? fcfa(v.spending) : '—'}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className="adm-card">
            <h2>Par mois</h2>
            <table className="adm-table">
              <thead><tr><th>Mois</th><th>Recettes</th><th>Dépenses</th><th>Solde</th></tr></thead>
              <tbody>{months.map(([m, v]) => (
                <tr key={m}><td>{new Date(`${m}-01T12:00:00Z`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</td><td>{fcfa(v.income)}</td><td>{fcfa(v.spending)}</td><td>{fcfa(v.income - v.spending)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      <h2 className="adm-subtitle">Opérations</h2>
      <AdminCollectionManager collection="finances" records={data.records} refs={data.refs} deleted={data.deleted} edited={data.edited} canWrite={data.storage !== 'unavailable'} />
    </main>
  )
}

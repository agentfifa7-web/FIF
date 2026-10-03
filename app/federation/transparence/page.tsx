import Link from 'next/link'
import { ArrowRight, BarChart3, ClipboardList, FileText, Gavel, Wallet } from 'lucide-react'
import { presidentPromises, transparencyRecords, getCommission } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { formatDate } from '@/lib/format'
import type { TransparencyRecord } from '@/lib/data/types'
import { loadCms } from '@/lib/cms/server'

export const metadata = { title: 'Transparence FIF — FIF Digital' }

const CATEGORY_ICON: Record<TransparencyRecord['category'], typeof FileText> = {
  Rapport: FileText,
  Budget: Wallet,
  'Décision': Gavel,
  'Appel d’offres': ClipboardList,
  'Statistique institutionnelle': BarChart3,
}

const CATEGORIES: TransparencyRecord['category'][] = ['Budget', 'Rapport', 'Décision', 'Appel d’offres', 'Statistique institutionnelle']

export default async function TransparencePage() {
  await loadCms()
  const done = presidentPromises.filter((p) => p.status === 'Réalisée').length

  return (
    <main>
      <PageHero
        eyebrow="Gouvernance ouverte"
        title="Transparence FIF"
        subtitle="Le programme 2026-2030 du Président, son avancement engagement par engagement, ainsi que les budgets, décisions, appels d’offres et statistiques institutionnelles de la Fédération."
        breadcrumb={[{ label: 'Fédération', href: '/federation' }, { label: 'Transparence' }]}
        meta={[
          { value: '12/09/2026', label: 'Début du mandat 2026-2030' },
          { value: `${done}/${presidentPromises.length}`, label: 'Engagements réalisés' },
          { value: String(transparencyRecords.length), label: 'Documents (démonstration)' },
        ]}
      />

      <section className="page-section tight">
        <div className="page-section-head">
          <div>
            <p className="section-tag">Programme « Transformer pour durer »</p>
            <h2 style={{ fontSize: 24 }}>Suivi des engagements du mandat 2026-2030</h2>
          </div>
          <Link href="/federation/president" className="text-link">Voir le profil du Président <ArrowRight size={14} /></Link>
        </div>
        <p className="lede">Engagements annoncés par Yacine Idriss Diallo pendant la campagne de septembre 2026. Le mandat vient de débuter : l’avancement de chaque engagement sera mis à jour à mesure que la FIF publie des réalisations.</p>

        <div className="promise-list">
          {presidentPromises.map((p) => {
            const commission = getCommission(p.commissionId) ?? undefined
            const statusClass = p.status === 'Réalisée' ? 'ok' : p.status === 'En cours' ? 'pending' : 'neutral'
            return (
              <details key={p.id}>
                <summary>
                  <div>
                    <strong>{p.title}</strong>
                    <div className="gauge-track"><div className="gauge-fill" style={{ width: `${p.progress}%` }} /></div>
                  </div>
                  <b>{p.progress}%</b>
                  <span className={`status-pill ${statusClass}`}>{p.status}</span>
                </summary>
                <p className="desc">{p.description}</p>
                <div className="promise-foot">
                  {commission && (
                    <Link href={`/federation/commissions/${commission.slug}`} className="chip">
                      Portée par : {commission.name}
                    </Link>
                  )}
                </div>
              </details>
            )
          })}
        </div>
      </section>

      {CATEGORIES.map((category) => {
        const items = transparencyRecords.filter((t) => t.category === category)
        if (items.length === 0) return null
        const Icon = CATEGORY_ICON[category]
        return (
          <section className="page-section tight" key={category} id={category === 'Budget' ? 'budget' : undefined}>
            <p className="section-tag">{category}</p>
            <div className="card-grid cols-2" style={{ marginTop: 16 }}>
              {items.map((t) => (
                <Link href={`/federation/transparence/${t.slug}`} className="entity-card" key={t.id}>
                  <Icon size={18} color="var(--orange)" />
                  <div>
                    <strong>{t.title}</strong>
                    <span>{formatDate(t.date)}{t.amount ? ` · ${t.amount}` : ''}</span>
                  </div>
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

import Link from 'next/link'
import {
  BadgeCheck, BarChart3, Building2, ClipboardList, FileText, Film, Gavel, GraduationCap, Landmark, Newspaper,
  Settings, Shield, ShoppingBag, Ticket, Trophy, UserCog, Users, Wallet,
} from 'lucide-react'
import { StorageNotice } from '@/components/admin/StorageNotice'
import { collectionDoc } from '@/lib/cms/admin-data'
import { mergeCollection } from '@/lib/cms/apply'
import { SCHEMAS, SCHEMA_ORDER } from '@/lib/cms/schema'
import { loadCms } from '@/lib/cms/server'
import { storageMode } from '@/lib/cms/store'
import type { CollectionKey } from '@/lib/cms/types'

export const metadata = { title: 'FIF Command Center — Administration' }

const ICONS: Record<CollectionKey, typeof Newspaper> = {
  articles: Newspaper, videos: Film, competitions: Trophy, matches: BarChart3, clubs: Shield, players: Users,
  licences: BadgeCheck, referees: Gavel, coaches: UserCog, agents: FileText, officials: Building2,
  stadiums: Landmark, tickets: Ticket, products: ShoppingBag, finances: Wallet, academies: GraduationCap,
}

const GROUPS = ['Contenus', 'Compétitions', 'Personnes', 'Commerce', 'Administration'] as const

function hrefFor(key: CollectionKey) {
  return key === 'finances' ? '/admin/finances' : `/admin/gerer/${key}`
}

export default async function AdminPage() {
  const cms = await loadCms()
  const mode = storageMode()
  const counts = Object.fromEntries(SCHEMA_ORDER.map((k) => [k, mergeCollection(k, collectionDoc(cms, k)).length])) as Record<CollectionKey, number>
  const sheets = Object.keys(cms.sheets).length

  return (
    <main className="adm-page">
      <p className="adm-eyebrow">Administration fédérale</p>
      <h1>FIF Command Center</h1>
      <p className="adm-lede">Ajoutez, modifiez ou retirez les contenus du site. Chaque enregistrement est publié immédiatement.</p>
      <StorageNotice mode={mode} />

      <div className="adm-quick">
        <Link href="/admin/gerer/articles" className="button button-primary">+ Nouvelle actualité</Link>
        <Link href="/admin/gerer/matches" className="button-outline">+ Nouveau match</Link>
        <Link href="/admin/feuille-de-match" className="button-outline"><ClipboardList size={15} /> Feuilles de match ({sheets} publiée{sheets > 1 ? 's' : ''})</Link>
        <Link href="/admin/parametres" className="button-outline"><Settings size={15} /> Paramètres</Link>
      </div>

      {GROUPS.map((group) => {
        const keys = SCHEMA_ORDER.filter((k) => SCHEMAS[k].group === group)
        return (
          <section key={group} className="adm-group">
            <h2>{group}</h2>
            <div className="adm-modules">
              {keys.map((k) => {
                const Icon = ICONS[k]
                return (
                  <Link key={k} href={hrefFor(k)} className="adm-module">
                    <Icon size={22} />
                    <div><strong>{SCHEMAS[k].label}</strong><span>{counts[k]} élément{counts[k] > 1 ? 's' : ''}</span></div>
                  </Link>
                )
              })}
              {group === 'Compétitions' && (
                <Link href="/admin/feuille-de-match" className="adm-module">
                  <ClipboardList size={22} />
                  <div><strong>Feuilles de match</strong><span>{sheets} publiée{sheets > 1 ? 's' : ''}</span></div>
                </Link>
              )}
              {group === 'Administration' && (
                <Link href="/admin/parametres" className="adm-module">
                  <Settings size={22} />
                  <div><strong>Paramètres</strong><span>Bandeau, contact, réseaux, ventes</span></div>
                </Link>
              )}
            </div>
          </section>
        )
      })}
    </main>
  )
}

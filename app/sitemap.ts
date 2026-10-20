import type { MetadataRoute } from 'next'
import { articles, clubs, competitions, elephantsFixtures, nationalTeams, players, realLigue1Matches, stadiums } from '@/lib/data/mock'
import { loadCms } from '@/lib/cms/server'
import { SITE_URL } from '@/lib/site'

// Pages publiques indexables : rubriques principales et contenus réels
// (actualités, clubs, joueurs, compétitions, sélections, matchs, stades).
const STATIC: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, freq: 'hourly' },
  { path: '/actualites', priority: 0.9, freq: 'hourly' },
  { path: '/matches', priority: 0.9, freq: 'hourly' },
  { path: '/resultats', priority: 0.9, freq: 'hourly' },
  { path: '/competitions', priority: 0.8, freq: 'daily' },
  { path: '/equipes-nationales', priority: 0.8, freq: 'daily' },
  { path: '/clubs', priority: 0.7, freq: 'weekly' },
  { path: '/joueurs', priority: 0.6, freq: 'weekly' },
  { path: '/stades', priority: 0.5, freq: 'monthly' },
  { path: '/palmares', priority: 0.5, freq: 'monthly' },
  { path: '/billetterie', priority: 0.7, freq: 'daily' },
  { path: '/boutique', priority: 0.5, freq: 'weekly' },
  { path: '/fif-tv', priority: 0.6, freq: 'daily' },
  { path: '/supporters', priority: 0.6, freq: 'weekly' },
  { path: '/football', priority: 0.5, freq: 'monthly' },
  { path: '/football/feminin', priority: 0.5, freq: 'monthly' },
  { path: '/federation', priority: 0.6, freq: 'monthly' },
  { path: '/federation/president', priority: 0.4, freq: 'monthly' },
  { path: '/federation/transparence', priority: 0.4, freq: 'monthly' },
  { path: '/documents', priority: 0.5, freq: 'monthly' },
  { path: '/services', priority: 0.6, freq: 'monthly' },
  { path: '/licences', priority: 0.5, freq: 'monthly' },
  { path: '/transferts', priority: 0.4, freq: 'monthly' },
  { path: '/formation', priority: 0.5, freq: 'monthly' },
  { path: '/arbitrage', priority: 0.4, freq: 'monthly' },
  { path: '/reclamations', priority: 0.3, freq: 'yearly' },
  { path: '/discipline', priority: 0.3, freq: 'monthly' },
  { path: '/presse', priority: 0.4, freq: 'monthly' },
  { path: '/carrieres', priority: 0.3, freq: 'monthly' },
  { path: '/contact', priority: 0.4, freq: 'yearly' },
  { path: '/application', priority: 0.4, freq: 'yearly' },
]

// Régénéré chaque heure : les articles et scores ajoutés depuis l'administration y apparaissent.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await loadCms()
  const url = (p: string) => `${SITE_URL}${p}`
  const entries: MetadataRoute.Sitemap = STATIC.map((s) => ({ url: url(s.path), changeFrequency: s.freq, priority: s.priority }))
  for (const a of articles) entries.push({ url: url(`/actualites/${a.slug}`), lastModified: new Date(a.date), changeFrequency: 'weekly', priority: 0.7 })
  for (const c of competitions) entries.push({ url: url(`/competitions/${c.slug}`), changeFrequency: 'daily', priority: 0.7 })
  for (const t of nationalTeams) entries.push({ url: url(`/equipes-nationales/${t.slug}`), changeFrequency: 'weekly', priority: 0.7 })
  for (const f of elephantsFixtures) entries.push({ url: url(`/equipes-nationales/elephants/matchs/${f.slug}`), lastModified: new Date(f.date), changeFrequency: 'weekly', priority: 0.6 })
  for (const m of realLigue1Matches) entries.push({ url: url(`/competitions/ligue-1/matchs/${m.slug}`), lastModified: new Date(m.date), changeFrequency: 'weekly', priority: 0.5 })
  for (const c of clubs) entries.push({ url: url(`/clubs/${c.slug}`), changeFrequency: 'weekly', priority: 0.5 })
  for (const p of players) entries.push({ url: url(`/joueurs/${p.slug}`), changeFrequency: 'monthly', priority: 0.3 })
  for (const s of stadiums) entries.push({ url: url(`/stades/${s.slug}`), changeFrequency: 'monthly', priority: 0.3 })
  return entries
}

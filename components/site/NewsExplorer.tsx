'use client'

import { useMemo, useState } from 'react'
import type { Article } from '@/lib/data/types'
import { NewsCard } from './cards'
import { EmptyState } from './widgets'

export function NewsExplorer({ articles }: { articles: Article[] }) {
  const categories = ['Tous', ...Array.from(new Set(articles.map((a) => a.category)))]
  const [category, setCategory] = useState('Tous')
  const filtered = useMemo(
    () => (category === 'Tous' ? articles : articles.filter((a) => a.category === category)),
    [articles, category],
  )

  return (
    <div>
      <div className="filters" role="tablist" aria-label="Filtrer les actualités">
        {categories.map((c) => (
          <button key={c} type="button" className={category === c ? 'filter active' : 'filter'} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      {!filtered.length && <EmptyState title="Aucun article" />}
      <div className="news-grid" style={{ marginTop: 24 }}>
        {filtered.slice(0, 24).map((a, i) => <NewsCard key={a.id} article={a} featured={i === 0} />)}
      </div>
    </div>
  )
}

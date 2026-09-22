'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface Candidate { id: string; name: string }

export function MatchdayVote({ candidates }: { candidates: Candidate[] }) {
  const [voted, setVoted] = useState<string | null>(null)

  if (voted) {
    const winner = candidates.find((c) => c.id === voted)
    return (
      <div className="entity-card" style={{ padding: 20 }}>
        <Check size={20} color="var(--green)" />
        <div><strong>Merci pour votre vote !</strong><span>Vous avez voté pour {winner?.name}. Résultat visible en fin de match : « CHOIX DES SUPPORTERS ».</span></div>
      </div>
    )
  }

  return (
    <div className="card-grid cols-2">
      {candidates.map((c) => (
        <button type="button" key={c.id} className="entity-card" style={{ appearance: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }} onClick={() => setVoted(c.id)}>
          <div><strong>{c.name}</strong></div>
        </button>
      ))}
    </div>
  )
}

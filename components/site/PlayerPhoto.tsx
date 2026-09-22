'use client'

import { useState } from 'react'

// Tente d'afficher une photo réelle (Wikimedia Commons) ; si l'image est
// indisponible ou introuvable, bascule silencieusement sur les initiales.
export function PlayerPhoto({ name, photoUrl, size, background }: { name: string; photoUrl?: string; size: number; background: string }) {
  const [failed, setFailed] = useState(false)
  const initials = name.split(' ').map((n) => n[0]).join('')

  if (!photoUrl || failed) {
    return (
      <span className="avatar" style={{ background, fontSize: size * 0.36, height: size, width: size }}>
        {initials}
      </span>
    )
  }

  return (
    <img
      src={photoUrl}
      alt={name}
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ background, borderRadius: '50%', height: size, objectFit: 'cover', width: size }}
    />
  )
}

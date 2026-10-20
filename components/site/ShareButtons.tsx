'use client'

import { useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'

/** Partage d'une page : partage natif du téléphone, liens Facebook / X / WhatsApp, copie du lien. */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const enc = encodeURIComponent
  async function nativeShare() {
    if (navigator.share) { try { await navigator.share({ title, url }) } catch {} }
    else copy()
  }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }
  return (
    <div className="share-row" aria-label="Partager">
      <span>Partager</span>
      <button type="button" onClick={nativeShare} aria-label="Partager"><Share2 size={16} /></button>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook">f</a>
      <a href={`https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur X">X</a>
      <a href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur WhatsApp">wa</a>
      <button type="button" onClick={copy} aria-label="Copier le lien">{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
    </div>
  )
}

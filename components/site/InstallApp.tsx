'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Check, Download, Share, SquarePlus, X } from 'lucide-react'

// Application installable (PWA) : enregistrement du service worker et bouton
// « Télécharger l'application ». Sur Android / Chrome / Edge, l'installation se
// fait en un clic ; sur iPhone / iPad, Apple impose de passer par le menu
// Partager → « Sur l'écran d'accueil » : le bouton affiche alors la marche à suivre.

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: InstallPromptEvent | null = null
let installed = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true
}

function isIos() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

type InstallState = 'installed' | 'prompt' | 'ios' | 'manual'
let cachedState: InstallState = 'manual'
function computeState(): InstallState {
  if (installed || isStandalone()) return 'installed'
  if (deferredPrompt) return 'prompt'
  if (isIos()) return 'ios'
  return 'manual'
}
function getSnapshot() {
  const next = computeState()
  if (next !== cachedState) cachedState = next
  return cachedState
}

function useInstallState() {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'manual' as InstallState)
}

/** À placer une fois dans le layout : service worker + capture de l'invite d'installation. */
export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {})
    }
    const onPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e as InstallPromptEvent
      notify()
    }
    const onInstalled = () => {
      installed = true
      deferredPrompt = null
      notify()
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  return null
}

export function InstallSteps({ platform }: { platform: 'ios' | 'manual' }) {
  if (platform === 'ios') {
    return (
      <ol className="install-steps">
        <li>Ouvrez ce site dans <strong>Safari</strong>.</li>
        <li>Touchez le bouton <strong>Partager</strong> <Share size={14} aria-hidden /> en bas de l’écran.</li>
        <li>Choisissez <strong>« Sur l’écran d’accueil »</strong> <SquarePlus size={14} aria-hidden />, puis <strong>Ajouter</strong>.</li>
      </ol>
    )
  }
  return (
    <ol className="install-steps">
      <li>Ouvrez ce site dans <strong>Chrome</strong>, <strong>Edge</strong> ou <strong>Samsung Internet</strong>.</li>
      <li>Ouvrez le menu du navigateur <strong>⋮</strong>.</li>
      <li>Choisissez <strong>« Installer l’application »</strong> ou <strong>« Ajouter à l’écran d’accueil »</strong>.</li>
    </ol>
  )
}

/** Bouton « Télécharger l'application FIF ». */
export function InstallAppButton({ className = 'button button-primary', label = 'Télécharger l’application' }: { className?: string; label?: string }) {
  const state = useInstallState()
  const [help, setHelp] = useState(false)

  if (state === 'installed') {
    return <span className={className} aria-live="polite"><Check size={16} aria-hidden /> Application installée</span>
  }

  async function install() {
    if (deferredPrompt) {
      const prompt = deferredPrompt
      await prompt.prompt()
      const choice = await prompt.userChoice.catch(() => null)
      if (choice?.outcome === 'accepted') installed = true
      deferredPrompt = null
      notify()
      return
    }
    setHelp(true)
  }

  return (
    <>
      <button type="button" className={className} onClick={install}>
        <Download size={16} aria-hidden /> {label}
      </button>
      {help && (state === 'ios' || state === 'manual') && (
        <div className="install-dialog" role="dialog" aria-modal="true" aria-label="Installer l’application FIF" onClick={() => setHelp(false)}>
          <div className="install-dialog-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="install-dialog-close" onClick={() => setHelp(false)} aria-label="Fermer"><X size={18} /></button>
            <img src="/icons/icon-192.png" alt="" width={64} height={64} />
            <h3>Installer l’application FIF</h3>
            <p>{state === 'ios' ? 'Sur iPhone et iPad, l’installation se fait en 3 gestes :' : 'Votre navigateur n’a pas proposé l’installation automatique. Procédez ainsi :'}</p>
            <InstallSteps platform={state} />
          </div>
        </div>
      )}
    </>
  )
}

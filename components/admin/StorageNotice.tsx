import { AlertTriangle, Database } from 'lucide-react'
import type { StorageMode } from '@/lib/cms/store'

/** État du stockage des données du back-office. */
export function StorageNotice({ mode }: { mode: StorageMode }) {
  if (mode === 'redis') return <p className="adm-storage is-ok"><Database size={14} /> Base de données connectée : les modifications sont visibles immédiatement par tous les visiteurs.</p>
  if (mode === 'file') return <p className="adm-storage is-ok"><Database size={14} /> Stockage local du serveur (fichier) : les modifications sont visibles par tous les visiteurs de ce serveur.</p>
  return (
    <div className="adm-storage is-warn">
      <AlertTriangle size={16} />
      <div>
        <b>Aucune base de données connectée : les modifications ne peuvent pas être enregistrées.</b>
        <span>Sur Vercel : ouvrez le projet → <b>Storage</b> → <b>Create Database</b> → <b>Upstash for Redis</b> (offre gratuite) → <b>Connect</b> au projet, puis redéployez. Le site détecte automatiquement la base.</span>
      </div>
    </div>
  )
}

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LogOut, ShieldCheck } from 'lucide-react'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-auth'
import { formatPhone } from '@/lib/format-phone'
import { adminLogout } from '../actions'

export const metadata = { robots: { index: false, follow: false } }

// Deuxième contrôle (en plus de proxy.ts) : aucune page de l'espace admin ne s'affiche sans session valide.
export default async function AdminSpaceLayout({ children }: { children: React.ReactNode }) {
  const session = verifyAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)
  if (!session) redirect('/admin/connexion')
  return (
    <>
      <div className="admin-bar">
        <span><ShieldCheck size={15} /> Administrateur connecté · <b>{formatPhone(session.phone)}</b></span>
        <form action={adminLogout}><button type="submit"><LogOut size={14} /> Se déconnecter</button></form>
      </div>
      {children}
    </>
  )
}

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { AdminLoginForm } from '@/components/site/AdminLoginForm'
import { ADMIN_COOKIE, adminConfigured, safeAdminNext, verifyAdminSession } from '@/lib/admin-auth'

export const metadata = { title: 'Connexion administrateur — FIF', robots: { index: false, follow: false } }

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const target = safeAdminNext(next)
  if (verifyAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)) redirect(target)
  const configured = adminConfigured()

  return (
    <main className="page-section" style={{ paddingBottom: 90, paddingTop: 70 }}>
      <div className="form-card">
        <span className="admin-login-badge"><ShieldCheck size={14} /> Espace réservé</span>
        <h1>Administration FIF</h1>
        {configured ? (
          <>
            <p className="muted-sm">Connexion au FIF Command Center, réservée aux administrateurs de la Fédération.</p>
            <AdminLoginForm next={target} />
            <p className="form-foot">Session sécurisée de 8 heures. Après 5 essais erronés, l’accès est bloqué 15 minutes.</p>
          </>
        ) : (
          <div className="admin-setup">
            <p><b>L’accès administrateur n’est pas encore activé.</b> Pour des raisons de sécurité, le numéro et le mot de passe ne sont pas écrits dans le code du site : ils sont enregistrés sur le serveur d’hébergement.</p>
            <ol>
              <li>Ouvrez le projet sur Vercel → <b>Settings</b> → <b>Environment Variables</b>.</li>
              <li>Ajoutez <code>FIF_ADMIN_PHONE</code> : le numéro de l’administrateur.</li>
              <li>Ajoutez <code>FIF_ADMIN_PASSWORD</code> : un mot de passe d’au moins 12 caractères.</li>
              <li>Redéployez le site, puis revenez sur cette page.</li>
            </ol>
          </div>
        )}
      </div>
    </main>
  )
}

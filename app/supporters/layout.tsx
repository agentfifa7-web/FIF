import { ShieldCheck } from 'lucide-react'
import { FanNav } from '@/components/site/FanNav'

export default function SupportersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FanNav />
      {children}
      <section className="page-section tight">
        <div className="demo-notice fan-notice" role="note">
          <ShieldCheck aria-hidden />
          <div>
            <strong>Espace supporters en démonstration</strong>
            <span>Votre progression (XP, badges, pronostics, publications) est enregistrée uniquement dans ce navigateur. Aucun jeu ne demande de mise ni ne fait gagner d’argent, et aucune récompense ou adhésion n’est encore délivrée par la FIF.</span>
          </div>
        </div>
      </section>
    </>
  )
}

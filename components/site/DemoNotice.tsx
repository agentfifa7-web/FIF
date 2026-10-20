import { Info } from 'lucide-react'

/** Avertissement visible pour un service en ligne non encore raccordé aux
 *  systèmes de la FIF : rien n'est transmis, aucun paiement réel. */
export function DemoNotice({ children, title = 'Service en démonstration' }: { children?: React.ReactNode; title?: string }) {
  return (
    <div className="demo-notice" role="note">
      <Info aria-hidden />
      <div>
        <strong>{title}</strong>
        <span>{children ?? 'Ce formulaire illustre le futur service en ligne : votre demande est conservée uniquement dans ce navigateur et n’est pas transmise à la FIF. Aucun paiement réel n’est effectué.'}</span>
      </div>
    </div>
  )
}

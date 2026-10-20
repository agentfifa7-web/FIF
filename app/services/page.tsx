import Link from 'next/link'
import {
  ArrowRight, Award, BookOpen, Building2, ClipboardList, FileText, Flag, GraduationCap, HandCoins, IdCard, MapPin, Megaphone,
  Repeat, Scale, Search, ShieldCheck, ShoppingBag, Ticket, Users,
} from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'

export const metadata = { title: 'Services en ligne — FIF', description: 'Licences, transferts, formation, arbitrage, réclamations, documents officiels et espaces professionnels de la Fédération Ivoirienne de Football.' }

type Status = 'info' | 'demo' | 'pro'
const STATUS: Record<Status, { label: string; cls: string }> = {
  info: { label: 'Information officielle', cls: 'badge-green' },
  demo: { label: 'Démarche en démonstration', cls: 'badge-orange' },
  pro: { label: 'Espace professionnel', cls: 'badge-gray' },
}

const GROUPS: { id: string; title: string; intro: string; items: { href: string; title: string; desc: string; icon: typeof IdCard; status: Status }[] }[] = [
  {
    id: 'licencies', title: 'Joueurs et licenciés', intro: 'Licence, identité fédérale et mobilité des joueurs.',
    items: [
      { href: '/licences', title: 'Demander une licence', desc: 'Joueurs, entraîneurs, arbitres, dirigeants, agents et clubs.', icon: IdCard, status: 'demo' },
      { href: '/fif-id', title: 'FIF ID', desc: 'Identifiant numérique unique du football ivoirien.', icon: ShieldCheck, status: 'demo' },
      { href: '/verifier', title: 'Vérifier un FIF ID', desc: 'Contrôler l’authenticité d’une licence ou d’un diplôme.', icon: Search, status: 'demo' },
      { href: '/transferts', title: 'Transferts', desc: 'Demande et suivi d’un transfert entre clubs affiliés.', icon: Repeat, status: 'demo' },
    ],
  },
  {
    id: 'clubs', title: 'Clubs', intro: 'Gestion du club, effectifs, feuilles de match et accompagnement.',
    items: [
      { href: '/portail/clubs', title: 'Portail Clubs', desc: 'Effectifs, licenciés, compétitions et feuilles de match.', icon: ClipboardList, status: 'pro' },
      { href: '/aides-projets', title: 'Aides FIF & Projet Club', desc: 'Candidater aux programmes d’aide et suivre son dossier.', icon: HandCoins, status: 'demo' },
      { href: '/projet-club', title: 'Diagnostic Projet Club', desc: 'Évaluer la structuration de son club, module par module.', icon: Building2, status: 'demo' },
      { href: '/clubs', title: 'Annuaire des clubs', desc: 'Clubs de Ligue 1, Ligue 2 et du Championnat National Amateur.', icon: MapPin, status: 'info' },
    ],
  },
  {
    id: 'officiels', title: 'Arbitres, entraîneurs et officiels', intro: 'Formation, désignations et parcours techniques.',
    items: [
      { href: '/officiels', title: 'Portail Officiels', desc: 'Désignations, disponibilités et rapports de match.', icon: Flag, status: 'pro' },
      { href: '/arbitrage', title: 'Devenir arbitre', desc: 'Parcours de l’arbitre, de la formation initiale à l’élite.', icon: Award, status: 'demo' },
      { href: '/formation', title: 'FIF Academy', desc: 'Formations diplômantes : entraîneurs, arbitres, dirigeants.', icon: GraduationCap, status: 'demo' },
    ],
  },
  {
    id: 'juridique', title: 'Textes, discipline et réclamations', intro: 'Règlements, décisions et voies de recours.',
    items: [
      { href: '/documents', title: 'Documents officiels', desc: 'Statuts, règlements, circulaires et procès-verbaux.', icon: FileText, status: 'demo' },
      { href: '/discipline', title: 'Discipline', desc: 'Décisions et procédures de la Commission de discipline.', icon: Scale, status: 'demo' },
      { href: '/reclamations', title: 'Réclamations et appels', desc: 'Déposer une réclamation et suivre son instruction.', icon: BookOpen, status: 'demo' },
    ],
  },
  {
    id: 'public', title: 'Supporters et médias', intro: 'Billetterie, boutique, accréditations et contact.',
    items: [
      { href: '/billetterie', title: 'Billetterie', desc: 'Matchs des Éléphants et du championnat.', icon: Ticket, status: 'demo' },
      { href: '/boutique', title: 'Boutique', desc: 'Maillots et produits officiels.', icon: ShoppingBag, status: 'demo' },
      { href: '/presse', title: 'Espace presse', desc: 'Communiqués et demandes d’accréditation.', icon: Megaphone, status: 'demo' },
      { href: '/contact', title: 'Contact & FAQ', desc: 'Questions fréquentes et coordonnées de la FIF.', icon: Users, status: 'info' },
    ],
  },
]

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services en ligne"
        title="Vos démarches auprès de la FIF"
        subtitle="Licences, transferts, formation, arbitrage, réclamations et espaces professionnels. Chaque service indique s’il s’agit d’une information officielle, d’une démarche encore en démonstration ou d’un espace réservé."
        breadcrumb={[{ label: 'Services' }]}
        noPhotos
      />
      <section className="page-section">
        <div className="svc-hub">
          {GROUPS.map((g) => (
            <div key={g.id} className="svc-group" id={g.id}>
              <h2>{g.title}</h2>
              <p>{g.intro}</p>
              <div className="svc-grid">
                {g.items.map(({ href, title, desc, icon: Icon, status }) => (
                  <Link key={href} href={href} className="svc-card">
                    <div className="svc-card-top"><Icon size={22} aria-hidden /><span className={`badge ${STATUS[status].cls}`}>{STATUS[status].label}</span></div>
                    <strong>{title}</strong>
                    <span className="desc">{desc}</span>
                    <span className="text-link">Accéder <ArrowRight size={15} style={{ verticalAlign: 'middle' }} /></span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="demo-notice" style={{ marginTop: 40 }} role="note">
          <ShieldCheck aria-hidden />
          <div><strong>À propos des démarches en démonstration</strong><span>Ces formulaires préfigurent les futurs services en ligne. Tant qu’ils ne sont pas raccordés aux systèmes de la FIF, aucune demande n’est transmise et aucun paiement n’est effectué : adressez vos démarches officielles à votre club ou au secrétariat de la FIF.</span></div>
        </div>
      </section>
    </main>
  )
}

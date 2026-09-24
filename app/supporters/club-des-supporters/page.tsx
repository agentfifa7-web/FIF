import Link from 'next/link'
import { CalendarDays, Gift, Percent, ShoppingBag, Ticket, Users } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { DemoBadge } from '@/components/site/DemoBadge'
import { ClubDesSupportersJoin, type MembershipTier } from '@/components/site/ClubDesSupportersJoin'

export const metadata = { title: 'Club des Supporters — FIF Digital' }

const ADVANTAGES = [
  { icon: Gift, title: 'Kit de bienvenue', description: 'Écharpe, carte de membre et goodies Éléphants, à retirer au siège de la FIF ou livrés.' },
  { icon: Ticket, title: 'Billetterie prioritaire', description: 'Accès prioritaire aux matchs à domicile et à l’extérieur, ainsi qu’à la CAN.' },
  { icon: Percent, title: '-10% sur les tribunes', description: 'Réduction sur vos achats de billets hors places déjà préférentielles.' },
  { icon: CalendarDays, title: 'Entraînements publics', description: 'Accès privilégié aux séances d’entraînement ouvertes des Éléphants.' },
  { icon: Users, title: 'Événements exclusifs', description: 'Invitations aux avant-matchs, rencontres joueurs et événements supporters.' },
  { icon: ShoppingBag, title: 'Réductions boutique', description: 'Remises sur la Boutique FIF officielle, ventes privées réservées aux membres.' },
]

const TIERS: MembershipTier[] = [
  {
    name: 'Éléphant',
    price: 15000,
    tagline: 'L’essentiel pour suivre les Éléphants.',
    benefits: ['Billetterie prioritaire', 'Carte de membre numérique', '-5% Boutique FIF'],
  },
  {
    name: 'Éléphant Or',
    price: 35000,
    tagline: 'Pour les supporters les plus fidèles.',
    benefits: ['Tous les avantages Éléphant', 'Kit de bienvenue complet', '-10% Boutique FIF', 'Accès entraînements publics'],
  },
  {
    name: 'Carré VIP',
    price: 75000,
    tagline: 'L’expérience supporter complète.',
    benefits: ['Tous les avantages Éléphant Or', 'Espace Supporters les jours de match', 'Invitations événements exclusifs', 'Priorité absolue billetterie CAN'],
  },
]

export default function ClubDesSupportersPage() {
  return (
    <main>
      <PageHero
        eyebrow="🎟️ Club des Supporters"
        title="Vivez votre passion des Éléphants encore plus près."
        subtitle="Le Club des Supporters réunit tous les avantages et services exclusifs pour suivre et soutenir l’équipe nationale dans les meilleures conditions."
        breadcrumb={[{ label: 'Supporters', href: '/supporters' }, { label: 'Club des Supporters' }]}
        meta={[{ value: String(TIERS.length), label: 'Formules d’abonnement' }]}
      />

      <section className="page-section tight">
        <p className="section-tag">Vos avantages</p>
        <div className="info-tiles" style={{ marginTop: 16 }}>
          {ADVANTAGES.map((a) => (
            <div className="info-tile" key={a.title}><a.icon /><strong>{a.title}</strong><p>{a.description}</p></div>
          ))}
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Nos abonnements</p>
        <ClubDesSupportersJoin tiers={TIERS} />
      </section>

      <section className="page-section tight dark-section">
        <p className="section-tag" style={{ color: 'var(--orange)' }}>Aller plus loin</p>
        <div className="card-grid cols-2" style={{ marginTop: 16 }}>
          <Link href="/supporters/associations" className="entity-card"><Users size={18} color="var(--orange)" /><div><strong>Fan Clubs & associations</strong><span>Rejoindre ou créer une association reconnue par la FIF</span></div></Link>
          <Link href="/billetterie" className="entity-card"><Ticket size={18} color="var(--orange)" /><div><strong>Billetterie</strong><span>Réserver vos places pour les prochains matchs</span></div></Link>
        </div>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

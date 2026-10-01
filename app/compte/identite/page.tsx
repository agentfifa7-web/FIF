import { Breadcrumb } from '@/components/site/PageHero'
import { IdentityForm } from '@/components/site/IdentityForm'

export const metadata = { title: 'Mon identité — FIF Digital' }

export default function IdentityPage() {
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'Mon compte', href: '/compte' }, { label: 'Ma carte FIF ID', href: '/compte/carte' }, { label: 'Mon identité' }]} />
      </div>
      <section className="page-section tight"><IdentityForm /></section>
    </main>
  )
}

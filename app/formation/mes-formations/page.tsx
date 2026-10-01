import { Breadcrumb } from '@/components/site/PageHero'
import { MyAcademy } from '@/components/site/MyAcademy'
import { DemoBadge } from '@/components/site/DemoBadge'

export const metadata = { title: 'Mes formations — FIF Academy' }

export default function MyAcademyPage() {
  return (
    <main>
      <div style={{ padding: '28px clamp(20px,9vw,140px) 0' }}>
        <Breadcrumb items={[{ label: 'FIF Academy', href: '/formation' }, { label: 'Mes formations' }]} />
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-.03em', margin: '14px 0 0' }}>Mes formations</h1>
      </div>
      <section className="page-section tight"><MyAcademy /></section>
      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

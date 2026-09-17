'use client'

import { Camera, FileText, Mic, Newspaper } from 'lucide-react'
import { articles } from '@/lib/data/mock'
import { PageHero } from '@/components/site/PageHero'
import { NewsCard } from '@/components/site/cards'
import { DemoBadge } from '@/components/site/DemoBadge'

export default function PressPage() {
  return (
    <main>
      <PageHero
        eyebrow="FIF Media Center"
        title="Presse"
        subtitle="Communiqués, photos, vidéos, logos autorisés, dossiers de presse et accréditations pour les médias accrédités."
        breadcrumb={[{ label: 'Presse' }]}
      />

      <section className="page-section tight">
        <div className="info-tiles">
          <div className="info-tile"><Newspaper /><strong>Communiqués officiels</strong><p>Toutes les annonces institutionnelles et sportives publiées par la Fédération.</p></div>
          <div className="info-tile"><Camera /><strong>Médiathèque</strong><p>Photos et vidéos haute définition libres de droit pour la presse accréditée.</p></div>
          <div className="info-tile"><Mic /><strong>Conférences & interviews</strong><p>Retransmissions et retranscriptions des conférences de presse fédérales.</p></div>
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Derniers communiqués</p>
        <div className="news-grid" style={{ marginTop: 16 }}>
          {articles.slice(0, 3).map((a) => <NewsCard key={a.id} article={a} />)}
        </div>
      </section>

      <section className="page-section tight">
        <p className="section-tag">Demande d’accréditation</p>
        <form className="form-card" style={{ marginTop: 16, marginLeft: 0 }} onSubmit={(e) => e.preventDefault()}>
          <div className="text-field"><label htmlFor="media">Média / organe de presse</label><input id="media" required /></div>
          <div className="text-field"><label htmlFor="journalist">Nom du journaliste</label><input id="journalist" required /></div>
          <div className="text-field"><label htmlFor="event">Événement concerné</label><input id="event" placeholder="Match, conférence, événement…" /></div>
          <div className="form-actions"><button type="submit" className="button button-primary" style={{ justifyContent: 'center' }}><FileText size={16} /> Envoyer la demande</button></div>
        </form>
      </section>

      <section className="page-section tight"><DemoBadge /></section>
    </main>
  )
}

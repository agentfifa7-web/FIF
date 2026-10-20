import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import './ds.css'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { CmsHydrator } from '@/components/site/CmsHydrator'
import { SiteAnnouncement } from '@/components/site/SiteAnnouncement'
import { PwaRegister } from '@/components/site/InstallApp'
import { RevealObserver } from '@/components/site/RevealObserver'
import { MobileTabBar } from '@/components/site/MobileTabBar'
import { JsonLd } from '@/components/site/JsonLd'
import { connection } from 'next/server'
import { loadCms, toPublicOverlay } from '@/lib/cms/server'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const DESCRIPTION = 'Site de la Fédération Ivoirienne de Football : Éléphants et Éléphantes, Ligue 1 et Ligue 2, calendrier, résultats, clubs, joueurs, billetterie et services aux licenciés.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Fédération Ivoirienne de Football — FIF', template: '%s' },
  description: DESCRIPTION,
  openGraph: { type: 'website', locale: 'fr_CI', siteName: SITE_NAME, title: 'Fédération Ivoirienne de Football — FIF', description: DESCRIPTION, images: [{ url: '/media/hero-poster.jpg', alt: 'Fédération Ivoirienne de Football' }] },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
  applicationName: 'FIF',
  appleWebApp: { capable: true, title: 'FIF', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  viewportFit: 'cover',
  themeColor: '#041b12',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Rendu à chaque visite : les modifications du back-office sont visibles immédiatement.
  await connection()
  const cms = await loadCms()
  return (
    <html lang="fr" className={`${barlowCondensed.variable} ${barlow.variable}`}>
      <body className="antialiased">
        <JsonLd data={{
          '@context': 'https://schema.org', '@type': 'SportsOrganization', name: SITE_NAME, alternateName: 'FIF', sport: 'Football',
          url: SITE_URL, logo: `${SITE_URL}/fif-logo.png`, areaServed: 'Côte d’Ivoire',
          memberOf: [{ '@type': 'SportsOrganization', name: 'FIFA' }, { '@type': 'SportsOrganization', name: 'CAF' }],
        }} />
        <CmsHydrator overlay={toPublicOverlay(cms)}>
          <div className="site-shell">
            <SiteAnnouncement settings={cms.settings} />
            <SiteHeader />
            <div id="contenu" tabIndex={-1}>{children}</div>
            <SiteFooter settings={cms.settings} />
          </div>
          <MobileTabBar />
        </CmsHydrator>
        <PwaRegister />
        <RevealObserver />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

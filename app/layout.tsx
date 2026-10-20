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
import { connection } from 'next/server'
import { loadCms, toPublicOverlay } from '@/lib/cms/server'

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

export const metadata: Metadata = {
  title: { default: 'Fédération Ivoirienne de Football — FIF', template: '%s' },
  description: 'Actualités, compétitions, Éléphants, clubs, joueurs et données du football ivoirien.',
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
  colorScheme: 'light dark',
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
        <CmsHydrator overlay={toPublicOverlay(cms)}>
          <div className="site-shell">
            <SiteAnnouncement settings={cms.settings} />
            <SiteHeader />
            <div id="contenu" tabIndex={-1}>{children}</div>
            <SiteFooter settings={cms.settings} />
          </div>
        </CmsHydrator>
        <PwaRegister />
        <RevealObserver />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

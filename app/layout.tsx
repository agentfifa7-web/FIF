import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { CmsHydrator } from '@/components/site/CmsHydrator'
import { SiteAnnouncement } from '@/components/site/SiteAnnouncement'
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
  title: 'FIF Digital — Le football ivoirien, plus proche que jamais',
  description: 'Actualités, compétitions, Éléphants, clubs, joueurs et données du football ivoirien.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
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
            {children}
            <SiteFooter settings={cms.settings} />
          </div>
        </CmsHydrator>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

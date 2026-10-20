import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Espaces privés, pages personnelles et outils internes : pas d'indexation.
      disallow: ['/admin', '/api/', '/compte', '/connexion', '/inscription', '/billetterie/mes-billets', '/boutique/panier', '/search', '/verifier/', '/design-system', '/hors-ligne', '/formation/espace/', '/formation/mes-formations', '/formation/diplome', '/notifications'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

// Adresse publique du site, utilisée pour le sitemap, les liens canoniques et
// les aperçus de partage. NEXT_PUBLIC_SITE_URL permet de la remplacer (nom de
// domaine officiel) ; sinon l'adresse de production Vercel est utilisée.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://fif-oe4f.vercel.app')
).replace(/\/$/, '')

export const SITE_NAME = 'Fédération Ivoirienne de Football'

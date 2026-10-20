// Test de fumée du site : parcourt les pages publiques depuis l'accueil et
// vérifie pour chacune le code HTTP 200, un <title>, une description, un <h1>
// unique, la langue et l'absence de lien interne cassé.
// Usage : pnpm build && pnpm start, puis dans un autre terminal :
//   pnpm test                      (http://localhost:3000)
//   BASE_URL=https://… pnpm test   (site déployé)
const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const MAX = Number(process.env.MAX_PAGES || 400)
const SKIP = /^\/(admin|api|_next|icons|crests|flags|players|hero|media|fif-logo)|\.(png|jpe?g|svg|pdf|mp4|webmanifest|xml|txt|js)$/

const seen = new Set(), queue = ['/', '/sitemap.xml', '/robots.txt'], errors = []
let checked = 0
while (queue.length && checked < MAX) {
  const path = queue.shift()
  if (seen.has(path)) continue
  seen.add(path)
  let res
  try { res = await fetch(BASE + path, { redirect: 'manual' }) } catch (e) { errors.push(`${path} : ${e.message}`); continue }
  checked++
  if (res.status >= 300 && res.status < 400) continue
  if (res.status !== 200) { errors.push(`${path} : HTTP ${res.status}`); continue }
  if (path.endsWith('.xml') || path.endsWith('.txt')) continue
  const html = await res.text()
  const h1 = (html.match(/<h1[\s>]/g) || []).length
  if (!/<title>[^<]{3,}<\/title>/.test(html)) errors.push(`${path} : <title> manquant`)
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) errors.push(`${path} : description manquante`)
  if (!/<html lang="fr"/.test(html)) errors.push(`${path} : attribut lang absent`)
  if (h1 !== 1 && !path.startsWith('/admin')) errors.push(`${path} : ${h1} titre(s) <h1>`)
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) if (!SKIP.test(m[1]) && !seen.has(m[1])) queue.push(m[1])
}
console.log(`${checked} pages vérifiées sur ${BASE}`)
if (errors.length) { console.error(`${errors.length} problème(s) :\n- ` + errors.slice(0, 50).join('\n- ')); process.exit(1) }
console.log('Aucun problème détecté.')

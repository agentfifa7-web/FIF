import { readImage } from '@/lib/cms/store'

// Images envoyées depuis le back-office (actualités, boutique, clubs…).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const img = await readImage(id)
  if (!img) return new Response('Image introuvable', { status: 404 })
  return new Response(new Uint8Array(img.data), {
    headers: { 'Content-Type': img.contentType, 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
}

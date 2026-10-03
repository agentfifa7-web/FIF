// État courant des données du back-office dans ce module (serveur ou navigateur),
// mis à jour par applyOverlay (lib/cms/apply.ts).
import type { MatchSheetOverride } from '@/lib/matchsheet'
import { DEFAULT_SETTINGS, type SiteSettings } from './types'

export const cmsRuntime: { version: number; sheets: Record<string, MatchSheetOverride>; settings: SiteSettings } = {
  version: -1,
  sheets: {},
  settings: DEFAULT_SETTINGS,
}

export function getSettings(): SiteSettings {
  return cmsRuntime.settings
}

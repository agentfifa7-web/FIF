// Contenus des leçons FIF Academy, par formation (slug) puis module puis leçon,
// dans le même ordre que lib/data/academy.ts.
import type { LessonContent } from './types'
import { licenceCafA, licenceCafB, licenceCafC, entraineurFutsal } from './entraineurs'
import { educateurFootballDeBase, educatriceFootballFeminin } from './educateurs'
import { arbitreElite, arbitreFutsalBeach, arbitreStagiaire } from './arbitres'
import { duManagementSportFootball, gouvernanceGestionClub, licenceClubConformite } from './dirigeants'
import { analysteVideoData, preparateurPhysiqueFootball, recruteurDetectionTalents } from './performance'
import { duMedecineFootball, nutritionFootballeur } from './sante'
import { arbitreAssistant, commissaireDeMatch, entraineurGardiens, instructeurObservateurArbitres, licenceBFederale, licenceCafD, premiersSecoursTerrain, securiteStades } from './presentiel'
import { communicationMediasClub, integriteProtectionMineurs, marketingBilletterieFans, preparationExamenAgentFifa } from './organisation'

export type { LessonContent }

export const programContent: Record<string, LessonContent[][]> = {
  'licence-caf-d': licenceCafD,
  'licence-b-federale': licenceBFederale,
  'entraineur-gardiens': entraineurGardiens,
  'arbitre-assistant': arbitreAssistant,
  'instructeur-observateur-arbitres': instructeurObservateurArbitres,
  'premiers-secours-terrain': premiersSecoursTerrain,
  'commissaire-de-match': commissaireDeMatch,
  'securite-stades': securiteStades,
  'licence-caf-c': licenceCafC,
  'licence-caf-b': licenceCafB,
  'licence-caf-a': licenceCafA,
  'entraineur-futsal': entraineurFutsal,
  'educateur-football-de-base': educateurFootballDeBase,
  'educatrice-football-feminin': educatriceFootballFeminin,
  'arbitre-stagiaire': arbitreStagiaire,
  'arbitre-elite': arbitreElite,
  'arbitre-futsal-beach': arbitreFutsalBeach,
  'gouvernance-gestion-club': gouvernanceGestionClub,
  'licence-club-conformite': licenceClubConformite,
  'du-management-sport-football': duManagementSportFootball,
  'recruteur-detection-talents': recruteurDetectionTalents,
  'analyste-video-data': analysteVideoData,
  'preparateur-physique-football': preparateurPhysiqueFootball,
  'du-medecine-football': duMedecineFootball,
  'nutrition-footballeur': nutritionFootballeur,
  'preparation-examen-agent-fifa': preparationExamenAgentFifa,
  'communication-medias-club': communicationMediasClub,
  'marketing-billetterie-fans': marketingBilletterieFans,
  'integrite-protection-mineurs': integriteProtectionMineurs,
}

export function lessonContent(slug: string, moduleIndex: number, lessonIndex: number): LessonContent | undefined {
  return programContent[slug]?.[moduleIndex]?.[lessonIndex]
}

/** Durée de lecture estimée d'une leçon, en minutes. */
export function readingMinutes(c: LessonContent) {
  const words = [c.intro, ...c.points, c.practice, c.takeaway ?? ''].join(' ').split(/\s+/).length
  return Math.max(3, Math.round(words / 60) + 2)
}

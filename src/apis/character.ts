import { fetcher } from "./fetcher"
import type { Mood } from "./letter"

export interface Character {
  id: string
  characterType: { id: string; name: string; imageUrl: string | null }
  level: number
  maxLevel: number
  letterCount: number
  nextLevelLetterCount: number | null
  canGraduate: boolean
}

export interface GraduationCard {
  id: string
  graduatedAt: string
  levelSnapshot: number
  characterName: string
  letterCount: number
  topMood: Mood | null
  cardImageUrl: string | null
}

/** 내 캐릭터. 처음 조회하면 백엔드가 랜덤 종류로 만든다. */
export function getMyCharacter(token?: string) {
  return fetcher<Character>("/characters/me", { token })
}

export function getGraduationCards(token?: string) {
  return fetcher<GraduationCard[]>("/characters/graduation-cards", { token })
}

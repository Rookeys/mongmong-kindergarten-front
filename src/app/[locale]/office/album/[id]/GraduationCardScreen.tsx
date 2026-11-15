"use client"

import { notFound } from "next/navigation"
import { useTranslations } from "next-intl"
import { Popover } from "@kojaem/mongmong"
import { useCharacterFindMyGraduationCards } from "@/apis/generated/characters/characters"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterImage from "@/components/CharacterImage"
import LoadingScreen from "@/components/LoadingScreen"
import GraduationCardHeader from "../GraduationCardHeader"
import ShareCardButtons from "./ShareCardButtons"

export default function GraduationCardScreen({ cardId }: { cardId: string }) {
  const t = useTranslations("album")
  const tHome = useTranslations("home")
  const tMood = useTranslations("mood")
  // 단건 조회 API가 없어 목록에서 찾는다
  const { data: cards } = useCharacterFindMyGraduationCards()

  if (!cards) return <LoadingScreen />

  const card = cards.find((graduationCard) => graduationCard.id === cardId)
  if (!card) notFound()

  const details = [
    { label: t("name"), value: card.characterName },
    { label: t("letterCount"), value: t("letterCountValue", { count: card.letterCount }) },
    { label: t("topMood"), value: card.topMood ? tMood(card.topMood) : "-" }
  ]

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation />
      <article className="bg-card border-border-brand-weak mx-5 flex flex-col gap-4 rounded-lg border p-4">
        <GraduationCardHeader card={card} />
        <div className="bg-home-floor relative flex h-[230px] flex-col items-center justify-end gap-1 overflow-hidden rounded pb-4">
          <img
            src="/assets/images/home-room.gif"
            alt=""
            className="pixelated absolute top-0 left-1/2 h-[180px] w-[305px] max-w-none -translate-x-1/2"
          />
          {/* TODO: 디자인시스템 popover 자동 폭 옵션이 생기면 w-auto! 제거 */}
          <Popover kind="popover" title={tHome("idle")} tail="bottom" className="w-auto!" />
          <CharacterImage src={null} alt={card.characterName} size={80} />
        </div>
        <dl className="flex flex-col gap-2">
          {details.map((detail) => (
            <div key={detail.label} className="flex justify-between">
              <dt className="text-body-md text-text-inverse-secondary">{detail.label}</dt>
              <dd className="text-subtitle-md text-text-inverse-primary">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </article>
      <ShareCardButtons shareText={t("shareText", { name: card.characterName, count: card.letterCount })} />
    </main>
  )
}

import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Popover } from "@kojaem/mongmong"
import { getGraduationCards } from "@/apis/character"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterImage from "@/components/CharacterImage"
import { requireSession } from "@/utils/session"
import GraduationCardHeader from "../GraduationCardHeader"
import ShareCardButtons from "./ShareCardButtons"

/** 졸업 카드 상세 */
export default async function GraduationCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { access_token: token } = await requireSession()
  const { id } = await params
  const t = await getTranslations("album")
  const tHome = await getTranslations("home")
  const tMood = await getTranslations("mood")

  // 단건 조회 API가 없어 목록에서 찾는다
  const cards = await getGraduationCards(token)
  const card = cards.find((graduationCard) => graduationCard.id === id)
  if (!card) notFound()

  const details = [
    { label: t("name"), value: card.characterName },
    { label: t("letterCount"), value: t("letterCountValue", { count: card.letterCount }) },
    { label: t("topMood"), value: card.topMood ? tMood(card.topMood) : "-" }
  ]

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title="" />
      <article className="bg-card border-border-brand-weak mx-5 flex flex-col gap-4 rounded-lg border p-4">
        <GraduationCardHeader card={card} />
        <div className="relative flex h-[230px] flex-col items-center justify-end gap-1 overflow-hidden rounded bg-[#ffd0da] pb-4">
          <img
            src="/assets/images/home-room.gif"
            alt=""
            className="absolute top-0 left-1/2 h-[180px] w-[305px] max-w-none -translate-x-1/2"
          />
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

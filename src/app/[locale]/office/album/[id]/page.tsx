import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Popover } from "@kojaem/mongmong"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterImage from "@/components/CharacterImage"
import { api, type GraduationCard } from "@/utils/api"
import { requireSession } from "@/utils/session"
import { formatCardDate, LevelBadge } from "../card"
import ShareCardButton from "./ShareCardButton"

export default async function AlbumCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { access_token: token } = await requireSession()
  const { id } = await params
  const t = await getTranslations("album")
  const tHome = await getTranslations("home")
  const tMood = await getTranslations("mood")
  // 단건 조회 API가 없어 목록에서 찾는다
  const card = (await api<GraduationCard[]>("/characters/graduation-cards", { token })).find((c) => c.id === id)
  if (!card) notFound()

  const rows = [
    [t("name"), card.characterName],
    [t("letterCount"), t("letterCountValue", { count: card.letterCount })],
    [t("topMood"), card.topMood ? tMood(card.topMood) : "-"]
  ]

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title="" />
      <article className="border-border-brand-weak mx-5 flex flex-col gap-4 rounded-lg border bg-[linear-gradient(rgb(41_5_255/0.1),rgb(41_5_255/0.1)),linear-gradient(#f4f4f9,#f4f4f9)] p-4">
        <div className="flex items-center justify-between">
          <LevelBadge level={card.levelSnapshot} />
          <span className="text-caption-lg text-text-inverse-secondary">{formatCardDate(card.graduatedAt)}</span>
        </div>
        <div className="relative flex h-[230px] flex-col items-center justify-end gap-1 overflow-hidden rounded bg-[#ffd0da] pb-4">
          <img src="/assets/images/home-room.gif" alt="" className="absolute top-0 left-1/2 h-[180px] w-[305px] max-w-none -translate-x-1/2" />
          <Popover kind="popover" title={tHome("idle")} tail="bottom" className="w-auto!" />
          <CharacterImage src={null} alt={card.characterName} size={80} />
        </div>
        <dl className="flex flex-col gap-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <dt className="text-body-md text-text-inverse-secondary">{label}</dt>
              <dd className="text-subtitle-md text-text-inverse-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </article>
      <ShareCardButton text={t("shareText", { name: card.characterName, count: card.letterCount })} />
    </main>
  )
}

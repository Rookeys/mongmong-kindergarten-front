import { getTranslations } from "next-intl/server"
import { Result } from "@kojaem/mongmong"
import BackTopNavigation from "@/components/BackTopNavigation"
import { Link } from "@/i18n/navigation"
import { api, type GraduationCard } from "@/utils/api"
import { requireSession } from "@/utils/session"
import { formatCardDate, LevelBadge } from "./card"

export default async function AlbumPage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("album")
  const cards = await api<GraduationCard[]>("/characters/graduation-cards", { token })

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      {cards.length === 0 ? (
        <Result
          className="mt-20 [&_*]:text-text-secondary!"
          image={<img src="/assets/images/character-face.png" alt="" width={40} height={40} />}
          title={t("empty")}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 px-5 py-5">
          {cards.map((card) => (
            <li key={card.id}>
              <Link
                href={`/office/album/${card.id}`}
                className="border-border-brand-weak flex flex-col items-center gap-2 rounded-lg border bg-[linear-gradient(rgb(41_5_255/0.1),rgb(41_5_255/0.1)),linear-gradient(#f4f4f9,#f4f4f9)] p-3"
              >
                <div className="flex w-full items-center justify-between">
                  <LevelBadge level={card.levelSnapshot} />
                  <span className="text-caption-lg text-text-inverse-secondary">{formatCardDate(card.graduatedAt)}</span>
                </div>
                <img
                  src={card.cardImageUrl ?? "/assets/images/mood-placeholder.png"}
                  alt=""
                  width={100}
                  height={100}
                  className="[image-rendering:pixelated]"
                />
                <span className="text-subtitle-md text-text-inverse-primary">{card.characterName}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

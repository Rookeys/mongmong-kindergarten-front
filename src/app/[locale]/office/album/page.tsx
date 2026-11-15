import { getTranslations } from "next-intl/server"
import { Result } from "@kojaem/mongmong"
import { getGraduationCards } from "@/apis/character"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import { ON_DARK_SECONDARY_TEXT } from "@/constants/designSystemOverrides"
import { Link } from "@/i18n/navigation"
import { requireSession } from "@/utils/session"
import GraduationCardHeader from "./GraduationCardHeader"

/** 졸업 앨범: 졸업한 캐릭터 카드 목록 */
export default async function AlbumPage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("album")
  const cards = await getGraduationCards(token)

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      {cards.length === 0 ? (
        <Result className={`mt-20 ${ON_DARK_SECONDARY_TEXT}`} image={<CharacterFace size={40} />} title={t("empty")} />
      ) : (
        <ul className="grid grid-cols-2 gap-3 px-5 py-5">
          {cards.map((card) => (
            <li key={card.id}>
              <Link
                href={`/office/album/${card.id}`}
                className="bg-card border-border-brand-weak flex flex-col items-center gap-2 rounded-lg border p-3"
              >
                <GraduationCardHeader card={card} />
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

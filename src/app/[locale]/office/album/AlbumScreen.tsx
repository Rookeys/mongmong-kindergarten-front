"use client"

import { useTranslations } from "next-intl"
import { Result } from "@kojaem/mongmong"
import { useCharacterFindMyGraduationCards } from "@/apis/generated/characters/characters"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import GraduationCardHeader from "./GraduationCardHeader"

export default function AlbumScreen() {
  const t = useTranslations("album")
  const { data: cards } = useCharacterFindMyGraduationCards()

  if (!cards) return <LoadingScreen />

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      {cards.length === 0 ? (
        <Result className="mt-20" image={<CharacterFace size={40} />} title={t("empty")} />
      ) : (
        <ul className="grid grid-cols-2 gap-3 p-5">
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
                  className="pixelated"
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

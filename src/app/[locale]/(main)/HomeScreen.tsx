"use client"

import { useLocale, useTranslations } from "next-intl"
import { Button, Popover } from "@kojaem/mongmong"
import { useAuthGetMe } from "@/apis/generated/auth/auth"
import { useCharacterFindMine } from "@/apis/generated/characters/characters"
import type { LocaleType } from "@/apis/generated/model"
import { useQuestionFindDaily } from "@/apis/generated/questions/questions"
import CharacterImage from "@/components/CharacterImage"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"

export default function HomeScreen() {
  const t = useTranslations("home")
  const locale = useLocale() as LocaleType
  const { data: character } = useCharacterFindMine()
  const { data: me } = useAuthGetMe()
  const { data: question } = useQuestionFindDaily({ locale })

  if (!character || !me || !question) return <LoadingScreen />

  const characterName = character.characterType.name

  return (
    <main className="bg-home-floor flex flex-1 flex-col">
      <header className="bg-home-header flex h-[54px] items-center justify-between px-[20px] py-[12px]">
        <div className="flex items-center gap-[20px]">
          <HeaderStat value={`LV.${character.level}`} />
          <Link href="/rewards">
            <HeaderStat value={me.rewardCount} />
          </Link>
        </div>
        {/* TODO: 오른쪽 아이콘 3개는 Figma에서 용도 미정 (임시 하트 아이콘) */}
        <div className="flex items-center gap-[20px]" aria-hidden>
          <HeaderIcon />
          <HeaderIcon />
          <HeaderIcon />
        </div>
      </header>

      <section className="relative flex h-[398px] flex-col items-center justify-end gap-[4px] overflow-hidden">
        <img
          src="/assets/images/home-room.gif"
          alt=""
          className="pixelated absolute top-0 left-1/2 h-[304px] w-[515px] max-w-none -translate-x-1/2"
        />
        {/* TODO: 디자인시스템 popover가 폭 260px 고정이라 Figma처럼 내용 폭에 맞추려고 덮어씀 (자동 폭 옵션 필요) */}
        <Popover kind="popover" title={t("idle")} tail="bottom" className="w-auto!" />
        <CharacterImage src={character.characterType.imageUrl} alt={characterName} size={100} />
      </section>

      <section className="px-[20px] pb-[12px]">
        <div className="bg-fill-glass-weak border-border-brand-weak rounded-card-l flex flex-col items-end gap-[12px] border px-[20px] py-[16px] backdrop-blur-[15px]">
          <p className="text-body-md text-text-inverse-primary w-full">{question.content}</p>
          <Button asChild size="s" color="brand" variant="fill">
            <Link href="/letter">{t("openLetter", { name: characterName })}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function HeaderStat({ value }: { value: string | number }) {
  return (
    <div className="flex items-center gap-[2px]">
      <HeaderIcon />
      <span className="text-subtitle-sm text-text-primary">{value}</span>
    </div>
  )
}

function HeaderIcon() {
  return <img src="/assets/images/heart.png" alt="" width={28} height={28} className="rounded-full" />
}

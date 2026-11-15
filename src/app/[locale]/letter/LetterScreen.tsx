"use client"

import { useLocale, useTranslations } from "next-intl"
import { Button } from "@kojaem/mongmong"
import { useAuthGetMe } from "@/apis/generated/auth/auth"
import { useCharacterFindMine } from "@/apis/generated/characters/characters"
import type { LocaleType } from "@/apis/generated/model"
import { useQuestionFindDaily } from "@/apis/generated/questions/questions"
import BackTopNavigation from "@/components/BackTopNavigation"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"

export default function LetterScreen() {
  const t = useTranslations("letter")
  const locale = useLocale() as LocaleType
  const { data: character } = useCharacterFindMine()
  const { data: me } = useAuthGetMe()
  const { data: question } = useQuestionFindDaily({ locale })

  if (!character || !me || !question) return <LoadingScreen />

  const name = character.characterType.name
  const hasReplied = Boolean(question.letterId)

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title", { name })} />

      <section className="p-5">
        <article className="bg-letter-paper border-border-brand-weak rounded-bottom-sheet flex flex-col border py-6 backdrop-blur-[15px]">
          <p className="text-subtitle-lg text-text-inverse-primary px-6 py-3">{t("to")}</p>
          <p className="text-body-md text-text-inverse-secondary px-6 py-2 whitespace-pre-line">
            {t("body", { name, nickname: me.nickname ?? "", question: question.content })}
          </p>
          <div className="flex h-[58px] items-center justify-between px-6 pt-5">
            <p className="text-subtitle-lg text-text-inverse-primary whitespace-pre-line">{t("from", { name })}</p>
            <img src="/assets/images/letter-sign.png" alt="" width={60} height={60} className="pixelated" />
          </div>
        </article>
      </section>

      <div className="mt-auto flex flex-col gap-2 px-5 pb-5">
        {hasReplied ? (
          <Button size="xl" color="brand" variant="fill" isFullWidth disabled>
            {t("alreadyWritten")}
          </Button>
        ) : (
          <Button asChild size="xl" color="brand" variant="fill" isFullWidth>
            <Link href="/letter/write">{t("write")}</Link>
          </Button>
        )}
        <Button asChild size="xl" color="brand" variant="weak" isFullWidth>
          <Link href="/">{t("later")}</Link>
        </Button>
      </div>
    </main>
  )
}

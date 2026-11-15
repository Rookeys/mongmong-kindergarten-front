"use client"

import { useLocale, useTranslations } from "next-intl"
import { Button, ListRow, Result } from "@kojaem/mongmong"
import { useLetterFindPublic } from "@/apis/generated/letters/letters"
import type { LocaleType } from "@/apis/generated/model"
import { useQuestionFindDaily } from "@/apis/generated/questions/questions"
import CharacterFace from "@/components/CharacterFace"
import DateChangeTitle from "@/components/DateChangeTitle"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import LoungeWelcomeSheet from "./LoungeWelcomeSheet"
import PublicLetterCard from "@/components/PublicLetterCard"

export default function LoungeScreen({ date }: { date?: string }) {
  const t = useTranslations("lounge")
  const locale = useLocale() as LocaleType
  const { data: question } = useQuestionFindDaily({ date, locale })
  const { data: letters } = useLetterFindPublic(
    { questionId: question?.id ?? "" },
    { query: { enabled: Boolean(question) } }
  )

  if (!question || !letters) return <LoadingScreen />

  const writeHref = `/letter/write?date=${question.date}`

  return (
    <main className="bg-gradient-letter flex flex-1 flex-col">
      <header className="text-subtitle-lg text-text-primary flex h-[54px] items-center justify-center">
        <DateChangeTitle date={question.date} path="/lounge" />
      </header>
      <h1 className="text-title-md text-text-primary px-[20px] py-[24px]">{question.content}</h1>

      {letters.length === 0 ? (
        <Result
          image={<CharacterFace size={40} />}
          title={t("empty")}
          action={
            <Button asChild size="s" color="brand" variant="fill">
              <Link href={writeHref}>{t("writeFirst")}</Link>
            </Button>
          }
        />
      ) : (
        <>
          <Link href={writeHref} className="block">
            <ListRow
              padding="l"
              leadingAsset={<CharacterFace />}
              title={t("writeToo")}
              trailingAccessory={<span aria-hidden>›</span>}
            />
          </Link>
          <ul className="flex flex-col gap-[24px] px-[20px] pt-[12px] pb-[24px]">
            {letters.map((letter) => (
              <li key={letter.id}>
                <PublicLetterCard letter={letter} />
              </li>
            ))}
          </ul>
        </>
      )}
      <LoungeWelcomeSheet />
    </main>
  )
}

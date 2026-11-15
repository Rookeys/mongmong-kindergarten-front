"use client"

import { useLocale, useTranslations } from "next-intl"
import { ListRow } from "@kojaem/mongmong"
import type { LocaleType } from "@/apis/generated/model"
import { useQuestionFindAll } from "@/apis/generated/questions/questions"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import { getDateOfQuestionOrder, toKstDate } from "@/utils/date"

/**
 * 1년치 질문 목록. 누르면 올해 그 질문 날짜의 답장 쓰기로 간다 (미래 날짜는 비활성).
 * 2월 29일은 질문이 없어 목록에도 없다. TODO: "광고 보고 답장 쓰기"는 임시 알림 (TODO.md)
 */
export default function QuestionListScreen() {
  const t = useTranslations("questions")
  const tCommon = useTranslations("common")
  const locale = useLocale() as LocaleType
  const { data: questions } = useQuestionFindAll({ locale })

  if (!questions) return <LoadingScreen />

  const today = toKstDate()
  const year = Number(today.slice(0, 4))

  return (
    <main className="bg-night-sky flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      <button type="button" className="block text-left" onClick={() => alert(tCommon("adNotReady"))}>
        <ListRow
          padding="l"
          leadingAsset={<CharacterFace />}
          title={t("adReply")}
          trailingAccessory={<span aria-hidden>›</span>}
        />
      </button>
      <ol className="flex flex-col pb-[20px]">
        {questions.map((question) => {
          const date = getDateOfQuestionOrder(year, question.orderNum)
          const order = String(question.orderNum).padStart(3, "0")
          const content = (
            <>
              <span className="text-text-secondary">{order}</span>
              {question.content}
            </>
          )
          return (
            <li key={question.id}>
              {date > today ? (
                <p className="text-subtitle-md text-text-quaternary flex gap-[24px] px-[20px] py-[16px]">{content}</p>
              ) : (
                <Link
                  href={`/letter/write?date=${date}`}
                  className="text-subtitle-md text-text-primary flex gap-[24px] px-[20px] py-[16px]"
                >
                  {content}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}

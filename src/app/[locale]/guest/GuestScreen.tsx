"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { signIn } from "next-auth/react"
import { Button, Modal } from "@kojaem/mongmong"
import type { LocaleType } from "@/apis/generated/model"
import { useQuestionFindGuestToday } from "@/apis/generated/questions/questions"
import BackTopNavigation from "@/components/BackTopNavigation"
import LoadingScreen from "@/components/LoadingScreen"
import RestDayScreen from "@/components/RestDayScreen"
import { isRestDay, toKstDate } from "@/utils/date"

/** 비회원 화면. 오늘의 질문만 보여주고, 답장 쓰기를 누르면 로그인을 안내한다 */
export default function GuestScreen() {
  const t = useTranslations("guest")
  const locale = useLocale() as LocaleType
  // 2월 29일은 질문이 없는 날이라 조회하지 않는다
  const isTodayRestDay = isRestDay(toKstDate())
  const { data: question } = useQuestionFindGuestToday({ locale }, { query: { enabled: !isTodayRestDay } })
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  if (!question && !isTodayRestDay) return <LoadingScreen />

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title")} />
      {question ? (
        <section className="flex flex-1 flex-col px-[20px] py-[20px]">
          <article className="bg-letter-paper border-border-brand-weak rounded-bottom-sheet border px-[24px] py-[24px] backdrop-blur-[15px]">
            <p className="text-subtitle-lg text-text-inverse-primary">{question.content}</p>
          </article>
          <div className="mt-auto flex flex-col gap-[8px]">
            <p className="text-body-md text-text-secondary text-center">{t("description")}</p>
            <Button size="xl" color="brand" variant="fill" isFullWidth onClick={() => setIsLoginModalOpen(true)}>
              {t("write")}
            </Button>
          </div>
        </section>
      ) : (
        <RestDayScreen />
      )}

      <Modal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        title={t("loginTitle")}
        description={t("loginDescription")}
        buttons={
          <>
            <Button size="l" color="brand" variant="weak" isFullWidth onClick={() => setIsLoginModalOpen(false)}>
              {t("later")}
            </Button>
            <Button
              size="l"
              color="brand"
              variant="fill"
              isFullWidth
              onClick={() => signIn("kakao", { callbackUrl: `/${locale}/auth/sign-in` })}
            >
              {t("login")}
            </Button>
          </>
        }
      />
    </main>
  )
}

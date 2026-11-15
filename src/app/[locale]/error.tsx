"use client"

import { useTranslations } from "next-intl"
import { Button, Result } from "@kojaem/mongmong"
import { getErrorMessage } from "@/apis/instance"

/** 화면 데이터를 불러오지 못했을 때 (react-query 조회 실패도 여기로 온다) */
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("common")
  return (
    <main className="bg-night-sky flex min-h-dvh items-center justify-center">
      <Result
        title={t("errorTitle")}
        description={getErrorMessage(error)}
        action={
          <Button size="m" color="brand" variant="fill" onClick={reset}>
            {t("retry")}
          </Button>
        }
      />
    </main>
  )
}

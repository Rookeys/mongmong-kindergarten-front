import { getLocale, getTranslations } from "next-intl/server"
import { Button } from "@kojaem/mongmong"
import { getMe } from "@/apis/auth"
import { getMyCharacter } from "@/apis/character"
import { getDailyQuestion } from "@/apis/question"
import BackTopNavigation from "@/components/BackTopNavigation"
import { Link } from "@/i18n/navigation"
import { requireSession } from "@/utils/session"

/** 캐릭터가 보낸 오늘의 질문 편지 */
export default async function LetterPage() {
  const { access_token: token } = await requireSession()
  const locale = await getLocale()
  const t = await getTranslations("letter")

  const [character, me, question] = await Promise.all([
    getMyCharacter(token),
    getMe(token),
    getDailyQuestion({ locale }, token)
  ])
  const name = character.characterType.name
  const hasReplied = Boolean(question.letterId)

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={t("title", { name })} />

      <section className="px-5 py-5">
        <article className="border-border-brand-weak rounded-bottom-sheet flex flex-col border bg-[radial-gradient(120%_120%_at_0%_0%,rgb(255_255_255/0.9),rgb(249_248_255/0.9)_54%,rgb(229_226_255/0.9))] py-6 backdrop-blur-[15px]">
          <p className="text-subtitle-lg text-text-inverse-primary px-6 py-3">{t("to")}</p>
          <p className="text-body-md text-text-inverse-secondary px-6 py-2 whitespace-pre-line">
            {t("body", { name, nickname: me.nickname ?? "", question: question.content })}
          </p>
          <div className="flex h-[58px] items-center justify-between px-6 pt-5">
            <p className="text-subtitle-lg text-text-inverse-primary whitespace-pre-line">{t("from", { name })}</p>
            <img
              src="/assets/images/letter-sign.png"
              alt=""
              width={60}
              height={60}
              className="[image-rendering:pixelated]"
            />
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

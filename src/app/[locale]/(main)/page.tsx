import { getLocale, getTranslations } from "next-intl/server"
import { Button, Popover } from "@kojaem/mongmong"
import { Link } from "@/i18n/navigation"
import { api, type Character, type DailyQuestion, type User } from "@/utils/api"
import { requireSession } from "@/utils/session"

export default async function HomePage() {
  const { access_token: token } = await requireSession()
  const locale = await getLocale()
  const t = await getTranslations("home")
  const [character, me, question] = await Promise.all([
    api<Character>("/characters/me", { token }),
    api<User>("/auth/me", { token }),
    api<DailyQuestion>(`/questions/daily?locale=${locale}`, { token })
  ])

  return (
    <main className="flex flex-1 flex-col bg-[#ffd0da]">
      <header className="flex h-[54px] items-center justify-between bg-[#140f60] px-5 py-3">
        <div className="flex items-center gap-5">
          <HeaderStat value={`LV.${character.level}`} />
          <HeaderStat value={me.rewardCount} />
        </div>
        {/* TODO: 오른쪽 아이콘 3개는 Figma에서 용도 미정 (임시 하트 아이콘) */}
        <div className="flex items-center gap-5" aria-hidden>
          <HeaderIcon />
          <HeaderIcon />
          <HeaderIcon />
        </div>
      </header>

      <section className="relative flex h-[398px] flex-col items-center justify-end gap-1 overflow-hidden">
        <img
          src="/assets/images/home-room.gif"
          alt=""
          className="absolute top-0 left-1/2 h-[304px] w-[515px] max-w-none -translate-x-1/2 [image-rendering:pixelated]"
        />
        {/* Figma "Primitive / Popover": 내용 폭에 맞춤. DS popover는 260px 고정이라 덮어씀 */}
        <Popover kind="popover" title={t("idle")} tail="bottom" className="w-auto!" />
        {/* 원본 이미지 여백이 커서 Figma와 같은 비율로 잘라 보여준다 */}
        <div className="relative size-[100px] overflow-hidden">
          <img
            src={character.characterType.imageUrl ?? "/assets/images/character-egg.png"}
            alt={character.characterType.name}
            className="absolute top-[-52.98%] left-[-55.44%] size-[212.9%] max-w-none [image-rendering:pixelated]"
          />
        </div>
      </section>

      <section className="px-5 pb-3">
        <div className="bg-fill-glass-weak border-border-brand-weak rounded-card-l flex flex-col items-end gap-3 border px-5 py-4 backdrop-blur-[15px]">
          <p className="text-body-md text-text-inverse-primary w-full">{question.content}</p>
          <Button asChild size="s" color="brand" variant="fill">
            <Link href="/letter">{t("openLetter", { name: character.characterType.name })}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function HeaderStat({ value }: { value: string | number }) {
  return (
    <div className="flex items-center gap-0.5">
      <HeaderIcon />
      <span className="text-subtitle-sm text-text-primary">{value}</span>
    </div>
  )
}

function HeaderIcon() {
  return <img src="/assets/images/heart.png" alt="" width={28} height={28} className="rounded-full" />
}

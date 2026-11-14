import { getTranslations } from "next-intl/server"
import { Button, ListRow } from "@kojaem/mongmong"
import { Link } from "@/i18n/navigation"
import { api, type User } from "@/utils/api"
import { todayKst } from "@/utils/date"
import { requireSession } from "@/utils/session"

const DAY_MS = 24 * 60 * 60 * 1000
const ROW_CLASS = "[&_*]:text-text-primary!"

// TODO: 자주 묻는 질문·의견 보내기·스토어 리뷰·서비스 팀원 링크, 설정·로그아웃·탈퇴 (TODO.md)
export default async function OfficePage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("office")
  const me = await api<User>("/auth/me", { token })
  const joined = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date(me.createdDate))
  const days = Math.round((Date.parse(todayKst()) - Date.parse(joined)) / DAY_MS) + 1

  return (
    <main className="flex flex-1 flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <section className="flex flex-col gap-1 px-5 pt-14 pb-6">
        <h1 className="text-title-md text-text-primary">{t("together", { nickname: me.nickname ?? "", days })}</h1>
        <p className="text-body-md text-text-secondary">{t("inviteCode", { code: me.myInviteCode })}</p>
      </section>

      <ListRow
        padding="l"
        className={ROW_CLASS}
        leadingAsset={<img src="/assets/images/character-face.png" alt="" width={30} height={30} />}
        title={t("rewardCount", { count: me.rewardCount })}
        trailingAccessory={
          <Button asChild size="s" color="brand" variant="fill">
            <Link href="/rewards">{t("moreRewards")}</Link>
          </Button>
        }
      />
      {(
        [
          ["album", "/office/album"],
          ["notices", "/office/notices"]
        ] as const
      ).map(([key, href]) => (
        <Link key={key} href={href} className="block">
          <ListRow padding="l" className={ROW_CLASS} title={t(key)} trailingAccessory={<span aria-hidden>›</span>} />
        </Link>
      ))}
    </main>
  )
}

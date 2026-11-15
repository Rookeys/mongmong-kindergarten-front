import { getTranslations } from "next-intl/server"
import { Button, ListRow } from "@kojaem/mongmong"
import { getMe } from "@/apis/auth"
import CharacterFace from "@/components/CharacterFace"
import { ON_DARK_TEXT } from "@/constants/designSystemOverrides"
import { Link } from "@/i18n/navigation"
import { toKstDate } from "@/utils/date"
import { requireSession } from "@/utils/session"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const MENUS = [
  { key: "album", href: "/office/album" },
  { key: "notices", href: "/office/notices" },
  { key: "settings", href: "/office/settings" }
] as const

/** 가입한 날을 1일째로 센다 */
function getDaysTogether(joinedAt: string) {
  return Math.round((Date.parse(toKstDate()) - Date.parse(toKstDate(joinedAt))) / ONE_DAY_MS) + 1
}

/** 원장실 탭. TODO: 자주 묻는 질문·의견 보내기·스토어 리뷰·서비스 팀원 (연결할 주소 없음) */
export default async function OfficePage() {
  const { access_token: token } = await requireSession()
  const t = await getTranslations("office")
  const me = await getMe(token)

  return (
    <main className="flex flex-1 flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <section className="flex flex-col gap-1 px-5 pt-14 pb-6">
        <h1 className="text-title-md text-text-primary">
          {t("together", { nickname: me.nickname ?? "", days: getDaysTogether(me.createdDate) })}
        </h1>
        <p className="text-body-md text-text-secondary">{t("inviteCode", { code: me.myInviteCode })}</p>
      </section>

      <ListRow
        padding="l"
        className={ON_DARK_TEXT}
        leadingAsset={<CharacterFace />}
        title={t("rewardCount", { count: me.rewardCount })}
        trailingAccessory={
          <Button asChild size="s" color="brand" variant="fill">
            <Link href="/rewards">{t("moreRewards")}</Link>
          </Button>
        }
      />
      {MENUS.map((menu) => (
        <Link key={menu.key} href={menu.href} className="block">
          <ListRow
            padding="l"
            className={ON_DARK_TEXT}
            title={t(menu.key)}
            trailingAccessory={<span aria-hidden>›</span>}
          />
        </Link>
      ))}
    </main>
  )
}

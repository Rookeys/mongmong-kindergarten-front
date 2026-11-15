"use client"

import { useTranslations } from "next-intl"
import { Button, ListRow } from "@kojaem/mongmong"
import { useAuthGetMe } from "@/apis/generated/auth/auth"
import CharacterFace from "@/components/CharacterFace"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import { toKstDate } from "@/utils/date"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

// TODO: 자주 묻는 질문·의견 보내기·스토어 리뷰·서비스 팀원 (연결할 주소 없음)
const MENUS = [
  { key: "album", href: "/office/album" },
  { key: "notices", href: "/office/notices" },
  { key: "settings", href: "/office/settings" }
] as const

/** 가입한 날을 1일째로 센다 */
function getDaysTogether(joinedAt: string) {
  return Math.round((Date.parse(toKstDate()) - Date.parse(toKstDate(joinedAt))) / ONE_DAY_MS) + 1
}

export default function OfficeScreen() {
  const t = useTranslations("office")
  const { data: me } = useAuthGetMe()

  if (!me) return <LoadingScreen />

  return (
    <main className="bg-night-sky flex flex-1 flex-col">
      <section className="flex flex-col gap-[4px] px-[20px] pt-[56px] pb-[24px]">
        <h1 className="text-title-md text-text-primary">
          {t("together", { nickname: me.nickname ?? "", days: getDaysTogether(me.createdDate) })}
        </h1>
        <p className="text-body-md text-text-secondary">{t("inviteCode", { code: me.myInviteCode })}</p>
      </section>

      <ListRow
        padding="l"
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
          <ListRow padding="l" title={t(menu.key)} trailingAccessory={<span aria-hidden>›</span>} />
        </Link>
      ))}
    </main>
  )
}

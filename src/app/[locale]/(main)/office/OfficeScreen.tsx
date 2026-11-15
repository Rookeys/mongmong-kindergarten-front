"use client"

import { useTranslations } from "next-intl"
import { Button, ListRow } from "@kojaem/mongmong"
import { useAuthGetMe } from "@/apis/generated/auth/auth"
import CharacterFace from "@/components/CharacterFace"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import { toKstDate } from "@/utils/date"

const ONE_DAY_MS = 24 * 60 * 60 * 1000

/** 원장실 메뉴 (Figma 순서). href가 없는 메뉴는 아직 준비 중이라 누르면 안내만 띄운다 */
const MENUS = [
  { key: "album", href: "/office/album" },
  { key: "notices", href: "/office/notices" },
  // TODO: 자주 묻는 질문·의견 보내기·스토어 리뷰·만든 사람들은 화면·연결 주소가 정해지면 연결 (TODO.md)
  { key: "faq", href: undefined },
  { key: "feedback", href: undefined },
  { key: "storeReview", href: undefined },
  { key: "makers", href: undefined },
  { key: "settings", href: "/office/settings" }
] as const

/** 가입한 날을 1일째로 센다 */
function getDaysTogether(joinedAt: string) {
  return Math.round((Date.parse(toKstDate()) - Date.parse(toKstDate(joinedAt))) / ONE_DAY_MS) + 1
}

export default function OfficeScreen() {
  const t = useTranslations("office")
  const tCommon = useTranslations("common")
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
      {MENUS.map((menu) => {
        const row = <ListRow padding="l" title={t(menu.key)} trailingAccessory={<span aria-hidden>›</span>} />
        return menu.href ? (
          <Link key={menu.key} href={menu.href} className="block">
            {row}
          </Link>
        ) : (
          <button
            key={menu.key}
            type="button"
            className="block w-full text-left"
            onClick={() => alert(tCommon("comingSoon"))}
          >
            {row}
          </button>
        )
      })}
    </main>
  )
}

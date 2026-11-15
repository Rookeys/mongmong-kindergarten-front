"use client"

import { useTranslations } from "next-intl"
import { TabBar, TabBarItem } from "@kojaem/mongmong"
import { usePathname, useRouter } from "@/i18n/navigation"

const TABS = [
  { key: "home", href: "/" },
  { key: "diary", href: "/diary" },
  { key: "decorate", href: "/decorate" },
  { key: "lounge", href: "/lounge" },
  { key: "office", href: "/office" }
] as const

/** 하단 탭바: 홈·일지·꾸미기·휴게실·원장실 */
export default function MainTabBar() {
  const t = useTranslations("tab")
  const pathname = usePathname()
  const router = useRouter()

  // 홈("/")은 정확히 같을 때만, 나머지 탭은 하위 경로까지 선택으로 본다
  const isSelected = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <TabBar className="sticky bottom-0">
      {TABS.map(({ key, href }) => {
        const selected = isSelected(href)
        return (
          <TabBarItem
            key={key}
            icon={<img src={`/assets/icons/tab/${key}-${selected ? "on" : "off"}.svg`} alt="" width={24} height={24} />}
            label={t(key)}
            selected={selected}
            onClick={() => router.push(href)}
          />
        )
      })}
    </TabBar>
  )
}

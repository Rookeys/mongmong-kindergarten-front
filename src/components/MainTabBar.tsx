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

export default function MainTabBar() {
  const t = useTranslations("tab")
  const pathname = usePathname()
  const router = useRouter()

  return (
    <TabBar className="sticky bottom-0">
      {TABS.map(({ key, href }) => {
        const selected = href === "/" ? pathname === "/" : pathname.startsWith(href)
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

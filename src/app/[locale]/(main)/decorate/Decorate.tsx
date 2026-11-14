"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { Button, Chip, GridList, GridListItem, Modal, Toast } from "@kojaem/mongmong"
import CharacterImage from "@/components/CharacterImage"
import ItemImage from "@/components/ItemImage"
import { DIALOG_CLASS } from "@/constants/dialog"
import { useRouter } from "@/i18n/navigation"
import { sleep } from "@/utils/sleep"
import { api, ApiError, ITEM_TYPES, type Character, type CharacterItem, type Item, type ItemType } from "@/utils/api"

interface Props {
  character: Character
  rewardCount: number
  items: Item[]
  owned: CharacterItem[]
}

export default function Decorate({ character, rewardCount, items, owned }: Props) {
  const t = useTranslations("decorate")
  const router = useRouter()
  const { data: session } = useSession()
  const [tab, setTab] = useState<ItemType>("clothes")
  const [detail, setDetail] = useState<Item>()
  const [modal, setModal] = useState<"insufficient" | "error">()
  const [error, setError] = useState<string>()
  const [toast, setToast] = useState<string>()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (toast) sleep(2500).then(() => setToast(undefined))
  }, [toast])

  const ownedByItem = new Map(owned.map((entry) => [entry.itemId, entry]))
  const equipped = owned.filter((entry) => entry.isEquipped)

  const run = async (action: () => Promise<unknown>, done?: string) => {
    setBusy(true)
    try {
      await action()
      if (done) setToast(done)
      setDetail(undefined)
      router.refresh()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e))
      setModal("error")
    } finally {
      setBusy(false)
    }
  }

  const toggleEquip = (entry: CharacterItem) =>
    run(() =>
      api(`/character-items/${entry.id}`, {
        method: "PATCH",
        token: session?.access_token,
        body: { isEquipped: !entry.isEquipped }
      })
    )

  const buy = (item: Item) => {
    if (rewardCount < item.cost) return setModal("insufficient")
    run(() => api("/character-items", { method: "POST", token: session?.access_token, body: { itemId: item.id } }), t("bought"))
  }

  return (
    <main className="flex flex-1 flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <section className="relative flex flex-1 items-center justify-center py-10">
        {equipped
          .filter((entry) => entry.itemType === "background")
          .map((entry) => (
            <ItemImage key={entry.id} src={entry.imageUrl} size={360} className="absolute inset-0 size-full object-cover" />
          ))}
        <div className="relative">
          <CharacterImage src={character.characterType.imageUrl} alt={character.characterType.name} size={120} />
          {/* TODO: 옷·얼굴 아이템을 캐릭터 위 어디에 그릴지 Figma 기준 필요. 지금은 캐릭터 크기에 맞춰 겹친다 */}
          {equipped
            .filter((entry) => entry.itemType !== "background")
            .map((entry) => (
              <ItemImage key={entry.id} src={entry.imageUrl} size={120} className="absolute inset-0" />
            ))}
        </div>
        {toast && (
          <Toast className="absolute bottom-4">
            {toast}
          </Toast>
        )}
      </section>

      <section className="bg-background-upper rounded-t-[28px] px-2.5 pt-5 pb-4">
        {detail ? (
          <div className="flex flex-col items-center gap-3 px-2.5">
            <button type="button" className="text-text-inverse-secondary self-start text-xl" onClick={() => setDetail(undefined)} aria-label={t("back")}>
              ‹
            </button>
            <ItemImage src={detail.imageUrl} size={100} />
            <p className="text-subtitle-md text-text-inverse-primary">{detail.name}</p>
            <Button size="xl" color="brand" variant="fill" isFullWidth disabled={busy} onClick={() => buy(detail)}>
              {t("buy", { cost: detail.cost })}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 px-3.5 pb-3">
              {ITEM_TYPES.map((type) => (
                <Chip key={type} kind="select" size="s" selected={tab === type} onClick={() => setTab(type)}>
                  {t(`tab.${type}`)}
                </Chip>
              ))}
            </div>
            <GridList columns="3">
              {items
                .filter((item) => item.itemType === tab)
                .map((item) => {
                  const entry = ownedByItem.get(item.id)
                  return (
                    <GridListItem
                      key={item.id}
                      image={<ItemImage src={item.imageUrl} size={40} />}
                      label={item.name}
                      selected={entry?.isEquipped}
                      className={entry ? undefined : "opacity-50"}
                      disabled={busy}
                      onClick={() => (entry ? toggleEquip(entry) : setDetail(item))}
                    />
                  )
                })}
            </GridList>
          </>
        )}
      </section>

      <Modal
        className={DIALOG_CLASS}
        open={Boolean(modal)}
        onOpenChange={(open) => !open && setModal(undefined)}
        title={modal === "insufficient" ? t("insufficientTitle") : error}
        description={modal === "insufficient" && detail ? t("insufficientDescription", { count: detail.cost - rewardCount }) : undefined}
        buttons={
          modal === "insufficient" ? (
            <>
              <Button size="l" className="whitespace-nowrap" color="brand" variant="weak" isFullWidth onClick={() => setModal(undefined)}>
                {t("later")}
              </Button>
              {/* TODO: AdMob 보상형 광고 연결 */}
              <Button size="l" className="whitespace-nowrap" color="brand" variant="fill" isFullWidth disabled>
                {t("watchAd")}
              </Button>
            </>
          ) : (
            <Button size="l" color="brand" variant="fill" isFullWidth onClick={() => setModal(undefined)}>
              {t("close")}
            </Button>
          )
        }
      />
    </main>
  )
}

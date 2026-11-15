"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button, Chip, GridList, GridListItem, Modal, Toast } from "@kojaem/mongmong"
import type { Character } from "@/apis/character"
import { getErrorMessage } from "@/apis/fetcher"
import { buyItem, ITEM_TYPES, setItemEquipped, type Item, type ItemType, type OwnedItem } from "@/apis/item"
import CharacterImage from "@/components/CharacterImage"
import ItemImage from "@/components/ItemImage"
import { DIALOG_SURFACE } from "@/constants/designSystemOverrides"
import { useToast } from "@/hooks/useToast"
import { useRouter } from "@/i18n/navigation"

interface Props {
  character: Character
  rewardCount: number
  items: Item[]
  ownedItems: OwnedItem[]
}

export default function Decorate({ character, rewardCount, items, ownedItems }: Props) {
  const t = useTranslations("decorate")
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ItemType>("clothes")
  /** 구매 화면을 보고 있는 아이템 */
  const [itemToBuy, setItemToBuy] = useState<Item>()
  const [isLoading, setIsLoading] = useState(false)
  const [isInsufficientModalOpen, setIsInsufficientModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const { toastMessage, showToast } = useToast()

  const equippedItems = ownedItems.filter((ownedItem) => ownedItem.isEquipped)
  const equippedBackground = equippedItems.find((ownedItem) => ownedItem.itemType === "background")
  const equippedWearables = equippedItems.filter((ownedItem) => ownedItem.itemType !== "background")
  const itemsOfSelectedType = items.filter((item) => item.itemType === selectedType)

  const handleItemClick = async (item: Item) => {
    const ownedItem = ownedItems.find((owned) => owned.itemId === item.id)
    if (!ownedItem) {
      setItemToBuy(item)
      return
    }

    setIsLoading(true)
    try {
      await setItemEquipped(ownedItem.id, !ownedItem.isEquipped)
      router.refresh()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuy = async (item: Item) => {
    if (rewardCount < item.cost) {
      setIsInsufficientModalOpen(true)
      return
    }

    setIsLoading(true)
    try {
      await buyItem(item.id)
      showToast(t("bought"))
      setItemToBuy(undefined)
      router.refresh()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col bg-[url('/assets/images/background.png')] bg-cover bg-center">
      <section className="relative flex flex-1 items-center justify-center py-10">
        {equippedBackground && (
          <ItemImage src={equippedBackground.imageUrl} size={360} className="absolute inset-0 size-full object-cover" />
        )}
        <div className="relative">
          <CharacterImage src={character.characterType.imageUrl} alt={character.characterType.name} size={120} />
          {/* TODO: 옷·얼굴 아이템을 캐릭터 위 어디에 그릴지 Figma 기준 필요. 지금은 캐릭터 크기에 맞춰 겹친다 */}
          {equippedWearables.map((ownedItem) => (
            <ItemImage key={ownedItem.id} src={ownedItem.imageUrl} size={120} className="absolute inset-0" />
          ))}
        </div>
        {toastMessage && <Toast className="absolute bottom-4">{toastMessage}</Toast>}
      </section>

      <section className="bg-background-upper rounded-t-[28px] px-2.5 pt-5 pb-4">
        {itemToBuy ? (
          <div className="flex flex-col items-center gap-3 px-2.5">
            <button
              type="button"
              className="text-text-inverse-secondary self-start text-xl"
              onClick={() => setItemToBuy(undefined)}
              aria-label={t("back")}
            >
              ‹
            </button>
            <ItemImage src={itemToBuy.imageUrl} size={100} />
            <p className="text-subtitle-md text-text-inverse-primary">{itemToBuy.name}</p>
            <Button
              size="xl"
              color="brand"
              variant="fill"
              isFullWidth
              disabled={isLoading}
              onClick={() => handleBuy(itemToBuy)}
            >
              {t("buy", { cost: itemToBuy.cost })}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 px-3.5 pb-3">
              {ITEM_TYPES.map((type) => (
                <Chip
                  key={type}
                  kind="select"
                  size="s"
                  selected={selectedType === type}
                  onClick={() => setSelectedType(type)}
                >
                  {t(`tab.${type}`)}
                </Chip>
              ))}
            </div>
            <GridList columns="3">
              {itemsOfSelectedType.map((item) => {
                const ownedItem = ownedItems.find((owned) => owned.itemId === item.id)
                return (
                  <GridListItem
                    key={item.id}
                    image={<ItemImage src={item.imageUrl} size={40} />}
                    label={item.name}
                    selected={ownedItem?.isEquipped}
                    // 아직 안 산 아이템은 흐리게
                    className={ownedItem ? undefined : "opacity-50"}
                    disabled={isLoading}
                    onClick={() => handleItemClick(item)}
                  />
                )
              })}
            </GridList>
          </>
        )}
      </section>

      <Modal
        className={DIALOG_SURFACE}
        open={isInsufficientModalOpen}
        onOpenChange={setIsInsufficientModalOpen}
        title={t("insufficientTitle")}
        description={itemToBuy && t("insufficientDescription", { count: itemToBuy.cost - rewardCount })}
        buttons={
          <>
            <Button
              size="l"
              className="whitespace-nowrap"
              color="brand"
              variant="weak"
              isFullWidth
              onClick={() => setIsInsufficientModalOpen(false)}
            >
              {t("later")}
            </Button>
            {/* TODO: AdMob 보상형 광고 연결 전까지 비활성 */}
            <Button size="l" className="whitespace-nowrap" color="brand" variant="fill" isFullWidth disabled>
              {t("watchAd")}
            </Button>
          </>
        }
      />

      <Modal
        className={DIALOG_SURFACE}
        open={Boolean(errorMessage)}
        onOpenChange={(open) => !open && setErrorMessage(undefined)}
        title={errorMessage}
        buttons={
          <Button size="l" color="brand" variant="fill" isFullWidth onClick={() => setErrorMessage(undefined)}>
            {t("close")}
          </Button>
        }
      />
    </main>
  )
}

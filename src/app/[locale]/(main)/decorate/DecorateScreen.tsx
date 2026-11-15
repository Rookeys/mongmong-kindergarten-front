"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useQueryClient } from "@tanstack/react-query"
import { Chip, GridList, GridListItem, Toast } from "@kojaem/mongmong"
import { getAuthGetMeQueryKey, useAuthGetMe } from "@/apis/generated/auth/auth"
import {
  getCharacterItemFindMineQueryKey,
  useCharacterItemFindMine,
  useCharacterItemPurchase,
  useCharacterItemUpdateEquip
} from "@/apis/generated/character-items/character-items"
import { useCharacterFindMine } from "@/apis/generated/characters/characters"
import { useItemFindAll } from "@/apis/generated/items/items"
import { ItemType, type GetItemResponseDto } from "@/apis/generated/model"
import { getErrorMessage } from "@/apis/instance"
import CharacterImage from "@/components/CharacterImage"
import ItemImage from "@/components/ItemImage"
import LoadingScreen from "@/components/LoadingScreen"
import { useToast } from "@/hooks/useToast"
import ErrorModal from "./ErrorModal"
import InsufficientRewardModal from "./InsufficientRewardModal"
import ItemPurchasePanel from "./ItemPurchasePanel"

export default function DecorateScreen() {
  const t = useTranslations("decorate")
  const queryClient = useQueryClient()
  const { data: character } = useCharacterFindMine()
  const { data: me } = useAuthGetMe()
  const { data: items } = useItemFindAll()
  const { data: ownedItems } = useCharacterItemFindMine()
  const purchaseItem = useCharacterItemPurchase()
  const updateEquip = useCharacterItemUpdateEquip()

  const [selectedType, setSelectedType] = useState<ItemType>(ItemType.clothes)
  /** 구매 화면을 보고 있는 아이템 */
  const [itemToBuy, setItemToBuy] = useState<GetItemResponseDto>()
  const [isInsufficientModalOpen, setIsInsufficientModalOpen] = useState(false)
  const { toastMessage, showToast } = useToast()

  if (!character || !me || !items || !ownedItems) return <LoadingScreen />

  const equippedItems = ownedItems.filter((ownedItem) => ownedItem.isEquipped)
  const equippedBackground = equippedItems.find((ownedItem) => ownedItem.itemType === ItemType.background)
  const equippedWearables = equippedItems.filter((ownedItem) => ownedItem.itemType !== ItemType.background)
  const itemsOfSelectedType = items.filter((item) => item.itemType === selectedType)
  const isSaving = purchaseItem.isPending || updateEquip.isPending
  const saveError = purchaseItem.error ?? updateEquip.error

  const handleItemClick = (item: GetItemResponseDto) => {
    const ownedItem = ownedItems.find((owned) => owned.itemId === item.id)
    if (!ownedItem) {
      setItemToBuy(item)
      return
    }
    updateEquip.mutate(
      { id: ownedItem.id, data: { isEquipped: !ownedItem.isEquipped } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getCharacterItemFindMineQueryKey() })
      }
    )
  }

  const handleBuy = (item: GetItemResponseDto) => {
    if (me.rewardCount < item.cost) {
      setIsInsufficientModalOpen(true)
      return
    }
    purchaseItem.mutate(
      { data: { itemId: item.id } },
      {
        onSuccess: () => {
          showToast(t("bought"))
          setItemToBuy(undefined)
          queryClient.invalidateQueries({ queryKey: getCharacterItemFindMineQueryKey() })
          queryClient.invalidateQueries({ queryKey: getAuthGetMeQueryKey() })
        }
      }
    )
  }

  return (
    <main className="bg-night-sky flex flex-1 flex-col">
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
          <ItemPurchasePanel
            item={itemToBuy}
            isPurchasing={isSaving}
            onBack={() => setItemToBuy(undefined)}
            onBuy={() => handleBuy(itemToBuy)}
          />
        ) : (
          <>
            <div className="flex gap-2 px-3.5 pb-3">
              {Object.values(ItemType).map((type) => (
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
                    disabled={isSaving}
                    onClick={() => handleItemClick(item)}
                  />
                )
              })}
            </GridList>
          </>
        )}
      </section>

      <InsufficientRewardModal
        open={isInsufficientModalOpen}
        missingCount={itemToBuy ? itemToBuy.cost - me.rewardCount : 0}
        onClose={() => setIsInsufficientModalOpen(false)}
      />
      <ErrorModal
        message={saveError ? getErrorMessage(saveError) : undefined}
        onClose={() => {
          purchaseItem.reset()
          updateEquip.reset()
        }}
      />
    </main>
  )
}

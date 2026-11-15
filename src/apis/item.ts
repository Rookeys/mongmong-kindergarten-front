import { fetcher } from "./fetcher"

export const ITEM_TYPES = ["clothes", "face", "background"] as const
export type ItemType = (typeof ITEM_TYPES)[number]

/** 상점 아이템 */
export interface Item {
  id: string
  name: string
  itemType: ItemType
  imageUrl: string
  cost: number
}

/** 내 캐릭터가 가진 아이템 */
export interface OwnedItem {
  id: string
  itemId: string
  itemName: string
  itemType: ItemType
  imageUrl: string
  isEquipped: boolean
}

export function getItems(token?: string) {
  return fetcher<Item[]>("/items", { token })
}

export function getOwnedItems(token?: string) {
  return fetcher<OwnedItem[]>("/character-items", { token })
}

export function buyItem(itemId: string) {
  return fetcher<OwnedItem>("/character-items", { method: "POST", body: { itemId } })
}

/** 장착·해제. 같은 종류의 다른 아이템은 백엔드가 해제한다. */
export function setItemEquipped(ownedItemId: string, isEquipped: boolean) {
  return fetcher<OwnedItem>(`/character-items/${ownedItemId}`, { method: "PATCH", body: { isEquipped } })
}

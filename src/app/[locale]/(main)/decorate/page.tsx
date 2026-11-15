import { getMe } from "@/apis/auth"
import { getMyCharacter } from "@/apis/character"
import { getItems, getOwnedItems } from "@/apis/item"
import { requireSession } from "@/utils/session"
import Decorate from "./Decorate"

/** 꾸미기 탭 */
export default async function DecoratePage() {
  const { access_token: token } = await requireSession()
  const [character, me, items, ownedItems] = await Promise.all([
    getMyCharacter(token),
    getMe(token),
    getItems(token),
    getOwnedItems(token)
  ])
  return <Decorate character={character} rewardCount={me.rewardCount} items={items} ownedItems={ownedItems} />
}

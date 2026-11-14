import { api, type Character, type CharacterItem, type Item, type User } from "@/utils/api"
import { requireSession } from "@/utils/session"
import Decorate from "./Decorate"

export default async function DecoratePage() {
  const { access_token: token } = await requireSession()
  const [character, me, items, owned] = await Promise.all([
    api<Character>("/characters/me", { token }),
    api<User>("/auth/me", { token }),
    api<Item[]>("/items", { token }),
    api<CharacterItem[]>("/character-items", { token })
  ])
  return <Decorate character={character} rewardCount={me.rewardCount} items={items} owned={owned} />
}

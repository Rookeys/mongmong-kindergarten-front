import { requireSession } from "@/utils/session"
import HomeScreen from "./HomeScreen"

export default async function HomePage() {
  await requireSession()
  return <HomeScreen />
}

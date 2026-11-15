import { requireSession } from "@/utils/session"
import AlbumScreen from "./AlbumScreen"

/** 졸업 앨범 */
export default async function AlbumPage() {
  await requireSession()
  return <AlbumScreen />
}

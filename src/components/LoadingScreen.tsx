import CharacterImage from "./CharacterImage"

/** 데이터를 불러오는 동안 보여주는 화면 */
export default function LoadingScreen() {
  return (
    <div className="flex flex-1 items-center justify-center py-20" role="status" aria-busy>
      <CharacterImage src={null} alt="" size={80} className="animate-pulse" />
    </div>
  )
}

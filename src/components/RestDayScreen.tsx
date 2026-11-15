import { useTranslations } from "next-intl"
import CharacterImage from "./CharacterImage"

/** 2월 29일(질문이 없는 날)에 질문 대신 보여주는 안내 */
export default function RestDayScreen() {
  const t = useTranslations("common")
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[16px] py-[80px]">
      <CharacterImage src={null} alt="" size={100} />
      <p className="text-title-sm text-text-primary">{t("restDay")}</p>
    </div>
  )
}

import type { GetGraduationCardResponseDto } from "@/apis/generated/model"
import { formatDotDate } from "@/utils/date"

/** 졸업 카드 윗줄: 레벨 뱃지와 졸업 날짜 */
export default function GraduationCardHeader({ card }: { card: GetGraduationCardResponseDto }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-caption-md text-text-brand rounded-full bg-[rgb(41_5_255/0.1)] px-[8px] py-[2px]">
        Lv.{card.levelSnapshot}
      </span>
      <span className="text-caption-lg text-text-inverse-secondary">{formatDotDate(card.graduatedAt)}</span>
    </div>
  )
}

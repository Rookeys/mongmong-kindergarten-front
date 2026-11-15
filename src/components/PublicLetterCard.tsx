import { useFormatter, useNow, useTranslations } from "next-intl"
import { Asset } from "@kojaem/mongmong"
import type { GetPublicLetterResponseDto } from "@/apis/generated/model"
import ReportButton from "@/components/ReportButton"

/** 휴게실의 다른 사람 답장 카드 */
export default function PublicLetterCard({ letter }: { letter: GetPublicLetterResponseDto }) {
  const t = useTranslations("lounge")
  const format = useFormatter()
  const now = useNow()

  return (
    <article className="bg-card border-border-brand-weak flex flex-col gap-[10px] rounded-[8px] border p-[16px]">
      <div className="flex items-start gap-[10px]">
        <div className="flex flex-1 items-center gap-[10px]">
          <Asset
            shape="squircle"
            size="l"
            icon={<img src="/assets/images/mood-placeholder.png" alt="" width={26} height={26} />}
          />
          <div className="text-text-inverse-primary flex flex-col gap-[4px]">
            {/* 공개 답장은 익명이라 작성자 대신 "From. 익명" */}
            <p className="text-subtitle-sm">{t("from")}</p>
            <p className="text-caption-md">{format.relativeTime(new Date(letter.createdDate), now)}</p>
          </div>
        </div>
        <ReportButton letterId={letter.id} />
      </div>
      <p className="text-body-md text-text-inverse-primary whitespace-pre-line">{letter.answer}</p>
    </article>
  )
}

import { useFormatter, useNow, useTranslations } from "next-intl"
import { Asset } from "@kojaem/mongmong"
import type { GetPublicLetterResponseDto } from "@/apis/generated/model"
import ReportButton from "./ReportButton"

/** 휴게실의 다른 사람 답장 카드 */
export default function PublicLetterCard({ letter }: { letter: GetPublicLetterResponseDto }) {
  const t = useTranslations("lounge")
  const format = useFormatter()
  const now = useNow()

  return (
    <article className="bg-card border-border-brand-weak flex flex-col gap-2.5 rounded-lg border p-4">
      <div className="flex items-start gap-2.5">
        <div className="flex flex-1 items-center gap-2.5">
          <Asset
            shape="squircle"
            size="l"
            icon={<img src="/assets/images/mood-placeholder.png" alt="" width={26} height={26} />}
          />
          <div className="text-text-inverse-primary flex flex-col gap-1">
            {/* TODO: 백엔드 응답에 익명 닉네임이 없어 고정 문구 */}
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

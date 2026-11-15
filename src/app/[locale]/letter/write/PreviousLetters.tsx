import { useTranslations } from "next-intl"
import { Result } from "@kojaem/mongmong"
import type { GetLetterResponseDto } from "@/apis/generated/model"
import CharacterFace from "@/components/CharacterFace"
import { formatDotDate } from "@/utils/date"

/** 같은 질문에 예전 해에 쓴 답장 목록 */
export default function PreviousLetters({ letters }: { letters: GetLetterResponseDto[] }) {
  const t = useTranslations("letterWrite")

  return (
    <section>
      <h2 className="text-subtitle-lg text-text-primary px-[20px] pt-[24px] pb-[12px]">{t("previous")}</h2>
      {letters.length === 0 ? (
        <Result image={<CharacterFace size={40} />} title={t("noPrevious")} />
      ) : (
        <ul className="flex flex-col gap-[16px] px-[20px] pb-[112px]">
          {letters.map((letter) => (
            <li key={letter.id} className="flex flex-col gap-[8px]">
              <p className="text-subtitle-md text-text-primary">{formatDotDate(letter.letterDate)}</p>
              <p className="bg-card border-border-brand-weak rounded-textfield text-body-md text-text-inverse-primary border p-[16px] whitespace-pre-line">
                {letter.answer}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

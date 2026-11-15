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
      <h2 className="text-subtitle-lg text-text-primary px-5 pt-6 pb-3">{t("previous")}</h2>
      {letters.length === 0 ? (
        <Result image={<CharacterFace size={40} />} title={t("noPrevious")} />
      ) : (
        <ul className="flex flex-col gap-4 px-5 pb-28">
          {letters.map((letter) => (
            <li key={letter.id} className="flex flex-col gap-2">
              <p className="text-subtitle-md text-text-primary">{formatDotDate(letter.letterDate)}</p>
              <p className="bg-card border-border-brand-weak rounded-textfield text-body-md text-text-inverse-primary border p-4 whitespace-pre-line">
                {letter.answer}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

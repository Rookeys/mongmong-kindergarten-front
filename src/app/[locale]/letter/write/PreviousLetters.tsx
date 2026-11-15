import { useTranslations } from "next-intl"
import { Result } from "@kojaem/mongmong"
import type { Letter } from "@/apis/letter"
import CharacterFace from "@/components/CharacterFace"
import { ON_DARK_SECONDARY_TEXT } from "@/constants/designSystemOverrides"

/** 같은 질문에 예전 해에 쓴 답장 목록 */
export default function PreviousLetters({ letters }: { letters: Letter[] }) {
  const t = useTranslations("letterWrite")

  return (
    <>
      <h2 className="text-subtitle-lg text-text-primary px-5 pt-6 pb-3">{t("previous")}</h2>
      {letters.length === 0 ? (
        <Result className={ON_DARK_SECONDARY_TEXT} image={<CharacterFace size={40} />} title={t("noPrevious")} />
      ) : (
        <ul className="flex flex-col gap-4 px-5 pb-28">
          {letters.map((letter) => (
            <li key={letter.id} className="flex flex-col gap-2">
              <p className="text-subtitle-md text-text-primary">{letter.letterDate.replaceAll("-", ".")}</p>
              <p className="rounded-textfield border-border-brand-weak bg-background-upper text-body-md text-text-inverse-primary border p-4 whitespace-pre-line">
                {letter.answer}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

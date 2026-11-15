"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Button, ListRow, TextArea } from "@kojaem/mongmong"
import { getAuthGetMeQueryKey, useAuthGetMe } from "@/apis/generated/auth/auth"
import { getCharacterFindMineQueryKey, useCharacterFindMine } from "@/apis/generated/characters/characters"
import { getLetterFindCalendarQueryKey, useLetterCreate, useLetterFindAll } from "@/apis/generated/letters/letters"
import type { CreateLetterResponseDto, LocaleType } from "@/apis/generated/model"
import { getQuestionFindDailyQueryKey, useQuestionFindDaily } from "@/apis/generated/questions/questions"
import { getErrorMessage } from "@/apis/instance"
import BackTopNavigation from "@/components/BackTopNavigation"
import CharacterFace from "@/components/CharacterFace"
import DateChangeTitle from "@/components/DateChangeTitle"
import LoadingScreen from "@/components/LoadingScreen"
import { Link } from "@/i18n/navigation"
import { toKstDate } from "@/utils/date"
import { letterSchema, MAX_ANSWER_LENGTH, type LetterFormValues } from "@/validations/letterSchema"
import LetterSentFlow from "./LetterSentFlow"
import MoodSheet from "./MoodSheet"
import PastLetterCostModal, { PAST_LETTER_COST } from "./PastLetterCostModal"
import PreviousLetters from "./PreviousLetters"

/** 답장을 보내기 전 차례로 여는 창: 지난 날짜면 꿈조각 확인 → 기분 선택 */
type Dialog = "cost" | "mood"

export default function LetterWriteScreen({ date }: { date?: string }) {
  const t = useTranslations("letterWrite")
  const locale = useLocale() as LocaleType
  const queryClient = useQueryClient()

  const { data: character } = useCharacterFindMine()
  const { data: me } = useAuthGetMe()
  const { data: question } = useQuestionFindDaily({ date, locale })
  const { data: myLetters } = useLetterFindAll({ questionId: question?.id }, { query: { enabled: Boolean(question) } })
  const createLetter = useLetterCreate()

  const { register, control, watch, handleSubmit } = useForm<LetterFormValues>({
    resolver: zodResolver(letterSchema),
    defaultValues: { answer: "" }
  })
  const [openDialog, setOpenDialog] = useState<Dialog>()
  const [sentLetter, setSentLetter] = useState<CreateLetterResponseDto>()

  if (!character || !me || !question || !myLetters) return <LoadingScreen />
  if (sentLetter) return <LetterSentFlow letter={sentLetter} character={character} />

  const writtenLetter = myLetters.find((letter) => letter.id === question.letterId)
  const previousLetters = myLetters.filter((letter) => letter.id !== question.letterId)
  const answer = watch("answer")
  const isPastDate = question.date < toKstDate()

  const onSubmit = ({ answer, mood }: LetterFormValues) => {
    createLetter.mutate(
      { data: { answer, mood, letterDate: question.date, localeType: locale } },
      {
        onSuccess: (letter) => {
          setOpenDialog(undefined)
          setSentLetter(letter)
          // 답장 여부·꿈조각·레벨·캘린더가 바뀐다
          queryClient.invalidateQueries({ queryKey: getQuestionFindDailyQueryKey() })
          queryClient.invalidateQueries({ queryKey: getAuthGetMeQueryKey() })
          queryClient.invalidateQueries({ queryKey: getCharacterFindMineQueryKey() })
          queryClient.invalidateQueries({ queryKey: getLetterFindCalendarQueryKey() })
        }
      }
    )
  }

  return (
    <main className="bg-gradient-letter flex min-h-dvh flex-col">
      <BackTopNavigation title={<DateChangeTitle date={question.date} path="/letter/write" />} />
      <h1 className="text-title-md text-text-primary px-[20px] py-[24px]">{question.content}</h1>

      <div className="px-[20px] py-[16px]">
        {writtenLetter ? (
          <p className="bg-card border-border-brand-weak rounded-textfield text-body-md text-text-inverse-primary border p-[16px] whitespace-pre-line">
            {writtenLetter.answer}
          </p>
        ) : (
          <TextArea
            {...register("answer")}
            maxLength={MAX_ANSWER_LENGTH}
            placeholder={t("placeholder", { max: MAX_ANSWER_LENGTH })}
            helperText={`${answer.length}/${MAX_ANSWER_LENGTH}`}
            className="field-sizing-content"
          />
        )}
      </div>

      <Link href={`/lounge?date=${question.date}`} className="block">
        <ListRow
          padding="l"
          leadingAsset={<CharacterFace />}
          title={t("othersReplies")}
          trailingAccessory={<span aria-hidden>›</span>}
        />
      </Link>

      <PreviousLetters letters={previousLetters} />

      {!writtenLetter && answer.trim() && (
        <div className="sticky bottom-0 mt-auto px-[20px] pb-[20px]">
          {/* 지난 날짜 답장은 꿈조각을 쓰므로 먼저 확인받는다 */}
          <Button
            size="xl"
            color="brand"
            variant="fill"
            isFullWidth
            onClick={() => setOpenDialog(isPastDate ? "cost" : "mood")}
          >
            {t("submit")}
          </Button>
        </div>
      )}

      <PastLetterCostModal
        open={openDialog === "cost"}
        hasEnoughReward={me.rewardCount >= PAST_LETTER_COST}
        onClose={() => setOpenDialog(undefined)}
        onConfirm={() => setOpenDialog("mood")}
      />

      <Controller
        name="mood"
        control={control}
        render={({ field }) => (
          <MoodSheet
            open={openDialog === "mood"}
            onOpenChange={(open) => setOpenDialog(open ? "mood" : undefined)}
            selectedMood={field.value}
            onSelectMood={field.onChange}
            isSending={createLetter.isPending}
            errorMessage={createLetter.error ? getErrorMessage(createLetter.error) : undefined}
            onConfirm={handleSubmit(onSubmit)}
          />
        )}
      />
    </main>
  )
}

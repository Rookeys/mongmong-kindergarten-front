import { useTranslations } from "next-intl"
import { Button } from "@kojaem/mongmong"
import type { GetItemResponseDto } from "@/apis/generated/model"
import ItemImage from "@/components/ItemImage"

interface Props {
  item: GetItemResponseDto
  isPurchasing: boolean
  onBack: () => void
  onBuy: () => void
}

/** 아직 안 산 아이템을 눌렀을 때 보이는 구매 화면 */
export default function ItemPurchasePanel({ item, isPurchasing, onBack, onBuy }: Props) {
  const t = useTranslations("decorate")
  return (
    <div className="flex flex-col items-center gap-3 px-2.5">
      <button
        type="button"
        className="text-text-inverse-secondary self-start text-xl"
        onClick={onBack}
        aria-label={t("back")}
      >
        ‹
      </button>
      <ItemImage src={item.imageUrl} size={100} />
      <p className="text-subtitle-md text-text-inverse-primary">{item.name}</p>
      <Button size="xl" color="brand" variant="fill" isFullWidth disabled={isPurchasing} onClick={onBuy}>
        {t("buy", { cost: item.cost })}
      </Button>
    </div>
  )
}

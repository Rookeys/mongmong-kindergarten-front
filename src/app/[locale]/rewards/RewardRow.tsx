import { Button, ListRow } from "@kojaem/mongmong"
import CharacterFace from "@/components/CharacterFace"

interface Props {
  title: string
  buttonLabel: string
  disabled?: boolean
  onClick?: () => void
}

/** 꿈 조각 공장의 "○○하고 [N개 받기]" 한 줄 */
export default function RewardRow({ title, buttonLabel, disabled, onClick }: Props) {
  return (
    <ListRow
      padding="l"
      leadingAsset={<CharacterFace />}
      title={title}
      trailingAccessory={
        <Button size="s" color="brand" variant="fill" disabled={disabled} onClick={onClick}>
          {buttonLabel}
        </Button>
      }
    />
  )
}

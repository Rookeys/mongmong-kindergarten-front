import { Checkbox, ListRow } from "@kojaem/mongmong"

interface Props {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

/** 설정의 켜기/끄기 한 줄. 줄 전체를 눌러도 체크된다. */
export default function SettingToggleRow({ title, description, checked, disabled, onChange }: Props) {
  return (
    <label className="block cursor-pointer">
      <ListRow
        padding="l"
        title={title}
        description={description}
        trailingAccessory={
          <Checkbox checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
        }
      />
    </label>
  )
}

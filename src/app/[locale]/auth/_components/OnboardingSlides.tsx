"use client"

type Props = {
  lines?: string[]
  show?: boolean
  nickname?: string
}

export default function OnboardingSlides({ lines, show, nickname = "" }: Props) {
  if (show) {
    return (
      <>
        <div className={`justify-centet text-title-sm text-text-primary flex h-24 flex-col items-center`}>
          {!!lines &&
            lines.map((line, i) =>
              nickname ? <p key={i}>{line.replace("{name}", nickname)}</p> : <p key={i}>{line}</p>
            )}
        </div>
      </>
    )
  }
}

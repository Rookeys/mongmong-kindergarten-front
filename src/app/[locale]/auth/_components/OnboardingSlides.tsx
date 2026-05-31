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
                <div className={`flex flex-col justify-centet items-center h-24 text-title-sm text-text-primary`}>
                    {!!lines && lines.map((line, i) => (
                        nickname ? (
                            <p key={i} >
                                {line.replace("{name}", nickname)}
                            </p>
                        ) : (
                            <p key={i}>
                                {line}
                            </p>
                        )))}
                </div>
            </>
        )
    }
}

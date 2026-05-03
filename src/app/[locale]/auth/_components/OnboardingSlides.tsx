"use client"

import { ReactNode } from "react"

type Props = {
    lines?: string[]
    show?: boolean
}


export default function OnboardingSlides({ lines, show }: Props) {

    if (show) {

        return (
            <>
                <div className={`
                    flex flex-col justify-centet items-center h-24 title-medium-weak
                    `}>

                    {!!lines && lines.map((line, i) => (
                        <p key={i} >
                            {line}
                        </p>
                    ))}
                </div>
            </>
        )
    }
}

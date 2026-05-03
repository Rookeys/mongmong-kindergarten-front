"use client"
import { useTranslations } from 'next-intl'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { nicknameSchema } from '@/validations/nicknameSchema';
import { cn } from '@/utils/cn';
import { ONBOARDING_LAYOUT_ID } from '@/lib/providers/animationLayoutId/onboardingLayoutId';


interface props {
    show: boolean
    setSendNext: Dispatch<SetStateAction<boolean>>
}

interface nicknameI {
    nickname: string
}

export default function InputNickname({ show, setSendNext }: props) {
    const t = useTranslations("sign-up")
    const {
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm<nicknameI>({
        resolver: zodResolver(nicknameSchema),
        mode: 'onChange',
        defaultValues: {
            nickname: "",
        },
    });
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const errorMsg = useMemo(() => {
        return errors.nickname?.message && t(errors.nickname?.message)
    }, [errors.nickname?.message])

    useEffect(() => {
        trigger("nickname")
    }, [])


    return (
        <div className={cn(`h-screen w-screen flex flex-col justify-start items-center transform transition-all duration-1000 ease-out`,
            show && "translate-y-0 opacity-100",
            !show && "translate-y-3 opacity-0")}>
            <motion.img
                layoutId={ONBOARDING_LAYOUT_ID}
                src="/onboarding.gif"
                alt=""
                className="w-25 h-25 mt-14"
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 34,
                }}
            />
            <span className='mt-3'>{t("name")}</span>
            <div className='w-full pr-5 pl-5 pt-6 '>

                <input
                    className="p-2 rounded-xl w-full h-12.5 mb-1 bg-[#F2F4F6]"
                    placeholder={t('namePlaceholder')}
                    value={watch("nickname")}
                    onChange={(e) => setValue("nickname", e.target.value, { shouldValidate: true })}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                />
                {errorMsg && <span
                    className={"text-caption-lg " + cn(isFocus && "text-[#F14452]", !isFocus && "text-[#8E8E93]")}
                >{errorMsg}</span>}
            </div>
            <div className="text-subtitle-lg absolute bottom-0 left-0 w-full p-5">
                <button
                    onClick={() => !errors.nickname?.message && setSendNext(true)}
                    className={"text-subtitle-lg " + cn("w-full rounded-2xl mb-5 p-3.75 text-white", !!errors.nickname?.message && "bg-[#c0c0c0]", !!!errors.nickname?.message && "bg-[#6A62EA]")}
                    disabled={!!errors.nickname?.message}
                >
                    {t("nextButton")}
                </button>
            </div>
        </div >
    )
}

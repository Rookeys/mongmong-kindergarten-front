"use client"
import { cn } from '@/utils/cn'
import React, { useMemo } from 'react'

interface buttonProps {
    size: "XL" | "L" | "M" | "S"
    color: "Brand" | "Neutral" | "Inverse"
    variant: "Fill" | "Weak"
    disabled: boolean
    title: string
    width: "fit" | "full"
    onClick: () => void
}

export default function Button({ size, color, variant, disabled, width, title, onClick }: buttonProps) {
    const sizeClass = useMemo(() => {
        if (width === "fit") {
            return cn(size === "XL"
                ? "rounded-button-xl py-padding-2xs px-padding-3xl h-14"
                : (size === "L"
                    ? "rounded-button-l px-padding-2xl h-12"
                    : (size === "M"
                        ? "rounded-button-m px-padding-xl h-9.5"
                        : "rounded-button-s px-padding-l h-8")))
        } else {
            return cn(size === "XL"
                ? "w-full rounded-button-l px-padding-2xl py-4.25"
                : (size === "L" ?
                    ("w-full rounded-button-l px-padding-2xl py-3.25")
                    : (size === "M"
                        ? "w-full px-4 py-[9.5px]"
                        : "w-full px-3 py-2")))
        }
    }, [size, width]);

    const fontSizeClass = useMemo(() => {
        return cn(size === "XL" || size === "L"
            ? "text-subtitle-lg"
            : (size === "M"
                ? "text-subtitle-md"
                : "text-subtitle-sm"))
    }, [size]);

    const colorClass = useMemo(() => {
        if (disabled) {
            if (color === "Brand") {
                return cn(variant === "Fill"
                    ? "text-text-strong bg-fill-brand opacity-30"
                    : "text-text-brand/30 bg-fill-brand-weak")
            } else if (color === "Neutral") {
                return cn(variant === "Fill"
                    ? "text-text-inverse-primary bg-fill-pressed opacity-30"
                    : "text-text-inverse-secondary/30 bg-fill-neutral-weak")
            } else {
                return cn(variant === "Fill"
                    ? "text-text-brand bg-fill-inverse opacity-30"
                    : "text-text-brand-weak/30 bg-fill-inverse-weak")
            }
        } else {
            if (color === "Brand") {
                if (variant === "Fill") {
                    return cn(
                        "bg-fill-brand",
                        "text-text-strong",
                        "active:text-white",
                        "after:absolute",
                        "after:inset-0",
                        "after:content-['']",
                        "after:bg-fill-pressed/50",
                        "after:pointer-events-none",
                        "after:opacity-0",
                        "active:after:opacity-100"
                    )
                }
                else {
                    return cn(
                        "text-text-brand",
                        "bg-fill-brand-weak",
                        "after:absolute",
                        "after:inset-0",
                        "after:content-['']",
                        "after:bg-fill-brand/20",
                        "after:text-text-brand",
                        "after:opacity-0",
                        "active:after:opacity-100"
                    )
                }

            } else if (color === "Neutral") {
                if (variant === "Fill") {
                    return cn(
                        "text-text-strong",
                        "bg-fill-neutral",
                        "active:bg-fill-pressed",
                        "active:text-white",
                        "after:absolute",
                        "after:inset-0",
                        "after:content-['']",
                        "after:bg-fill-pressed",
                        "after:opacity-0",
                        "active:after:opacity-100"
                    )
                }
                else {
                    return cn(
                        "text-text-inverse-secondary",
                        "bg-fill-neutral-weak",
                        "active:bg-fill-pressed",
                        "after:absolute",
                        "after:inset-0",
                        "after:content-['']",
                        "after:bg-fill-pressed",
                        "after:opacity-0",
                        "active:after:opacity-100"
                    )
                }

            } else {
                if (variant === "Fill") {
                    return cn(
                        "text-text-brand",
                        "bg-fill-inverse",
                        "active:bg-background-dim",
                        "active:text-text-brand-weak",
                        "after:absolute",
                        "after:inset-0",
                        "after:content-['']",
                        "after:bg-fill-inverse-weak",
                        "after:opacity-0",
                        "active:after:opacity-100"
                    )
                }
                else {
                    return cn(
                        "text-text-brand-weak",
                        "bg-fill-inverse-weak",
                        "active:bg-background-dim",
                        "after:absolute",
                        "after:inset-0",
                        "after:content-['']",
                        "after:bg-fill-inverse-weak",
                        "after:opacity-0",
                        "active:after:opacity-100"
                    )
                }
            }
        }
    }, [color, variant, disabled]);

    return (
        <button
            className={cn(sizeClass, colorClass, "relative overflow-hidden")}
            disabled={disabled}
            onClick={onClick}
        >
            <span className={cn("relative z-10", fontSizeClass)}>{title}</span>
        </button>
    )
}

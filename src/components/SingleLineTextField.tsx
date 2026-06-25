"use client"
import { cn } from "@/utils/cn"
import React, { useState } from "react"

interface SingleLineTextFieldProps {
  value: string
  onChange: (arg0: string) => void
  placeholder: string
  label?: string
  disabled?: boolean
  errorMsg?: string
  clearAble?: boolean
  leftSection?: React.ReactNode
  rightSection?: React.ReactNode
}

export default function SingleLineTextField({
  value,
  onChange,
  placeholder,
  label,
  disabled,
  errorMsg,
  clearAble,
  leftSection,
  rightSection
}: SingleLineTextFieldProps) {
  const [isFocus, setIsFocus] = useState<boolean>(false)

  return (
    <>
      {!!label && (
        <div className={"text-subtitle-md" + cn(!!errorMsg ? "text-text-secondary" : "text-text-danger")}>{label}</div>
      )}
      <div
        className={cn(
          "rounded-textfield",
          !errorMsg && !disabled && (value !== "" || isFocus) && "bg-background-default"
        )}
      >
        <div
          className={cn(
            "text-body-md pr-padding-s pl-padding-xl rounded-textfield text-text-primary border-border-brand-weak/10 mb-1 flex h-13.5 w-full items-center justify-between border",
            !!errorMsg
              ? "bg-fill-danger-weak"
              : disabled
                ? "bg-fill-inverse-weak/69"
                : value !== "" || isFocus
                  ? "bg-fill-brand-weak/10"
                  : "bg-background-upper/92"
          )}
          tabIndex={0}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsFocus(false)
            }
          }}
        >
          <div className="flex w-full">
            {leftSection && <div className="text-gray-400">{leftSection}</div>}
            <input
              className="text-body-md text-text-inverse-primary placeholder:text-text-inverse-tertiary w-full flex-1 ring-0 outline-none focus:ring-0 focus:outline-none"
              placeholder={placeholder}
              value={value}
              disabled={disabled}
              onChange={(e) => {
                onChange(e.target.value)
              }}
              onFocus={() => setIsFocus(true)}
            />
          </div>
          <div className="flex justify-between">
            {!!clearAble && value !== "" && (
              <div className="text-gray-400">
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => !disabled && onChange("")}
                  className="rounded-full p-1 transition hover:bg-gray-200"
                  aria-label="Clear input"
                >
                  <img src={"/assets/icon/iconClearButton.svg"} alt="clear-button" />
                </button>
              </div>
            )}

            {rightSection && <div className="text-gray-400">{rightSection}</div>}
          </div>
        </div>
      </div>
      {errorMsg && (
        <span className={"text-caption-lg " + cn(!!errorMsg && "text-text-danger", !isFocus && "text-text-secondary")}>
          {errorMsg}
        </span>
      )}
    </>
  )
}

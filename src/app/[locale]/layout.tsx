import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getLocale } from "next-intl/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { ModalRoot } from "@/components/modal/ModalRoot"
import NextAuthSessionProvider from "@/lib/providers/NextAuthSessionProvider"
import { Geist, Geist_Mono } from "next/font/google"
import "@/app/globals.css"
import "@kojaem/mongmong/styles.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "몽몽유치원",
  description: "하루 한 질문에 답하며 캐릭터를 키우는 편지 일지"
}

export default async function LocaleLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()
  const session = await getServerSession(authOptions)

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <NextAuthSessionProvider session={session}>
            {children}
            <div id="portal" />
            <ModalRoot />
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

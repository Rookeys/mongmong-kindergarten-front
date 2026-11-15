import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getLocale } from "next-intl/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { ModalRoot } from "@/components/modal/ModalRoot"
import NextAuthSessionProvider from "@/lib/providers/NextAuthSessionProvider"
import ReactQueryProvider from "@/lib/providers/ReactQueryProvider"
import "@/app/globals.css"
import "@kojaem/mongmong/styles.css"

export const metadata: Metadata = {
  title: "몽몽유치원",
  description: "하루 한 질문에 답하며 캐릭터를 키우는 편지 일지"
}

export default async function LocaleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  const messages = await getMessages()
  const session = await getServerSession(authOptions)

  return (
    // Figma 화면이 디자인시스템 Dark 색 모드 기준이라 Dark 테마로 고정한다
    <html lang={locale} data-theme="dark">
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <NextAuthSessionProvider session={session}>
            <ReactQueryProvider>
              {children}
              <div id="portal" />
              <ModalRoot />
            </ReactQueryProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

import { getSession } from "next-auth/react"

/** 백엔드 에러 응답({ statusCode, code, message })을 담는 에러. code 목록은 백엔드 docs/error-codes.md */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
  }
}

interface FetcherOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
  body?: unknown
  /** 서버 컴포넌트에서 호출할 때 넘긴다. 브라우저에서는 생략하면 로그인 세션의 토큰을 붙인다. */
  token?: string
}

/** 백엔드 API를 호출하고 JSON 응답을 돌려준다. 실패하면 ApiError를 던진다. */
export async function fetcher<T = void>(
  path: string,
  { method = "GET", body, token }: FetcherOptions = {}
): Promise<T> {
  const accessToken = token ?? (await getBrowserAccessToken())

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  })

  // 응답 본문이 없는 API(204 등)도 있어서 JSON 파싱 실패는 무시한다
  const data = await response.json().catch(() => undefined)
  if (!response.ok) {
    throw new ApiError(response.status, data?.code ?? "UNKNOWN", data?.message ?? response.statusText)
  }
  return data as T
}

async function getBrowserAccessToken() {
  if (typeof window === "undefined") return undefined
  const session = await getSession()
  return session?.access_token
}

/** 화면에 보여줄 에러 문구 */
export function getErrorMessage(error: unknown) {
  return error instanceof ApiError ? error.message : String(error)
}

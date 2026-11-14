export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
  }
}

export interface User {
  id: string
  email: string | null
  nickname: string | null
  rewardCount: number
  myInviteCode: string
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
  user: User
}

type ApiInit = Omit<RequestInit, "body"> & { token?: string; body?: unknown }

// 백엔드 에러 응답: { statusCode, code, message, ... } (백엔드 docs/error-codes.md)
export async function api<T>(path: string, { token, body, headers, ...init }: ApiInit = {}): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  const data = await res.json().catch(() => undefined)
  if (!res.ok) throw new ApiError(res.status, data?.code ?? "UNKNOWN", data?.message ?? res.statusText)
  return data as T
}

export interface Character {
  id: string
  characterType: { id: string; name: string; imageUrl: string | null }
  level: number
  maxLevel: number
  letterCount: number
  nextLevelLetterCount: number | null
  canGraduate: boolean
}

export interface DailyQuestion {
  id: string
  date: string
  content: string
  letterId: string | null
}

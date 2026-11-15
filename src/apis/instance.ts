import axios, { AxiosError, type AxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"
import type { ErrorResponseDto } from "./generated/model"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROOT,
  timeout: 20_000
})

/*
 * Access Token의 원본은 next-auth 세션(쿠키) 하나다. 브라우저에서만 쓰는 인스턴스라 서버 세션은 다루지 않는다.
 * 세션이 바뀌면 AccessTokenSync(src/lib/providers)가 여기 넣어 두고, 요청마다 붙인다.
 */
let accessToken: string | undefined

export function setAccessToken(token: string | undefined) {
  accessToken = token
}

axiosInstance.interceptors.request.use(async (config) => {
  // 첫 요청이 AccessTokenSync보다 먼저 나가는 경우를 위해, 토큰이 없으면 세션에서 한 번 읽는다
  if (!accessToken && typeof window !== "undefined") {
    accessToken = (await getSession())?.access_token
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

/*
 * 401이면 토큰이 만료된 것이다. getSession()을 부르면 next-auth(서버)가 Refresh Token으로 새 토큰을 받아
 * 쿠키를 갱신하므로, 그 토큰으로 한 번만 다시 요청한다.
 */
axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
  const request = error.config as (AxiosRequestConfig & { isRetry?: boolean }) | undefined
  const canRetry = error.response?.status === 401 && request && !request.isRetry && typeof window !== "undefined"
  if (!canRetry) {
    throw error
  }

  const session = await getSession()
  setAccessToken(session?.access_token)
  if (!session?.access_token) {
    throw error
  }
  return axiosInstance({ ...request, isRetry: true } as AxiosRequestConfig)
})

/** orval이 만든 API 함수가 쓰는 요청 함수. 응답의 data만 돌려준다. */
export function apiInstance<T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> {
  return axiosInstance({ ...config, ...options }).then((response) => response.data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<Body> = Body

/** 백엔드 에러 코드(백엔드 docs/error-codes.md). 네트워크 오류 등 응답이 없으면 undefined */
export function getErrorCode(error: unknown) {
  return axios.isAxiosError<ErrorResponseDto>(error) ? error.response?.data?.code : undefined
}

/** 화면에 보여줄 에러 문구 (백엔드가 한국어 문구를 준다) */
export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ErrorResponseDto>(error)) {
    return error.response?.data?.message ?? error.message
  }
  return String(error)
}

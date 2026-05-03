// import axios, { type AxiosResponse } from "axios"
// Todo: 토큰 재발급 API 호출로 변경
export const refreshAccessToken = async (
  refreshToken: string
): Promise<{
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number
  refreshTokenExpiresAt: number
}> => {
  try {
    return {
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
      accessTokenExpiresAt: 1774319543,
      refreshTokenExpiresAt: 1776738743
    }
  } catch (error) {
    throw error
  }
}

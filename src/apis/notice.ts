import { fetcher } from "./fetcher"

export interface Notice {
  id: string
  title: string
  content: string
  createdDate: string
}

export function getNotices(token?: string) {
  return fetcher<Notice[]>("/notices", { token })
}

export function getNotice(id: string, token?: string) {
  return fetcher<Notice>(`/notices/${id}`, { token })
}

import { env } from './env'

/** 공통 API 요청 함수 — 모든 API 호출은 이 함수를 통해서 합니다. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(env.apiKey ? { Authorization: `Bearer ${env.apiKey}` } : {}),
      ...init.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

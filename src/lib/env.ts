/**
 * 환경 변수는 .env 파일(.gitignore 처리됨)에서 읽어옵니다.
 * 브라우저에서 접근 가능하려면 이름이 VITE_ 로 시작해야 합니다.
 * ⚠️ VITE_ 변수는 빌드 결과물에 그대로 노출되므로 비밀 키(secret)는 넣지 마세요.
 *    비밀 키는 서버(백엔드/서버리스 함수)에서만 사용해야 합니다.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  apiKey: import.meta.env.VITE_API_KEY ?? '',
} as const

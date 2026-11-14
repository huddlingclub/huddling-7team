import { env } from '@/lib/env'

export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight">Huddling 7team</h1>
      <p className="mt-4 text-gray-600">React + Tailwind CSS 기본 틀이 준비되었습니다.</p>
      <p className="mt-2 text-sm text-gray-400">
        API Base URL:{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5">
          {env.apiBaseUrl || '(미설정 — .env 확인)'}
        </code>
      </p>
    </section>
  )
}

import { env } from '@/lib/env'

export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <h1 className="text-4xl font-bold tracking-tight">Huddling 7team</h1>
      <p className="mt-4 text-gray-600">React + Tailwind CSS 기본 틀이 준비되었습니다.</p>
      <a
        className="mt-6 inline-flex rounded-lg bg-indigo-700 px-4 py-3 font-semibold text-white hover:bg-indigo-800"
        href={import.meta.env.BASE_URL + 'penguin-glacier.html'}
      >
        얼음섬 가계부 열기
      </a>
      <p className="mt-2 text-sm text-gray-400">
        API Base URL:{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5">
          {env.apiBaseUrl || '(미설정 — .env 확인)'}
        </code>
      </p>
    </section>
  )
}

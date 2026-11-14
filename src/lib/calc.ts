import { STAGES, type Stage } from './constants'
import type { Expense, Settings } from './types'

const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISO(new Date())
export const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const thisMonthRange = (d = new Date()) => ({
  periodStart: toISO(new Date(d.getFullYear(), d.getMonth(), 1)),
  periodEnd: toISO(new Date(d.getFullYear(), d.getMonth() + 1, 0)),
})
export const daysFromToday = (n: number, d = new Date()) => ({
  periodStart: toISO(d),
  periodEnd: toISO(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n - 1)),
})

export const inPeriod = (e: Expense, s: Settings) =>
  e.date >= s.periodStart && e.date <= s.periodEnd
export const totalSpent = (expenses: Expense[]) => expenses.reduce((sum, e) => sum + e.amount, 0)
export const usageRate = (spent: number, budget: number) =>
  budget > 0 ? (spent / budget) * 100 : 0
export const remaining = (spent: number, budget: number) => budget - spent

export const stageFor = (rate: number): Stage => {
  let s = STAGES[0]
  for (const st of STAGES) if (rate >= st.from) s = st
  return s
}

/** 기간 중 남은 날짜 (오늘 포함). 기간이 끝났으면 0 */
export const daysLeft = (s: Settings, today = todayISO()) => {
  if (today > s.periodEnd) return 0
  const start = today < s.periodStart ? s.periodStart : today
  return Math.round((fromISO(s.periodEnd).getTime() - fromISO(start).getTime()) / 86_400_000) + 1
}

/** 하루 권장 금액 = 남은 금액 ÷ 남은 날짜 (백 원 단위 내림) */
export const dailyAllowance = (spent: number, s: Settings) => {
  const d = daysLeft(s)
  if (d <= 0) return 0
  return Math.max(0, Math.floor(remaining(spent, s.budget) / d / 100) * 100)
}

export const formatKRW = (n: number) => `${Math.round(Math.abs(n)).toLocaleString('ko-KR')}원`
export const formatNum = (n: number) => Math.round(Math.abs(n)).toLocaleString('ko-KR')
/** 2026-11-14 → 2026. 11. 14. */
export const formatDateDots = (iso: string) => iso.replaceAll('-', '. ') + '.'
/** 2026-11-14 → 11.14 */
export const formatMD = (iso: string) => `${Number(iso.slice(5, 7))}.${Number(iso.slice(8, 10))}`
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
/** 2026-11-14 → 11월 14일 토요일 */
export const formatDayHeader = (iso: string) => {
  const d = fromISO(iso)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일`
}
export const monthOf = (s: Settings) => fromISO(s.periodStart).getMonth() + 1

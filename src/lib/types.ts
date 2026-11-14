import type { Category } from './constants'

export interface Settings {
  /** 기간 동안 쓸 수 있는 돈 (원) */
  budget: number
  /** 'YYYY-MM-DD' */
  periodStart: string
  periodEnd: string
}

export interface Expense {
  id: string
  amount: number
  memo: string
  /** 'YYYY-MM-DD' */
  date: string
  category: Category
  createdAt: number
}

export interface AppState {
  settings: Settings | null
  expenses: Expense[]
}

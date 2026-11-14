// localStorage 기반 단일 저장소. 화면은 useStore()와 actions만 사용.
import { useEffect, useState } from 'react'
import { STORAGE_KEY } from './constants'
import type { AppState, Expense, Settings } from './types'

const empty: AppState = { settings: null, expenses: [] }

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

let state: AppState = load()
const listeners = new Set<() => void>()

function save(next: AppState) {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export const actions = {
  setSettings(settings: Settings) {
    save({ ...state, settings })
  },
  addExpense(e: Omit<Expense, 'id' | 'createdAt'>) {
    const expense: Expense = { ...e, id: crypto.randomUUID(), createdAt: Date.now() }
    save({ ...state, expenses: [expense, ...state.expenses] })
    return expense
  },
  removeExpense(id: string) {
    save({ ...state, expenses: state.expenses.filter((e) => e.id !== id) })
  },
  /** 모든 기록과 한도를 지운다 (홈은 한도 0원 상태로 돌아감) */
  clearAll() {
    save(empty)
  },
}

export function useStore(): AppState {
  const [, force] = useState(0)
  useEffect(() => {
    const l = () => force((n) => n + 1)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return state
}

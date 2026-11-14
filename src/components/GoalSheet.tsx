import { useState } from 'react'
import { Field, Pill, PrimaryButton, Sheet } from './ui'
import { daysFromToday, formatDateDots, formatNum, thisMonthRange } from '../lib/calc'
import type { Settings } from '../lib/types'

interface Props {
  initial: Settings | null
  onSave: (s: Settings) => void
  onClose?: () => void
  onClearAll?: () => void
}

export default function GoalSheet({ initial, onSave, onClose, onClearAll }: Props) {
  const [budget, setBudget] = useState(initial?.budget ?? 1_000_000)
  const [range, setRange] = useState(() =>
    initial ? { periodStart: initial.periodStart, periodEnd: initial.periodEnd } : thisMonthRange(),
  )
  const valid = budget > 0 && range.periodStart <= range.periodEnd

  const presets = [
    { label: '이번 달', get: () => thisMonthRange() },
    { label: '오늘부터 7일', get: () => daysFromToday(7) },
    { label: '오늘부터 30일', get: () => daysFromToday(30) },
  ]
  const isPreset = (p: (typeof presets)[number]) => {
    const r = p.get()
    return r.periodStart === range.periodStart && r.periodEnd === range.periodEnd
  }

  return (
    <Sheet title="한도와 기간" onClose={onClose} gap={24}>
      <div className="flex w-full flex-col gap-2">
        <label className="text-grey600 text-[14px] leading-[21px]">이 기간 소비 한도</label>
        <Field active>
          <input
            inputMode="numeric"
            value={budget ? formatNum(budget) : ''}
            placeholder="1,000,000"
            autoFocus={!initial}
            onChange={(e) => setBudget(Number(e.target.value.replace(/[^\d]/g, '')))}
            className="placeholder:text-grey400 w-full bg-transparent text-[16px] leading-6 outline-none"
          />
          <span className="text-grey600 text-[15px]">원</span>
        </Field>
      </div>

      <div className="flex w-full flex-col gap-2">
        <label className="text-grey600 text-[14px] leading-[21px]">기간</label>
        <div className="flex w-full gap-2">
          {(['periodStart', 'periodEnd'] as const).map((k) => (
            <Field key={k} className="min-w-0 flex-1">
              <span className="text-[16px] leading-6">{formatDateDots(range[k])}</span>
              <input
                type="date"
                value={range[k]}
                onChange={(e) => e.target.value && setRange({ ...range, [k]: e.target.value })}
                className="absolute inset-0 opacity-0"
                aria-label={k === 'periodStart' ? '시작일' : '종료일'}
              />
            </Field>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          {presets.map((p) => (
            <Pill key={p.label} selected={isPreset(p)} onClick={() => setRange(p.get())}>
              {p.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <PrimaryButton disabled={!valid} onClick={() => onSave({ budget, ...range })}>
          저장하기
        </PrimaryButton>
        {onClearAll && (
          <button
            onClick={() => {
              if (window.confirm('모든 기록을 지우고 처음부터 시작할까요? 되돌릴 수 없어요.'))
                onClearAll()
            }}
            className="text-grey500 text-[14px] leading-[21px]"
          >
            기록 모두 지우기
          </button>
        )}
      </div>
    </Sheet>
  )
}

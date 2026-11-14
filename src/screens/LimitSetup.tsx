import { useState } from 'react'
import Keypad from '../components/Keypad'
import { Pill, PrimaryButton } from '../components/ui'
import { formatKRW, fromISO, thisMonthRange, usageRate } from '../lib/calc'
import type { Settings } from '../lib/types'

const QUICK = [100_000, 500_000, 1_000_000]

interface Props {
  /** 기존 설정이 있으면 '한도 수정', 없으면 '한도 입력' */
  initial: Settings | null
  spent: number
  onSave: (s: Settings) => void
  onBack?: () => void
}

/** 02 설정_한도 입력 / 14 설정_한도 수정 */
export default function LimitSetup({ initial, spent, onSave, onBack }: Props) {
  const editing = !!initial
  const [budget, setBudget] = useState(initial?.budget ?? 0)
  const range = initial
    ? { periodStart: initial.periodStart, periodEnd: initial.periodEnd }
    : thisMonthRange()
  const s = fromISO(range.periodStart),
    e = fromISO(range.periodEnd)

  const caption = editing
    ? budget > 0 && budget !== initial!.budget
      ? `사용률이 ${Math.round(usageRate(spent, initial!.budget))}%에서 ${Math.round(usageRate(spent, budget))}%로 바뀌어요`
      : '한도를 바꾸면 사용률도 같이 바뀌어요'
    : `${s.getMonth() + 1}월 ${s.getDate()}일부터 ${e.getMonth() + 1}월 ${e.getDate()}일까지`

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-6 pt-[max(54px,env(safe-area-inset-top))] pb-[max(34px,env(safe-area-inset-bottom))]">
      <nav className="flex h-12 w-full items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="뒤로"
            className="flex size-10 items-center justify-center"
          >
            <img src="/img/icon-chevron-left.svg" alt="" width={24} height={24} />
          </button>
        ) : (
          <span className="size-10" />
        )}
        <h1 className="text-[17px] leading-[25.5px] font-semibold">{editing ? '한도 수정' : ''}</h1>
        <span className="size-10" />
      </nav>

      <div className="flex w-full flex-col gap-2 pt-6">
        <h2 className="text-[26px] leading-[35px] font-bold">
          {editing ? (
            <>
              소비 한도를
              <br />
              바꿀까요?
            </>
          ) : (
            <>
              이번 달 소비 한도를
              <br />
              정해주세요
            </>
          )}
        </h2>
        <p className="text-grey600 text-[15px] leading-[22.5px]">
          {editing ? (
            <>
              지금까지 쓴 {formatKRW(spent)}은<br />
              그대로 남아요
            </>
          ) : (
            <>
              한도만큼 빙하가 생기고
              <br />
              쓸수록 녹아요
            </>
          )}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 pt-10">
        <div className="border-blue500 flex w-full items-center border-b-2 pb-2">
          <p className="text-[30px] leading-10 font-bold">
            {budget > 0 ? formatKRW(budget) : <span className="text-grey300">0원</span>}
          </p>
        </div>
        <p
          className={`text-[14px] leading-[21px] ${editing && budget > 0 && budget !== initial!.budget ? 'text-blue600' : 'text-grey500'}`}
        >
          {caption}
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        {QUICK.map((q) => (
          <Pill key={q} selected onClick={() => setBudget(budget + q)}>
            +{q / 10_000}만
          </Pill>
        ))}
      </div>

      <div className="min-h-4 flex-1" />

      <div className="flex w-full flex-col gap-2">
        <Keypad value={budget} onChange={setBudget} />
        <PrimaryButton disabled={budget <= 0} onClick={() => onSave({ budget, ...range })}>
          {editing ? '수정하기' : '시작하기'}
        </PrimaryButton>
      </div>
    </div>
  )
}

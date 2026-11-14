import { useState } from 'react'
import { Field, Pill, PrimaryButton, Sheet } from './ui'
import Keypad from './Keypad'
import { CATEGORIES, QUICK_AMOUNTS, type Category } from '../lib/constants'
import { formatDateDots, formatKRW, stageFor, todayISO, usageRate } from '../lib/calc'

interface Props {
  spent: number
  budget: number
  onSave: (e: { amount: number; memo: string; date: string; category: Category }) => void
  onClose: () => void
}

export default function ExpenseSheet({ spent, budget, onSave, onClose }: Props) {
  const [amount, setAmount] = useState(0)
  const [memo, setMemo] = useState('')
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState<Category>(CATEGORIES[0])

  const before = usageRate(spent, budget)
  const after = usageRate(spent + amount, budget)
  const sBefore = stageFor(before),
    sAfter = stageFor(after)
  const preview =
    amount <= 0
      ? '금액을 입력하면 빙하 변화를 미리 보여줘요'
      : sAfter.key !== sBefore.key
        ? `${Math.round(before)}% → ${Math.round(after)}%. 빙하가 '${sAfter.label}' 단계로 넘어가요`
        : `${Math.round(before)}% → ${Math.round(after)}%. 아직 '${sAfter.label}' 단계예요`

  return (
    <Sheet title="얼마를 썼나요?" onClose={onClose}>
      <p className="w-full text-center text-[30px] leading-10 font-bold">
        {amount > 0 ? formatKRW(amount) : <span className="text-grey300">0원</span>}
      </p>

      <div className="bg-grey50 flex w-full items-start gap-2 rounded-[14px] px-4 py-3">
        <img
          src="/img/dot.svg"
          alt=""
          width={8}
          height={14.5}
          className="mt-[3px] shrink-0"
          style={{ opacity: amount > 0 ? 1 : 0.3 }}
        />
        <p className="text-grey700 flex-1 text-[14px] leading-[21px]">{preview}</p>
      </div>

      <div className="flex gap-2">
        {QUICK_AMOUNTS.map((q) => (
          <Pill key={q} selected onClick={() => setAmount(amount + q)}>
            +{q / 10_000}만
          </Pill>
        ))}
      </div>
      <div className="flex w-full flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Pill key={c} selected={category === c} onClick={() => setCategory(c)}>
            {c}
          </Pill>
        ))}
      </div>

      <div className="flex w-full gap-2">
        <Field className="min-w-0 flex-1">
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="어디에 썼나요? (선택)"
            className="placeholder:text-grey400 w-full bg-transparent text-[16px] leading-6 outline-none"
          />
        </Field>
        <Field className="w-[140px] shrink-0">
          <span className="text-[15px] leading-6">{formatDateDots(date)}</span>
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="absolute inset-0 opacity-0"
            aria-label="날짜"
          />
        </Field>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Keypad value={amount} onChange={setAmount} />
        <PrimaryButton
          disabled={amount <= 0}
          onClick={() => onSave({ amount, memo, date, category })}
        >
          기록하기
        </PrimaryButton>
      </div>
    </Sheet>
  )
}

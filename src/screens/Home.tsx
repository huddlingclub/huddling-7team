import { useState } from 'react'
import Scene from '../components/Scene'
import ExpenseSheet from '../components/ExpenseSheet'
import GoalSheet from '../components/GoalSheet'
import { ExpenseRow, PrimaryButton } from '../components/ui'
import { BAR_TICKS } from '../lib/constants'
import { actions, useStore } from '../lib/store'
import {
  dailyAllowance,
  daysLeft,
  formatKRW,
  formatMD,
  inPeriod,
  monthOf,
  remaining,
  stageFor,
  totalSpent,
  usageRate,
} from '../lib/calc'
import type { Settings } from '../lib/types'

interface Props {
  settings: Settings
  onHistory: () => void
  onEditLimit: () => void
}

export default function Home({ settings, onHistory, onEditLimit }: Props) {
  const { expenses } = useStore()
  const [sheet, setSheet] = useState<'none' | 'expense' | 'period'>('none')
  const [shakeKey, setShakeKey] = useState(0)

  const list = expenses.filter((e) => inPeriod(e, settings))
  const budget = settings.budget
  const spent = totalSpent(list)
  const rate = usageRate(spent, budget)
  const stage = stageFor(rate)
  const left = remaining(spent, budget)
  const broke = left < 0

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[430px] pb-[122px]">
      {/* 풀블리드 장면 */}
      <Scene rate={rate} shakeKey={shakeKey} />

      {/* 장면 위에 얹는 헤더 */}
      <header className="absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-[max(60px,calc(env(safe-area-inset-top)+6px))]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[26px] leading-[35px] font-bold">{monthOf(settings)}월의 빙하</h1>
          <div className="flex items-center gap-1.5 text-[12px] leading-[18px] font-semibold">
            <button
              onClick={() => setSheet('period')}
              className="bg-blue50 text-blue600 rounded-[6px] px-1.5 py-0.5"
            >
              {daysLeft(settings)}일 남음
            </button>
            <button
              onClick={onEditLimit}
              className="flex items-center gap-1 rounded-[6px] bg-white/70 px-1.5 py-0.5"
            >
              <span className="text-grey600">한도</span>
              <span className="text-grey800">{formatKRW(budget)}</span>
            </button>
          </div>
        </div>
        <button
          onClick={onHistory}
          className="text-grey800 flex h-[38px] items-center gap-1 rounded-[10px] bg-white px-3 text-[14px] leading-[21px] font-semibold"
        >
          <img src="/img/icon-receipt.svg" alt="" width={16} height={16} />
          지출 확인하기
        </button>
      </header>

      {/* 흰 콘텐츠 영역: 장면 아래 56px를 덮고 올라옴 */}
      <div className="relative -mt-14 flex flex-col gap-4 rounded-t-[24px] bg-white px-6 pt-4">
        <section className="bg-grey50 flex w-full flex-col rounded-[16px] p-5">
          <div className="text-grey600 flex w-full justify-between text-[15px] leading-[22.5px]">
            <span>{broke ? '빙하가 다 녹았어요' : '남은 빙하'}</span>
            <span>{Math.round(rate)}% 사용</span>
          </div>
          <p
            className={`pt-1 pb-4 text-[30px] leading-10 font-bold ${broke ? 'text-[#e42939]' : ''}`}
          >
            {broke ? `${formatKRW(left)} 초과` : formatKRW(left)}
          </p>
          <div className="bg-grey200 h-2 w-full overflow-hidden rounded-[4px]">
            <div
              className="h-2 rounded-[4px] transition-all duration-700"
              style={{ width: `${Math.min(rate, 100)}%`, background: stage.bar }}
            />
          </div>
          <div className="text-grey500 relative mt-2 h-[18px] w-full text-[12px] leading-[18px]">
            {BAR_TICKS.map((t) => (
              <span
                key={t.at}
                className="absolute top-0"
                style={{
                  left: `${t.at}%`,
                  transform:
                    t.at === 0 ? 'none' : t.at === 100 ? 'translateX(-100%)' : 'translateX(-50%)',
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
          <div className="border-grey200 mt-4 flex w-full items-center justify-between border-t pt-4 text-[15px] leading-[22.5px]">
            <span className="text-grey600">하루에 쓸 수 있는 돈</span>
            <span className="font-semibold">
              {budget <= 0
                ? '한도를 먼저 정해주세요'
                : broke
                  ? '오늘은 쓰지 말아요'
                  : formatKRW(dailyAllowance(spent, settings))}
            </span>
          </div>
        </section>

        <section className="flex w-full flex-col gap-2 pt-4">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-[18px] leading-[27px] font-bold">최근 지출</h2>
            <span className="text-grey500 text-[14px] leading-[21px]">{list.length}건</span>
          </div>
          {list.length === 0 ? (
            <p className="text-grey500 py-6 text-center text-[14px]">
              아직 기록이 없어요. 빙하가 온전해요.
            </p>
          ) : (
            <div className="flex w-full flex-col">
              {list.map((e) => (
                <ExpenseRow
                  key={e.id}
                  category={e.category}
                  title={e.memo || e.category}
                  sub={formatMD(e.date)}
                  amount={`-${formatKRW(e.amount)}`}
                  onDelete={() => actions.removeExpense(e.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] bg-gradient-to-b from-white/0 via-white via-30% to-white px-6 pt-4 pb-[max(34px,env(safe-area-inset-bottom))]">
        {budget > 0 ? (
          <PrimaryButton icon="plus" onClick={() => setSheet('expense')}>
            지출 기록하기
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={onEditLimit}>소비 한도 정하기</PrimaryButton>
        )}
      </div>

      {sheet === 'period' && (
        <GoalSheet
          initial={settings}
          onSave={(s) => {
            actions.setSettings(s)
            setSheet('none')
          }}
          onClose={() => setSheet('none')}
          onClearAll={() => {
            actions.clearAll()
            setSheet('none')
          }}
        />
      )}
      {sheet === 'expense' && (
        <ExpenseSheet
          spent={spent}
          budget={budget}
          onSave={(e) => {
            actions.addExpense(e)
            setSheet('none')
            setShakeKey(Date.now())
          }}
          onClose={() => setSheet('none')}
        />
      )}
    </div>
  )
}

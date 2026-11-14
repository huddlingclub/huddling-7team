import { ExpenseRow } from '../components/ui'
import { useStore } from '../lib/store'
import { formatDayHeader, formatKRW, inPeriod, monthOf, totalSpent, usageRate } from '../lib/calc'

/** 내역_11월 지출 */
export default function History({ onBack }: { onBack: () => void }) {
  const { settings, expenses } = useStore()
  const list = settings ? expenses.filter((e) => inPeriod(e, settings)) : []
  const spent = totalSpent(list)
  const month = settings ? monthOf(settings) : new Date().getMonth() + 1

  const groups = new Map<string, typeof list>()
  for (const e of [...list].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
  )) {
    groups.set(e.date, [...(groups.get(e.date) ?? []), e])
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-6 pt-[max(54px,env(safe-area-inset-top))] pb-[max(34px,env(safe-area-inset-bottom))]">
      <nav className="flex h-12 w-full items-center justify-between">
        <button
          onClick={onBack}
          aria-label="뒤로"
          className="flex size-10 items-center justify-center"
        >
          <img src="/img/icon-chevron-left.svg" alt="" width={24} height={24} />
        </button>
        <h1 className="text-[17px] leading-[25.5px] font-semibold">{month}월 지출</h1>
        <span className="size-10" />
      </nav>

      <div className="flex w-full flex-col gap-1 py-6">
        <p className="text-grey600 text-[15px] leading-[22.5px]">{month}월에 쓴 돈</p>
        <p className="text-[30px] leading-10 font-bold">{formatKRW(spent)}</p>
        {settings && (
          <p className="text-grey500 text-[14px] leading-[21px]">
            한도 {formatKRW(settings.budget)} 중 {Math.round(usageRate(spent, settings.budget))}%를
            썼어요
          </p>
        )}
      </div>
      <div className="bg-grey200 h-px w-full" />

      {groups.size === 0 ? (
        <p className="text-grey500 py-10 text-center text-[14px]">아직 기록이 없어요</p>
      ) : (
        <div className="flex w-full flex-col gap-6 pt-6">
          {[...groups.entries()].map(([date, items]) => (
            <section key={date} className="flex w-full flex-col gap-1">
              <div className="flex w-full items-center justify-between text-[14px] leading-[21px]">
                <span className="text-grey600 font-semibold">{formatDayHeader(date)}</span>
                <span className="text-grey500">-{formatKRW(totalSpent(items))}</span>
              </div>
              {items.map((e) => (
                <ExpenseRow
                  key={e.id}
                  category={e.category}
                  title={e.memo || e.category}
                  amount={`-${formatKRW(e.amount)}`}
                />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

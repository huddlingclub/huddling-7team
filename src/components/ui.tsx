import type { ReactNode } from 'react'
import { CATEGORY_COLORS, type Category } from '../lib/constants'

/** TDS xlarge primary 버튼. 56px, 반경 16, 17/600. 비활성은 불투명도 30% */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  icon,
  variant = 'blue',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: 'plus'
  variant?: 'blue' | 'white'
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[56px] w-full items-center justify-center gap-[6px] rounded-[16px] px-5 text-[17px] leading-[25.5px] font-semibold disabled:opacity-30 ${variant === 'blue' ? 'bg-blue500 text-white' : 'text-blue500 bg-white'}`}
    >
      {icon === 'plus' && (
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M4.17 10H15.83M10 4.17V15.83"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

/** 카테고리 & 빠른 금액 버튼. 32px, 반경 8 */
export function Pill({
  children,
  selected,
  onClick,
}: {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[32px] items-center justify-center rounded-[8px] px-3 text-[14px] leading-[21px] font-semibold ${selected ? 'bg-blue50 text-blue600' : 'bg-grey100 text-grey700'}`}
    >
      {children}
    </button>
  )
}

export function CategoryChip({ category }: { category: Category }) {
  const c = CATEGORY_COLORS[category]
  return (
    <span
      className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] text-[12px] leading-[18px] font-semibold"
      style={{ background: c.bg, color: c.fg }}
    >
      {category}
    </span>
  )
}

/** 최근 지출 한 줄 */
export function ExpenseRow({
  category,
  title,
  sub,
  amount,
  onDelete,
}: {
  category: Category
  title: string
  sub?: string
  amount: string
  onDelete?: () => void
}) {
  return (
    <div className="flex w-full items-center gap-4 py-3">
      <CategoryChip category={category} />
      <div className="min-w-0 flex-1">
        <p className="text-grey800 truncate text-[16px] leading-6 font-semibold">{title}</p>
        {sub && <p className="text-grey500 text-[13px] leading-[19.5px]">{sub}</p>}
      </div>
      <p className="shrink-0 text-[16px] leading-6 font-semibold">{amount}</p>
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label="삭제"
          className="active:bg-grey100 flex size-[32px] shrink-0 items-center justify-center rounded-[8px]"
        >
          <img src="/img/icon-x.svg" alt="" width={20} height={20} />
        </button>
      )}
    </div>
  )
}

/** 바텀시트. 배경(dim)을 누르면 닫힘 */
export function Sheet({
  title,
  onClose,
  gap = 16,
  children,
}: {
  title: string
  onClose?: () => void
  gap?: 16 | 24
  children: ReactNode
}) {
  return (
    <div
      className="dim-enter fixed inset-0 z-40 flex items-end justify-center bg-[rgba(0,12,30,0.4)]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`sheet-enter flex max-h-[calc(100dvh-60px)] w-full max-w-[430px] flex-col overflow-y-auto rounded-t-[16px] bg-white px-6 pt-2 pb-[max(34px,env(safe-area-inset-bottom))] ${gap === 24 ? 'gap-6' : 'gap-4'}`}
      >
        <div className="flex w-full justify-center">
          <div className="bg-grey300 h-1 w-10 rounded-[4px]" />
        </div>
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] leading-[29px] font-bold">{title}</h2>
          {onClose && (
            <button onClick={onClose} className="text-grey600 text-[15px] leading-[22.5px]">
              닫기
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

/** 입력 박스 (h48, 반경 14) */
export function Field({
  children,
  active,
  className = '',
}: {
  children: ReactNode
  active?: boolean
  className?: string
}) {
  return (
    <div
      className={`relative flex h-[48px] items-center rounded-[14px] border px-4 ${active ? 'border-blue500 bg-white' : 'border-grey200 bg-grey50'} ${className}`}
    >
      {children}
    </div>
  )
}

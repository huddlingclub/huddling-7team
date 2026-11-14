const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫']

/** 숫자 키패드. 눌림 상태는 grey100 배경 */
export default function Keypad({
  value,
  onChange,
  max = 999_999_999,
}: {
  value: number
  onChange: (n: number) => void
  max?: number
}) {
  const press = (k: string) => {
    if (k === '⌫') return onChange(Math.floor(value / 10))
    const next = Number(`${value}${k}`)
    if (next <= max) onChange(next)
  }
  return (
    <div className="grid w-full grid-cols-3 gap-1">
      {KEYS.map((k) => (
        <button
          key={k}
          onClick={() => press(k)}
          className="text-grey800 active:bg-grey100 flex h-[56px] items-center justify-center rounded-[14px] text-[22px] leading-[31px] font-semibold"
        >
          {k === '⌫' ? (
            <img src="/img/icon-backspace.svg" alt="지우기" width={24} height={24} />
          ) : (
            k
          )}
        </button>
      ))}
    </div>
  )
}

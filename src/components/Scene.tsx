import { useEffect, useRef, useState } from 'react'
import {
  BROKE_DROWN,
  SEAL_ENABLED,
  SEAL_FAR_BUBBLE,
  SEAL_FAR_FROM,
  SEAL_NEAR_BUBBLE,
  SEAL_NEAR_FROM,
  type Stage,
} from '../lib/constants'
import { stageFor } from '../lib/calc'

/**
 * 홈 장면 (Figma v3 scene 390×563, 풀블리드). 좌표는 시안 px 그대로 쓰고 컨테이너 폭에 맞춰 scale.
 * 소비율(%) 하나로 6단계 + 바다표범 등장·접근·꿀꺽을 그린다. shakeKey 가 바뀌면 빙하가 흔들린다.
 */
export const SCENE_W = 390
export const SCENE_H = 563
const ICE_RATIO = 905 / 330
const PENGUIN = { w: 168.47, h: 190 }

type Mood = 'happy' | 'surprised' | 'dizzy' | 'dead'
const MOOD: Record<Stage['key'], Mood> = {
  solid: 'happy',
  crack: 'surprised',
  split: 'surprised',
  breaking: 'dizzy',
  risky: 'dizzy',
  broke: 'dead',
}

interface Layout {
  ice?: { x: number; y: number; w: number; rot?: number; crack?: string }
  penguin: { x: number; y: number; rot?: number }
  chips: [number, number, number][]
  dim?: number
  bubbleTop: number
}
const LAYOUT: Record<Stage['key'], Layout> = {
  solid: {
    ice: { x: 30, y: 321.46, w: 330 },
    penguin: { x: 110.77, y: 185.23 },
    chips: [],
    bubbleTop: 140,
  },
  crack: {
    ice: { x: 34.95, y: 322.98, w: 320.1, crack: 'crack-v3-2' },
    penguin: { x: 110.77, y: 185.23 },
    chips: [],
    bubbleTop: 140,
  },
  split: {
    ice: { x: 49.8, y: 327.53, w: 290.4, crack: 'crack-v3-3' },
    penguin: { x: 110.77, y: 185.23 },
    chips: [[26.89, 306.8, 42]],
    bubbleTop: 140,
  },
  breaking: {
    ice: { x: 76.44, y: 335.61, w: 237.6, rot: -2, crack: 'crack-v3-4' },
    penguin: { x: 107.56, y: 185.28, rot: -2 },
    chips: [
      [15.19, 310, 54],
      [318.04, 298.8, 39],
      [286.41, 340.4, 27],
    ],
    bubbleTop: 137,
  },
  risky: {
    ice: { x: 104.71, y: 344.18, w: 181.5, rot: -5, crack: 'crack-v3-5' },
    penguin: { x: 102.77, y: 185.58, rot: -5 },
    chips: [
      [7.99, 314.8, 57],
      [318.89, 303.6, 51],
      [57.62, 350, 33],
      [294.46, 346.8, 36],
    ],
    dim: 0.12,
    bubbleTop: 134,
  },
  broke: {
    penguin: { x: 110.77, y: 225 },
    chips: [
      [25.94, 314.8, 69],
      [289.66, 306.8, 57],
      [101.74, 356.4, 36],
      [241.28, 353.2, 42],
      [176.94, 375.6, 27],
    ],
    dim: 0.2,
    bubbleTop: 180,
  },
}

export default function Scene({ rate, shakeKey }: { rate: number; shakeKey: number }) {
  const stage = stageFor(rate)
  const L = LAYOUT[stage.key]
  const broke = stage.key === 'broke'
  const sealFar = SEAL_ENABLED && !broke && rate >= SEAL_FAR_FROM && rate < SEAL_NEAR_FROM
  const sealNear = SEAL_ENABLED && !broke && rate >= SEAL_NEAR_FROM
  const eaten = SEAL_ENABLED && broke

  const label = eaten
    ? stage.label
    : broke
      ? BROKE_DROWN.label
      : sealNear
        ? '바다표범 접근'
        : sealFar
          ? '위험'
          : stage.label
  const bubble = eaten
    ? stage.bubble
    : broke
      ? BROKE_DROWN.bubble
      : sealNear
        ? SEAL_NEAR_BUBBLE
        : sealFar
          ? SEAL_FAR_BUBBLE
          : stage.bubble
  const badgeColor = sealNear ? '#f04452' : sealFar ? '#f57800' : stage.color
  const bubbleTop = eaten ? 159 : L.bubbleTop

  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / SCENE_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="bg-scene relative w-full overflow-hidden"
      style={{ aspectRatio: `${SCENE_W}/${SCENE_H}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: SCENE_W, height: SCENE_H, transform: `scale(${scale})` }}
      >
        <img
          src="/img/sea-tall.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {L.dim && (
          <div
            className="absolute top-0 left-0 h-[230px] w-full"
            style={{ background: `rgba(26,41,69,${L.dim})` }}
          />
        )}

        {L.chips.map(([x, y, w], i) => (
          <img
            key={i}
            src="/img/ice.png"
            alt=""
            className="drift absolute object-cover"
            draggable={false}
            style={{
              left: x,
              top: y,
              width: w,
              height: w / ICE_RATIO,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}

        {/* shakeKey 가 바뀌면 key 로 다시 마운트되어 흔들림 애니메이션이 재생됨 */}
        <div key={shakeKey} className={`absolute inset-0 ${shakeKey ? 'shake' : ''}`}>
          {L.ice && (
            <div
              className="absolute transition-all duration-700"
              style={{
                left: L.ice.x,
                top: L.ice.y,
                width: L.ice.w,
                height: L.ice.w / ICE_RATIO,
                transform: L.ice.rot ? `rotate(${L.ice.rot}deg)` : undefined,
              }}
            >
              <img
                src="/img/ice.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              {L.ice.crack && (
                <img
                  src={`/img/${L.ice.crack}.svg`}
                  alt=""
                  className="absolute inset-0 h-full w-full"
                  draggable={false}
                />
              )}
            </div>
          )}

          {eaten ? (
            <>
              <div
                className="absolute overflow-hidden"
                style={{ left: 25, top: 195.57, width: 340, height: 204.43 }}
              >
                <img
                  src="/img/seal.png"
                  alt=""
                  className="absolute top-0 left-0"
                  style={{ width: 340, height: 240.51 }}
                  draggable={false}
                />
              </div>
              <img
                src="/img/ripple-v3-eaten.svg"
                alt=""
                className="absolute"
                style={{ left: 8, top: 394, width: 374, height: 12 }}
              />
              <div
                className="absolute overflow-hidden"
                style={{ left: 147.94, top: 321.71, width: 94.13, height: 51.83 }}
              >
                <img
                  src="/img/penguin-dead.png"
                  alt=""
                  className="absolute"
                  style={{ left: 10, top: 0, width: 74.13, height: 83.6 }}
                  draggable={false}
                />
              </div>
            </>
          ) : broke ? (
            <>
              <div
                className="absolute overflow-hidden"
                style={{ left: 105.77, top: 221, width: 178.47, height: 135 }}
              >
                <img
                  src="/img/penguin-dead.png"
                  alt=""
                  className="absolute"
                  style={{ left: 5, top: 4, width: PENGUIN.w, height: PENGUIN.h }}
                  draggable={false}
                />
              </div>
              <img
                src="/img/ripple-v3-drown.svg"
                alt=""
                className="absolute"
                style={{ left: 105, top: 350, width: 180, height: 12 }}
              />
            </>
          ) : (
            <div
              className={`absolute ${stage.key === 'solid' ? 'bob' : ''}`}
              style={{
                left: L.penguin.x,
                top: L.penguin.y,
                width: PENGUIN.w,
                height: PENGUIN.h,
                transform: L.penguin.rot ? `rotate(${L.penguin.rot}deg)` : undefined,
              }}
            >
              <img
                src={`/img/penguin-${MOOD[stage.key]}.png`}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          )}
        </div>

        {sealFar && (
          <>
            <div
              className="drift absolute overflow-hidden"
              style={{ left: 305, top: 221.3, width: 70, height: 30.7 }}
            >
              <img
                src="/img/seal.png"
                alt=""
                className="absolute top-0 left-0"
                style={{ width: 70, height: 49.52 }}
                draggable={false}
              />
            </div>
            <img
              src="/img/ripple-v3-far.svg"
              alt=""
              className="absolute"
              style={{ left: 301.5, top: 246, width: 77, height: 12 }}
            />
          </>
        )}
        {sealNear && (
          <>
            <div
              className="drift absolute overflow-hidden"
              style={{ left: 180, top: 291.06, width: 220, height: 108.94 }}
            >
              <img
                src="/img/seal.png"
                alt=""
                className="absolute top-0 left-0"
                style={{ width: 220, height: 155.62 }}
                draggable={false}
              />
            </div>
            <img
              src="/img/ripple-v3-near.svg"
              alt=""
              className="absolute"
              style={{ left: 169, top: 394, width: 242, height: 12 }}
            />
          </>
        )}

        {/* 배지 (왼쪽 아래) */}
        <span
          className="absolute left-6 rounded-[8px] px-2 py-1 text-[12px] leading-[18px] font-semibold text-white"
          style={{ top: 466, background: badgeColor }}
        >
          {label}
        </span>
        {/* 말풍선: 펭귄 머리 위 가운데, 꼬리 아래 */}
        <div
          className="text-grey800 absolute left-1/2 -translate-x-1/2 rounded-[14px] bg-white px-3 py-2 text-[14px] leading-[21px] font-semibold whitespace-nowrap"
          style={{ top: bubbleTop }}
        >
          {bubble}
          <img
            src="/img/bubble-tail.svg"
            alt=""
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: -10, width: 18, height: 11 }}
          />
        </div>
      </div>
    </div>
  )
}

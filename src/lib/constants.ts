// Figma "7조 ver2" 시안 기준 기본값. 숫자·문구·색을 바꿀 때는 여기만 수정.

export type StageKey = 'solid' | 'crack' | 'split' | 'breaking' | 'risky' | 'broke'

export interface Stage {
  key: StageKey
  /** 이 소비율(%) 이상이면 해당 단계 */
  from: number
  label: string
  bubble: string
  /** 배지 색 */
  color: string
  /** 진행 막대 색 */
  bar: string
}

export const STAGES: Stage[] = [
  {
    key: 'solid',
    from: 0,
    label: '단단함',
    bubble: '발밑이 아직 단단해요',
    color: '#3182f6',
    bar: '#3182f6',
  },
  {
    key: 'crack',
    from: 30,
    label: '금이 감',
    bubble: '어? 발밑에서 쩍 소리가 났어요',
    color: '#3182f6',
    bar: '#3182f6',
  },
  {
    key: 'split',
    from: 50,
    label: '갈라짐',
    bubble: '얼음이 갈라지고 있어요',
    color: '#ee8f11',
    bar: '#ffb331',
  },
  {
    key: 'breaking',
    from: 70,
    label: '조각나는 중',
    bubble: '조각이 떨어져 나가요! 그만 써요',
    color: '#f57800',
    bar: '#f57800',
  },
  {
    key: 'risky',
    from: 90,
    label: '위태로움',
    bubble: '발 디딜 곳이 거의 없어요',
    color: '#f04452',
    bar: '#f04452',
  },
  {
    key: 'broke',
    from: 100,
    label: '꿀꺽',
    bubble: '꿀꺽! 잘 먹을게',
    color: '#d22030',
    bar: '#e42939',
  },
]

/** 바다표범 연출 (위협_01~03). false면 홈_06 '파산' 연출(펭귄이 바다에 빠짐)로 대체 */
export const SEAL_ENABLED = true
export const SEAL_FAR_FROM = 60
export const SEAL_NEAR_FROM = 80
export const SEAL_FAR_BUBBLE = '저 멀리 바다표범이 보여요'
export const SEAL_NEAR_BUBBLE = '바다표범이 코앞까지 왔어요!'
export const BROKE_DROWN = { label: '파산', bubble: '풍덩! 결국 바다에 빠졌어요' }

/** 진행 막대 눈금 */
export const BAR_TICKS: { at: number; label: string }[] = [
  { at: 0, label: '0' },
  { at: 30, label: '30%' },
  { at: 50, label: '50%' },
  { at: 70, label: '70%' },
  { at: 90, label: '90%' },
  { at: 100, label: '파산' },
]

export const CATEGORIES = ['식비', '카페', '쇼핑', '교통', '문화', '생활', '기타'] as const
export type Category = (typeof CATEGORIES)[number]

/** 카테고리 칩 색 (배경, 글자) */
export const CATEGORY_COLORS: Record<Category, { bg: string; fg: string }> = {
  식비: { bg: '#fff3e0', fg: '#f57800' },
  카페: { bg: '#fff9e7', fg: '#dd7d02' },
  쇼핑: { bg: '#f9f0fc', fg: '#9128b4' },
  교통: { bg: '#e8f3ff', fg: '#1b64da' },
  문화: { bg: '#edf8f8', fg: '#0c8585' },
  생활: { bg: '#f0faf6', fg: '#029359' },
  기타: { bg: '#f2f4f6', fg: '#4e5968' },
}

/** 지출 입력 빠른 금액 (원) */
export const QUICK_AMOUNTS = [10_000, 50_000, 100_000]

export const STORAGE_KEY = 'iceland:v3'

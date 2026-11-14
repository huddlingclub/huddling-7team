import { PrimaryButton } from '../components/ui'

/** 시작_텅빙주의보 */
export default function Splash({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-splash relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden">
      <img
        src="/img/splash.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 top-[16.5%] flex flex-col items-center gap-3 text-center">
        <p className="text-blue600 text-[15px] leading-[22.5px] font-semibold">
          월급이 녹는 펭귄 가계부
        </p>
        <h1 className="text-[40px] leading-[50px] font-extrabold tracking-[-0.8px]">텅빙주의보</h1>
        <p className="text-grey800 text-[17px] leading-[25.5px]">
          돈을 쓸 때마다
          <br />
          펭귄 발밑 빙하가 녹아요
        </p>
      </div>
      <img
        src="/img/penguin-happy.png"
        alt=""
        className="bob absolute top-[47.5%] left-1/2 w-[133px] -translate-x-1/2"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-6 pb-[max(50px,calc(env(safe-area-inset-bottom)+16px))]">
        <p className="text-[14px] leading-[21px] text-white">설치 없이 바로 써요</p>
        <PrimaryButton variant="white" onClick={onStart}>
          시작하기
        </PrimaryButton>
      </div>
    </div>
  )
}

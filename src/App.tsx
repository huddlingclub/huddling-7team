import { useState } from 'react'
import { actions, useStore } from './lib/store'
import { inPeriod, thisMonthRange, totalSpent } from './lib/calc'
import Splash from './screens/Splash'
import LimitSetup from './screens/LimitSetup'
import Home from './screens/Home'
import History from './screens/History'

/** 흐름: 01 시작 → (한도 없으면) 02 한도 입력 → 03 홈. 시작 화면은 앱을 열 때마다 보인다 */
export default function App() {
  const { settings, expenses } = useStore()
  const [screen, setScreen] = useState<'splash' | 'home' | 'history' | 'limit'>('splash')
  const current = settings ?? { budget: 0, ...thisMonthRange() }
  const hasLimit = current.budget > 0

  if (screen === 'splash') return <Splash onStart={() => setScreen(hasLimit ? 'home' : 'limit')} />
  if (screen === 'history') return <History onBack={() => setScreen('home')} />
  if (screen === 'limit') {
    const spent = totalSpent(expenses.filter((e) => inPeriod(e, current)))
    return (
      <LimitSetup
        initial={hasLimit ? current : null}
        spent={spent}
        onSave={(s) => {
          actions.setSettings(s)
          setScreen('home')
        }}
        onBack={() => setScreen(hasLimit ? 'home' : 'splash')}
      />
    )
  }
  return (
    <Home
      settings={current}
      onHistory={() => setScreen('history')}
      onEditLimit={() => setScreen('limit')}
    />
  )
}

import { MODES } from '../../constants/modes'
import type { QuizMode } from '../../constants/modes'
import { accuracyPercent } from '../../lib/stats'
import type { Progress } from '../../types/progress'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { ModeCard } from './ModeCard'
import { StatsPanel } from './StatsPanel'

interface HomeScreenProps {
  progress: Progress
  /** 苦手として残っていて、いま実際に出題できる問題の数 */
  reviewCount: number
  /** モードごとの出題数 */
  counts: Record<QuizMode, number>
  onStart: (mode: QuizMode) => void
  onReset: () => void
}

export function HomeScreen({ progress, reviewCount, counts, onStart, onReset }: HomeScreenProps) {
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <Card className="overflow-hidden p-6 text-center">
        <p aria-hidden className="text-5xl">
          🚗💨
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight">
          その<span className="rounded bg-yellow-200 px-1 text-red-600">言い切り</span>、あやしいぞ!
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          学科試験でおなじみの「ひっかけ問題」を、ゲーム感覚で攻略しよう。
          <br />
          「必ず」「絶対」「常に」…あやしいワードを見つけると、警告灯がピカピカ光るよ!
        </p>
      </Card>

      <StatsPanel
        totalAnswered={progress.totalAnswered}
        accuracy={accuracyPercent(progress.totalCorrect, progress.totalAnswered)}
        wrongCount={reviewCount}
      />

      <section aria-label="出題モード" className="flex flex-col gap-3">
        {MODES.map((info) => (
          <ModeCard key={info.mode} info={info} count={counts[info.mode]} onSelect={() => onStart(info.mode)} />
        ))}
      </section>

      <div className="text-center">
        <Button variant="ghost" onClick={onReset} disabled={progress.totalAnswered === 0}>
          学習の記録をリセット
        </Button>
      </div>
    </div>
  )
}

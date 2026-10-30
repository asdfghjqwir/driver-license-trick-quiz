import { getCorrectLabel } from '../../lib/question'
import { accuracyPercent, getRank } from '../../lib/stats'
import type { AnswerRecord } from '../../state/quizReducer'
import type { Question } from '../../types/quiz'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

interface ResultScreenProps {
  queue: readonly Question[]
  results: readonly AnswerRecord[]
  onRetry: () => void
  onReview: () => void
  onHome: () => void
  /** 苦手克服モードで復習できる問題があるか */
  canReview: boolean
}

export function ResultScreen({ queue, results, onRetry, onReview, onHome, canReview }: ResultScreenProps) {
  const correctCount = results.filter((result) => result.correct).length
  const percent = accuracyPercent(correctCount, results.length)
  const rank = getRank(percent)
  const missed = results.flatMap((result) => {
    const question = queue.find((q) => q.id === result.questionId)
    return !result.correct && question !== undefined ? [question] : []
  })

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <Card className="p-6 text-center">
        <p aria-hidden className="text-6xl animate-pop-in">
          {rank.emoji}
        </p>
        <h2 className="mt-2 text-2xl font-black">{rank.title}</h2>
        <p className="mt-3 text-5xl font-black text-slate-800">
          {correctCount}
          <span className="text-2xl text-slate-600"> / {results.length}問</span>
        </p>
        <p className="mt-1 text-sm font-bold text-slate-600">正答率 {percent}%</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">{rank.message}</p>
      </Card>

      {missed.length > 0 && (
        <Card className="p-5">
          <h3 className="font-black">💡 まちがえた問題</h3>
          <ul className="mt-3 flex list-none flex-col gap-3 p-0">
            {missed.map((question) => (
              <li key={question.id} className="rounded-2xl bg-red-50 p-3 text-sm leading-6">
                <p className="font-bold">{question.text}</p>
                <p className="mt-1 font-black text-green-700">正解: {getCorrectLabel(question)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-600">
            まちがえた問題は「苦手克服モード」に入りました。正解すると、苦手リストから外れます。
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={onRetry}>
          もう一度チャレンジ 🔄
        </Button>
        {canReview && (
          <Button variant="secondary" onClick={onReview}>
            🔁 苦手克服モードで復習する
          </Button>
        )}
        <Button variant="ghost" onClick={onHome}>
          ホームにもどる
        </Button>
      </div>
    </div>
  )
}

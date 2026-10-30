import { detectTrapKeywords } from '../../lib/trapDetector'
import { isCorrect } from '../../lib/question'
import type { Question } from '../../types/quiz'
import { Button } from '../common/Button'
import { ProgressBar } from '../common/ProgressBar'
import { AnswerOptions } from './AnswerOptions'
import { ExplanationPanel } from './ExplanationPanel'
import { QuestionCard } from './QuestionCard'
import { TrapAlertLight } from './TrapAlertLight'

interface QuizScreenProps {
  question: Question
  /** 何問目か(0はじまり) */
  index: number
  total: number
  /** 答えたあとなら true(正誤と解説を見ている) */
  answered: boolean
  selected: number | null
  /** 連続正解の数 */
  streak: number
  onAnswer: (selectedIndex: number) => void
  onNext: () => void
  onQuit: () => void
}

export function QuizScreen({
  question,
  index,
  total,
  answered,
  selected,
  streak,
  onAnswer,
  onNext,
  onQuit,
}: QuizScreenProps) {
  const keywords = detectTrapKeywords(question.text)
  const isLast = index + 1 >= total

  return (
    <div className="flex flex-col gap-4">
      {/* 答える前だけ、警告灯をピカピカさせる */}
      {!answered && <TrapAlertLight keywords={keywords} />}

      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={onQuit} aria-label="クイズをやめてホームにもどる">
          ← ホーム
        </Button>
        <p className="text-sm font-black text-slate-700">
          {index + 1} / {total}
          {streak >= 2 && <span className="ml-2 rounded-full bg-orange-400 px-2 py-0.5 text-white">🔥 {streak}連続!</span>}
        </p>
      </div>
      <ProgressBar current={answered ? index + 1 : index} total={total} />

      {/* key を問題IDにして、問題が変わるたびにアニメーションをやりなおす */}
      <div key={question.id} className="flex flex-col gap-4">
        <QuestionCard question={question} />
        <AnswerOptions question={question} selected={selected} locked={answered} onSelect={onAnswer} />
      </div>

      {answered && selected !== null && (
        <>
          <ExplanationPanel question={question} correct={isCorrect(question, selected)} keywords={keywords} />
          <Button size="lg" onClick={onNext} className="w-full">
            {isLast ? '結果を見る 🏁' : '次の問題へ ▶'}
          </Button>
        </>
      )}
    </div>
  )
}

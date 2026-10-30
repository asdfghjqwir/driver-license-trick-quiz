import { useEffect, useRef } from 'react'
import { getCorrectLabel } from '../../lib/question'
import { cn } from '../../lib/cn'
import type { Question } from '../../types/quiz'

interface ExplanationPanelProps {
  question: Question
  correct: boolean
  /** 問題文から見つかったひっかけキーワード */
  keywords: readonly string[]
}

/** 答えたあとに出る、正誤と「なぜそうなるのか」の解説 */
export function ExplanationPanel({ question, correct, keywords }: ExplanationPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  // スマホでも解説が目に入るように、自動でスクロールする
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-3 animate-slide-up">
      <div
        className={cn(
          'rounded-3xl px-5 py-4 text-center text-2xl font-black text-white animate-pop-in',
          correct ? 'bg-green-500' : 'bg-red-500',
        )}
      >
        {correct ? '🎉 正解!' : '😵 ざんねん!'}
      </div>

      <div className="rounded-3xl border-2 border-white bg-white p-5 shadow-[0_6px_0_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-sky-700">{correct ? '📘 ポイント解説' : '💡 なぜまちがえたの?'}</p>
        <p className="mt-1 text-sm font-bold text-slate-600">
          正解: <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">{getCorrectLabel(question)}</span>
        </p>
        <p className="mt-3 leading-7">{question.explanation}</p>

        {question.tip !== undefined && (
          <p className="mt-3 rounded-2xl bg-yellow-100 px-4 py-3 text-sm font-bold leading-6 text-slate-700">
            🪤 ひっかけポイント: {question.tip}
          </p>
        )}

        {keywords.length > 0 && (
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700">
            ⚠️ この問題には「{keywords.join('」「')}」という言い切りワードが入っていたよ。ひっかけのサインだけど、
            正しい文のこともあるから、内容をよく確かめよう。
          </p>
        )}
      </div>
    </div>
  )
}

import { splitByTrapKeywords } from '../../lib/trapDetector'
import type { Question } from '../../types/quiz'
import { Card } from '../common/Card'

interface QuestionCardProps {
  question: Question
}

/** 問題文のカード。ひっかけキーワードは、蛍光ペンで目立たせる */
export function QuestionCard({ question }: QuestionCardProps) {
  const segments = splitByTrapKeywords(question.text)

  return (
    <Card className="p-5 animate-slide-up">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">{question.category}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {question.kind === 'truefalse' ? '○×問題' : '4択問題'}
        </span>
      </div>
      <p className="text-lg font-bold leading-8 sm:text-xl">
        {segments.map((segment, index) =>
          segment.isTrap ? (
            <mark
              key={index}
              className="rounded bg-yellow-200 px-1 font-black text-red-600 underline decoration-red-500 decoration-wavy underline-offset-4"
            >
              {segment.text}
            </mark>
          ) : (
            <span key={index}>{segment.text}</span>
          ),
        )}
      </p>
    </Card>
  )
}

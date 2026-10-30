import { getCorrectIndex, getOptionLabels } from '../../lib/question'
import { cn } from '../../lib/cn'
import type { Question } from '../../types/quiz'

interface AnswerOptionsProps {
  question: Question
  selected: number | null
  /** 答えたあと(true)は、押せなくなって正誤の色がつく */
  locked: boolean
  onSelect: (index: number) => void
}

type OptionState = 'idle' | 'correct' | 'wrong' | 'dim'

const STATE_CLASSES: Record<OptionState, string> = {
  idle: 'border-white bg-white hover:-translate-y-0.5 active:translate-y-1',
  correct: 'border-green-500 bg-green-400 text-white animate-pop-in',
  wrong: 'border-red-500 bg-red-400 text-white animate-shake',
  dim: 'border-white bg-white opacity-40',
}

const CIRCLED_NUMBERS = ['①', '②', '③', '④'] as const
const TRUE_FALSE_VIEW = [
  { symbol: '⭕', label: '正しい' },
  { symbol: '❌', label: 'まちがい' },
] as const

/** 答えの選択肢。○×問題は大きな2つのボタン、4択問題は縦に4つ並べる */
export function AnswerOptions({ question, selected, locked, onSelect }: AnswerOptionsProps) {
  const correctIndex = getCorrectIndex(question)

  function stateOf(index: number): OptionState {
    if (!locked) return 'idle'
    if (index === correctIndex) return 'correct'
    if (index === selected) return 'wrong'
    return 'dim'
  }

  const baseClass =
    'cursor-pointer rounded-3xl border-4 font-black shadow-[0_6px_0_rgba(15,23,42,0.12)] transition focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-default'

  if (question.kind === 'truefalse') {
    return (
      <div className="grid grid-cols-2 gap-4">
        {TRUE_FALSE_VIEW.map((view, index) => (
          <button
            key={view.label}
            type="button"
            disabled={locked}
            onClick={() => onSelect(index)}
            className={cn(baseClass, 'flex flex-col items-center gap-1 py-6', STATE_CLASSES[stateOf(index)])}
          >
            <span aria-hidden className="text-5xl">
              {view.symbol}
            </span>
            <span className="text-lg">{view.label}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {getOptionLabels(question).map((label, index) => (
        <button
          key={label}
          type="button"
          disabled={locked}
          onClick={() => onSelect(index)}
          className={cn(baseClass, 'flex items-center gap-3 px-4 py-4 text-left text-base', STATE_CLASSES[stateOf(index)])}
        >
          <span aria-hidden className="text-2xl">
            {CIRCLED_NUMBERS[index]}
          </span>
          <span className="flex-1 leading-6">{label}</span>
        </button>
      ))}
    </div>
  )
}

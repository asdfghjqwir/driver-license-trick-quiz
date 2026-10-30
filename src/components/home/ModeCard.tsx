import type { ModeInfo } from '../../constants/modes'
import { cn } from '../../lib/cn'

interface ModeCardProps {
  info: ModeInfo
  /** この モードで出る問題の数 */
  count: number
  onSelect: () => void
}

/** ホーム画面の、出題モードを選ぶカード */
export function ModeCard({ info, count, onSelect }: ModeCardProps) {
  const disabled = count === 0

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'flex w-full cursor-pointer items-start gap-3 rounded-3xl border-2 border-white bg-white p-4 text-left shadow-[0_6px_0_rgba(15,23,42,0.1)] transition',
        'hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgba(15,23,42,0.12)] active:translate-y-1 active:shadow-none',
        'focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
      )}
    >
      <span aria-hidden className="text-4xl">
        {info.emoji}
      </span>
      <span className="flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-lg font-black">{info.title}</span>
          <span className="rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-black text-slate-800">{count}問</span>
        </span>
        <span className="mt-1 block text-sm leading-6 text-slate-600">
          {disabled && info.mode === 'review' ? 'まだ苦手な問題はありません。まずはクイズに挑戦しよう!' : info.description}
        </span>
      </span>
    </button>
  )
}

interface ProgressBarProps {
  current: number
  total: number
}

/** 「いま何問目か」を示すバー */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total <= 0 ? 0 : Math.min(100, Math.round((current / total) * 100))

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label="クイズの進みぐあい"
      className="h-4 w-full overflow-hidden rounded-full bg-white/70 shadow-inner"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-orange-400 transition-all duration-500"
        style={{ width: percent + '%' }}
      />
    </div>
  )
}

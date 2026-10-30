import { Card } from '../common/Card'

interface StatsPanelProps {
  totalAnswered: number
  accuracy: number
  wrongCount: number
}

interface StatProps {
  label: string
  value: string
  emoji: string
}

function Stat({ label, value, emoji }: StatProps) {
  return (
    <div className="flex-1 text-center">
      <p aria-hidden className="text-2xl">
        {emoji}
      </p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-xs font-bold text-slate-600">{label}</p>
    </div>
  )
}

/** これまでの学習の記録(LocalStorage に保存されたもの) */
export function StatsPanel({ totalAnswered, accuracy, wrongCount }: StatsPanelProps) {
  return (
    <Card className="flex gap-2 p-4">
      <Stat emoji="✍️" label="答えた数" value={String(totalAnswered)} />
      <Stat emoji="🎯" label="正答率" value={totalAnswered === 0 ? '-' : accuracy + '%'} />
      <Stat emoji="🔁" label="苦手な問題" value={wrongCount + '問'} />
    </Card>
  )
}

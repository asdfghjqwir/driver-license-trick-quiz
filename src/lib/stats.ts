/** 正答率(%)。1 問も答えていなければ 0 */
export function accuracyPercent(correct: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((correct / total) * 100)
}

export interface Rank {
  emoji: string
  title: string
  message: string
}

/** 正答率に応じた称号 */
export function getRank(percent: number): Rank {
  if (percent >= 90) {
    return { emoji: '🏆', title: 'ひっかけマスター', message: 'ほぼ完ぺき! もう、ひっかけには引っかからないね。' }
  }
  if (percent >= 70) {
    return { emoji: '🚗', title: 'ベテランドライバー', message: 'いい調子! まちがえた問題を復習すれば、さらに安心。' }
  }
  if (percent >= 50) {
    return { emoji: '🔰', title: '見習いドライバー', message: 'あと少し! 解説を読んで、もう一度チャレンジしよう。' }
  }
  return { emoji: '🚧', title: '仮免ストップ', message: 'ここからが伸びしろ! 苦手克服モードで特訓しよう。' }
}

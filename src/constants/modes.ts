export type QuizMode = 'quick' | 'all' | 'trap' | 'review'

export interface ModeInfo {
  mode: QuizMode
  emoji: string
  title: string
  description: string
}

/** ホーム画面に並べる出題モード */
export const MODES: readonly ModeInfo[] = [
  { mode: 'quick', emoji: '⚡', title: 'サクッと10問', description: 'ランダムに10問。スキマ時間にどうぞ!' },
  { mode: 'all', emoji: '🏁', title: 'ぜんぶ30問', description: '全問にチャレンジして、ひっかけに強くなろう。' },
  { mode: 'trap', emoji: '⚠️', title: 'ひっかけ特訓', description: '「必ず」「絶対」などの言い切りワードが入った問題だけ。' },
  { mode: 'review', emoji: '🔁', title: '苦手克服モード', description: 'まちがえた問題だけを、正解できるまで復習。' },
]

/** 「サクッと」モードの問題数 */
export const QUICK_QUESTION_COUNT = 10

/** 問題のジャンル */
export const QUESTION_CATEGORIES = [
  '灯火',
  '駐停車',
  '踏切',
  '信号・標識',
  '追い越し・進路変更',
  '運転のルール',
  '自転車',
] as const

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number]

interface BaseQuestion {
  id: string
  category: QuestionCategory
  /** 問題文 */
  text: string
  /** 正解の理由(なぜそうなるのか) */
  explanation: string
  /** ひっかけポイントのひとこと(なくてもよい) */
  tip?: string
}

/** ○×問題 */
export interface TrueFalseQuestion extends BaseQuestion {
  kind: 'truefalse'
  /** 問題文が正しければ true */
  answer: boolean
}

/** 4択問題 */
export interface ChoiceQuestion extends BaseQuestion {
  kind: 'choice'
  options: readonly string[]
  /** 正解の選択肢の番号(0はじまり) */
  answerIndex: number
}

export type Question = TrueFalseQuestion | ChoiceQuestion

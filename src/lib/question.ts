import type { Question } from '../types/quiz'
import { detectTrapKeywords } from './trapDetector'

const TRUE_FALSE_LABELS = ['○ 正しい', '× まちがい'] as const

/** 問題の選択肢のラベル(○×問題は「○」「×」の2つ) */
export function getOptionLabels(question: Question): readonly string[] {
  return question.kind === 'truefalse' ? TRUE_FALSE_LABELS : question.options
}

/** 正解の選択肢の番号(○×問題は ○ が 0、× が 1) */
export function getCorrectIndex(question: Question): number {
  if (question.kind === 'choice') {
    return question.answerIndex
  }
  return question.answer ? 0 : 1
}

export function isCorrect(question: Question, selectedIndex: number): boolean {
  return selectedIndex === getCorrectIndex(question)
}

/** 正解の選択肢のラベル */
export function getCorrectLabel(question: Question): string {
  return getOptionLabels(question)[getCorrectIndex(question)] ?? ''
}

/** 問題文にひっかけキーワードが入っているか */
export function hasTrapKeyword(question: Question): boolean {
  return detectTrapKeywords(question.text).length > 0
}

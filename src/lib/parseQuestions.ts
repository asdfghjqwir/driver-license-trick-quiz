import { QUESTION_CATEGORIES } from '../types/quiz'
import type { Question, QuestionCategory } from '../types/quiz'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCategory(value: unknown): value is QuestionCategory {
  return QUESTION_CATEGORIES.some((category) => category === value)
}

function readString(record: UnknownRecord, key: string, where: string): string {
  const value = record[key]
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${where}: "${key}" は空でない文字列にしてください`)
  }
  return value
}

/** 問題データ(JSON)を、型の付いた Question に変換する。形がおかしければ例外を投げる */
export function parseQuestions(raw: unknown): Question[] {
  if (!Array.isArray(raw)) {
    throw new Error('問題データは配列にしてください')
  }
  const items: readonly unknown[] = raw
  const seenIds = new Set<string>()

  return items.map((item, index): Question => {
    const where = `問題${index + 1}`
    if (!isRecord(item)) {
      throw new Error(`${where}: オブジェクトにしてください`)
    }

    const id = readString(item, 'id', where)
    if (seenIds.has(id)) {
      throw new Error(`${where}: id "${id}" が重複しています`)
    }
    seenIds.add(id)

    const category = item['category']
    if (!isCategory(category)) {
      throw new Error(`${where}: category が不正です`)
    }

    const text = readString(item, 'text', where)
    const explanation = readString(item, 'explanation', where)
    const tipValue = item['tip']
    if (tipValue !== undefined && typeof tipValue !== 'string') {
      throw new Error(`${where}: tip は文字列にしてください`)
    }
    const common = { id, category, text, explanation, ...(tipValue === undefined ? {} : { tip: tipValue }) }

    const kind = item['kind']
    if (kind === 'truefalse') {
      const answer = item['answer']
      if (typeof answer !== 'boolean') {
        throw new Error(`${where}: answer は true / false にしてください`)
      }
      return { ...common, kind, answer }
    }

    if (kind === 'choice') {
      const options = item['options']
      if (!Array.isArray(options)) {
        throw new Error(`${where}: options は配列にしてください`)
      }
      const optionList: readonly unknown[] = options
      const labels = optionList.filter((option): option is string => typeof option === 'string' && option !== '')
      if (labels.length !== 4 || labels.length !== optionList.length) {
        throw new Error(`${where}: 4択問題の options は、空でない文字列を4つにしてください`)
      }
      const answerIndex = item['answerIndex']
      if (typeof answerIndex !== 'number' || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= labels.length) {
        throw new Error(`${where}: answerIndex は 0〜3 の整数にしてください`)
      }
      return { ...common, kind, options: labels, answerIndex }
    }

    throw new Error(`${where}: kind は "truefalse" か "choice" にしてください`)
  })
}

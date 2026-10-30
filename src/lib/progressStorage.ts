import type { Progress } from '../types/progress'

/** LocalStorage の保存キー(形を変えたら v2 にして、古いデータは読み捨てる) */
export const STORAGE_KEY = 'driver-license-trick-quiz:progress:v1'

export const EMPTY_PROGRESS: Progress = { wrongIds: [], totalAnswered: 0, totalCorrect: 0 }

/** 読み書きに必要な部分だけの、LocalStorage の型(テストで差しかえられる) */
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

/** ブラウザの LocalStorage。使えない環境(プライベートモードなど)では null */
export function getBrowserStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

/** 保存された文字列から、正しい形のときだけ Progress を取り出す */
export function parseProgress(raw: unknown): Progress | null {
  if (typeof raw !== 'object' || raw === null) return null
  const wrongIds: unknown = Reflect.get(raw, 'wrongIds')
  const totalAnswered: unknown = Reflect.get(raw, 'totalAnswered')
  const totalCorrect: unknown = Reflect.get(raw, 'totalCorrect')

  if (!Array.isArray(wrongIds)) return null
  const ids: readonly unknown[] = wrongIds
  const stringIds = ids.filter((id): id is string => typeof id === 'string')
  if (stringIds.length !== ids.length) return null
  if (!isNonNegativeInteger(totalAnswered) || !isNonNegativeInteger(totalCorrect)) return null
  if (totalCorrect > totalAnswered) return null

  return { wrongIds: [...new Set(stringIds)], totalAnswered, totalCorrect }
}

export function loadProgress(storage: StorageLike | null = getBrowserStorage()): Progress {
  if (storage === null) return EMPTY_PROGRESS
  try {
    const text = storage.getItem(STORAGE_KEY)
    if (text === null) return EMPTY_PROGRESS
    return parseProgress(JSON.parse(text)) ?? EMPTY_PROGRESS
  } catch {
    // 壊れたデータは、読み捨ててやり直す
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: Progress, storage: StorageLike | null = getBrowserStorage()): void {
  if (storage === null) return
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // 容量いっぱいなどで保存できなくても、クイズは続けられるようにする
  }
}

/**
 * 1 問答えた結果を、記録に反映する(元の記録は変えない)。
 * まちがえたら苦手リストに追加、正解したら苦手リストから外す。
 */
export function applyAnswer(progress: Progress, questionId: string, correct: boolean): Progress {
  const withoutThis = progress.wrongIds.filter((id) => id !== questionId)
  return {
    wrongIds: correct ? withoutThis : [...withoutThis, questionId],
    totalAnswered: progress.totalAnswered + 1,
    totalCorrect: progress.totalCorrect + (correct ? 1 : 0),
  }
}

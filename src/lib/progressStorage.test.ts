import { describe, expect, it } from 'vitest'
import type { StorageLike } from './progressStorage'
import { EMPTY_PROGRESS, STORAGE_KEY, applyAnswer, loadProgress, parseProgress, saveProgress } from './progressStorage'

/** メモリ上だけの、テスト用の LocalStorage */
function fakeStorage(initial?: string): StorageLike & { value: string | null } {
  const store = { value: initial ?? null }
  return {
    get value() {
      return store.value
    },
    getItem: (key: string) => (key === STORAGE_KEY ? store.value : null),
    setItem: (key: string, value: string) => {
      if (key === STORAGE_KEY) store.value = value
    },
  }
}

describe('applyAnswer', () => {
  it('まちがえたら、苦手リストに入り、回答数だけ増える', () => {
    const next = applyAnswer(EMPTY_PROGRESS, 'q01', false)
    expect(next).toEqual({ wrongIds: ['q01'], totalAnswered: 1, totalCorrect: 0 })
  })

  it('正解したら、苦手リストから外れる(苦手克服)', () => {
    const before = { wrongIds: ['q01', 'q02'], totalAnswered: 2, totalCorrect: 0 }
    const next = applyAnswer(before, 'q01', true)
    expect(next.wrongIds).toEqual(['q02'])
    expect(next.totalCorrect).toBe(1)
  })

  it('同じ問題を続けてまちがえても、苦手リストに重複しない', () => {
    let progress = applyAnswer(EMPTY_PROGRESS, 'q01', false)
    progress = applyAnswer(progress, 'q01', false)
    expect(progress.wrongIds).toEqual(['q01'])
    expect(progress.totalAnswered).toBe(2)
  })

  it('元の記録は書きかえない', () => {
    const before = { wrongIds: ['q01'], totalAnswered: 1, totalCorrect: 0 }
    applyAnswer(before, 'q02', false)
    expect(before.wrongIds).toEqual(['q01'])
  })
})

describe('parseProgress', () => {
  it('正しい形なら読み取れる', () => {
    expect(parseProgress({ wrongIds: ['a'], totalAnswered: 3, totalCorrect: 2 })).toEqual({
      wrongIds: ['a'],
      totalAnswered: 3,
      totalCorrect: 2,
    })
  })

  it('形がおかしければ null', () => {
    expect(parseProgress(null)).toBeNull()
    expect(parseProgress('text')).toBeNull()
    expect(parseProgress({ wrongIds: 'a', totalAnswered: 1, totalCorrect: 1 })).toBeNull()
    expect(parseProgress({ wrongIds: [1], totalAnswered: 1, totalCorrect: 1 })).toBeNull()
    expect(parseProgress({ wrongIds: [], totalAnswered: -1, totalCorrect: 0 })).toBeNull()
    expect(parseProgress({ wrongIds: [], totalAnswered: 1, totalCorrect: 5 })).toBeNull()
  })
})

describe('loadProgress / saveProgress', () => {
  it('保存したものを、読み出せる', () => {
    const storage = fakeStorage()
    const progress = { wrongIds: ['q05'], totalAnswered: 4, totalCorrect: 3 }
    saveProgress(progress, storage)
    expect(loadProgress(storage)).toEqual(progress)
  })

  it('何も保存されていなければ、空の記録', () => {
    expect(loadProgress(fakeStorage())).toEqual(EMPTY_PROGRESS)
  })

  it('壊れたデータ(JSONでない・形がちがう)は、空の記録にもどす', () => {
    expect(loadProgress(fakeStorage('これはJSONではない'))).toEqual(EMPTY_PROGRESS)
    expect(loadProgress(fakeStorage('{"wrongIds":"x"}'))).toEqual(EMPTY_PROGRESS)
  })

  it('LocalStorage が使えない(null)ときも、例外にならない', () => {
    expect(loadProgress(null)).toEqual(EMPTY_PROGRESS)
    expect(() => saveProgress(EMPTY_PROGRESS, null)).not.toThrow()
  })

  it('保存に失敗しても、例外にならない', () => {
    const broken: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    expect(() => saveProgress(EMPTY_PROGRESS, broken)).not.toThrow()
  })
})

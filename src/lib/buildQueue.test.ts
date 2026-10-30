import { describe, expect, it } from 'vitest'
import { QUESTIONS } from '../data/questions'
import { buildQueue } from './buildQueue'
import { hasTrapKeyword } from './question'

const noShuffle = () => 0.999

describe('buildQueue', () => {
  it('quick: 10問だけ出す', () => {
    expect(buildQueue('quick', QUESTIONS, [], noShuffle)).toHaveLength(10)
  })

  it('all: 全問を出す(重複なし)', () => {
    const queue = buildQueue('all', QUESTIONS, [])
    expect(queue).toHaveLength(QUESTIONS.length)
    expect(new Set(queue.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })

  it('trap: ひっかけキーワード入りの問題だけ出す', () => {
    const queue = buildQueue('trap', QUESTIONS, [])
    expect(queue.length).toBeGreaterThan(0)
    expect(queue.every(hasTrapKeyword)).toBe(true)
  })

  it('review: 苦手リストにある問題だけ出す', () => {
    const queue = buildQueue('review', QUESTIONS, ['q01', 'q10', 'zzz'])
    expect(queue.map((q) => q.id).sort()).toEqual(['q01', 'q10'])
  })

  it('review: 苦手がなければ、空', () => {
    expect(buildQueue('review', QUESTIONS, [])).toEqual([])
  })
})

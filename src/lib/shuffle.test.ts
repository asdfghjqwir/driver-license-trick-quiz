import { describe, expect, it } from 'vitest'
import type { RandomFn } from './shuffle'
import { shuffle } from './shuffle'

/** 同じ順番で同じ値を返す、テスト用の乱数 */
function seededRandom(seed: number): RandomFn {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

describe('shuffle', () => {
  it('要素の数と中身は変わらない', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]
    const result = shuffle(input, seededRandom(1))
    expect(result).toHaveLength(input.length)
    expect([...result].sort((a, b) => a - b)).toEqual(input)
  })

  it('元の配列は変えない', () => {
    const input = [1, 2, 3, 4]
    shuffle(input, seededRandom(2))
    expect(input).toEqual([1, 2, 3, 4])
  })

  it('同じ乱数なら、同じ並びになる', () => {
    const input = ['a', 'b', 'c', 'd', 'e']
    expect(shuffle(input, seededRandom(3))).toEqual(shuffle(input, seededRandom(3)))
  })

  it('空の配列や1要素でも動く', () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle([1])).toEqual([1])
  })
})

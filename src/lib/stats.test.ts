import { describe, expect, it } from 'vitest'
import { accuracyPercent, getRank } from './stats'

describe('accuracyPercent', () => {
  it('正答率を四捨五入で返す', () => {
    expect(accuracyPercent(1, 3)).toBe(33)
    expect(accuracyPercent(2, 3)).toBe(67)
    expect(accuracyPercent(10, 10)).toBe(100)
  })

  it('1問も答えていなければ 0', () => {
    expect(accuracyPercent(0, 0)).toBe(0)
  })
})

describe('getRank', () => {
  it('正答率で称号が変わる', () => {
    expect(getRank(100).title).toBe('ひっかけマスター')
    expect(getRank(90).title).toBe('ひっかけマスター')
    expect(getRank(89).title).toBe('ベテランドライバー')
    expect(getRank(70).title).toBe('ベテランドライバー')
    expect(getRank(69).title).toBe('見習いドライバー')
    expect(getRank(50).title).toBe('見習いドライバー')
    expect(getRank(49).title).toBe('仮免ストップ')
    expect(getRank(0).title).toBe('仮免ストップ')
  })
})

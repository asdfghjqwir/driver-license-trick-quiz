import { describe, expect, it } from 'vitest'
import { detectTrapKeywords, splitByTrapKeywords } from './trapDetector'

describe('detectTrapKeywords', () => {
  it('4つの代表的なひっかけキーワードを検出する', () => {
    expect(detectTrapKeywords('必ず止まる')).toEqual(['必ず'])
    expect(detectTrapKeywords('絶対に違反になる')).toEqual(['絶対'])
    expect(detectTrapKeywords('常に右側を走る')).toEqual(['常に'])
    expect(detectTrapKeywords('いかなる場合も進入できる')).toEqual(['いかなる場合も'])
  })

  it('ひっかけキーワードがなければ空の配列を返す', () => {
    expect(detectTrapKeywords('夜間はライトをつける')).toEqual([])
    expect(detectTrapKeywords('')).toEqual([])
  })

  it('出てきた順に、重複なしで返す', () => {
    expect(detectTrapKeywords('絶対に必ず止まる。必ず確認する')).toEqual(['絶対', '必ず'])
  })

  it('「どんな場合も必ず」のように、複数あれば両方とも検出する', () => {
    expect(detectTrapKeywords('どんな場合も必ず停止する')).toEqual(['どんな場合も', '必ず'])
  })

  it('意味のちがう言葉(必ずしも・非常に)は検出しない', () => {
    expect(detectTrapKeywords('必ずしも止まるとは限らない')).toEqual([])
    expect(detectTrapKeywords('非常に危険である')).toEqual([])
    expect(detectTrapKeywords('非常に危険だが常に注意する')).toEqual(['常に'])
  })
})

describe('splitByTrapKeywords', () => {
  it('キーワードの部分に isTrap の印を付けて分ける', () => {
    expect(splitByTrapKeywords('黄色は必ず止まる')).toEqual([
      { text: '黄色は', isTrap: false },
      { text: '必ず', isTrap: true },
      { text: '止まる', isTrap: false },
    ])
  })

  it('つなげると、元の文章にもどる', () => {
    const text = 'どんな場合も必ず停止し、絶対に進まず、常に右を見る。非常に大事。'
    const joined = splitByTrapKeywords(text)
      .map((segment) => segment.text)
      .join('')
    expect(joined).toBe(text)
  })

  it('キーワードがなければ、全体で 1 区間になる', () => {
    expect(splitByTrapKeywords('ライトをつける')).toEqual([{ text: 'ライトをつける', isTrap: false }])
  })

  it('空の文章は、区間なし', () => {
    expect(splitByTrapKeywords('')).toEqual([])
  })
})

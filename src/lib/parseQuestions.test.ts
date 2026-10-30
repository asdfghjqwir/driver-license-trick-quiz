import { describe, expect, it } from 'vitest'
import { QUESTIONS } from '../data/questions'
import { hasTrapKeyword, getCorrectIndex, getOptionLabels, isCorrect } from './question'
import { parseQuestions } from './parseQuestions'

const validTrueFalse = {
  id: 'x1',
  kind: 'truefalse',
  category: '灯火',
  text: '問題文',
  answer: true,
  explanation: '解説',
}

const validChoice = {
  id: 'x2',
  kind: 'choice',
  category: '灯火',
  text: '問題文',
  options: ['a', 'b', 'c', 'd'],
  answerIndex: 2,
  explanation: '解説',
}

describe('マスターデータ(questions.json)', () => {
  it('30問そろっていて、IDが重複していない', () => {
    expect(QUESTIONS).toHaveLength(30)
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(30)
  })

  it('○×問題と4択問題の両方がある', () => {
    expect(QUESTIONS.some((q) => q.kind === 'truefalse')).toBe(true)
    expect(QUESTIONS.some((q) => q.kind === 'choice')).toBe(true)
  })

  it('すべての問題の正解が、選択肢の範囲内にある', () => {
    for (const q of QUESTIONS) {
      const index = getCorrectIndex(q)
      expect(index).toBeGreaterThanOrEqual(0)
      expect(index).toBeLessThan(getOptionLabels(q).length)
      expect(isCorrect(q, index)).toBe(true)
    }
  })

  it('ひっかけキーワード入りの問題が、10問以上ある', () => {
    expect(QUESTIONS.filter(hasTrapKeyword).length).toBeGreaterThanOrEqual(10)
  })

  it('ひっかけキーワードを含む問題でも、答えが ○ のものと × のものがある(言い切り = ×、と決めつけられない)', () => {
    const trapQuestions = QUESTIONS.filter(hasTrapKeyword)
    const answers = trapQuestions.flatMap((q) => (q.kind === 'truefalse' ? [q.answer] : []))
    expect(answers).toContain(true)
    expect(answers).toContain(false)
  })
})

describe('parseQuestions', () => {
  it('正しい○×問題と4択問題を読み取れる', () => {
    const result = parseQuestions([validTrueFalse, validChoice])
    expect(result).toHaveLength(2)
    expect(result[0]?.kind).toBe('truefalse')
    expect(result[1]?.kind).toBe('choice')
  })

  it('配列でなければ例外', () => {
    expect(() => parseQuestions({})).toThrow()
    expect(() => parseQuestions(null)).toThrow()
  })

  it('IDが重複していたら例外', () => {
    expect(() => parseQuestions([validTrueFalse, validTrueFalse])).toThrow('重複')
  })

  it('不正なジャンル・種類・正解は例外', () => {
    expect(() => parseQuestions([{ ...validTrueFalse, category: 'ぞんざい' }])).toThrow('category')
    expect(() => parseQuestions([{ ...validTrueFalse, kind: 'unknown' }])).toThrow('kind')
    expect(() => parseQuestions([{ ...validTrueFalse, answer: 'yes' }])).toThrow('answer')
  })

  it('4択の選択肢が4つでない、正解の番号が範囲外なら例外', () => {
    expect(() => parseQuestions([{ ...validChoice, options: ['a', 'b', 'c'] }])).toThrow('options')
    expect(() => parseQuestions([{ ...validChoice, answerIndex: 4 }])).toThrow('answerIndex')
    expect(() => parseQuestions([{ ...validChoice, answerIndex: 1.5 }])).toThrow('answerIndex')
  })

  it('問題文や解説が空なら例外', () => {
    expect(() => parseQuestions([{ ...validTrueFalse, text: '' }])).toThrow('text')
    expect(() => parseQuestions([{ ...validTrueFalse, explanation: '  ' }])).toThrow('explanation')
  })
})

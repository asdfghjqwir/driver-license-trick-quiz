import { describe, expect, it } from 'vitest'
import { QUESTIONS } from '../data/questions'
import { getCorrectIndex } from '../lib/question'
import { currentQuestion, currentStreak, initialQuizState, quizReducer } from './quizReducer'
import type { QuizState } from './quizReducer'

const firstThree = QUESTIONS.slice(0, 3)

function started(): QuizState {
  return quizReducer(initialQuizState, { type: 'start', mode: 'all', questions: firstThree })
}

function wrongIndexOf(state: QuizState): number {
  const question = currentQuestion(state)
  if (question === null) throw new Error('問題がありません')
  return getCorrectIndex(question) === 0 ? 1 : 0
}

function correctIndexOf(state: QuizState): number {
  const question = currentQuestion(state)
  if (question === null) throw new Error('問題がありません')
  return getCorrectIndex(question)
}

describe('quizReducer', () => {
  it('start で、1 問目の「答える前」になる', () => {
    const state = started()
    expect(state.phase).toBe('answering')
    expect(state.mode).toBe('all')
    expect(state.index).toBe(0)
    expect(state.results).toEqual([])
  })

  it('出す問題がないときは、ホームのまま', () => {
    expect(quizReducer(initialQuizState, { type: 'start', mode: 'review', questions: [] })).toEqual(initialQuizState)
  })

  it('answer で正誤を記録して、解説を見る段階になる', () => {
    const state = started()
    const next = quizReducer(state, { type: 'answer', selected: correctIndexOf(state) })
    expect(next.phase).toBe('feedback')
    expect(next.results).toHaveLength(1)
    expect(next.results[0]?.correct).toBe(true)
  })

  it('まちがえた答えは correct: false で記録される', () => {
    const state = started()
    const next = quizReducer(state, { type: 'answer', selected: wrongIndexOf(state) })
    expect(next.results[0]?.correct).toBe(false)
  })

  it('答えたあとに、もう一度 answer しても無視される(二重回答できない)', () => {
    const state = started()
    const answered = quizReducer(state, { type: 'answer', selected: correctIndexOf(state) })
    const again = quizReducer(answered, { type: 'answer', selected: wrongIndexOf(state) })
    expect(again).toBe(answered)
    expect(again.results).toHaveLength(1)
  })

  it('答える前に next しても無視される', () => {
    const state = started()
    expect(quizReducer(state, { type: 'next' })).toBe(state)
  })

  it('最後の問題のあとに next すると、結果画面(finished)になる', () => {
    let state = started()
    for (let i = 0; i < firstThree.length; i++) {
      state = quizReducer(state, { type: 'answer', selected: correctIndexOf(state) })
      state = quizReducer(state, { type: 'next' })
    }
    expect(state.phase).toBe('finished')
    expect(state.results).toHaveLength(3)
  })

  it('quit で、ホームにもどる', () => {
    expect(quizReducer(started(), { type: 'quit' })).toEqual(initialQuizState)
  })
})

describe('currentStreak', () => {
  it('最後から数えた連続正解の数を返す', () => {
    const ok = { questionId: 'a', selected: 0, correct: true }
    const ng = { questionId: 'b', selected: 0, correct: false }
    expect(currentStreak([])).toBe(0)
    expect(currentStreak([ok, ok, ng])).toBe(0)
    expect(currentStreak([ng, ok, ok])).toBe(2)
    expect(currentStreak([ok, ok, ok])).toBe(3)
  })
})

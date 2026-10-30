import type { QuizMode } from '../constants/modes'
import { isCorrect } from '../lib/question'
import type { Question } from '../types/quiz'

/**
 * クイズの進行の段階
 * - idle: ホーム画面
 * - answering: 問題に答える前
 * - feedback: 答えたあと(正誤と解説を見ている)
 * - finished: 全問おわって、結果を見ている
 */
export type QuizPhase = 'idle' | 'answering' | 'feedback' | 'finished'

export interface AnswerRecord {
  questionId: string
  selected: number
  correct: boolean
}

export interface QuizState {
  phase: QuizPhase
  mode: QuizMode | null
  queue: readonly Question[]
  index: number
  selected: number | null
  results: readonly AnswerRecord[]
}

export type QuizAction =
  | { type: 'start'; mode: QuizMode; questions: readonly Question[] }
  | { type: 'answer'; selected: number }
  | { type: 'next' }
  | { type: 'quit' }

export const initialQuizState: QuizState = {
  phase: 'idle',
  mode: null,
  queue: [],
  index: 0,
  selected: null,
  results: [],
}

/** いま出題中の問題(なければ null) */
export function currentQuestion(state: QuizState): Question | null {
  return state.queue[state.index] ?? null
}

/** 最後から数えて、何問連続で正解しているか */
export function currentStreak(results: readonly AnswerRecord[]): number {
  let streak = 0
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i]?.correct !== true) break
    streak++
  }
  return streak
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start': {
      // 出す問題がなければ、ホームのままにする
      if (action.questions.length === 0) {
        return initialQuizState
      }
      return {
        phase: 'answering',
        mode: action.mode,
        queue: action.questions,
        index: 0,
        selected: null,
        results: [],
      }
    }

    case 'answer': {
      if (state.phase !== 'answering') return state
      const question = currentQuestion(state)
      if (question === null) return state
      return {
        ...state,
        phase: 'feedback',
        selected: action.selected,
        results: [
          ...state.results,
          { questionId: question.id, selected: action.selected, correct: isCorrect(question, action.selected) },
        ],
      }
    }

    case 'next': {
      if (state.phase !== 'feedback') return state
      const nextIndex = state.index + 1
      if (nextIndex >= state.queue.length) {
        return { ...state, phase: 'finished' }
      }
      return { ...state, phase: 'answering', index: nextIndex, selected: null }
    }

    case 'quit':
      return initialQuizState
  }
}

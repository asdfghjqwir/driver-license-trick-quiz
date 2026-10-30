import { QUICK_QUESTION_COUNT } from '../constants/modes'
import type { QuizMode } from '../constants/modes'
import type { Question } from '../types/quiz'
import { hasTrapKeyword } from './question'
import { shuffle } from './shuffle'
import type { RandomFn } from './shuffle'

/** モードに合わせて、出題する問題の並びをつくる */
export function buildQueue(
  mode: QuizMode,
  questions: readonly Question[],
  wrongIds: readonly string[],
  random: RandomFn = Math.random,
): Question[] {
  switch (mode) {
    case 'quick':
      return shuffle(questions, random).slice(0, QUICK_QUESTION_COUNT)
    case 'all':
      return shuffle(questions, random)
    case 'trap':
      return shuffle(questions.filter(hasTrapKeyword), random)
    case 'review':
      return shuffle(
        questions.filter((question) => wrongIds.includes(question.id)),
        random,
      )
  }
}

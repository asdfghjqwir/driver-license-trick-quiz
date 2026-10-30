import { parseQuestions } from '../lib/parseQuestions'
import type { Question } from '../types/quiz'
import rawQuestions from './questions.json'

/** アプリに埋め込んだ問題のマスターデータ(読み込み時に形を検証する) */
export const QUESTIONS: readonly Question[] = parseQuestions(rawQuestions)

import { useCallback, useEffect, useState } from 'react'
import { EMPTY_PROGRESS, applyAnswer, loadProgress, saveProgress } from '../lib/progressStorage'
import type { Progress } from '../types/progress'

interface UseProgressResult {
  progress: Progress
  /** 1 問答えた結果を記録する */
  recordAnswer: (questionId: string, correct: boolean) => void
  /** 記録をすべて消す */
  reset: () => void
}

/** 学習の記録を、LocalStorage と同期しながら持つ */
export function useProgress(): UseProgressResult {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const recordAnswer = useCallback((questionId: string, correct: boolean) => {
    setProgress((current) => applyAnswer(current, questionId, correct))
  }, [])

  const reset = useCallback(() => {
    setProgress(EMPTY_PROGRESS)
  }, [])

  return { progress, recordAnswer, reset }
}

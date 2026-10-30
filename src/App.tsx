import { useReducer } from 'react'
import { AppShell } from './components/layout/AppShell'
import { HomeScreen } from './components/home/HomeScreen'
import { QuizScreen } from './components/quiz/QuizScreen'
import { ResultScreen } from './components/result/ResultScreen'
import { QUICK_QUESTION_COUNT } from './constants/modes'
import type { QuizMode } from './constants/modes'
import { QUESTIONS } from './data/questions'
import { useProgress } from './hooks/useProgress'
import { buildQueue } from './lib/buildQueue'
import { isCorrect, hasTrapKeyword } from './lib/question'
import { currentQuestion, currentStreak, initialQuizState, quizReducer } from './state/quizReducer'

/** 問題データに実在する、苦手な問題のIDだけを返す(データが変わっても壊れないように) */
function existingWrongIds(wrongIds: readonly string[]): string[] {
  return wrongIds.filter((id) => QUESTIONS.some((question) => question.id === id))
}

function App() {
  const [quiz, dispatch] = useReducer(quizReducer, initialQuizState)
  const { progress, recordAnswer, reset } = useProgress()

  const wrongIds = existingWrongIds(progress.wrongIds)
  const question = currentQuestion(quiz)

  function handleStart(mode: QuizMode) {
    dispatch({ type: 'start', mode, questions: buildQueue(mode, QUESTIONS, wrongIds) })
  }

  function handleAnswer(selected: number) {
    if (question === null || quiz.phase !== 'answering') return
    dispatch({ type: 'answer', selected })
    recordAnswer(question.id, isCorrect(question, selected))
  }

  function handleReset() {
    if (window.confirm('学習の記録をすべて消します。よろしいですか?')) {
      reset()
    }
  }

  const counts: Record<QuizMode, number> = {
    quick: Math.min(QUICK_QUESTION_COUNT, QUESTIONS.length),
    all: QUESTIONS.length,
    trap: QUESTIONS.filter(hasTrapKeyword).length,
    review: wrongIds.length,
  }

  return (
    <AppShell>
      {quiz.phase === 'idle' && (
        <HomeScreen
          progress={progress}
          reviewCount={wrongIds.length}
          counts={counts}
          onStart={handleStart}
          onReset={handleReset}
        />
      )}

      {(quiz.phase === 'answering' || quiz.phase === 'feedback') && question !== null && (
        <QuizScreen
          question={question}
          index={quiz.index}
          total={quiz.queue.length}
          answered={quiz.phase === 'feedback'}
          selected={quiz.selected}
          streak={currentStreak(quiz.results)}
          onAnswer={handleAnswer}
          onNext={() => dispatch({ type: 'next' })}
          onQuit={() => dispatch({ type: 'quit' })}
        />
      )}

      {quiz.phase === 'finished' && (
        <ResultScreen
          queue={quiz.queue}
          results={quiz.results}
          canReview={wrongIds.length > 0}
          onRetry={() => handleStart(quiz.mode ?? 'quick')}
          onReview={() => handleStart('review')}
          onHome={() => dispatch({ type: 'quit' })}
        />
      )}
    </AppShell>
  )
}

export default App

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { QUESTIONS } from '../data/questions'
import { getCorrectIndex } from '../lib/question'
import type { Question } from '../types/quiz'
import { QuizScreen } from './quiz/QuizScreen'
import { TrapAlertLight } from './quiz/TrapAlertLight'
import { ResultScreen } from './result/ResultScreen'

function findQuestion(id: string): Question {
  const question = QUESTIONS.find((q) => q.id === id)
  if (question === undefined) throw new Error(`${id} が見つかりません`)
  return question
}

const noop = () => {}

function renderQuiz(question: Question, options: { answered: boolean; selected: number | null }): string {
  return renderToStaticMarkup(
    <QuizScreen
      question={question}
      index={0}
      total={10}
      answered={options.answered}
      selected={options.selected}
      streak={0}
      onAnswer={noop}
      onNext={noop}
      onQuit={noop}
    />,
  )
}

describe('ホーム画面', () => {
  it('タイトルと4つの出題モードが表示される', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain('ひっかけ免許クイズ')
    for (const title of ['サクッと10問', 'ぜんぶ30問', 'ひっかけ特訓', '苦手克服モード']) {
      expect(html).toContain(title)
    }
  })

  it('苦手な問題がないときは、苦手克服モードが押せない', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain('まだ苦手な問題はありません')
    expect(html).toContain('disabled')
  })

  it('学習の注意書き(独自データであること)が表示される', () => {
    expect(renderToStaticMarkup(<App />)).toContain('学習用に作った独自のデータ')
  })
})

describe('警告灯(ひっかけトラップ感知)', () => {
  it('キーワードがあれば、警告の文言とキーワードが出る', () => {
    const html = renderToStaticMarkup(<TrapAlertLight keywords={['必ず', '絶対']} />)
    expect(html).toContain('ひっかけトラップ感知')
    expect(html).toContain('必ず')
    expect(html).toContain('絶対')
    expect(html).toContain('animate-siren')
  })

  it('キーワードがなければ、何も出ない', () => {
    expect(renderToStaticMarkup(<TrapAlertLight keywords={[]} />)).toBe('')
  })
})

describe('クイズ画面', () => {
  it('ひっかけキーワード入りの問題(q10)では、警告灯が出て、キーワードに蛍光ペンがつく', () => {
    const html = renderQuiz(findQuestion('q10'), { answered: false, selected: null })
    expect(html).toContain('ひっかけトラップ感知')
    expect(html).toContain('<mark')
  })

  it('ひっかけキーワードのない問題(q01)では、警告灯が出ない', () => {
    const html = renderQuiz(findQuestion('q01'), { answered: false, selected: null })
    expect(html).not.toContain('ひっかけトラップ感知')
    expect(html).not.toContain('<mark')
  })

  it('4択問題では、4つの選択肢が出る', () => {
    const html = renderQuiz(findQuestion('q05'), { answered: false, selected: null })
    for (const mark of ['①', '②', '③', '④']) {
      expect(html).toContain(mark)
    }
  })

  it('まちがえると、「なぜまちがえたの?」の解説と、正解が出て、選んだ選択肢が揺れる', () => {
    const question = findQuestion('q01')
    const wrong = getCorrectIndex(question) === 0 ? 1 : 0
    const html = renderQuiz(question, { answered: true, selected: wrong })
    expect(html).toContain('ざんねん')
    expect(html).toContain('なぜまちがえたの')
    expect(html).toContain(question.explanation)
    expect(html).toContain('animate-shake')
    expect(html).not.toContain('ひっかけトラップ感知')
  })

  it('正解すると、「正解!」とポイント解説が出る', () => {
    const question = findQuestion('q01')
    const html = renderQuiz(question, { answered: true, selected: getCorrectIndex(question) })
    expect(html).toContain('🎉 正解!')
    expect(html).toContain('ポイント解説')
  })

  it('ひっかけキーワード入りの問題を答えたあとは、解説に言い切りワードの注意が出る', () => {
    const question = findQuestion('q10')
    const html = renderQuiz(question, { answered: true, selected: getCorrectIndex(question) })
    expect(html).toContain('言い切りワード')
  })

  it('最後の問題では、ボタンが「結果を見る」になる', () => {
    const html = renderToStaticMarkup(
      <QuizScreen
        question={findQuestion('q01')}
        index={9}
        total={10}
        answered
        selected={0}
        streak={0}
        onAnswer={noop}
        onNext={noop}
        onQuit={noop}
      />,
    )
    expect(html).toContain('結果を見る')
  })
})

describe('結果画面', () => {
  it('まちがえた問題と正解が出る', () => {
    const question = findQuestion('q03')
    const html = renderToStaticMarkup(
      <ResultScreen
        queue={[question]}
        results={[{ questionId: question.id, selected: 0, correct: false }]}
        canReview
        onRetry={noop}
        onReview={noop}
        onHome={noop}
      />,
    )
    expect(html).toContain('まちがえた問題')
    expect(html).toContain(question.text)
    expect(html).toContain('苦手克服モードで復習する')
  })

  it('全問正解なら、「まちがえた問題」は出ない', () => {
    const question = findQuestion('q03')
    const html = renderToStaticMarkup(
      <ResultScreen
        queue={[question]}
        results={[{ questionId: question.id, selected: 1, correct: true }]}
        canReview={false}
        onRetry={noop}
        onReview={noop}
        onHome={noop}
      />,
    )
    expect(html).not.toContain('まちがえた問題')
    expect(html).toContain('ひっかけマスター')
  })
})

/**
 * ひっかけキーワード(教習所の問題で「言い切り」に使われやすい言葉)。
 * source は検出に使う正規表現。「必ずしも」「非常に」のような別の意味の言葉は拾わない。
 */
interface TrapPattern {
  keyword: string
  source: string
}

const TRAP_PATTERNS: readonly TrapPattern[] = [
  { keyword: 'いかなる場合も', source: 'いかなる場合も' },
  { keyword: 'どんな場合も', source: 'どんな場合も' },
  { keyword: '必ず', source: '必ず(?!しも)' },
  { keyword: '絶対', source: '絶対' },
  { keyword: '常に', source: '(?<!非)常に' },
]

/** 画面に表示する用の、ひっかけキーワード一覧 */
export const TRAP_KEYWORDS: readonly string[] = TRAP_PATTERNS.map((pattern) => pattern.keyword)

function createMatcher(): RegExp {
  return new RegExp(TRAP_PATTERNS.map((pattern) => pattern.source).join('|'), 'g')
}

/** 文章を、ひっかけキーワードとそれ以外に分けたときの 1 区間 */
export interface TextSegment {
  text: string
  isTrap: boolean
}

/** 問題文に含まれるひっかけキーワードを、出てきた順に(重複なしで)返す */
export function detectTrapKeywords(text: string): string[] {
  const found: string[] = []
  for (const match of text.matchAll(createMatcher())) {
    const word = match[0]
    if (!found.includes(word)) {
      found.push(word)
    }
  }
  return found
}

/** 文章を、ひっかけキーワードの部分とそれ以外に分ける(つなげると元の文章にもどる) */
export function splitByTrapKeywords(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let cursor = 0
  for (const match of text.matchAll(createMatcher())) {
    const start = match.index
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), isTrap: false })
    }
    segments.push({ text: match[0], isTrap: true })
    cursor = start + match[0].length
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isTrap: false })
  }
  return segments
}

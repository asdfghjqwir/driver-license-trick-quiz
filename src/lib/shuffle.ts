/** 0 以上 1 未満の乱数を返す関数(テストで固定の値を使えるように、差しかえ可能にしている) */
export type RandomFn = () => number

/** Fisher-Yates 法で並べかえた新しい配列を返す(元の配列は変えない) */
export function shuffle<T>(items: readonly T[], random: RandomFn = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const current = result[i]
    const other = result[j]
    if (current === undefined || other === undefined) continue
    result[i] = other
    result[j] = current
  }
  return result
}

/** LocalStorage に保存する学習の記録 */
export interface Progress {
  /** まちがえたまま(苦手)の問題ID */
  wrongIds: readonly string[]
  /** これまでに答えた回数 */
  totalAnswered: number
  /** そのうち正解した回数 */
  totalCorrect: number
}

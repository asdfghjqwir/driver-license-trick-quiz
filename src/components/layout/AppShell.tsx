import type { ReactNode } from 'react'

/** 全画面に共通の、背景・ヘッダー・フッター */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50 font-sans text-slate-800">
      <header>
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <span aria-hidden className="text-2xl">
            🚦
          </span>
          <span className="text-lg font-black tracking-tight text-slate-800">ひっかけ免許クイズ</span>
        </div>
        {/* 横断歩道のしましま */}
        <div aria-hidden className="h-2 bg-[repeating-linear-gradient(90deg,#ffffff_0_18px,#1e293b_18px_36px)]" />
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6">{children}</main>

      <footer className="mx-auto max-w-2xl px-4 pb-10 text-xs leading-6 text-slate-600">
        ※ このアプリの問題と解説は、学習用に作った独自のデータです。実際の試験の問題とは異なります。
        最新の法令や正確な内容は、警察庁・都道府県警察・JAF・自動車教習所などの公式の情報で確認してください。
      </footer>
    </div>
  )
}

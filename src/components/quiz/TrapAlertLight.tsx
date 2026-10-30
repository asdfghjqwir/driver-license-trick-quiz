interface TrapAlertLightProps {
  /** 問題文から見つかったひっかけキーワード */
  keywords: readonly string[]
}

/** ひっかけキーワードを見つけると、画面のすみで警告灯がピカピカ光る */
export function TrapAlertLight({ keywords }: TrapAlertLightProps) {
  if (keywords.length === 0) return null

  return (
    <div
      role="status"
      className="fixed right-3 top-3 z-40 flex max-w-[17rem] items-center gap-3 rounded-full border-2 border-red-500 bg-white py-2 pl-3 pr-4 shadow-[0_6px_0_rgba(239,68,68,0.25)] animate-pop-in"
    >
      {/* 警告灯: 赤とオレンジが交互に光り、まわりに光の輪が広がる */}
      <span aria-hidden className="relative flex size-6 shrink-0 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex size-5 rounded-full animate-siren" />
      </span>
      <span className="leading-tight">
        <span className="block animate-blink text-sm font-black text-red-600">⚠️ひっかけトラップ感知！</span>
        <span className="block text-xs font-bold text-slate-600">「{keywords.join('」「')}」に注意</span>
      </span>
    </div>
  )
}

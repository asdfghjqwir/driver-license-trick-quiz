import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

/** 白い丸角のカード */
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-3xl border-2 border-white bg-white/95 shadow-[0_8px_0_rgba(15,23,42,0.08)]', className)}>
      {children}
    </div>
  )
}

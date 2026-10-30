import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant
  size?: 'md' | 'lg'
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-yellow-400 text-slate-900 shadow-[0_5px_0_#ca8a04] hover:translate-y-[2px] hover:shadow-[0_3px_0_#ca8a04] active:translate-y-[5px] active:shadow-none',
  secondary:
    'bg-white text-sky-700 border-2 border-sky-300 shadow-[0_5px_0_#7dd3fc] hover:translate-y-[2px] hover:shadow-[0_3px_0_#7dd3fc] active:translate-y-[5px] active:shadow-none',
  ghost: 'bg-transparent text-slate-600 hover:bg-white/60',
}

/** アプリ共通のボタン(押すとぷにっと沈む) */
export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl font-black transition focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'lg' ? 'px-8 py-4 text-lg' : 'px-5 py-3 text-base',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

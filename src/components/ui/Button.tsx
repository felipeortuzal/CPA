import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant }

export function Button({ className, variant = 'primary', children, ...props }: PropsWithChildren<ButtonProps>) {
  const variants: Record<Variant, string> = {
    primary: 'bg-emerald-400 text-slate-950 hover:bg-emerald-300',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
  }
  return <button className={cn('inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50', variants[variant], className)} {...props}>{children}</button>
}

import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/cn'
export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <section className={cn('rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/[0.04]', className)}>{children}</section> }

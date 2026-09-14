import type { PropsWithChildren } from 'react'
export function Badge({ children }: PropsWithChildren) { return <span className="inline-flex rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{children}</span> }

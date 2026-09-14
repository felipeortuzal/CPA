import type { ReactNode } from 'react'
import { Card } from './Card'
export function StatCard({ label, value, helper, icon }: { label: string; value: string; helper: string; icon: ReactNode }) { return <Card><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-500">{helper}</p></div><div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-600 dark:text-emerald-300">{icon}</div></div></Card> }

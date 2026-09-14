import type { LucideIcon } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
export function PlaceholderPage({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) { return <div className="mx-auto max-w-5xl"><div className="mb-6"><h1 className="text-3xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-slate-500">{description}</p></div><Card><EmptyState icon={<Icon className="h-8 w-8"/>} title="Fundação pronta" description="Esta área já está integrada à navegação e receberá a funcionalidade completa nas próximas versões."/></Card></div> }

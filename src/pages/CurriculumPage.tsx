import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronRight, Circle, CircleDot, Star } from 'lucide-react'
import metadata from '../../content/cpa/metadata.json'
import { cpaCurriculum } from '../../content/cpa/curriculum'
import type { CurriculumUnit } from '../../content/cpa/schema'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Progress } from '../components/ui/Progress'
import { Skeleton } from '../components/ui/Skeleton'
import { useAuth } from '../features/auth/AuthProvider'
import { useProfile } from '../features/auth/ProfileProvider'
import { supabase } from '../lib/supabase'

type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered'
type TreeNode = CurriculumUnit & { children: TreeNode[] }

const statusMeta = {
  not_started: { label: 'Não iniciado', icon: Circle, className: 'text-slate-400' },
  in_progress: { label: 'Em andamento', icon: CircleDot, className: 'text-amber-500' },
  completed: { label: 'Estudado', icon: CheckCircle2, className: 'text-emerald-500' },
  mastered: { label: 'Dominado', icon: Star, className: 'text-violet-500' },
} satisfies Record<ProgressStatus, { label: string; icon: typeof Circle; className: string }>

function buildTree(items: CurriculumUnit[]): TreeNode[] {
  const nodes = new Map(items.map((item) => [item.pdCode, { ...item, children: [] as TreeNode[] }]))
  const roots: TreeNode[] = []
  for (const node of nodes.values()) {
    if (node.parentCode) nodes.get(node.parentCode)?.children.push(node)
    else roots.push(node)
  }
  return roots
}

function leafCodes(node: TreeNode): string[] {
  return node.children.length ? node.children.flatMap(leafCodes) : [node.pdCode]
}

function aggregateStatus(node: TreeNode, statuses: Map<string, ProgressStatus>): ProgressStatus {
  const own = statuses.get(node.pdCode)
  if (own && own !== 'not_started') return own
  if (!node.children.length) return own ?? 'not_started'
  const children = node.children.map((child) => aggregateStatus(child, statuses))
  if (children.every((value) => value === 'mastered')) return 'mastered'
  if (children.every((value) => value === 'completed' || value === 'mastered')) return 'completed'
  if (children.some((value) => value !== 'not_started')) return 'in_progress'
  return 'not_started'
}

function CurriculumNode({ node, statuses, expanded, onToggle, depth = 0 }: {
  node: TreeNode
  statuses: Map<string, ProgressStatus>
  expanded: Set<string>
  onToggle: (pdCode: string) => void
  depth?: number
}) {
  const hasChildren = node.children.length > 0
  const open = expanded.has(node.pdCode)
  const status = aggregateStatus(node, statuses)
  const meta = statusMeta[status]
  const StatusIcon = meta.icon

  return <div>
    <div className="flex items-start gap-2 border-b border-slate-100 py-3 pr-3 dark:border-white/[0.06]" style={{ paddingLeft: `${12 + Math.min(depth, 7) * 18}px` }}>
      {hasChildren ? <button type="button" onClick={() => onToggle(node.pdCode)} className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10" aria-label={open ? `Recolher ${node.pdCode}` : `Expandir ${node.pdCode}`}>
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button> : <span className="h-6 w-6 shrink-0" />}
      <button type="button" disabled={!hasChildren} onClick={() => hasChildren && onToggle(node.pdCode)} className="min-w-0 flex-1 text-left">
        <span className="mr-2 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">{node.pdCode}</span>
        <span className={depth < 2 ? 'text-sm font-semibold' : 'text-sm text-slate-700 dark:text-slate-200'}>{node.title}</span>
        {node.weight ? <span className="ml-2 text-xs font-semibold text-slate-500">{node.weight}%</span> : null}
      </button>
      <span className={`inline-flex shrink-0 items-center gap-1.5 pt-0.5 text-xs font-medium ${meta.className}`}><StatusIcon className="h-3.5 w-3.5" />{meta.label}</span>
    </div>
    {hasChildren && open ? node.children.map((child) => <CurriculumNode key={child.pdCode} node={child} statuses={statuses} expanded={expanded} onToggle={onToggle} depth={depth + 1} />) : null}
  </div>
}

export function CurriculumPage() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const tree = useMemo(() => buildTree(cpaCurriculum), [])
  const [expanded, setExpanded] = useState(() => new Set(['1', '2', '3', '4']))
  const [statuses, setStatuses] = useState<Map<string, ProgressStatus>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      if (!user || profile?.current_certification !== 'CPA') { setLoading(false); return }
      setLoading(true)
      const { data: items } = await supabase.from('curriculum_items').select('id,pd_code').eq('certification_id', 'CPA').eq('program_version', metadata.programVersion)
      if (!items?.length) { if (active) { setStatuses(new Map()); setLoading(false) }; return }
      const codeById = new Map(items.map((item) => [item.id as string, item.pd_code as string]))
      const { data: progressRows } = await supabase.from('lesson_progress').select('curriculum_item_id,status').eq('user_id', user.id)
      const next = new Map<string, ProgressStatus>()
      for (const row of progressRows ?? []) {
        const code = codeById.get(row.curriculum_item_id as string)
        if (code) next.set(code, row.status as ProgressStatus)
      }
      if (active) { setStatuses(next); setLoading(false) }
    }
    void load()
    return () => { active = false }
  }, [user, profile?.current_certification])

  const leaves = useMemo(() => tree.flatMap(leafCodes), [tree])
  const studied = leaves.filter((code) => ['completed', 'mastered'].includes(statuses.get(code) ?? '')).length
  const mastered = leaves.filter((code) => statuses.get(code) === 'mastered').length
  const coverage = leaves.length ? Math.round(studied / leaves.length * 100) : 0

  function toggle(pdCode: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(pdCode)) next.delete(pdCode)
      else next.add(pdCode)
      return next
    })
  }

  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2"><Badge>CPA · PD {metadata.programVersion}</Badge><span className="text-sm text-slate-500">Vigência: 01/01/2026</span></div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Trilha de Estudos</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Programa Detalhado oficial da nova CPA, com todos os códigos PD preservados em sua hierarquia.</p>
      </div>
      <Card className="min-w-[280px]"><div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Cobertura</p><p className="mt-1 text-3xl font-black">{coverage}%</p></div><div className="text-right text-xs text-slate-500"><p>{studied} estudados</p><p>{mastered} dominados</p></div></div><Progress value={coverage} /><p className="mt-2 text-xs text-slate-500">Base: {leaves.length} itens terminais do PD.</p></Card>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metadata.macroTopics.map((topic) => <Card key={topic.pdCode} className="p-4"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300">{topic.pdCode}</span><span className="text-sm font-black">{topic.weight}%</span></div><p className="mt-2 text-sm font-semibold leading-5">{topic.title}</p></Card>)}</div>

    <div className="flex flex-wrap gap-4 text-xs">{Object.entries(statusMeta).map(([key, item]) => { const Icon = item.icon; return <span key={key} className={`inline-flex items-center gap-1.5 ${item.className}`}><Icon className="h-3.5 w-3.5" />{item.label}</span> })}</div>

    {loading ? <div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-20" /></div> : <div className="space-y-4">{tree.map((root) => <Card key={root.pdCode} className="overflow-hidden p-0"><CurriculumNode node={root} statuses={statuses} expanded={expanded} onToggle={toggle} /></Card>)}</div>}

    <p className="text-xs leading-5 text-slate-500">Fonte: ANBIMA — Programa Detalhado CPA, versão {metadata.programVersion}, revisão de 04/06/2025, vigente desde 01/01/2026. Última verificação: 14/09/2026.</p>
  </div>
}

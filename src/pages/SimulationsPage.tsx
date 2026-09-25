import { reportStorageError } from '../lib/storage/events'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Clock3, FileText, History, Sparkles, Target, Zap } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { cpaQuestions } from '../../content/cpa/questions'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { generateSimulation, samplesFromAttempts, samplesFromSimulations, type SimulationMode } from '../lib/simulations/engine'
import { getQuestionAttempts } from '../lib/storage/repositories/questionRepository'
import { createSimulation, getSeenQuestionIds, getSimulations } from '../lib/storage/repositories/simulationRepository'
import type { QuestionAttemptRecord, SimulationRecord } from '../lib/storage/types'

const themeLabels: Record<string, string> = {
  '1': 'Tema 1 · Estrutura e dinâmica do SFN',
  '2': 'Tema 2 · Produtos do mercado financeiro',
  '3': 'Tema 3 · Relacionamento com o cliente',
  '4': 'Tema 4 · Inovação e desenvolvimento de mercado',
}

const modes = [
  { mode: 'quick10' as const, title: 'Simulado 10', description: '10 questões na distribuição de estudo dos macrotemas.', icon: Zap, detail: '30 min' },
  { mode: 'quick20' as const, title: 'Simulado 20', description: '20 questões na distribuição de estudo dos macrotemas.', icon: FileText, detail: '60 min' },
  { mode: 'weak' as const, title: 'Assuntos fracos', description: 'Prioriza PDs e temas em que seu histórico mostra erros.', icon: Target, detail: 'até 20 questões' },
  { mode: 'unseen' as const, title: 'Somente inéditas', description: 'Usa somente questões que ainda não apareceram nos seus treinos ou simulados.', icon: Sparkles, detail: 'até 20 questões' },
]

export function SimulationsPage() {
  const navigate = useNavigate()
  const [attempts, setAttempts] = useState<QuestionAttemptRecord[]>([])
  const [simulations, setSimulations] = useState<SimulationRecord[]>([])
  const [seen, setSeen] = useState<Set<string>>(new Set())
  const [theme, setTheme] = useState<'1'|'2'|'3'|'4'>('1')
  const [busy, setBusy] = useState<SimulationMode | null>(null)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const startLock = useRef(false)

  async function load() {
    const [attemptRows, simulationRows, seenIds] = await Promise.all([getQuestionAttempts(), getSimulations(), getSeenQuestionIds()])
    setAttempts(attemptRows); setSimulations(simulationRows); setSeen(seenIds); setLoaded(true)
  }
  useEffect(() => { void load().catch(reportStorageError) }, [])

  const performanceSamples = useMemo(() => [...samplesFromAttempts(attempts), ...samplesFromSimulations(simulations)], [attempts, simulations])
  const active = simulations.find((item) => !item.completedAt)
  const completed = simulations.filter((item) => item.completedAt)

  async function start(mode: SimulationMode) {
    if (!loaded || startLock.current) return
    startLock.current = true
    setBusy(mode); setError('')
    try {
      const definition = generateSimulation(cpaQuestions, { mode, theme: mode === 'theme' ? theme : undefined, seenQuestionIds: seen, performanceSamples })
      const record = await createSimulation(definition)
      navigate(`/prova/${record.id}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível gerar o simulado.')
    } finally { startLock.current = false; setBusy(null) }
  }

  return <div className="mx-auto max-w-6xl space-y-7">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><div className="mb-2 flex items-center gap-2"><Badge>Treino autoral</Badge><span className="text-sm text-slate-500">Conteúdo com revisão individual pendente</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Simulados CPA</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Treine em uma interface sem dicas nem correção durante a prova. O treino completo tem 50 questões e 2h30. As questões de diálogo atuais são objetivas; ainda não reproduzem as árvores de decisão do exame.</p></div>
      <Link to="/simulados/historico"><Button variant="secondary"><History className="h-4 w-4"/>Histórico ({completed.length})</Button></Link>
    </div>

    {active ? <Card className="border-amber-300 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/[0.06]"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">Simulado em andamento</p><p className="mt-1 font-semibold">{active.payload.label} · {active.questionCount} questões</p></div><Button onClick={() => navigate(`/prova/${active.id}`)}>Continuar <ArrowRight className="h-4 w-4"/></Button></div></Card> : null}

    <Card className="overflow-hidden p-0">
      <div className="bg-slate-950 p-6 text-white sm:p-8"><div className="flex flex-wrap items-center gap-2"><Badge>Treino completo</Badge><span className="text-xs text-slate-400">50 questões</span></div><h2 className="mt-4 text-2xl font-black">Treino completo CPA</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Distribuição de estudo: 10 questões do Tema 1, 20 do Tema 2, 15 do Tema 3 e 5 do Tema 4.</p><div className="mt-5 flex flex-wrap gap-5 text-sm"><span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-emerald-300"/>2h30</span><span>Sem estimativa de aprovação</span><span>Sem feedback durante a prova</span></div><Button className="mt-6" disabled={!loaded || busy !== null || Boolean(active)} onClick={() => void start('official_exam')}>{busy === 'official_exam' ? 'Gerando...' : 'Iniciar treino completo'} <ArrowRight className="h-4 w-4"/></Button></div>
    </Card>

    <div className="grid gap-4 md:grid-cols-2">{modes.map(({mode,title,description,icon:Icon,detail}) => <Card key={mode} className="flex flex-col"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"><Icon className="h-5 w-5"/></div><div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{description}</p><p className="mt-2 text-xs font-semibold text-slate-400">{detail}</p></div></div><div className="mt-auto pt-5"><Button variant="secondary" disabled={!loaded || busy !== null || Boolean(active)} onClick={() => void start(mode)}>{busy === mode ? 'Gerando...' : 'Iniciar'} <ArrowRight className="h-4 w-4"/></Button></div></Card>)}</div>

    <Card><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="font-bold">Simulado por tema</h2><p className="mt-1 text-sm text-slate-500">Até 20 questões focadas em um único macrotema. Não há corte oficial neste modo.</p></div><div className="flex flex-col gap-2 sm:flex-row"><select value={theme} onChange={(event) => setTheme(event.target.value as '1'|'2'|'3'|'4')} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5">{Object.entries(themeLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><Button disabled={!loaded || busy !== null || Boolean(active)} onClick={() => void start('theme')}>{busy === 'theme' ? 'Gerando...' : 'Iniciar por tema'}</Button></div></div></Card>

    {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/[0.06] dark:text-rose-200">{error}</div> : null}
    <p className="text-xs leading-5 text-slate-500">Os modos de treino usam o banco autoral local. O treino completo exclui exercícios gerados automaticamente. Nenhum modo certifica preparo ou aprovação na prova. O histórico é salvo neste navegador.</p>
  </div>
}

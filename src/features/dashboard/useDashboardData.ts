import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useProfile } from '../auth/ProfileProvider'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import { dashboardMock } from './mock'

export interface DashboardTopic {
  name: string
  pdCode: string
  weight: number
  progress: number
  accuracy: number
}

export interface DashboardSimulation {
  name: string
  score: string
  date: string
  passed: boolean
}

export interface DashboardData {
  name: string
  certification: string
  progress: number
  questions: number
  accuracy: number
  hours: number
  streak: number
  readiness: number
  topics: DashboardTopic[]
  weak: string[]
  simulations: DashboardSimulation[]
  continueTopic: DashboardTopic | null
  source: 'live' | 'mock'
}

interface CurriculumRow { id: string; pd_code: string; title: string; weight: number | null; item_type: string }
interface ProgressRow { curriculum_item_id: string; progress_percent: number; last_studied_at: string | null }
interface AttemptRow { is_correct: boolean; pd_code: string; attempted_at: string }
interface SessionRow { duration_seconds: number; started_at: string }
interface SimulationAttemptRow { simulation_id: string; score: number | null; passed: boolean | null; completed_at: string | null }
interface SimulationRow { id: string; name: string; question_count: number }

const defaultTopics: DashboardTopic[] = dashboardMock.topics.map((topic, index) => ({
  name: topic.name,
  pdCode: String(index + 1),
  weight: topic.weight,
  progress: 0,
  accuracy: 0,
}))

function calculateStreak(timestamps: string[]) {
  if (!timestamps.length) return 0
  const days = new Set(timestamps.map((value) => new Date(value).toISOString().slice(0, 10)))
  const cursor = new Date()
  cursor.setUTCHours(0, 0, 0, 0)
  const today = cursor.toISOString().slice(0, 10)
  if (!days.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1)
  if (!days.has(cursor.toISOString().slice(0, 10))) return 0

  let streak = 0
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}

function emptyData(name: string, certification: string): DashboardData {
  return {
    name,
    certification,
    progress: 0,
    questions: 0,
    accuracy: 0,
    hours: 0,
    streak: 0,
    readiness: 0,
    topics: defaultTopics,
    weak: [],
    simulations: [],
    continueTopic: defaultTopics[1] ?? defaultTopics[0] ?? null,
    source: 'live',
  }
}

export function useDashboardData() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const certification = profile?.current_certification ?? 'CPA'

  useEffect(() => {
    if (profileLoading) return
    if (!profile || !user) {
      setLoading(false)
      return
    }

    if (!supabaseConfigured) {
      setData({
        ...dashboardMock,
        certification,
        readiness: 61,
        topics: dashboardMock.topics.map((topic, index) => ({ ...topic, pdCode: String(index + 1) })),
        continueTopic: { ...dashboardMock.topics[1], pdCode: '2' },
        source: 'mock',
      })
      setLoading(false)
      return
    }

    let active = true
    const load = async () => {
      setLoading(true)
      setError(null)

      const [curriculumResult, progressResult, attemptsResult, sessionsResult, simulationAttemptsResult, simulationsResult] = await Promise.all([
        supabase.from('curriculum_items').select('id, pd_code, title, weight, item_type').eq('certification_id', certification).order('sort_order'),
        supabase.from('lesson_progress').select('curriculum_item_id, progress_percent, last_studied_at').eq('user_id', user.id),
        supabase.from('question_attempts').select('is_correct, pd_code, attempted_at').eq('user_id', user.id).eq('certification_id', certification),
        supabase.from('study_sessions').select('duration_seconds, started_at').eq('user_id', user.id).eq('certification_id', certification),
        supabase.from('simulation_attempts').select('simulation_id, score, passed, completed_at').eq('user_id', user.id).eq('certification_id', certification).not('completed_at', 'is', null).order('completed_at', { ascending: false }).limit(3),
        supabase.from('simulations').select('id, name, question_count').eq('certification_id', certification),
      ])

      const firstError = [curriculumResult.error, progressResult.error, attemptsResult.error, sessionsResult.error, simulationAttemptsResult.error, simulationsResult.error].find(Boolean)
      if (firstError) throw firstError
      if (!active) return

      const curriculum = (curriculumResult.data ?? []) as CurriculumRow[]
      const progressRows = (progressResult.data ?? []) as ProgressRow[]
      const attempts = (attemptsResult.data ?? []) as AttemptRow[]
      const sessions = (sessionsResult.data ?? []) as SessionRow[]
      const simulationAttempts = (simulationAttemptsResult.data ?? []) as SimulationAttemptRow[]
      const simulations = (simulationsResult.data ?? []) as SimulationRow[]
      const progressMap = new Map(progressRows.map((row) => [row.curriculum_item_id, row.progress_percent]))

      const overallProgress = curriculum.length
        ? Math.round(curriculum.reduce((sum, item) => sum + (progressMap.get(item.id) ?? 0), 0) / curriculum.length)
        : 0
      const accuracy = attempts.length ? Math.round((attempts.filter((item) => item.is_correct).length / attempts.length) * 100) : 0
      const hours = Math.round((sessions.reduce((sum, session) => sum + Math.max(0, session.duration_seconds), 0) / 3600) * 10) / 10
      const streak = calculateStreak([
        ...attempts.map((item) => item.attempted_at),
        ...sessions.map((item) => item.started_at),
        ...progressRows.flatMap((item) => item.last_studied_at ? [item.last_studied_at] : []),
      ])

      const macroRows = curriculum.filter((item) => item.item_type === 'macro')
      const topics = (macroRows.length ? macroRows : defaultTopics.map((topic) => ({ id: '', pd_code: topic.pdCode, title: topic.name, weight: topic.weight, item_type: 'macro' }))).map((macro) => {
        const descendants = curriculum.filter((item) => item.pd_code === macro.pd_code || item.pd_code.startsWith(`${macro.pd_code}.`))
        const topicProgress = descendants.length
          ? Math.round(descendants.reduce((sum, item) => sum + (progressMap.get(item.id) ?? 0), 0) / descendants.length)
          : 0
        const topicAttempts = attempts.filter((attempt) => attempt.pd_code === macro.pd_code || attempt.pd_code.startsWith(`${macro.pd_code}.`))
        const topicAccuracy = topicAttempts.length ? Math.round((topicAttempts.filter((attempt) => attempt.is_correct).length / topicAttempts.length) * 100) : 0
        return { name: macro.title, pdCode: macro.pd_code, weight: macro.weight ?? 0, progress: topicProgress, accuracy: topicAccuracy }
      })

      const weak = topics.filter((topic) => attempts.some((attempt) => attempt.pd_code === topic.pdCode || attempt.pd_code.startsWith(`${topic.pdCode}.`))).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3).map((topic) => topic.name)
      const simulationMap = new Map(simulations.map((simulation) => [simulation.id, simulation]))
      const recentSimulations = simulationAttempts.map((attempt) => {
        const simulation = simulationMap.get(attempt.simulation_id)
        return {
          name: simulation?.name ?? 'Simulado',
          score: `${attempt.score ?? 0}/${simulation?.question_count ?? '?'}`,
          date: attempt.completed_at ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(attempt.completed_at)) : '—',
          passed: Boolean(attempt.passed),
        }
      })
      const simulationPercentages = simulationAttempts.flatMap((attempt) => {
        const simulation = simulationMap.get(attempt.simulation_id)
        return simulation && attempt.score !== null ? [(attempt.score / simulation.question_count) * 100] : []
      })
      const simulationScore = simulationPercentages.length ? simulationPercentages.reduce((sum, value) => sum + value, 0) / simulationPercentages.length : 0
      const readiness = Math.round((overallProgress * 0.35) + (accuracy * 0.35) + (simulationScore * 0.2) + (Math.min(streak / 7, 1) * 100 * 0.1))
      const continueTopic = [...topics].filter((topic) => topic.progress < 100).sort((a, b) => b.weight - a.weight || b.progress - a.progress)[0] ?? null

      setData({
        name: profile.display_name,
        certification,
        progress: overallProgress,
        questions: attempts.length,
        accuracy,
        hours,
        streak,
        readiness,
        topics,
        weak,
        simulations: recentSimulations,
        continueTopic,
        source: 'live',
      })
      setLoading(false)
    }

    void load().catch((cause: unknown) => {
      if (!active) return
      setError(cause instanceof Error ? cause.message : 'Falha ao carregar o dashboard.')
      setData(emptyData(profile.display_name, certification))
      setLoading(false)
    })

    return () => { active = false }
  }, [certification, profile, profileLoading, user])

  return useMemo(() => ({ data, loading: loading || profileLoading, error }), [data, loading, profileLoading, error])
}

import { courseModules, matchesModule } from '../../../content/cpa/course/modules'
import { moduleReadings } from '../../../content/cpa/course/readings'
import type { CourseProgress } from '../storage/repositories/courseRepository'
import type { QuestionAttemptRecord, SimulationRecord } from '../storage/types'
import { practiceEvidence, reliableSimulation } from '../qualityEvidence'
export type ModuleState = 'not_started' | 'in_progress' | 'completed' | 'review' | 'mastered'
export const moduleStateLabels: Record<ModuleState,string> = {not_started:'Não iniciado',in_progress:'Em andamento',completed:'Concluído',review:'Precisa revisar',mastered:'Dominado'}
export const MASTERY_RULE = 'Leitura e simulado concluídos, pelo menos 12 questões distintas revisadas, prática em 3 dias com intervalo mínimo de 7 dias, acerto recente ≥80%, duas práticas recentes com ≥80% e última evidência nos últimos 30 dias.'
export function buildModuleProgress(progress: Record<string,CourseProgress>, simulations: SimulationRecord[], attempts: QuestionAttemptRecord[], now=new Date()) {
  const evidence = practiceEvidence(attempts,simulations)
  return courseModules.map(module => {
    const read = progress[module.id]?.readSections.length ?? 0
    const total = moduleReadings[module.id].sections.length
    const exams = simulations.filter(s => s.payload.moduleId === module.id && s.completedAt).sort((a,b)=>b.completedAt!.localeCompare(a.completedAt!))
    const samples = evidence.filter(row => matchesModule(module,row.pdCode) && Date.parse(row.at) <= now.getTime())
    const recent = samples.filter(row => now.getTime()-Date.parse(row.at)<=30*86400000)
    // One vote per question, using its latest answer: repeating one easy question cannot inflate mastery.
    const unique = [...new Map(recent.map(row => [row.questionId,row])).values()]
    const accuracy = unique.length ? Math.round(unique.filter(row=>row.correct).length/unique.length*100) : null
    const recentDays = [...new Set(recent.map(row=>new Date(row.at).toLocaleDateString('sv-SE')))]
    const daily = recentDays.slice(-2).map(day=>recent.filter(row=>new Date(row.at).toLocaleDateString('sv-SE')===day)).map(rows=>[...new Map(rows.map(row=>[row.questionId,row])).values()])
    const completed = read === total && exams.length>0
    const lastAt = samples.at(-1)?.at ?? null
    const span = recentDays.length ? (Date.parse(recentDays.at(-1)!)-Date.parse(recentDays[0]))/86400000 : 0
    const latestExam = exams.find(reliableSimulation)?.payload.result
    const poorExam = latestExam && latestExam.scorePercent < 70
    const stale = lastAt !== null && now.getTime()-Date.parse(lastAt)>30*86400000
    const mastered = completed && Boolean(latestExam && latestExam.scorePercent >= 70) && !poorExam && !stale && unique.length>=12 && recentDays.length>=3 && span>=7 && (accuracy??0)>=80 && daily.length===2 && daily.every(rows=>rows.length>=3 && rows.filter(row=>row.correct).length/rows.length>=.8)
    const needsReview = Boolean(poorExam || (unique.length>=3 && (accuracy??100)<70) || (completed && stale))
    const state: ModuleState = mastered?'mastered':needsReview?'review':completed?'completed':read>0||samples.length||exams.length?'in_progress':'not_started'
    return {module,read,total,completed,state,accuracy,distinct:unique.length,practiceDays:recentDays.length,lastAt,exam:exams[0]??null,needsReview}
  })
}
export type ModuleProgress = ReturnType<typeof buildModuleProgress>[number]
export function nextModule(rows: ModuleProgress[]) { return rows.find(row=>!row.completed && row.read>0) ?? rows.find(row=>!row.completed) ?? rows.find(row=>row.needsReview) ?? rows[0] }

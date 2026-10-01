import type { CPAFlashcard } from '../../../content/cpa/flashcards'
import { cpaQuestions } from '../../../content/cpa/questions'
import { isReviewed } from '../../../content/cpa/questions/quality'
import type { CPAQuestion } from '../../../content/cpa/questions/types'
import { matchesModule } from '../../../content/cpa/course/modules'
import { moduleReadings } from '../../../content/cpa/course/readings'
import { nextModule, type ModuleProgress } from '../course/progress'
import { getLatestFlashcardState } from '../review/flashcardEngine'
import { practiceEvidence, reliableError } from '../qualityEvidence'
import type { ErrorRecord, FlashcardReviewRecord, QuestionAttemptRecord, SimulationRecord } from '../storage/types'
import type { CourseProgress } from '../storage/repositories/courseRepository'
export type DailyKind = 'today' | 'review'
export type DailyStep =
  | { id:string;type:'reading';moduleId:string;sectionId:string;reason:string;minutes:number }
  | { id:string;type:'question';question:CPAQuestion;reason:string;minutes:number;errorId?:string }
  | { id:string;type:'flashcard';card:CPAFlashcard;reason:string;minutes:number }
export interface DailySession { version:1; date:string;kind:DailyKind;steps:DailyStep[];index:number;done:string[];skipped:string[];createdAt:string;updatedAt:string }
export interface DailyInput { modules:ModuleProgress[]; progress:Record<string,CourseProgress>; attempts:QuestionAttemptRecord[]; simulations:SimulationRecord[]; errors:ErrorRecord[];cards:CPAFlashcard[];reviews:FlashcardReviewRecord[];budget:number;now?:Date }
export function buildDailySteps(input:DailyInput,kind:DailyKind):DailyStep[] {
  const now=input.now??new Date()
  const samples=practiceEvidence(input.attempts,input.simulations)
  const last=new Map(samples.map(row=>[row.questionId,row]))
  const reliable=cpaQuestions.filter(isReviewed)
  const questions=new Map(reliable.map(q=>[q.id,q]))
  const buckets:DailyStep[][]=[[],[],[],[]]
  const used=new Set<string>()
  function pushQuestion(bucket:number,q:CPAQuestion,reason:string,errorId?:string) {
    if(used.has(q.id))return
    used.add(q.id);buckets[bucket].push({id:`question:${q.id}`,type:'question',question:q,reason,minutes:2,...(errorId?{errorId}:{})})
  }
  for(const e of input.errors.filter(e=>!e.resolvedAt&&reliableError(e)).sort((a,b)=>(b.errorCount??1)-(a.errorCount??1))) {
    const q=questions.get(e.questionId??e.sourceId)
    if(q)pushQuestion(0,q,'Retomar um erro pendente',e.id)
  }
  for(const card of input.cards) {
    const state=getLatestFlashcardState(card.id,input.reviews,now)
    if(state.due)buckets[1].push({id:`flashcard:${card.id}`,type:'flashcard',card,reason:state.reviewCount?'Flashcard previsto ou vencido':'Recordar um conceito do módulo iniciado',minutes:1})
  }
  for(const sample of [...last.values()].filter(row=>now.getTime()-Date.parse(row.at)>=7*86400000).sort((a,b)=>a.at.localeCompare(b.at))) {
    const q=questions.get(sample.questionId)
    if(q)pushQuestion(3,q,`Revisão espaçada: ${Math.floor((now.getTime()-Date.parse(sample.at))/86400000)} dias desde a última resposta`)
  }
  for(const row of input.modules.filter(row=>row.needsReview)) {
    const candidates=reliable.filter(q=>matchesModule(row.module,q.pdCode)).sort((a,b)=>Number(last.has(a.id))-Number(last.has(b.id))||(last.get(a.id)?.at??'').localeCompare(last.get(b.id)?.at??'')||a.id.localeCompare(b.id))
    for(const q of candidates)pushQuestion(2,q,`Reforçar ${row.module.title}`)
  }
  const budget=Math.max(10,Math.min(kind==='review'?20:120,input.budget))
  const steps:DailyStep[]=[];let minutes=0
  if(kind==='today') {
    const row=nextModule(input.modules)
    const sections=moduleReadings[row.module.id].sections.filter(s=>!input.progress[row.module.id]?.readSections.includes(s.id))
    for(const section of sections.slice(0,Math.max(1,Math.min(4,Math.floor(budget/10))))) {
      steps.push({id:`reading:${row.module.id}:${section.id}`,type:'reading',moduleId:row.module.id,sectionId:section.id,reason:`Continuar ${row.module.title}`,minutes:4});minutes+=4
    }
    // Unseen practice from the current module joins the mixed session after reading.
    const candidates=reliable.filter(q=>matchesModule(row.module,q.pdCode)).sort((a,b)=>Number(last.has(a.id))-Number(last.has(b.id))||(last.get(a.id)?.at??'').localeCompare(last.get(b.id)?.at??'')||a.id.localeCompare(b.id))
    for(const q of candidates.slice(0,Math.max(3,Math.min(12,Math.floor(budget/8)))))pushQuestion(2,q,`Praticar ${row.module.title}`)
  }
  // Round-robin prevents a large error backlog from crowding out spaced recall.
  while(buckets.some(bucket=>bucket.length)) {
    let added=false
    for(const bucket of buckets) {
      const step=bucket.shift()
      if(step&&minutes+step.minutes<=budget) {steps.push(step);minutes+=step.minutes;added=true}
    }
    if(!added&&buckets.every(bucket=>!bucket.some(step=>minutes+step.minutes<=budget)))break
  }
  return steps
}

import { cpaQuestionMap } from '../../../content/cpa/questions'
import type { ErrorRecord, LessonProgressRecord, QuestionAttemptRecord, QuizAttemptRecord, SimulationRecord, StudySessionRecord } from '../storage/types'

export interface AccuracyBucket { label:string; correct:number; total:number; percent:number }
export interface PdAnalytics { pdCode:string; title:string; correct:number; total:number; percent:number; errors:number; severity:'low'|'medium'|'high' }
export interface DailyAnalytics { date:string; questions:number; correct:number; accuracy:number|null; studyMinutes:number }
export interface AnalyticsSnapshot {
  uniqueQuestions:number
  firstAttemptAccuracy:number|null
  repeatAccuracy:number|null
  repeatAttempts:number
  totalAnswered:number
  totalCorrect:number
  overallAccuracy:number|null
  recentAccuracy:number|null
  lessonsStudied:number
  quizAverage:number|null
  studyMinutes:number
  simulationAverage:number|null
  byMacro:AccuracyBucket[]
  byDifficulty:AccuracyBucket[]
  pdHeatmap:PdAnalytics[]
  recurrentErrors:Array<{questionId:string;pdCode:string|null;prompt:string;count:number}>
  daily:DailyAnalytics[]
  simulationTrend:Array<{date:string;score:number;label:string}>
}

function pct(correct:number,total:number){return total?Math.round(correct/total*100):null}
function localDate(iso:string){return new Date(iso).toLocaleDateString('sv-SE')}

export function buildAnalyticsSnapshot(input:{
  attempts:QuestionAttemptRecord[]
  errors:ErrorRecord[]
  simulations:SimulationRecord[]
  sessions:StudySessionRecord[]
  lessons:LessonProgressRecord[]
  quizzes:QuizAttemptRecord[]
  now?:Date
}):AnalyticsSnapshot{
  const now=input.now??new Date()
  const cutoff=new Date(now)
  cutoff.setDate(cutoff.getDate()-30)
  const recent=input.attempts.filter((attempt)=>new Date(attempt.answeredAt)>=cutoff)

  const byMacroMap=new Map<string,{correct:number;total:number}>()
  const byDifficultyMap=new Map<string,{correct:number;total:number}>()
  const pdMap=new Map<string,{correct:number;total:number}>()

  const addSample=(pdCode:string,difficulty:string,isCorrect:boolean)=>{
    const macro=pdCode.split('.')[0]
    const m=byMacroMap.get(macro)??{correct:0,total:0};m.total+=1;if(isCorrect)m.correct+=1;byMacroMap.set(macro,m)
    const d=byDifficultyMap.get(difficulty)??{correct:0,total:0};d.total+=1;if(isCorrect)d.correct+=1;byDifficultyMap.set(difficulty,d)
    const p=pdMap.get(pdCode)??{correct:0,total:0};p.total+=1;if(isCorrect)p.correct+=1;pdMap.set(pdCode,p)
  }

  for(const attempt of input.attempts){
    const question=attempt.questionSnapshot??cpaQuestionMap.get(attempt.questionId)
    addSample(attempt.pdCode,question?.difficulty??'medium',attempt.isCorrect)
  }
  for(const simulation of input.simulations){
    for(const row of simulation.payload.result?.questionResults??[])addSample(row.pdCode,row.difficulty,row.isCorrect)
  }

  const errorCounts=new Map<string,number>()
  for(const error of input.errors){
    if(!error.pdCode)continue
    errorCounts.set(error.pdCode,(errorCounts.get(error.pdCode)??0)+Math.max(1,error.errorCount??error.wrongCount??1))
  }

  const pdHeatmap=[...pdMap.entries()].map(([pdCode,stats])=>{
    const errors=errorCounts.get(pdCode)??0
    const percent=pct(stats.correct,stats.total)??0
    const title=Array.from(cpaQuestionMap.values()).find((question)=>question.pdCode===pdCode)?.topic??pdCode
    const severity:PdAnalytics['severity']=stats.total>=3&&percent<55?'high':stats.total>=2&&percent<75?'medium':'low'
    return{pdCode,title,correct:stats.correct,total:stats.total,percent,errors,severity}
  }).sort((a,b)=>{
    const rank={high:0,medium:1,low:2}
    return rank[a.severity]-rank[b.severity]||a.percent-b.percent||b.total-a.total
  })

  const dailyMap=new Map<string,{questions:number;correct:number;studyMinutes:number}>()
  for(const attempt of input.attempts){
    const date=localDate(attempt.answeredAt)
    const row=dailyMap.get(date)??{questions:0,correct:0,studyMinutes:0}
    row.questions+=1
    if(attempt.isCorrect)row.correct+=1
    dailyMap.set(date,row)
  }
  for(const session of input.sessions){
    const date=localDate(session.startedAt)
    const row=dailyMap.get(date)??{questions:0,correct:0,studyMinutes:0}
    row.studyMinutes+=Math.round(session.activeSeconds/60)
    dailyMap.set(date,row)
  }

  const start=new Date(now)
  start.setDate(start.getDate()-29)
  const daily:DailyAnalytics[]=[]
  for(let i=0;i<30;i++){
    const day=new Date(start)
    day.setDate(start.getDate()+i)
    const date=day.toLocaleDateString('sv-SE')
    const row=dailyMap.get(date)??{questions:0,correct:0,studyMinutes:0}
    daily.push({date,questions:row.questions,correct:row.correct,accuracy:pct(row.correct,row.questions),studyMinutes:row.studyMinutes})
  }

  const completedSims=[...input.simulations].filter((simulation)=>simulation.completedAt&&simulation.score!==null)
  const simulationTrend=[...completedSims]
    .sort((a,b)=>(a.completedAt??'').localeCompare(b.completedAt??''))
    .slice(-12)
    .map((simulation)=>({date:simulation.completedAt!,score:simulation.score!,label:simulation.payload.label}))

  const recurrentErrors=input.errors
    .filter((error)=>(error.errorCount??error.wrongCount??1)>=2)
    .map((error)=>({questionId:error.questionId??error.sourceId,pdCode:error.pdCode,prompt:error.prompt,count:error.errorCount??error.wrongCount??1}))
    .sort((a,b)=>b.count-a.count)
    .slice(0,10)

  const seen = new Set<string>()
  const firstAttempts: QuestionAttemptRecord[] = []
  const repeats: QuestionAttemptRecord[] = []
  for (const attempt of [...input.attempts].sort((a,b)=>a.answeredAt.localeCompare(b.answeredAt))) {
    if (seen.has(attempt.questionId)) repeats.push(attempt)
    else { seen.add(attempt.questionId); firstAttempts.push(attempt) }
  }

  const totalCorrect=input.attempts.filter((attempt)=>attempt.isCorrect).length
  const lessonsStudied=input.lessons.filter((lesson)=>lesson.status==='completed'||lesson.status==='mastered').length
  const quizAverage=input.quizzes.length?Math.round(input.quizzes.reduce((sum,quiz)=>sum+quiz.score,0)/input.quizzes.length):null
  const studyMinutes=Math.round(input.sessions.reduce((sum,session)=>sum+session.activeSeconds,0)/60)
  const simulationAverage=completedSims.length?Math.round(completedSims.reduce((sum,simulation)=>sum+(simulation.score??0),0)/completedSims.length):null

  const macroNames:Record<string,string>={'1':'Tema 1','2':'Tema 2','3':'Tema 3','4':'Tema 4'}
  const byMacro=['1','2','3','4'].map((key)=>{
    const value=byMacroMap.get(key)??{correct:0,total:0}
    return{label:macroNames[key],...value,percent:pct(value.correct,value.total)??0}
  })
  const difficultyNames:Record<string,string>={easy:'Fácil',medium:'Médio',hard:'Difícil'}
  const byDifficulty=['easy','medium','hard'].map((key)=>{
    const value=byDifficultyMap.get(key)??{correct:0,total:0}
    return{label:difficultyNames[key],...value,percent:pct(value.correct,value.total)??0}
  })

  return{
    uniqueQuestions: seen.size,
    firstAttemptAccuracy: pct(firstAttempts.filter((row)=>row.isCorrect).length, firstAttempts.length),
    repeatAccuracy: pct(repeats.filter((row)=>row.isCorrect).length, repeats.length),
    repeatAttempts: repeats.length,
    totalAnswered:input.attempts.length,
    totalCorrect,
    overallAccuracy:pct(totalCorrect,input.attempts.length),
    recentAccuracy:pct(recent.filter((attempt)=>attempt.isCorrect).length,recent.length),
    lessonsStudied,
    quizAverage,
    studyMinutes,
    simulationAverage,
    byMacro,
    byDifficulty,
    pdHeatmap,
    recurrentErrors,
    daily,
    simulationTrend,
  }
}

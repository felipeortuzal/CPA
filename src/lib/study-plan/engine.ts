import { calendarDate } from './validation'
import { toLocalDateKey } from '../storage/repositories/activityRepository'
import type { StudyEngineSnapshot, StudyRecommendation, WeakTopic } from '../study-engine/types'
import type { ExamStudyPlan, ExamStudyPlanSettings, PaceStatus, PhaseSummary, PlannedTask, StudyPlanDay, StudyPlanPhase } from './types'

const DAY_MS=86_400_000
const PHASES:StudyPlanPhase[]=['fundamentals','coverage','practice','consolidation','simulations','final_review']
export const PHASE_META:Record<StudyPlanPhase,{label:string;purpose:string}>={
  fundamentals:{label:'Fundamentos',purpose:'Firmar a base e corrigir lacunas essenciais antes de acelerar.'},
  coverage:{label:'Cobertura',purpose:'Avançar pelo Programa Detalhado priorizando peso oficial e lacunas reais.'},
  practice:{label:'Prática',purpose:'Transformar conteúdo estudado em acerto de questão.'},
  consolidation:{label:'Consolidação',purpose:'Revisar pontos fracos, erros e flashcards vencidos.'},
  simulations:{label:'Simulados',purpose:'Aumentar exposição a blocos e Modo Prova, com correção posterior.'},
  final_review:{label:'Revisão final',purpose:'Reduzir matéria nova e revisar erros, flashcards e temas de maior risco.'},
}

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value))}
function parseDate(value:string){return new Date(`${value}T12:00:00.000Z`)}
function dateKey(value:Date){return value.toISOString().slice(0,10)}
function addDays(value:Date,days:number){return new Date(value.getTime()+days*DAY_MS)}
function calendarDays(from:Date,to:Date){return Math.max(0,Math.ceil((to.getTime()-from.getTime())/DAY_MS))}
function isStudyDay(date:Date,weekdays:number[]){return weekdays.includes(date.getUTCDay())}
function normalizeWeekdays(values:number[]){return [...new Set(values.filter((value)=>Number.isInteger(value)&&value>=0&&value<=6))].sort((a,b)=>a-b)}

export function normalizeStudyPlanSettings(settings:ExamStudyPlanSettings):ExamStudyPlanSettings{
  const weekdays=normalizeWeekdays(settings.availableWeekdays)
  const examDate=calendarDate(settings.examDate)?settings.examDate:null
  const startDate=calendarDate(settings.startDate)?settings.startDate:null
  return{...settings,examDate,startDate,availableWeekdays:weekdays.length?weekdays:[1,2,3,4,5],minutesPerDay:clamp(Math.round(Number.isFinite(settings.minutesPerDay)?settings.minutesPerDay:30),5,600)}
}

function studyDates(settings:ExamStudyPlanSettings,now:Date){
  const normalized=normalizeStudyPlanSettings(settings)
  const today=parseDate(toLocalDateKey(now))
  const configuredStart=normalized.startDate?parseDate(normalized.startDate):today
  const start=configuredStart>today?configuredStart:today
  const result:string[]=[]
  if(normalized.examDate){
    const exam=parseDate(normalized.examDate)
    for(let cursor=start;cursor<exam&&cursor<addDays(today,366);cursor=addDays(cursor,1))if(isStudyDay(cursor,normalized.availableWeekdays))result.push(dateKey(cursor))
    return result
  }
  let cursor=start
  while(result.length<14){if(isStudyDay(cursor,normalized.availableWeekdays))result.push(dateKey(cursor));cursor=addDays(cursor,1)}
  return result
}

function expectedProgress(settings:ExamStudyPlanSettings,studyDatesCount:number,now:Date){
  if(!settings.examDate||!settings.startDate)return null
  const start=parseDate(settings.startDate),exam=parseDate(settings.examDate),today=parseDate(toLocalDateKey(now))
  if(today<=start)return 0
  if(today>=exam)return 100
  const total=Math.max(1,calendarDays(start,exam))
  const elapsed=calendarDays(start,today)
  const calendarRatio=elapsed/total*100
  const pressure=studyDatesCount<=7?12:studyDatesCount<=30?6:0
  return clamp(calendarRatio+pressure,0,100)
}

function paceOf(settings:ExamStudyPlanSettings,study:StudyEngineSnapshot,studyDatesCount:number,now:Date):PaceStatus{
  if(!settings.examDate)return'continuous'
  const expected=expectedProgress(settings,studyDatesCount,now)
  if(expected===null)return'on_track'
  const actual=(study.coveragePercent*.55)+(study.overallMastery*.45)
  if(actual>=expected+12)return'ahead'
  if(actual<=expected-12)return'behind'
  return'on_track'
}

function phaseWeights(days:number,study:StudyEngineSnapshot,pace:PaceStatus){
  let weights=days<=10?[.08,.10,.16,.18,.28,.20]:days<=35?[.10,.18,.22,.18,.20,.12]:[.14,.24,.20,.16,.16,.10]
  if(study.coveragePercent>=60||pace==='ahead')weights=[.06,.12,.22,.18,.27,.15]
  else if(pace==='behind')weights=[.12,.28,.22,.15,.15,.08]
  if(study.falseConfidencePdCodes.length>=3)weights=[weights[0],weights[1]-.03,weights[2]+.05,weights[3]+.03,weights[4],Math.max(.05,weights[5]-.05)]
  const total=weights.reduce((a,b)=>a+b,0)
  return weights.map((weight)=>weight/total)
}

function allocatePhaseDays(totalDays:number,weights:number[]){
  if(totalDays<=0)return PHASES.map(()=>0)
  const raw=weights.map((weight)=>weight*totalDays)
  const minimum=totalDays>=PHASES.length?1:0
  const allocation=raw.map((value)=>Math.max(minimum,Math.floor(value)))
  while(allocation.reduce((a,b)=>a+b,0)>totalDays){
    let index=-1,best=-Infinity
    for(let i=0;i<allocation.length;i++){if(allocation[i]<=minimum)continue;const excess=allocation[i]-raw[i];if(excess>best){best=excess;index=i}}
    if(index<0)break
    allocation[index]-=1
  }
  while(allocation.reduce((a,b)=>a+b,0)<totalDays){
    let index=0,best=-Infinity
    for(let i=0;i<allocation.length;i++){const remainder=raw[i]-allocation[i];if(remainder>best){best=remainder;index=i}}
    allocation[index]+=1
  }
  return allocation
}

function rollingPhase(study:StudyEngineSnapshot,index:number):StudyPlanPhase{
  if(study.coveragePercent<20)return index%3===2?'practice':'fundamentals'
  if(study.coveragePercent<60)return ['coverage','practice','consolidation'][index%3] as StudyPlanPhase
  return ['practice','consolidation','simulations'][index%3] as StudyPlanPhase
}

function phaseForDay(index:number,allocations:number[]){
  let cursor=0
  for(let i=0;i<allocations.length;i++){cursor+=allocations[i];if(index<cursor)return PHASES[i]}
  return'final_review' as StudyPlanPhase
}

function makeTask(type:PlannedTask['type'],title:string,description:string,minutes:number,route:string,pdCode:string|null=null,index=0):PlannedTask{
  return{id:`${type}:${pdCode??'general'}:${index}`,type,title,description,minutes,route,pdCode}
}

function recommendationTask(item:StudyRecommendation,minutes:number,index:number):PlannedTask{
  const type=item.kind==='recover_error'?'errors':item.kind==='learn'?'learn':item.kind==='review'?'review':'practice'
  return makeTask(type,item.title,item.reason,minutes,item.route,item.pdCode,index)
}
function weakTask(item:WeakTopic,minutes:number,index:number):PlannedTask{return makeTask('practice',item.title,item.reason,minutes,item.route,item.pdCode,index)}
function simulationTask(minutesPerDay:number,index:number,full:boolean):PlannedTask{
  const minutes=full&&minutesPerDay>=150?150:minutesPerDay>=60?60:Math.min(30,minutesPerDay)
  const title=full&&minutesPerDay>=150?'Modo Prova CPA':'Bloco de simulado'
  const description=full&&minutesPerDay>=150?'Faça uma prova completa de 50 questões e revise os erros depois.':'Use um Simulado 10/20 ou bloco focado e corrija o desempenho no mesmo ciclo.'
  return makeTask('simulation',title,description,minutes,'/simulados',null,index)
}

function tasksForDay(phase:StudyPlanPhase,dayIndex:number,minutesPerDay:number,study:StudyEngineSnapshot,daysUntilExam:number|null){
  const tasks:PlannedTask[]=[]
  let remaining=minutesPerDay
  const push=(task:PlannedTask)=>{if(remaining<5)return;const minutes=Math.min(task.minutes,remaining);tasks.push({...task,minutes});remaining-=minutes}
  const rec=study.recommendations[dayIndex%Math.max(1,study.recommendations.length)]
  const weak=study.weakTopics[dayIndex%Math.max(1,study.weakTopics.length)]
  const nearExam=daysUntilExam!==null&&daysUntilExam<=14

  if(phase==='fundamentals'){
    if(rec)push(recommendationTask(rec,Math.min(30,remaining),dayIndex))
    else push(makeTask('learn','Cobertura guiada do Programa Detalhado','Abra a trilha e avance no próximo conteúdo disponível.',Math.min(30,remaining),'/trilha',null,dayIndex))
    if(remaining>=10)push(makeTask('flashcards','Revisão curta de flashcards','Consolide o que já foi ativado sem substituir prática de questões.',Math.min(15,remaining),'/flashcards',null,dayIndex))
  }else if(phase==='coverage'){
    if(rec)push(recommendationTask(rec,Math.min(35,remaining),dayIndex))
    if(remaining>=15&&weak)push(weakTask(weak,Math.min(25,remaining),dayIndex+100))
    if(remaining>=10)push(makeTask('review','Fechar lacunas do dia','Revise erros ou dúvidas antes de encerrar o bloco.',Math.min(15,remaining),'/revisao',null,dayIndex))
  }else if(phase==='practice'){
    if(weak)push(weakTask(weak,Math.min(35,remaining),dayIndex))
    else if(rec)push(recommendationTask(rec,Math.min(35,remaining),dayIndex))
    else push(makeTask('practice','Questões CPA','Treine o banco local priorizando temas com menor domínio.',Math.min(35,remaining),'/questoes',null,dayIndex))
    if(remaining>=10)push(makeTask('errors','Caderno de Erros','Corrija padrões de erro e marque o que ainda gera dúvida.',Math.min(20,remaining),'/erros',null,dayIndex))
  }else if(phase==='consolidation'){
    push(makeTask('review','Central de Revisão','Trabalhe revisões vencidas, dúvidas e falsa confiança.',Math.min(25,remaining),'/revisao',null,dayIndex))
    if(remaining>=10)push(makeTask('flashcards','Flashcards vencidos','Revise cartões previstos para hoje.',Math.min(20,remaining),'/flashcards',null,dayIndex))
    if(remaining>=10&&weak)push(weakTask(weak,Math.min(20,remaining),dayIndex+200))
  }else if(phase==='simulations'){
    push(simulationTask(minutesPerDay,dayIndex,nearExam||dayIndex%2===0))
    if(remaining>=10)push(makeTask('errors','Correção do simulado','Use o Caderno de Erros para transformar a tentativa em revisão ativa.',Math.min(25,remaining),'/erros',null,dayIndex))
  }else{
    push(makeTask('errors','Erros prioritários','Comece pelos erros recorrentes e dúvidas ainda abertas.',Math.min(25,remaining),'/erros',null,dayIndex))
    if(remaining>=10)push(makeTask('flashcards','Flashcards de revisão final','Recupere conceitos já estudados; não introduza matéria nova.',Math.min(20,remaining),'/flashcards',null,dayIndex))
    if(remaining>=20&&dayIndex%2===0)push(simulationTask(remaining,dayIndex,false))
  }
  if(tasks.length===0)tasks.push(makeTask('review','Revisão curta','Faça uma revisão curta do conteúdo já estudado.',Math.min(remaining||minutesPerDay,minutesPerDay),'/revisao',null,dayIndex))
  return tasks
}

export function generateExamStudyPlan(settingsInput:ExamStudyPlanSettings,study:StudyEngineSnapshot,now=new Date()):ExamStudyPlan{
  const settings=normalizeStudyPlanSettings(settingsInput)
  const dates=studyDates(settings,now)
  const exam=settings.examDate?parseDate(settings.examDate):null
  const daysUntilExam=exam?calendarDays(parseDate(toLocalDateKey(now)),exam):null
  const paceStatus=paceOf(settings,study,dates.length,now)
  const allocations=settings.examDate?allocatePhaseDays(dates.length,phaseWeights(dates.length,study,paceStatus)):PHASES.map(()=>0)
  const agenda:StudyPlanDay[]=dates.map((date,index)=>{
    const phase=settings.examDate?phaseForDay(index,allocations):rollingPhase(study,index)
    const tasks=tasksForDay(phase,index,settings.minutesPerDay,study,daysUntilExam)
    return{date,phase,phaseLabel:PHASE_META[phase].label,minutes:tasks.reduce((sum,task)=>sum+task.minutes,0),tasks}
  })
  const phases:PhaseSummary[]=settings.examDate?(()=>{
    let offset=0
    return PHASES.map((phase,index)=>{const count=allocations[index];const slice=dates.slice(offset,offset+count);offset+=count;return{phase,...PHASE_META[phase],days:count,startDate:slice[0]??null,endDate:slice.at(-1)??null}})
  })():PHASES.map((phase)=>{const matching=agenda.filter((day)=>day.phase===phase);return{phase,...PHASE_META[phase],days:matching.length,startDate:matching[0]?.date??null,endDate:matching.at(-1)?.date??null}})
  const currentPhase=agenda[0]?.phase??(settings.examDate?'final_review':'fundamentals')
  const paceMessage=paceStatus==='ahead'?'Você está adiantado em relação ao tempo restante; o plano desloca mais minutos para prática, consolidação e simulados.':paceStatus==='behind'?'Você está atrasado em relação ao tempo restante; o plano comprime cobertura e prioriza os PDs de maior impacto sem abandonar prática.':paceStatus==='continuous'?'Sem data definida: o plano funciona em janela móvel de 14 sessões e se recalcula conforme seu progresso.':'Seu ritmo está compatível com o tempo restante até a prova.'
  const recommendationBasis=[
    `Cobertura atual: ${study.coveragePercent}%`,
    ...(daysUntilExam!==null&&daysUntilExam>366?['Agenda limitada aos próximos 366 dias; recalculada a cada acesso.']:[]),
    `Domínio ponderado: ${study.overallMastery}%`,
    study.readinessScore===null?'Prontidão: dados insuficientes':`Prontidão interna: ${study.readinessScore}%`,
    `${study.weakTopics.length} ponto(s) fraco(s) priorizado(s)`,
    `${study.dueReviews} revisão(ões) vencida(s)`,
  ]
  return{generatedAt:now.toISOString(),settings,daysUntilExam,availableStudyDays:dates.length,paceStatus,paceMessage,currentPhase,phases,agenda,plannedMinutes:agenda.reduce((sum,day)=>sum+day.minutes,0),simulationDays:agenda.filter((day)=>day.tasks.some((task)=>task.type==='simulation')).length,recommendationBasis}
}

import { cpaCurriculum } from '../../../content/cpa/curriculum'
import type { CurriculumUnit } from '../../../content/cpa/schema'
import type { StudyEngineInput, StudyEngineSnapshot, PDMastery, StudyRecommendation, StudyRecommendationKind } from './types'

const DAY_MS = 86_400_000

function clamp(value:number,min=0,max=100){return Math.max(min,Math.min(max,value))}
function daysBetween(from:string,to:Date){return Math.max(0,(to.getTime()-new Date(from).getTime())/DAY_MS)}
function latest(values:(string|null|undefined)[]){return values.filter((value):value is string=>Boolean(value)).sort().at(-1)??null}
function macroCodeOf(pdCode:string){return pdCode.split('.')[0]}
function reviewInterval(score:number){if(score<35)return 1;if(score<50)return 2;if(score<65)return 4;if(score<75)return 7;if(score<85)return 10;if(score<95)return 14;return 30}
function levelOf(score:number):PDMastery['level']{if(score===0)return'new';if(score<40)return'weak';if(score<65)return'developing';if(score<85)return'strong';return'mastered'}
function retentionFactor(lastEvidenceAt:string|null,now:Date){if(!lastEvidenceAt)return 0;const days=daysBetween(lastEvidenceAt,now);if(days<=7)return 1;if(days<=14)return .96;if(days<=30)return .9;if(days<=60)return .82;return .72}

function terminalUnits(items:CurriculumUnit[]){
  const parents=new Set(items.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
  return items.filter((item)=>!parents.has(item.pdCode))
}

function statusSignal(status:string|undefined){
  if(status==='mastered')return 90
  if(status==='completed')return 70
  if(status==='in_progress')return 30
  return null
}

export function calculatePdMastery(unit:CurriculumUnit,input:StudyEngineInput):PDMastery{
  const now=input.now??new Date()
  const progress=input.lessonProgress.find((row)=>row.pdCode===unit.pdCode)
  const quizzes=input.quizAttempts.filter((row)=>row.pdCode===unit.pdCode)
  const direct=input.questionAttempts
    .filter((row)=>row.pdCode===unit.pdCode)
    .map((row)=>({isCorrect:row.isCorrect,at:row.answeredAt}))
  const simulationSamples=input.simulations.flatMap((simulation)=>{
    if(!simulation.completedAt||!simulation.payload.result)return[]
    return simulation.payload.result.questionResults
      .filter((row)=>row.pdCode===unit.pdCode&&row.selectedAnswer!==null)
      .map((row)=>({isCorrect:row.isCorrect,at:simulation.completedAt!}))
  })
  const practice=[...direct,...simulationSamples].sort((a,b)=>b.at.localeCompare(a.at)).slice(0,12)
  const practiceAttempts=practice.length
  const practiceAccuracy=practiceAttempts?Math.round(practice.filter((row)=>row.isCorrect).length/practiceAttempts*100):null
  const confidenceFactor=Math.min(1,practiceAttempts/5)
  const status=statusSignal(progress?.status)
  const bestQuiz=progress?.quizBestScore??(quizzes.length?Math.max(...quizzes.map((row)=>row.score)):null)
  let knowledge:number|null=null
  if(status!==null&&bestQuiz!==null)knowledge=Math.round(status*.4+bestQuiz*.6)
  else if(status!==null)knowledge=status
  else if(bestQuiz!==null)knowledge=bestQuiz

  let base=0
  if(knowledge!==null&&practiceAccuracy!==null){
    const practiceReliability=.7+.3*confidenceFactor
    base=knowledge*.45+practiceAccuracy*.55*practiceReliability
  }else if(knowledge!==null){
    base=knowledge*.85
  }else if(practiceAccuracy!==null){
    base=practiceAccuracy*(.7+.3*confidenceFactor)
  }

  const unresolved=input.errors.filter((error)=>error.pdCode===unit.pdCode&&!error.resolvedAt)
  const errorWeight=unresolved.reduce((sum,error)=>sum+(error.wrongCount??1),0)
  const errorPenalty=errorWeight?Math.min(18,5+Math.max(0,errorWeight-1)*2):0
  const doubtPenalty=progress?.hasDoubt?5:0
  const lastEvidenceAt=latest([
    progress?.lastStudiedAt,
    ...quizzes.map((row)=>row.completedAt),
    ...practice.map((row)=>row.at),
    ...unresolved.map((row)=>row.lastWrongAt??row.createdAt),
  ])
  const score=Math.round(clamp(base*retentionFactor(lastEvidenceAt,now)-errorPenalty-doubtPenalty))
  const interval=reviewInterval(score)
  const nextReviewAt=lastEvidenceAt?new Date(new Date(lastEvidenceAt).getTime()+interval*DAY_MS).toISOString():null
  const evidenceCount=(progress?1:0)+quizzes.length+practiceAttempts
  let confidence=0
  if(progress)confidence+=25
  if(bestQuiz!==null)confidence+=20
  confidence+=Math.min(50,practiceAttempts*10)
  if(lastEvidenceAt&&daysBetween(lastEvidenceAt,now)<=14)confidence+=5

  const macro= cpaCurriculum.find((item)=>item.pdCode===macroCodeOf(unit.pdCode))
  return{
    pdCode:unit.pdCode,
    title:unit.title,
    macroCode:macroCodeOf(unit.pdCode),
    macroTitle:macro?.title??`Tema ${macroCodeOf(unit.pdCode)}`,
    score,
    confidence:Math.round(clamp(confidence)),
    level:levelOf(score),
    evidenceCount,
    practiceAttempts,
    practiceAccuracy,
    unresolvedErrors:errorWeight,
    hasDoubt:Boolean(progress?.hasDoubt),
    lastEvidenceAt,
    nextReviewAt,
    reviewIntervalDays:interval,
    overdue:Boolean(nextReviewAt&&new Date(nextReviewAt).getTime()<=now.getTime()),
    lessonAvailable:input.lessonPdCodes.has(unit.pdCode),
    questionAvailable:input.questionPdCodes.has(unit.pdCode),
  }
}

function recommendationFor(item:PDMastery,macroWeight:number):StudyRecommendation|null{
  let kind:StudyRecommendationKind|null=null
  let reason=''
  if(item.unresolvedErrors>0){
    kind='recover_error';reason=`${item.unresolvedErrors} erro(s) pendente(s) neste PD.`
  }else if(item.score<45&&item.lessonAvailable){
    kind='learn';reason=item.evidenceCount===0?'Conteúdo ainda não iniciado e com aula disponível.':'Base ainda fraca; retome a aula antes de avançar.'
  }else if(item.overdue&&item.lessonAvailable){
    kind='review';reason=`Revisão vencida pelo ciclo de ${item.reviewIntervalDays} dia(s).`
  }else if(item.questionAvailable&&(item.score<75||item.overdue)){
    kind='practice';reason=item.practiceAttempts<3?'Falta evidência prática para consolidar o domínio.':'Acurácia/recência ainda pede mais prática.'
  }else if(item.lessonAvailable&&item.score<85){
    kind='review';reason='Revisão curta ajuda a elevar este PD para domínio forte.'
  }
  if(!kind)return null
  const targetMinutes=kind==='learn'?20:kind==='review'?12:15
  const priority=Math.round(
    (100-item.score)+macroWeight*.6+(item.overdue?20:0)+(item.unresolvedErrors>0?100:0)+(item.hasDoubt?15:0)+(item.lessonAvailable&&item.score===0?20:0)
  )
  const route=kind==='recover_error'||kind==='practice'
    ?`/questoes?pd=${encodeURIComponent(item.pdCode)}`
    :`/conteudos/${encodeURIComponent(item.pdCode)}`
  return{pdCode:item.pdCode,title:item.title,macroCode:item.macroCode,kind,score,priority,reason,targetMinutes,route}
}

function readinessLabel(score:number){
  if(score<35)return'Construindo base'
  if(score<55)return'Em desenvolvimento'
  if(score<70)return'Pronto para simular'
  if(score<80)return'Próximo do alvo'
  return'Indicadores fortes'
}

export function buildStudyEngineSnapshot(input:StudyEngineInput):StudyEngineSnapshot{
  const now=input.now??new Date()
  const directMastery=new Map(cpaCurriculum.map((unit)=>[unit.pdCode,calculatePdMastery(unit,input)]))
  const children=new Map<string,CurriculumUnit[]>()
  for(const unit of cpaCurriculum){
    if(!unit.parentCode)continue
    const list=children.get(unit.parentCode)??[]
    list.push(unit);children.set(unit.parentCode,list)
  }
  const memo=new Map<string,{item:PDMastery;leafCount:number}>()
  const resolve=(unit:CurriculumUnit):{item:PDMastery;leafCount:number}=>{
    const cached=memo.get(unit.pdCode);if(cached)return cached
    const direct=directMastery.get(unit.pdCode)!
    const childUnits=children.get(unit.pdCode)??[]
    if(childUnits.length===0){const result={item:direct,leafCount:1};memo.set(unit.pdCode,result);return result}
    const childResults=childUnits.map(resolve)
    const leafCount=childResults.reduce((sum,row)=>sum+row.leafCount,0)
    const weighted=(selector:(item:PDMastery)=>number)=>childResults.reduce((sum,row)=>sum+selector(row.item)*row.leafCount,0)/leafCount
    const childScore=weighted((item)=>item.score)
    const childConfidence=weighted((item)=>item.confidence)
    const childEvidence=childResults.reduce((sum,row)=>sum+row.item.evidenceCount,0)
    const hasDirect=direct.evidenceCount>0
    const hasChildren=childEvidence>0
    const score=Math.round(hasDirect&&hasChildren?childScore*.75+direct.score*.25:hasDirect?direct.score:childScore)
    const confidence=Math.round(hasDirect&&hasChildren?childConfidence*.75+direct.confidence*.25:hasDirect?direct.confidence:childConfidence)
    const reviewDates=[direct.nextReviewAt,...childResults.map((row)=>row.item.nextReviewAt)].filter((value):value is string=>Boolean(value)).sort()
    const item:PDMastery={
      ...direct,
      score,confidence,level:levelOf(score),
      evidenceCount:direct.evidenceCount+childEvidence,
      practiceAttempts:direct.practiceAttempts+childResults.reduce((sum,row)=>sum+row.item.practiceAttempts,0),
      practiceAccuracy:direct.practiceAccuracy,
      unresolvedErrors:direct.unresolvedErrors+childResults.reduce((sum,row)=>sum+row.item.unresolvedErrors,0),
      hasDoubt:direct.hasDoubt||childResults.some((row)=>row.item.hasDoubt),
      lastEvidenceAt:latest([direct.lastEvidenceAt,...childResults.map((row)=>row.item.lastEvidenceAt)]),
      nextReviewAt:reviewDates[0]??null,
      reviewIntervalDays:reviewInterval(score),
      overdue:direct.overdue||childResults.some((row)=>row.item.overdue),
    }
    const result={item,leafCount};memo.set(unit.pdCode,result);return result
  }
  const mastery=cpaCurriculum.map((unit)=>resolve(unit).item)
  const terminals=terminalUnits(cpaCurriculum)
  const terminalMastery=terminals.map((unit)=>directMastery.get(unit.pdCode)!)
  const roots=cpaCurriculum.filter((item)=>item.parentCode===null)
  const macroSummary=roots.map((root)=>{
    const rootMastery=resolve(root).item
    const terminalItems=terminalMastery.filter((item)=>item.macroCode===root.pdCode)
    const directItems=[...directMastery.values()].filter((item)=>item.macroCode===root.pdCode&&(item.lessonAvailable||item.questionAvailable))
    const covered=terminalItems.filter((item)=>item.evidenceCount>0).length
    return{
      macroCode:root.pdCode,
      title:root.title,
      officialWeight:root.weight??0,
      score:rootMastery.score,
      coveragePercent:terminalItems.length?Math.round(covered/terminalItems.length*100):0,
      dueReviews:directItems.filter((item)=>item.evidenceCount>0&&item.overdue).length,
      weakItems:directItems.filter((item)=>item.evidenceCount>0&&item.score<60).length,
      totalItems:terminalItems.length,
    }
  })
  const weightTotal=macroSummary.reduce((sum,item)=>sum+item.officialWeight,0)||100
  const overallMastery=Math.round(macroSummary.reduce((sum,item)=>sum+item.score*item.officialWeight,0)/weightTotal)
  const coveragePercent=terminalMastery.length?Math.round(terminalMastery.filter((item)=>item.evidenceCount>0).length/terminalMastery.length*100):0
  const officialExams=input.simulations
    .filter((row)=>row.completedAt&&row.payload.mode==='official_exam'&&row.payload.result)
    .sort((a,b)=>b.completedAt!.localeCompare(a.completedAt!))
    .slice(0,3)
  const recentOfficialExamAverage=officialExams.length
    ?Math.round(officialExams.reduce((sum,row)=>sum+(row.payload.result?.scorePercent??0),0)/officialExams.length)
    :null
  const readinessScore=Math.round(clamp(overallMastery*.6+coveragePercent*.15+(recentOfficialExamAverage??0)*.25))
  const readyForExam=coveragePercent>=75&&overallMastery>=70&&(recentOfficialExamAverage??0)>=70&&macroSummary.every((item)=>item.score>=60)

  const actionable=[...directMastery.values()].filter((item)=>item.lessonAvailable||item.questionAvailable)
  const candidates=actionable
    .map((item)=>recommendationFor(item,macroSummary.find((macro)=>macro.macroCode===item.macroCode)?.officialWeight??0))
    .filter((item):item is StudyRecommendation=>Boolean(item))
    .sort((a,b)=>b.priority-a.priority||a.pdCode.localeCompare(b.pdCode,undefined,{numeric:true}))

  const today:StudyRecommendation[]=[]
  let minutes=0
  for(const candidate of candidates){
    if(today.length>=5)break
    const sameMacro=today.filter((item)=>item.macroCode===candidate.macroCode).length
    if(sameMacro>=3&&candidates.some((other)=>!today.includes(other)&&other.macroCode!==candidate.macroCode))continue
    today.push(candidate);minutes+=candidate.targetMinutes
    if(minutes>=Math.max(15,input.dailyGoalMinutes)&&today.length>=2)break
  }
  if(today.length===0&&candidates[0]){today.push(candidates[0]);minutes=candidates[0].targetMinutes}

  const weakPdCodes=actionable
    .filter((item)=>item.evidenceCount>0&&item.score<60)
    .sort((a,b)=>a.score-b.score||b.unresolvedErrors-a.unresolvedErrors)
    .slice(0,20).map((item)=>item.pdCode)
  const masteredPdCodes=actionable.filter((item)=>item.score>=85&&item.confidence>=60).map((item)=>item.pdCode)

  return{
    generatedAt:now.toISOString(),overallMastery,coveragePercent,readinessScore,
    readinessLabel:readinessLabel(readinessScore),readyForExam,recentOfficialExamAverage,
    dueReviews:actionable.filter((item)=>item.evidenceCount>0&&item.overdue).length,
    recommendedMinutes:minutes,today,macroSummary,mastery,weakPdCodes,masteredPdCodes,
  }
}

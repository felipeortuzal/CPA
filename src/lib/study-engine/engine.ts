import { cpaCurriculum } from '../../../content/cpa/curriculum'
import type { CurriculumUnit } from '../../../content/cpa/schema'
import type { FlashcardReviewRecord, SimulationRecord } from '../storage/types'
import type { DataStatus, MasteryLevel, PDMastery, QuestionDifficulty, ReadinessBreakdown, StudyEngineInput, StudyEngineSnapshot, StudyRecommendation, StudyRecommendationKind, WeakTopic } from './types'

const DAY_MS=86_400_000
const DIFFICULTY_WEIGHT:Record<QuestionDifficulty,number>={easy:1,medium:1.25,hard:1.5}
const FLASHCARD_SCORE:Record<FlashcardReviewRecord['rating'],number>={again:0,hard:45,good:78,easy:95}

function clamp(value:number,min=0,max=100){return Math.max(min,Math.min(max,value))}
function daysBetween(from:string,to:Date){return Math.max(0,(to.getTime()-new Date(from).getTime())/DAY_MS)}
function latest(values:(string|null|undefined)[]){return values.filter((value):value is string=>Boolean(value)).sort().at(-1)??null}
function macroCodeOf(pdCode:string){return pdCode.split('.')[0]}
function levelOf(score:number):MasteryLevel{if(score<30)return'weak';if(score<60)return'learning';if(score<80)return'good';return'mastered'}
function reviewInterval(score:number){if(score<30)return 1;if(score<45)return 2;if(score<60)return 4;if(score<70)return 7;if(score<80)return 10;if(score<90)return 14;return 30}
function recencyWeight(at:string,now:Date){const days=daysBetween(at,now);if(days<=7)return 1.35;if(days<=14)return 1.2;if(days<=30)return 1;if(days<=60)return .82;return .65}
function retentionFactor(lastEvidenceAt:string|null,now:Date){if(!lastEvidenceAt)return 1;const days=daysBetween(lastEvidenceAt,now);if(days<=7)return 1;if(days<=14)return .98;if(days<=30)return .94;if(days<=60)return .87;if(days<=90)return .8;return .72}
function weightedAverage(rows:{value:number;weight:number}[]){const total=rows.reduce((sum,row)=>sum+row.weight,0);return total?rows.reduce((sum,row)=>sum+row.value*row.weight,0)/total:null}
function terminalUnits(items:CurriculumUnit[]){const parents=new Set(items.flatMap((item)=>item.parentCode?[item.parentCode]:[]));return items.filter((item)=>!parents.has(item.pdCode))}
function statusSignal(status:string|undefined){if(status==='mastered')return 45;if(status==='completed')return 38;if(status==='in_progress')return 10;return null}
function simulationModeWeight(mode:SimulationRecord['payload']['mode']){if(mode==='official_exam')return 1.9;if(mode==='quick20')return 1.25;if(mode==='quick10')return 1.1;return 1}
function dataStatusOf(args:{progress:boolean;quiz:boolean;questionSamples:number;simulationSamples:number;officialExamSamples:number;flashcardSamples:number}):DataStatus{
  const practice=args.questionSamples+args.simulationSamples
  if(args.officialExamSamples>=5||practice>=5||(practice>=3&&args.quiz))return'sufficient'
  if(args.quiz||practice>=3||args.flashcardSamples>=3||(args.progress&&practice>=1))return'partial'
  return'insufficient'
}

export function calculatePdMastery(unit:CurriculumUnit,input:StudyEngineInput):PDMastery{
  const now=input.now??new Date()
  const progress=input.lessonProgress.find((row)=>row.pdCode===unit.pdCode)
  const quizzes=input.quizAttempts.filter((row)=>row.pdCode===unit.pdCode).sort((a,b)=>b.completedAt.localeCompare(a.completedAt))
  const direct=input.questionAttempts.filter((row)=>row.pdCode===unit.pdCode).sort((a,b)=>b.answeredAt.localeCompare(a.answeredAt)).slice(0,15)
  const questionRows=direct.map((row)=>({
    value:row.isCorrect?100:0,
    weight:DIFFICULTY_WEIGHT[input.questionDifficultyById.get(row.questionId)??'medium']*recencyWeight(row.answeredAt,now),
  }))
  const weightedQuestionAccuracyRaw=weightedAverage(questionRows)
  const weightedQuestionAccuracy=weightedQuestionAccuracyRaw===null?null:Math.round(weightedQuestionAccuracyRaw)

  const simulationRows=input.simulations.flatMap((simulation)=>{
    if(!simulation.completedAt||!simulation.payload.result)return[]
    const modeWeight=simulationModeWeight(simulation.payload.mode)
    return simulation.payload.result.questionResults.filter((row)=>row.pdCode===unit.pdCode&&row.selectedAnswer!==null).map((row)=>({
      value:row.isCorrect?100:0,
      weight:DIFFICULTY_WEIGHT[row.difficulty]*modeWeight*recencyWeight(simulation.completedAt!,now),
      official:simulation.payload.mode==='official_exam',
      at:simulation.completedAt!,
    }))
  }).sort((a,b)=>b.at.localeCompare(a.at)).slice(0,20)
  const simulationAccuracyRaw=weightedAverage(simulationRows)
  const simulationAccuracy=simulationAccuracyRaw===null?null:Math.round(simulationAccuracyRaw)
  const officialExamSamples=simulationRows.filter((row)=>row.official).length

  const cardIds=new Set([...input.flashcardPdById.entries()].filter(([,pdCode])=>pdCode===unit.pdCode).map(([id])=>id))
  const flashRows=input.flashcardReviews.filter((row)=>cardIds.has(row.flashcardId)).sort((a,b)=>b.reviewedAt.localeCompare(a.reviewedAt)).slice(0,16).map((row)=>({value:FLASHCARD_SCORE[row.rating],weight:recencyWeight(row.reviewedAt,now)}))
  const flashcardRecallRaw=weightedAverage(flashRows)
  const flashcardRecall=flashcardRecallRaw===null?null:Math.round(flashcardRecallRaw)

  const bestQuiz=progress?.quizBestScore??(quizzes.length?Math.max(...quizzes.map((row)=>row.score)):null)
  const lesson=statusSignal(progress?.status)
  const signals:{value:number;weight:number}[]=[]
  if(lesson!==null)signals.push({value:lesson,weight:progress?.status==='in_progress'?.45:.8})
  if(bestQuiz!==null)signals.push({value:bestQuiz,weight:1.25})
  if(weightedQuestionAccuracy!==null)signals.push({value:weightedQuestionAccuracy,weight:1.3+Math.min(1.7,direct.length*.22)})
  if(simulationAccuracy!==null)signals.push({value:simulationAccuracy,weight:1.7+Math.min(2.3,simulationRows.length*.16)+(officialExamSamples>0?.8:0)})
  if(flashcardRecall!==null)signals.push({value:flashcardRecall,weight:.75+Math.min(.75,flashRows.length*.08)})

  const unresolved=input.errors.filter((error)=>error.pdCode===unit.pdCode&&!error.resolvedAt)
  const errorWeight=unresolved.reduce((sum,error)=>sum+(error.errorCount??error.wrongCount??1),0)
  const errorPenalty=errorWeight?Math.min(22,4+errorWeight*2.5+unresolved.filter((error)=>error.reviewStatus==='doubt').length*2):0
  const doubtPenalty=progress?.hasDoubt?6:0
  const lastEvidenceAt=latest([
    progress?.lastStudiedAt,...quizzes.map((row)=>row.completedAt),...direct.map((row)=>row.answeredAt),...simulationRows.map((row)=>row.at),...input.flashcardReviews.filter((row)=>cardIds.has(row.flashcardId)).map((row)=>row.reviewedAt),...unresolved.map((row)=>row.lastWrongAt??row.createdAt),
  ])
  const raw=weightedAverage(signals)??0
  const score=Math.round(clamp(raw*retentionFactor(lastEvidenceAt,now)-errorPenalty-doubtPenalty))
  const practiceAttempts=direct.length+simulationRows.length
  const combinedPractice=weightedAverage([
    ...(weightedQuestionAccuracy===null?[]:[{value:weightedQuestionAccuracy,weight:direct.length||1}]),
    ...(simulationAccuracy===null?[]:[{value:simulationAccuracy,weight:simulationRows.length*1.35||1}]),
  ])
  const practiceAccuracy=combinedPractice===null?null:Math.round(combinedPractice)
  const dataStatus=dataStatusOf({progress:Boolean(progress&&progress.status!=='not_started'),quiz:bestQuiz!==null,questionSamples:direct.length,simulationSamples:simulationRows.length,officialExamSamples,flashcardSamples:flashRows.length})

  const completedLesson=progress?.status==='completed'||progress?.status==='mastered'
  const falseConfidence=Boolean(completedLesson&&practiceAttempts>=3&&practiceAccuracy!==null&&practiceAccuracy<60)
  const falseConfidenceMessage=falseConfidence?'Estudado, mas precisa de prática.':null

  let confidence=0
  if(progress?.status==='completed'||progress?.status==='mastered')confidence+=15
  if(bestQuiz!==null)confidence+=15
  confidence+=Math.min(30,direct.length*5)
  confidence+=Math.min(25,simulationRows.length*3+(officialExamSamples>0?8:0))
  confidence+=Math.min(10,flashRows.length*2)
  if(lastEvidenceAt&&daysBetween(lastEvidenceAt,now)<=14)confidence+=5
  if(dataStatus==='insufficient')confidence=Math.min(confidence,34)
  if(dataStatus==='partial')confidence=Math.min(confidence,69)

  const interval=reviewInterval(score)
  const nextReviewAt=lastEvidenceAt?new Date(new Date(lastEvidenceAt).getTime()+interval*DAY_MS).toISOString():null
  const macro=cpaCurriculum.find((item)=>item.pdCode===macroCodeOf(unit.pdCode))
  return{
    pdCode:unit.pdCode,title:unit.title,macroCode:macroCodeOf(unit.pdCode),macroTitle:macro?.title??`Tema ${macroCodeOf(unit.pdCode)}`,
    score,confidence:Math.round(clamp(confidence)),dataStatus,level:levelOf(score),evidenceCount:(progress?1:0)+quizzes.length+practiceAttempts+flashRows.length,
    practiceAttempts,practiceAccuracy,weightedQuestionAccuracy,simulationAccuracy,flashcardRecall,officialExamSamples,
    unresolvedErrors:errorWeight,hasDoubt:Boolean(progress?.hasDoubt),falseConfidence,falseConfidenceMessage,lastEvidenceAt,nextReviewAt,reviewIntervalDays:interval,
    overdue:Boolean(nextReviewAt&&new Date(nextReviewAt).getTime()<=now.getTime()),lessonAvailable:input.lessonPdCodes.has(unit.pdCode),questionAvailable:input.questionPdCodes.has(unit.pdCode),
  }
}

function recommendationFor(item:PDMastery,macroWeight:number):StudyRecommendation|null{
  let kind:StudyRecommendationKind|null=null
  let reason=''
  if(item.unresolvedErrors>0){kind='recover_error';reason=`${item.unresolvedErrors} erro(s) recente(s) ainda pendente(s).`}
  else if(item.falseConfidence){kind='practice';reason=item.practiceAccuracy===null?'Estudado, mas precisa de prática.':`Estudado, mas precisa de prática: ${item.practiceAccuracy}% de acerto recente.`}
  else if(item.dataStatus==='insufficient'&&item.lessonAvailable){kind='learn';reason=item.evidenceCount===0?'Ainda sem evidência de estudo neste PD.':'Dados insuficientes para estimar domínio; gere mais evidência.'}
  else if(item.overdue&&item.lessonAvailable){kind='review';reason=`Revisão vencida pelo ciclo de ${item.reviewIntervalDays} dia(s).`}
  else if(item.questionAvailable&&(item.dataStatus!=='sufficient'||item.score<60)){kind='practice';reason=item.practiceAccuracy===null?'Falta prática suficiente para estimar domínio.':`Desempenho recente em prática: ${item.practiceAccuracy}%.`}
  else if(item.lessonAvailable&&item.score<80){kind='review';reason=`Domínio atual ${item.score}/100; revisão pode consolidar este PD.`}
  if(!kind)return null
  const targetMinutes=kind==='learn'?20:kind==='review'?12:15
  const priority=Math.round((100-item.score)+macroWeight*.7+(item.overdue?20:0)+(item.unresolvedErrors>0?100:0)+(item.falseConfidence?45:0)+(item.hasDoubt?15:0)+(item.dataStatus==='insufficient'?18:0))
  const route=kind==='recover_error'||kind==='practice'
    ?`/questoes?pd=${encodeURIComponent(item.pdCode)}`
    :`/conteudos/${encodeURIComponent(item.pdCode)}`
  return{pdCode:item.pdCode,title:item.title,macroCode:item.macroCode,kind,score:item.score,priority,reason,targetMinutes,route}
}

function readinessLabel(score:number|null,status:DataStatus){if(status==='insufficient'||score===null)return'Dados insuficientes';if(score<45)return'Construindo base';if(score<60)return'Em desenvolvimento';if(score<75)return'Próximo do alvo';return'Indicadores fortes'}
function readinessMessage(status:DataStatus){if(status==='insufficient')return'Ainda não há amostra suficiente para exibir uma pontuação precisa de prontidão.';if(status==='partial')return'Indicador preliminar baseado no seu desempenho na plataforma; continue acumulando prática e simulados completos. Não é garantia de aprovação.';return'Indicador interno baseado no seu desempenho na plataforma. Não é garantia de aprovação.'}
function recentOfficialExams(input:StudyEngineInput){return input.simulations.filter((row)=>row.completedAt&&row.payload.mode==='official_exam'&&row.payload.result).sort((a,b)=>b.completedAt!.localeCompare(a.completedAt!)).slice(0,5)}
function weightedExamAverage(exams:SimulationRecord[],now:Date){const rows=exams.map((exam)=>({value:exam.payload.result!.scorePercent,weight:recencyWeight(exam.completedAt!,now)}));const avg=weightedAverage(rows);return avg===null?null:Math.round(avg)}
function recentPracticeAccuracy(input:StudyEngineInput,now:Date){
  const direct=input.questionAttempts.filter((row)=>daysBetween(row.answeredAt,now)<=30).map((row)=>({value:row.isCorrect?100:0,weight:DIFFICULTY_WEIGHT[input.questionDifficultyById.get(row.questionId)??'medium']*recencyWeight(row.answeredAt,now)}))
  const simulations=input.simulations.flatMap((sim)=>!sim.completedAt||!sim.payload.result||daysBetween(sim.completedAt,now)>30?[]:sim.payload.result.questionResults.filter((row)=>row.selectedAnswer!==null).map((row)=>({value:row.isCorrect?100:0,weight:DIFFICULTY_WEIGHT[row.difficulty]*simulationModeWeight(sim.payload.mode)*recencyWeight(sim.completedAt!,now)})))
  const avg=weightedAverage([...direct,...simulations]);return avg===null?null:Math.round(avg)
}
function consistencyScore(exams:SimulationRecord[]){if(exams.length<2)return 0;const values=exams.map((exam)=>exam.payload.result!.scorePercent);const avg=values.reduce((a,b)=>a+b,0)/values.length;const meanDeviation=values.reduce((sum,value)=>sum+Math.abs(value-avg),0)/values.length;return Math.round(clamp(100-meanDeviation*3))}

export function buildStudyEngineSnapshot(input:StudyEngineInput):StudyEngineSnapshot{
  const now=input.now??new Date()
  const directMastery=new Map(cpaCurriculum.map((unit)=>[unit.pdCode,calculatePdMastery(unit,input)]))
  const children=new Map<string,CurriculumUnit[]>()
  for(const unit of cpaCurriculum){if(!unit.parentCode)continue;const list=children.get(unit.parentCode)??[];list.push(unit);children.set(unit.parentCode,list)}
  const memo=new Map<string,{item:PDMastery;leafCount:number}>()
  const resolve=(unit:CurriculumUnit):{item:PDMastery;leafCount:number}=>{
    const cached=memo.get(unit.pdCode);if(cached)return cached
    const direct=directMastery.get(unit.pdCode)!
    const childUnits=children.get(unit.pdCode)??[]
    if(childUnits.length===0){const result={item:direct,leafCount:1};memo.set(unit.pdCode,result);return result}
    const childResults=childUnits.map(resolve);const leafCount=childResults.reduce((sum,row)=>sum+row.leafCount,0)
    const weighted=(selector:(item:PDMastery)=>number)=>childResults.reduce((sum,row)=>sum+selector(row.item)*row.leafCount,0)/leafCount
    const childScore=weighted((item)=>item.score);const childConfidence=weighted((item)=>item.confidence);const childEvidence=childResults.reduce((sum,row)=>sum+row.item.evidenceCount,0)
    const hasDirect=direct.evidenceCount>0,hasChildren=childEvidence>0
    const score=Math.round(hasDirect&&hasChildren?childScore*.78+direct.score*.22:hasDirect?direct.score:childScore)
    const confidence=Math.round(hasDirect&&hasChildren?childConfidence*.78+direct.confidence*.22:hasDirect?direct.confidence:childConfidence)
    const statuses=[direct.dataStatus,...childResults.map((row)=>row.item.dataStatus)]
    const sufficient=statuses.filter((status)=>status==='sufficient').length,partial=statuses.filter((status)=>status==='partial').length
    const dataStatus:DataStatus=sufficient>0&&sufficient+partial>=Math.max(1,Math.ceil(statuses.length/2))?'sufficient':partial>0||sufficient>0?'partial':'insufficient'
    const reviewDates=[direct.nextReviewAt,...childResults.map((row)=>row.item.nextReviewAt)].filter((value):value is string=>Boolean(value)).sort()
    const item:PDMastery={...direct,score,confidence,dataStatus,level:levelOf(score),evidenceCount:direct.evidenceCount+childEvidence,practiceAttempts:direct.practiceAttempts+childResults.reduce((sum,row)=>sum+row.item.practiceAttempts,0),unresolvedErrors:direct.unresolvedErrors+childResults.reduce((sum,row)=>sum+row.item.unresolvedErrors,0),hasDoubt:direct.hasDoubt||childResults.some((row)=>row.item.hasDoubt),falseConfidence:direct.falseConfidence||childResults.some((row)=>row.item.falseConfidence),falseConfidenceMessage:direct.falseConfidenceMessage??(childResults.some((row)=>row.item.falseConfidence)?'Estudado, mas precisa de prática.':null),lastEvidenceAt:latest([direct.lastEvidenceAt,...childResults.map((row)=>row.item.lastEvidenceAt)]),nextReviewAt:reviewDates[0]??null,reviewIntervalDays:reviewInterval(score),overdue:direct.overdue||childResults.some((row)=>row.item.overdue),weightedQuestionAccuracy:direct.weightedQuestionAccuracy,simulationAccuracy:direct.simulationAccuracy,flashcardRecall:direct.flashcardRecall,officialExamSamples:direct.officialExamSamples+childResults.reduce((sum,row)=>sum+row.item.officialExamSamples,0)}
    const result={item,leafCount};memo.set(unit.pdCode,result);return result
  }

  const mastery=cpaCurriculum.map((unit)=>resolve(unit).item)
  const terminals=terminalUnits(cpaCurriculum);const terminalMastery=terminals.map((unit)=>directMastery.get(unit.pdCode)!)
  const roots=cpaCurriculum.filter((item)=>item.parentCode===null)
  const macroSummary=roots.map((root)=>{
    const rootMastery=resolve(root).item
    const terminalItems=terminalMastery.filter((item)=>item.macroCode===root.pdCode)
    const actionable=[...directMastery.values()].filter((item)=>item.macroCode===root.pdCode&&(item.lessonAvailable||item.questionAvailable))
    const covered=terminalItems.filter((item)=>item.evidenceCount>0).length
    const sufficient=terminalItems.filter((item)=>item.dataStatus==='sufficient').length
    return{macroCode:root.pdCode,title:root.title,officialWeight:root.weight??0,score:rootMastery.score,coveragePercent:terminalItems.length?Math.round(covered/terminalItems.length*100):0,sufficientPercent:terminalItems.length?Math.round(sufficient/terminalItems.length*100):0,dueReviews:actionable.filter((item)=>item.evidenceCount>0&&item.overdue).length,weakItems:actionable.filter((item)=>item.evidenceCount>0&&item.score<30).length,totalItems:terminalItems.length}
  })
  const weightTotal=macroSummary.reduce((sum,item)=>sum+item.officialWeight,0)||100
  const overallMastery=Math.round(macroSummary.reduce((sum,item)=>sum+item.score*item.officialWeight,0)/weightTotal)
  const coveragePercent=terminalMastery.length?Math.round(terminalMastery.filter((item)=>item.evidenceCount>0).length/terminalMastery.length*100):0
  const sufficientCoveragePercent=terminalMastery.length?Math.round(terminalMastery.filter((item)=>item.dataStatus==='sufficient').length/terminalMastery.length*100):0

  const exams=recentOfficialExams(input)
  const recentOfficialExamAverage=weightedExamAverage(exams,now)
  const recentPractice=recentPracticeAccuracy(input,now)
  const answeredEvidence=input.questionAttempts.length+input.simulations.reduce((sum,simulation)=>sum+(simulation.payload.result?.questionResults.filter((row)=>row.selectedAnswer!==null).length??0),0)
  const readinessDataStatus:DataStatus=exams.length>=2&&answeredEvidence>=40&&coveragePercent>=40?'sufficient':exams.length>=1||answeredEvidence>=20||coveragePercent>=20?'partial':'insufficient'
  const themeBalance=Math.round(clamp(Math.min(...macroSummary.map((item)=>item.score))*1.15))
  const breakdown:ReadinessBreakdown={coverage:coveragePercent,mastery:overallMastery,fullExams:recentOfficialExamAverage??0,recentPerformance:recentPractice??0,consistency:consistencyScore(exams),themeBalance}
  const computed=Math.round(clamp(breakdown.coverage*.15+breakdown.mastery*.30+breakdown.fullExams*.25+breakdown.recentPerformance*.15+breakdown.consistency*.05+breakdown.themeBalance*.10))
  const readinessScore=readinessDataStatus==='insufficient'?null:computed
  const readyForExam=readinessDataStatus==='sufficient'&&computed>=70&&(recentOfficialExamAverage??0)>=70&&macroSummary.every((item)=>item.score>=60)

  const actionable=[...directMastery.values()].filter((item)=>item.lessonAvailable||item.questionAvailable)
  const candidates=actionable.map((item)=>recommendationFor(item,macroSummary.find((macro)=>macro.macroCode===item.macroCode)?.officialWeight??0)).filter((item):item is StudyRecommendation=>Boolean(item)).sort((a,b)=>b.priority-a.priority||a.pdCode.localeCompare(b.pdCode,undefined,{numeric:true}))
  const recommendations=candidates.slice(0,3)
  const today:StudyRecommendation[]=[]
  let minutes=0
  for(const candidate of recommendations){today.push(candidate);minutes+=candidate.targetMinutes;if(minutes>=Math.max(15,input.dailyGoalMinutes)&&today.length>=2)break}
  if(today.length===0&&recommendations[0]){today.push(recommendations[0]);minutes=recommendations[0].targetMinutes}

  const weakTopics:WeakTopic[]=actionable.filter((item)=>item.evidenceCount>0&&(item.score<60||item.falseConfidence||item.unresolvedErrors>0)).sort((a,b)=>(b.falseConfidence?1:0)-(a.falseConfidence?1:0)||b.unresolvedErrors-a.unresolvedErrors||a.score-b.score).slice(0,10).map((item)=>({pdCode:item.pdCode,title:item.title,macroCode:item.macroCode,score:item.score,dataStatus:item.dataStatus,practiceAccuracy:item.practiceAccuracy,unresolvedErrors:item.unresolvedErrors,falseConfidence:item.falseConfidence,reason:item.falseConfidence?'Estudado, mas precisa de prática.':item.unresolvedErrors>0?`${item.unresolvedErrors} erro(s) pendente(s).`:item.dataStatus==='insufficient'?'Dados insuficientes.':`Domínio em ${item.score}/100.`,route:item.lessonAvailable?`/conteudos/${encodeURIComponent(item.pdCode)}`:`/questoes?pd=${encodeURIComponent(item.pdCode)}`}))
  const weakPdCodes=weakTopics.map((item)=>item.pdCode)
  const masteredPdCodes=actionable.filter((item)=>item.score>=80&&item.confidence>=60&&item.dataStatus!=='insufficient').map((item)=>item.pdCode)

  return{
    generatedAt:now.toISOString(),overallMastery,coveragePercent,sufficientCoveragePercent,readinessScore,readinessDataStatus,
    readinessLabel:readinessLabel(readinessScore,readinessDataStatus),readinessMessage:readinessMessage(readinessDataStatus),readinessBreakdown:breakdown,
    readyForExam,recentOfficialExamAverage,officialExamCount:exams.length,recentPracticeAccuracy:recentPractice,
    dueReviews:actionable.filter((item)=>item.evidenceCount>0&&item.overdue).length,recommendedMinutes:minutes,today,recommendations,
    macroSummary,mastery,weakTopics,falseConfidencePdCodes:actionable.filter((item)=>item.falseConfidence).map((item)=>item.pdCode),weakPdCodes,masteredPdCodes,
  }
}

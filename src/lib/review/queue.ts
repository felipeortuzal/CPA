import type { CPAFlashcard } from '../../../content/cpa/flashcards'
import type { PDMastery, StudyEngineSnapshot } from '../study-engine/types'
import type { ErrorRecord, FlashcardReviewRecord } from '../storage/types'
import { getLatestFlashcardState } from './flashcardEngine'

export type ReviewMode='5'|'10'|'20'|'eve'
export type ReviewQueueItemType='flashcard'|'error'|'content'

export interface ReviewQueueItem {
  id:string
  type:ReviewQueueItemType
  pdCode:string|null
  title:string
  reason:string
  priority:number
  estimatedMinutes:number
  route:string|null
  flashcardId?:string
  errorId?:string
  front?:string
  back?:string
}

export interface ReviewCenterSnapshot {
  queue:ReviewQueueItem[]
  dueFlashcards:number
  unresolvedErrors:number
  recurrentErrors:number
  weakPdCount:number
  overdueContent:number
}

function daysOverdue(nextReviewAt:string|null,now:Date){
  if(!nextReviewAt)return 0
  return Math.max(0,Math.floor((now.getTime()-new Date(nextReviewAt).getTime())/86_400_000))
}

function masteryCandidates(snapshot:StudyEngineSnapshot){
  const seen=new Set<string>()
  return snapshot.mastery.filter((item)=>{
    if(!item.lessonAvailable&&!item.questionAvailable)return false
    if(seen.has(item.pdCode))return false
    seen.add(item.pdCode)
    return item.evidenceCount>0&&(item.score<70||item.overdue||item.hasDoubt)
  })
}

function routeForMastery(item:PDMastery){
  if(item.lessonAvailable)return`/conteudos/${encodeURIComponent(item.pdCode)}`
  if(item.questionAvailable)return`/questoes?pd=${encodeURIComponent(item.pdCode)}`
  return'/trilha'
}

export function buildReviewCenter(
  study:StudyEngineSnapshot,
  flashcards:CPAFlashcard[],
  reviews:FlashcardReviewRecord[],
  errors:ErrorRecord[],
  now=new Date(),
):ReviewCenterSnapshot{
  const queue:ReviewQueueItem[]=[]
  const unresolved=errors.filter((error)=>!error.resolvedAt)

  for(const error of unresolved){
    const wrongCount=error.wrongCount??1
    queue.push({
      id:`error:${error.id}`,type:'error',pdCode:error.pdCode,title:error.prompt,
      reason:wrongCount>=2?`Erro recorrente: ${wrongCount} ocorrências.`:'Questão errada ainda não resolvida.',
      priority:220+wrongCount*25+(error.reviewStatus==='doubt'?35:error.reviewStatus==='review_later'?15:0),estimatedMinutes:3,route:`/questoes?question=${encodeURIComponent(error.sourceId)}`,errorId:error.id,
    })
  }

  for(const card of flashcards){
    const state=getLatestFlashcardState(card.id,reviews,now)
    if(!state.due)continue
    const overdue=daysOverdue(state.nextReviewAt,now)
    queue.push({
      id:`flashcard:${card.id}`,type:'flashcard',pdCode:card.pdCode,title:card.front,
      reason:state.reviewCount===0?'Flashcard novo de conteúdo já ativado.':overdue>0?`Flashcard vencido há ${overdue} dia(s).`:'Flashcard previsto para revisão hoje.',
      priority:150+Math.min(40,overdue*3)+(state.lastRating==='again'?35:0),estimatedMinutes:1,route:null,flashcardId:card.id,front:card.front,back:card.back,
    })
  }

  const errorPdCodes=new Set(unresolved.map((error)=>error.pdCode).filter((code):code is string=>Boolean(code)))
  for(const item of masteryCandidates(study)){
    if(errorPdCodes.has(item.pdCode))continue
    queue.push({
      id:`content:${item.pdCode}`,type:'content',pdCode:item.pdCode,title:item.title,
      reason:item.overdue?'Conteúdo antigo com revisão vencida.':item.hasDoubt?'Você marcou dúvida neste PD.':`Domínio atual em ${item.score}/100.`,
      priority:100+(100-item.score)+(item.overdue?25:0)+(item.hasDoubt?20:0),estimatedMinutes:item.lessonAvailable?5:4,route:routeForMastery(item),
    })
  }

  queue.sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id))
  return{
    queue,
    dueFlashcards:queue.filter((item)=>item.type==='flashcard').length,
    unresolvedErrors:unresolved.length,
    recurrentErrors:unresolved.filter((error)=>(error.wrongCount??1)>=2).length,
    weakPdCount:study.mastery.filter((item)=>(item.lessonAvailable||item.questionAvailable)&&item.evidenceCount>0&&item.score<60).length,
    overdueContent:study.mastery.filter((item)=>(item.lessonAvailable||item.questionAvailable)&&item.evidenceCount>0&&item.overdue).length,
  }
}

export function selectReviewQueue(queue:ReviewQueueItem[],mode:ReviewMode){
  const budget=mode==='eve'?45:Number(mode)
  const source=mode==='eve'
    ?queue.filter((item)=>item.type==='error'||item.type==='flashcard'||item.priority>=145)
    :queue
  const selected:ReviewQueueItem[]=[]
  let used=0
  for(const item of source){
    if(selected.length&&used+item.estimatedMinutes>budget)continue
    selected.push(item);used+=item.estimatedMinutes
    if(used>=budget)break
  }
  if(!selected.length&&source[0])selected.push(source[0])
  return selected
}

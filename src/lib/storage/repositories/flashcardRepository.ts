import { courseModuleMap } from '../../../../content/cpa/course/modules'
import { moduleReadings } from '../../../../content/cpa/course/readings'
import { validCourseProgress } from './courseRepository'
import { cpaLessonFlashcards, type CPAFlashcard } from '../../../../content/cpa/flashcards'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { FlashcardReviewRecord, StoredFlashcard } from '../types'
import { recordActivityInStore } from './activityRepository'
import { scheduleFlashcardReview, type FlashcardRating } from '../../review/flashcardEngine'

export async function getFlashcardReviews(flashcardId?:string){
  const db=await getDatabase()
  return flashcardId?db.getAllFromIndex('flashcardReviews','by-flashcard-id',flashcardId):db.getAll('flashcardReviews')
}

export async function getCustomFlashcards(){return (await getDatabase()).getAll('flashcards')}

export async function createCustomFlashcard(front:string,back:string,pdCode:string|null=null){
  const cleanFront=front.trim(),cleanBack=back.trim()
  if(!cleanFront||!cleanBack)throw new Error('Preencha frente e verso do flashcard.')
  const now=new Date().toISOString()
  const card:StoredFlashcard={id:crypto.randomUUID(),pdCode,front:cleanFront,back:cleanBack,createdAt:now,updatedAt:now}
  await (await getDatabase()).put('flashcards',card);notifyStorageChanged();return card
}

export async function deleteCustomFlashcard(id:string){
  const db=await getDatabase()
  const tx=db.transaction(['flashcards','flashcardReviews'],'readwrite')
  await tx.objectStore('flashcards').delete(id)
  const store=tx.objectStore('flashcardReviews')
  const reviews=await store.index('by-flashcard-id').getAll(`custom:${id}`)
  for(const review of reviews)await store.delete(review.id)
  await tx.done
  notifyStorageChanged()
}

export function toCustomCPAFlashcard(card:StoredFlashcard):CPAFlashcard{
  return{id:`custom:${card.id}`,certification:'CPA',pdCode:card.pdCode,front:card.front,back:card.back,source:'custom'}
}

export async function getActiveFlashcards(){
  const db=await getDatabase()
  const [progress,custom,plans]=await Promise.all([db.getAll('lessonProgress'),db.getAll('flashcards'),db.getAll('studyPlans')])
  const activePdCodes=new Set(progress.filter((row)=>row.status!=='not_started').map((row)=>row.pdCode))
  const moduleCards:CPAFlashcard[]=plans.flatMap(row=>{
    const payload=row.payload
    if(!validCourseProgress(payload,row.id)||!payload.readSections.length)return []
    return moduleReadings[payload.moduleId].recall.map((card,i)=>({id:`module:${payload.moduleId}:${i}`,certification:'CPA' as const,pdCode:courseModuleMap.get(payload.moduleId)!.prefixes[0],front:card.question,back:card.answer,source:'module' as const}))
  })
  return[
    ...moduleCards,
    ...cpaLessonFlashcards.filter((card)=>card.pdCode&&activePdCodes.has(card.pdCode)),
    ...custom.map(toCustomCPAFlashcard),
  ]
}

export async function reviewFlashcard(flashcardId:string,rating:FlashcardRating,at=new Date(),id?:string){
  const db=await getDatabase()
  const tx=db.transaction(['flashcards','flashcardReviews','activityDays'],'readwrite')
  if(flashcardId.startsWith('custom:') && !await tx.objectStore('flashcards').get(flashcardId.slice(7))) throw new Error('Este flashcard foi excluído. Atualize a fila.')
  const store=tx.objectStore('flashcardReviews')
  if(id){const previous=await store.get(id);if(previous){await tx.done;return previous}}
  const reviews=await store.index('by-flashcard-id').getAll(flashcardId)
  const record:FlashcardReviewRecord=scheduleFlashcardReview(flashcardId,rating,reviews,at)
  if(id)record.id=id
  await store.put(record)
  await recordActivityInStore(tx.objectStore('activityDays'),at)
  await tx.done
  notifyStorageChanged()
  return record
}

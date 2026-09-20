import { cpaLessonFlashcards, type CPAFlashcard } from '../../../../content/cpa/flashcards'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { FlashcardReviewRecord, StoredFlashcard } from '../types'
import { recordSignificantActivity } from './activityRepository'
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
  const db=await getDatabase();await db.delete('flashcards',id)
  const reviews=await db.getAllFromIndex('flashcardReviews','by-flashcard-id',`custom:${id}`)
  const tx=db.transaction('flashcardReviews','readwrite');for(const review of reviews)await tx.store.delete(review.id);await tx.done
  notifyStorageChanged()
}

export function toCustomCPAFlashcard(card:StoredFlashcard):CPAFlashcard{
  return{id:`custom:${card.id}`,certification:'CPA',pdCode:card.pdCode,front:card.front,back:card.back,source:'custom'}
}

export async function getActiveFlashcards(){
  const db=await getDatabase()
  const [progress,custom]=await Promise.all([db.getAll('lessonProgress'),db.getAll('flashcards')])
  const activePdCodes=new Set(progress.filter((row)=>row.status!=='not_started').map((row)=>row.pdCode))
  return[
    ...cpaLessonFlashcards.filter((card)=>card.pdCode&&activePdCodes.has(card.pdCode)),
    ...custom.map(toCustomCPAFlashcard),
  ]
}

export async function reviewFlashcard(flashcardId:string,rating:FlashcardRating,at=new Date()){
  const reviews=await getFlashcardReviews(flashcardId)
  const record:FlashcardReviewRecord=scheduleFlashcardReview(flashcardId,rating,reviews,at)
  await (await getDatabase()).put('flashcardReviews',record)
  await recordSignificantActivity(at)
  notifyStorageChanged()
  return record
}

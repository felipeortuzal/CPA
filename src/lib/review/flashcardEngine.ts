import type { FlashcardReviewRecord } from '../storage/types'

export type FlashcardRating = FlashcardReviewRecord['rating']

export interface FlashcardState {
  flashcardId: string
  lastReviewedAt: string | null
  nextReviewAt: string | null
  intervalDays: number
  ease: number
  reviewCount: number
  correctStreak: number
  lastRating: FlashcardRating | null
  due: boolean
}

const DAY_MS = 86_400_000

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value))}
function addDays(value:Date,days:number){return new Date(value.getTime()+days*DAY_MS).toISOString()}

export function getLatestFlashcardState(flashcardId:string,reviews:FlashcardReviewRecord[],now=new Date()):FlashcardState{
  const rows=reviews.filter((row)=>row.flashcardId===flashcardId).sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt))
  const latest=rows.at(-1)
  if(!latest)return{flashcardId,lastReviewedAt:null,nextReviewAt:null,intervalDays:0,ease:2.5,reviewCount:0,correctStreak:0,lastRating:null,due:true}
  const intervalDays=latest.intervalDays??Math.max(1,Math.round((latest.nextReviewAt?new Date(latest.nextReviewAt).getTime()-new Date(latest.reviewedAt).getTime():DAY_MS)/DAY_MS))
  return{
    flashcardId,
    lastReviewedAt:latest.reviewedAt,
    nextReviewAt:latest.nextReviewAt,
    intervalDays,
    ease:latest.ease??2.5,
    reviewCount:latest.reviewCount??rows.length,
    correctStreak:latest.correctStreak??0,
    lastRating:latest.rating,
    due:!latest.nextReviewAt||new Date(latest.nextReviewAt).getTime()<=now.getTime(),
  }
}

export function scheduleFlashcardReview(flashcardId:string,rating:FlashcardRating,reviews:FlashcardReviewRecord[],now=new Date()):FlashcardReviewRecord{
  const previous=getLatestFlashcardState(flashcardId,reviews,now)
  let ease=previous.ease
  let intervalDays=1
  let correctStreak=previous.correctStreak

  if(rating==='again'){
    ease=clamp(ease-.2,1.3,3)
    intervalDays=1
    correctStreak=0
  }else if(rating==='hard'){
    ease=clamp(ease-.15,1.3,3)
    intervalDays=previous.reviewCount===0?1:Math.max(1,Math.round(Math.max(1,previous.intervalDays)*1.2))
    correctStreak+=1
  }else if(rating==='good'){
    intervalDays=previous.reviewCount===0?1:previous.reviewCount===1?3:Math.max(2,Math.round(previous.intervalDays*ease))
    correctStreak+=1
  }else{
    ease=clamp(ease+.15,1.3,3)
    intervalDays=previous.reviewCount===0?4:Math.max(4,Math.round(Math.max(1,previous.intervalDays)*ease*1.3))
    correctStreak+=1
  }

  const reviewedAt=now.toISOString()
  return{
    id:crypto.randomUUID(),
    flashcardId,
    rating,
    reviewedAt,
    lastReviewedAt:reviewedAt,
    nextReviewAt:addDays(now,intervalDays),
    intervalDays,
    ease:Number(ease.toFixed(2)),
    reviewCount:previous.reviewCount+1,
    correctStreak,
  }
}

export function dueFlashcardCount(ids:string[],reviews:FlashcardReviewRecord[],now=new Date()){
  return ids.filter((id)=>getLatestFlashcardState(id,reviews,now).due).length
}

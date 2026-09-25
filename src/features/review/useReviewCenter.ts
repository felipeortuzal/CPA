import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CPAFlashcard } from '../../../content/cpa/flashcards'
import { buildReviewCenter, type ReviewCenterSnapshot } from '../../lib/review/queue'
import { STORAGE_CHANGED_EVENT, reportStorageError } from '../../lib/storage/events'
import { getActiveFlashcards, getFlashcardReviews } from '../../lib/storage/repositories/flashcardRepository'
import { getQuestionErrors } from '../../lib/storage/repositories/questionRepository'
import type { ErrorRecord, FlashcardReviewRecord } from '../../lib/storage/types'
import { useStudyEngine } from '../study/useStudyEngine'

export function useReviewCenter(){
  const {snapshot:study,loading:studyLoading,refresh:refreshStudy}=useStudyEngine()
  const [flashcards,setFlashcards]=useState<CPAFlashcard[]>([])
  const [reviews,setReviews]=useState<FlashcardReviewRecord[]>([])
  const [errors,setErrors]=useState<ErrorRecord[]>([])
  const [loading,setLoading]=useState(true)

  const load=useCallback(async()=>{
    setLoading(true)
    try {
      const [cards,reviewRows,errorRows]=await Promise.all([getActiveFlashcards(),getFlashcardReviews(),getQuestionErrors(true)])
      setFlashcards(cards);setReviews(reviewRows);setErrors(errorRows);
    } catch { reportStorageError() } finally { setLoading(false) }
  },[])

  useEffect(()=>{
    void load()
    const listener=()=>void load()
    window.addEventListener(STORAGE_CHANGED_EVENT,listener)
    return()=>window.removeEventListener(STORAGE_CHANGED_EVENT,listener)
  },[load])

  const center=useMemo<ReviewCenterSnapshot|null>(()=>study?buildReviewCenter(study,flashcards,reviews,errors):null,[study,flashcards,reviews,errors])
  const refresh=useCallback(async()=>{await Promise.all([load(),refreshStudy()])},[load,refreshStudy])
  return useMemo(()=>({center,study,flashcards,reviews,errors,loading:loading||studyLoading,refresh}),[center,study,flashcards,reviews,errors,loading,studyLoading,refresh])
}

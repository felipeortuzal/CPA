import { useEffect } from 'react'
import { addActiveStudySeconds, beginStudySession, endStudySession } from '../lib/storage/repositories/activityRepository'

const ACTIVE_WINDOW_MS = 60_000
const TICK_SECONDS = 15

export function useStudyTimer(pdCode: string | null) {
  useEffect(() => {
    if (!pdCode) return
    let disposed=false; let sessionId:string|null=null; let lastInteraction=Date.now()
    const touchActivity=()=>{ lastInteraction=Date.now() }
    const events:Array<keyof WindowEventMap>=['pointerdown','keydown','scroll','touchstart']
    events.forEach((event)=>window.addEventListener(event,touchActivity,{passive:true}))
    void beginStudySession('lesson',pdCode).then((session)=>{ if(disposed){void endStudySession(session.id);return} sessionId=session.id })
    const timer=window.setInterval(()=>{ if(!sessionId||document.visibilityState!=='visible'||Date.now()-lastInteraction>ACTIVE_WINDOW_MS)return; void addActiveStudySeconds(sessionId,TICK_SECONDS) },TICK_SECONDS*1000)
    const onVisibility=()=>{ if(document.visibilityState==='visible')lastInteraction=Date.now() }
    document.addEventListener('visibilitychange',onVisibility)
    return()=>{ disposed=true; window.clearInterval(timer); events.forEach((event)=>window.removeEventListener(event,touchActivity)); document.removeEventListener('visibilitychange',onVisibility); if(sessionId)void endStudySession(sessionId) }
  },[pdCode])
}

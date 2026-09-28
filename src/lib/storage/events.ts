export const STORAGE_CHANGED_EVENT='cpa:storage-changed'
export const STORAGE_ERROR_EVENT='cpa:storage-error'
let channel:BroadcastChannel|null=null
let initialized=false
function emitChange(){if(typeof window!=='undefined')window.dispatchEvent(new Event(STORAGE_CHANGED_EVENT))}
export function initializeStorageSync() {
  if(initialized||typeof window==='undefined')return
  initialized=true
  if(typeof BroadcastChannel!=='undefined')try{
    channel=new BroadcastChannel('cpa-study-changes-v1')
    channel.onmessage=event=>{if(event.data?.type==='changed')emitChange()}
  }catch{channel=null}
  // Refocusing is also useful for browsers that isolate file:// channels or lack this API.
  window.addEventListener('focus',emitChange)
}
export function notifyStorageChanged() {
  initializeStorageSync();emitChange()
  try{channel?.postMessage({type:'changed'})}catch{/* Same-tab state is still refreshed. */}
}
export function reportStorageError(){if(typeof window!=='undefined')window.dispatchEvent(new Event(STORAGE_ERROR_EVENT))}

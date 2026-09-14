export const STORAGE_CHANGED_EVENT = 'cpa:storage-changed'

export function notifyStorageChanged() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(STORAGE_CHANGED_EVENT))
}

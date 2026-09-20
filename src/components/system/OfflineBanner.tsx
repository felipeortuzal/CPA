import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export function useOnlineStatus() {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine)
  useEffect(() => {
    const onlineHandler = () => setOnline(true)
    const offlineHandler = () => setOnline(false)
    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
    return () => {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
    }
  }, [])
  return online
}

export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return <div role="status" aria-live="polite" className="border-b border-amber-300/50 bg-amber-50 px-4 py-2 text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
    <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs font-semibold sm:text-sm">
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true"/>
      <span>Você está offline. Aulas, questões, simulados e progresso local continuam disponíveis; links e verificações externas podem não abrir.</span>
    </div>
  </div>
}

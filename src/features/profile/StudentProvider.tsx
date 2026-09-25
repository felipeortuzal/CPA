import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { STORAGE_CHANGED_EVENT, STORAGE_ERROR_EVENT } from '../../lib/storage/events'
import { createProfile, getProfile, updateProfile } from '../../lib/storage/repositories/profileRepository'
import type { LocalProfile } from '../../lib/storage/types'

interface StudentContextValue {
  profile: LocalProfile | null
  loading: boolean
  storageError: string | null
  createStudent: (name: string) => Promise<void>
  updateStudent: (patch: Partial<Pick<LocalProfile,'displayName'|'currentCertification'|'dailyGoalMinutes'>>) => Promise<void>
  refresh: () => Promise<void>
}
const StudentContext = createContext<StudentContextValue | undefined>(undefined)

export function StudentProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<LocalProfile | null>(null); const [loading, setLoading] = useState(true)
  const [storageError, setStorageError] = useState<string | null>(null)
  const refresh = useCallback(async () => {
    try { const next = (await getProfile()) ?? null; setProfile(current => JSON.stringify(current) === JSON.stringify(next) ? current : next); setStorageError(null) }
    catch { setStorageError('Não foi possível acessar o progresso salvo neste navegador. Verifique as permissões de armazenamento e tente novamente. Seus dados não foram apagados.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void refresh(); const listener = () => { void refresh() }; window.addEventListener(STORAGE_CHANGED_EVENT, listener); return () => window.removeEventListener(STORAGE_CHANGED_EVENT, listener) }, [refresh])
  useEffect(() => {
    const onError = () => setStorageError('Não foi possível ler ou salvar o progresso. Verifique o espaço e as permissões do navegador e tente novamente. Os dados já salvos foram preservados.')
    window.addEventListener(STORAGE_ERROR_EVENT, onError)
    return () => window.removeEventListener(STORAGE_ERROR_EVENT, onError)
  }, [])
  const createStudent = useCallback(async (name: string) => { setProfile(await createProfile(name)) }, [])
  const updateStudent = useCallback(async (patch: Partial<Pick<LocalProfile,'displayName'|'currentCertification'|'dailyGoalMinutes'>>) => { setProfile(await updateProfile(patch)) }, [])
  const value = useMemo(() => ({ profile, loading, storageError, createStudent, updateStudent, refresh }), [profile, loading, storageError, createStudent, updateStudent, refresh])
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export function useStudent() { const value = useContext(StudentContext); if (!value) throw new Error('useStudent deve ser usado dentro de StudentProvider.'); return value }

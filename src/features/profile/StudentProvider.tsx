import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { STORAGE_CHANGED_EVENT } from '../../lib/storage/events'
import { createProfile, getProfile, updateProfile } from '../../lib/storage/repositories/profileRepository'
import type { LocalProfile } from '../../lib/storage/types'

interface StudentContextValue {
  profile: LocalProfile | null
  loading: boolean
  createStudent: (name: string) => Promise<void>
  updateStudent: (patch: Partial<Pick<LocalProfile,'displayName'|'currentCertification'|'dailyGoalMinutes'>>) => Promise<void>
  refresh: () => Promise<void>
}
const StudentContext = createContext<StudentContextValue | undefined>(undefined)

export function StudentProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<LocalProfile | null>(null); const [loading, setLoading] = useState(true)
  const refresh = useCallback(async () => { setProfile((await getProfile()) ?? null); setLoading(false) }, [])
  useEffect(() => { void refresh(); const listener = () => { void refresh() }; window.addEventListener(STORAGE_CHANGED_EVENT, listener); return () => window.removeEventListener(STORAGE_CHANGED_EVENT, listener) }, [refresh])
  const createStudent = useCallback(async (name: string) => { setProfile(await createProfile(name)) }, [])
  const updateStudent = useCallback(async (patch: Partial<Pick<LocalProfile,'displayName'|'currentCertification'|'dailyGoalMinutes'>>) => { setProfile(await updateProfile(patch)) }, [])
  const value = useMemo(() => ({ profile, loading, createStudent, updateStudent, refresh }), [profile, loading, createStudent, updateStudent, refresh])
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}

export function useStudent() { const value = useContext(StudentContext); if (!value) throw new Error('useStudent deve ser usado dentro de StudentProvider.'); return value }

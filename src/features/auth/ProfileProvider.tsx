import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { supabase } from '../../lib/supabase'
import type { Profile, ProfileUpdate } from '../../types/profile'
import { useAuth } from './AuthProvider'

interface ProfileContextValue {
  profile: Profile | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
  updateProfile: (patch: ProfileUpdate) => Promise<Profile>
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export function ProfileProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, current_certification, daily_goal_minutes, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle()

    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    setProfile((data as Profile | null) ?? null)
    setLoading(false)
  }, [user])

  useEffect(() => {
    void refreshProfile()
  }, [refreshProfile])

  const updateProfile = useCallback(async (patch: ProfileUpdate) => {
    if (!user) throw new Error('Sessão inválida.')

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', user.id)
      .select('id, display_name, avatar_url, current_certification, daily_goal_minutes, created_at, updated_at')
      .single()

    if (updateError) throw updateError
    const nextProfile = data as Profile
    setProfile(nextProfile)
    return nextProfile
  }, [user])

  const value = useMemo<ProfileContextValue>(() => ({
    profile,
    loading,
    error,
    refreshProfile,
    updateProfile,
  }), [profile, loading, error, refreshProfile, updateProfile])

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile deve ser usado dentro de ProfileProvider.')
  return context
}

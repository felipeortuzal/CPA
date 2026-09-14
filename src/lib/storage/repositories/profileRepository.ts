import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { LocalProfile } from '../types'

export async function getProfile() { return (await getDatabase()).get('profile', 'local') }

export async function createProfile(displayName: string): Promise<LocalProfile> {
  const now = new Date().toISOString()
  const profile: LocalProfile = { id: 'local', displayName: displayName.trim(), currentCertification: 'CPA', dailyGoalMinutes: 30, createdAt: now, updatedAt: now }
  if (!profile.displayName) throw new Error('Informe um nome.')
  await (await getDatabase()).put('profile', profile)
  notifyStorageChanged()
  return profile
}

export async function updateProfile(patch: Partial<Pick<LocalProfile, 'displayName' | 'currentCertification' | 'dailyGoalMinutes'>>): Promise<LocalProfile> {
  const db = await getDatabase()
  const current = await db.get('profile', 'local')
  if (!current) throw new Error('Perfil local ainda não foi criado.')
  const next: LocalProfile = { ...current, ...patch, displayName: patch.displayName !== undefined ? patch.displayName.trim() : current.displayName, updatedAt: new Date().toISOString() }
  if (!next.displayName) throw new Error('Informe um nome.')
  if (next.dailyGoalMinutes < 5 || next.dailyGoalMinutes > 600) throw new Error('A meta diária deve ficar entre 5 e 600 minutos.')
  await db.put('profile', next)
  notifyStorageChanged()
  return next
}

export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  current_certification: string
  daily_goal_minutes: number
  created_at: string
  updated_at: string
}

export type ProfileUpdate = Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'current_certification' | 'daily_goal_minutes'>>

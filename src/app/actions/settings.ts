'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(github: string, linkedin: string) {
  const supabase = createClient()
  
  // 1. Verify identity
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 2. Inject updates into the secure vault
  const { error } = await supabase
    .from('profiles')
    .update({ 
      github_url: github, 
      linkedin_url: linkedin 
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  // 3. Refresh the page cache to show the new saved data
  revalidatePath('/settings')
  return { success: true }
}
export async function updateTags(tags: string[]) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Update Supabase auth metadata securely for $0 storage costs
  const { error } = await supabase.auth.updateUser({
    data: { target_tags: tags }
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
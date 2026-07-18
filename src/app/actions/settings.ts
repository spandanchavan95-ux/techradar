'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Updated to accept the new resume parameter
export async function updateProfile(github: string, linkedin: string, resumeText: string = '') {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 2. Update standard profile URLs
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      github_url: github, 
      linkedin_url: linkedin 
    })
    .eq('id', user.id)

  if (profileError) return { success: false, error: profileError.message }

  // 3. Save the Resume text to the $0 Auth Metadata vault
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { resume_context: resumeText }
  })
  
  if (metadataError) return { success: false, error: metadataError.message }

  revalidatePath('/settings')
  return { success: true }
}

// Global Taxonomy Tag Updater (Keep this as we built it earlier)
export async function updateTags(tags: string[]) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase.auth.updateUser({
    data: { target_tags: tags }
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
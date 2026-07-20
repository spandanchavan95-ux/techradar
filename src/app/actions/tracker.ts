'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveJobToTracker(job: { title: string; company: string; location: string; link: string }) {
  const supabase = createClient()

  // 1. Verify the user is securely logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  // 2. Insert the job into their private RLS vault
  const { error } = await supabase
    .from('user_tracked_items')
    .insert({
      user_id: user.id,
      job_title: job.title,
      company: job.company,
      location: job.location,
      link: job.link,
      status: 'Saved'
    })

  if (error) {
    console.error("Database Injection Error:", error)
    return { success: false, error: error.message }
  }

  // 3. Silently refresh the tracker dashboard in the background so the new job appears
  revalidatePath('/tracker')
  return { success: true }
} 
// Add this below your existing saveJobToTracker function
export async function updateItemStatus(id: string, newStatus: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('user_tracked_items')
    .update({ status: newStatus })
    .eq('id', id)
    .eq('user_id', user.id) // Security check

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/tracker')
  return { success: true }
}
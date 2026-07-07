'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upgradeToPremium() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "Not logged in" }

  // Simulate a Stripe checkout delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Securely mutate the database status to Premium
  const { error } = await supabase
    .from('profiles')
    .update({ 
      is_premium: true,
      subscription_date: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  // Refresh the dashboard to unlock the features
  revalidatePath('/', 'layout')
  return { success: true }
}
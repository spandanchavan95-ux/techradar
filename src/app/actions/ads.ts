'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function checkAdRequirements() {
  const supabase = createClient()
  
  // 1. Immediately bypass ads for Premium users
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single()
      
    if (profile?.is_premium) {
      return { requireAd: false } // VIP Pass
    }
  }

  // 2. Standard Ad-Gating Logic for Free Users
  const cookieStore = cookies()
  const initTime = parseInt(cookieStore.get('app_init_time')?.value || '0')
  const lastAdTime = parseInt(cookieStore.get('last_ad_time')?.value || '0')
  const adCount = parseInt(cookieStore.get('session_ad_count')?.value || '0')
  
  const now = Date.now()
  
  const gracePeriodOver = (now - initTime) > 90000 // 90 seconds
  const cooldownOver = (now - lastAdTime) > 420000 // 7 minutes
  const underLimit = adCount < 5

  if (gracePeriodOver && cooldownOver && underLimit) {
    return { requireAd: true }
  }
  
  return { requireAd: false }
}

export async function logAdCompleted() {
  const cookieStore = cookies()
  const adCount = parseInt(cookieStore.get('session_ad_count')?.value || '0')
  
  cookieStore.set('last_ad_time', Date.now().toString(), { httpOnly: true, secure: true, sameSite: 'lax' })
  cookieStore.set('session_ad_count', (adCount + 1).toString(), { httpOnly: true, secure: true, sameSite: 'lax' })
}
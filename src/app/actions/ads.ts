'use server'

import { cookies } from 'next/headers'

export async function checkAdRequirements() {
  const cookieStore = cookies()
  
  const initTime = parseInt(cookieStore.get('app_init_time')?.value || '0')
  const lastAdTime = parseInt(cookieStore.get('last_ad_time')?.value || '0')
  const adCount = parseInt(cookieStore.get('session_ad_count')?.value || '0')
  
  const now = Date.now()
  
  // 1. Check 90-second grace period (90,000 milliseconds)
  const gracePeriodOver = (now - initTime) > 90000
  
  // 2. Check 7-minute cooldown (420,000 milliseconds)
  const cooldownOver = (now - lastAdTime) > 420000
  
  // 3. Check 5-ad session limit
  const underLimit = adCount < 5

  // If all constraints are met, trigger the ad
  if (gracePeriodOver && cooldownOver && underLimit) {
    return { requireAd: true }
  }
  
  return { requireAd: false }
}

export async function logAdCompleted() {
  const cookieStore = cookies()
  const adCount = parseInt(cookieStore.get('session_ad_count')?.value || '0')
  
  // Update cookies securely on the server
  cookieStore.set('last_ad_time', Date.now().toString(), { httpOnly: true, secure: true, sameSite: 'lax' })
  cookieStore.set('session_ad_count', (adCount + 1).toString(), { httpOnly: true, secure: true, sameSite: 'lax' })
}
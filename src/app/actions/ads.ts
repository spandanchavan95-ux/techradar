'use server'

import { cookies } from 'next/headers'

// Initial grace period: 90 seconds
const GRACE_PERIOD_MS = 90 * 1000
// Cooldown between ads: 7 minutes
const COOLDOWN_MS = 7 * 60 * 1000
// Max ads per session
const MAX_ADS = 5

export async function checkAdEligibility() {
  const cookieStore = cookies()
  const now = Date.now()

  // 1. Check App Initialization Time (Grace Period)
  const appInitTime = cookieStore.get('appInitTime')?.value
  if (!appInitTime) {
    // First time launching app this session
    cookieStore.set('appInitTime', now.toString(), { httpOnly: true, secure: true })
    return { showAd: false, reason: 'grace_period_started' }
  }

  if (now - parseInt(appInitTime) < GRACE_PERIOD_MS) {
    return { showAd: false, reason: 'grace_period_active' }
  }

  // 2. Check Session Ad Count
  const sessionAdCount = parseInt(cookieStore.get('sessionAdCount')?.value || '0')
  if (sessionAdCount >= MAX_ADS) {
    return { showAd: false, reason: 'ad_cap_reached' }
  }

  // 3. Check 7-Minute Cooldown
  const lastAdShownTime = cookieStore.get('lastAdShownTime')?.value
  if (lastAdShownTime && (now - parseInt(lastAdShownTime) < COOLDOWN_MS)) {
    return { showAd: false, reason: 'cooldown_active' }
  }

  // If all checks pass, show the ad
  return { showAd: true }
}

export async function logAdImpression() {
  const cookieStore = cookies()
  const sessionAdCount = parseInt(cookieStore.get('sessionAdCount')?.value || '0')
  
  // Increment count and reset cooldown timer
  cookieStore.set('sessionAdCount', (sessionAdCount + 1).toString(), { httpOnly: true, secure: true })
  cookieStore.set('lastAdShownTime', Date.now().toString(), { httpOnly: true, secure: true })
}
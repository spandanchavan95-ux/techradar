import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import TrackerClientUI from './TrackerClientUI' // We will build this next

export default async function TrackerPage() {
  const supabase = createClient()

  // 1. Fetch User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch their Premium Status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()
    
  const isPremium = profile?.is_premium || false

  // 3. Fetch their Saved Jobs
  const { data: savedJobs } = await supabase
    .from('user_tracked_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const jobs = savedJobs || []
  const trackingLimit = isPremium ? 'Unlimited' : 5
  const isCapped = !isPremium && jobs.length >= 5

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Pass all data to the interactive Client UI */}
        <TrackerClientUI 
          initialJobs={jobs} 
          isCapped={isCapped} 
          currentCount={jobs.length} 
          limit={trackingLimit} 
        />

      </div>
    </main>
  )
}
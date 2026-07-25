import JobCard from "@/components/JobCard"
import { Terminal, Code2, Rocket, Briefcase, Sparkles, Activity, Clock, ShieldCheck } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = createClient()
  
  // 1. Fetch User and their saved Tags
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userTags = user?.user_metadata?.target_tags || []
  
  // 2. Securely determine Premium Status
  let isPremium = false
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()
      
  if (profile?.is_premium) {
    isPremium = true
  }

  // 3. Build the dynamic database query targeting the 'items' table
  let query = supabase
    .from("items")
    .select("*")
    .eq('is_active', true)
    .order("created_at", { ascending: false })
    .limit(50)

  // 4. Enforce the 6-Hour Paywall Delay for Free Users
  if (!isPremium) {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    query = query.lte('created_at', sixHoursAgo)
  }

  const { data: items } = await query
  let allItems = items || []

  // 5. The True Radar: Flag matches against the correct schema columns
  const isTaggingActive = userTags.length > 0
  
  const enrichedItems = allItems.map((item) => {
    let isMatch = false
    if (isTaggingActive) {
      const searchString = `${item.headline} ${item.summary} ${item.source_platform}`.toLowerCase()
      isMatch = userTags.some((tag: string) => searchString.includes(tag.toLowerCase()))
    }
    return { ...item, isMatch }
  })

  // 6. Sort so highlighted matches float to the top
  enrichedItems.sort((a, b) => {
    if (a.isMatch && !b.isMatch) return -1
    if (!a.isMatch && b.isMatch) return 1
    return 0
  })

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-10 animate-in fade-in">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
          <div className="p-4 border border-slate-800 rounded-xl bg-[#0B0F19] flex flex-col shadow-lg">
            <span className="text-slate-500 mb-2 flex items-center"><Terminal className="w-4 h-4 mr-2"/> System Status</span>
            <span className="text-emerald-400 flex items-center font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
              Online & Routing
            </span>
          </div>
          <div className="p-4 border border-slate-800 rounded-xl bg-[#0B0F19] flex flex-col shadow-lg">
            <span className="text-slate-500 mb-2 flex items-center"><Clock className="w-4 h-4 mr-2"/> Data Access</span>
            {isPremium ? (
               <span className="text-emerald-400 font-bold">Instant Zero-Delay</span>
            ) : (
               <span className="text-amber-400 font-bold">6-Hour Standard Delay</span>
            )}
          </div>
          <div className="p-4 border border-slate-800 rounded-xl bg-[#0B0F19] flex flex-col shadow-lg">
            <span className="text-slate-500 mb-2 flex items-center"><Code2 className="w-4 h-4 mr-2"/> Active Scrapers</span>
            <span className="text-slate-200 font-bold">4 / 4 Engines</span>
          </div>
        </div>

        {/* Live Data Feed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6 mt-4">
            <h2 className="text-2xl font-bold flex items-center text-slate-100">
              <Briefcase className="w-6 h-6 mr-3 text-slate-400" /> 
              Live Industry Radar
            </h2>
            
            {isTaggingActive && (
              <div className="flex items-center text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <Sparkles className="w-3 h-3 mr-2" />
                Highlighting {userTags.length} Tags
              </div>
            )}
          </div>
          
          {enrichedItems.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/20 flex flex-col items-center justify-center">
              <Activity className="w-8 h-8 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-300 mb-2">Feed Empty</h3>
              <p className="text-slate-500 max-w-sm">
                {isPremium 
                  ? "The database is currently empty. Run your ingestion scraper to populate the feed."
                  : "No data available older than 6 hours. Upgrade to Premium Pro to bypass this artificial delay."}
              </p>
            </div>
          ) : (
            enrichedItems.map((item) => (
              // Crucial: We pass isPremium here so the JobCard knows to bypass ads!
              <JobCard key={item.id} job={item} isMatch={item.isMatch} isPremium={isPremium} />
            ))
          )}
        </div>
        
      </div>
    </main>
  )
}
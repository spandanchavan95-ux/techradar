import JobCard from "@/components/JobCard"
import { Terminal, Code2, Rocket, Briefcase, Sparkles } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  const supabase = createClient()
  
  // 1. Fetch User and their saved Tags
  const { data: { user } } = await supabase.auth.getUser()
  const userTags = user?.user_metadata?.target_tags || []
  
  // 2. Securely determine Premium Status
  let isPremium = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single()
      
    if (profile?.is_premium) {
      isPremium = true
    }
  }

  // 3. Build the dynamic database query targeting the 'items' table
  let query = supabase
    .from("items")
    .select("*")
    .eq('is_active', true)
    .order("created_at", { ascending: false })

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
    <main className="min-h-screen flex flex-col items-center p-10">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
          <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50 flex flex-col">
            <span className="text-slate-500 mb-2 flex items-center"><Terminal className="w-4 h-4 mr-2"/> System Status</span>
            <span className="text-emerald-400 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
              Online & Routing
            </span>
          </div>
          <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50 flex flex-col">
            <span className="text-slate-500 mb-2 flex items-center"><Rocket className="w-4 h-4 mr-2"/> Data Access</span>
            {isPremium ? (
               <span className="text-emerald-400">Instant (Zero-Delay)</span>
            ) : (
               <span className="text-amber-400">6-Hour Standard Delay</span>
            )}
          </div>
          <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50 flex flex-col">
            <span className="text-slate-500 mb-2 flex items-center"><Code2 className="w-4 h-4 mr-2"/> Active Scrapers</span>
            <span className="text-emerald-400">1 / 4 Engines</span>
          </div>
        </div>

        {/* Live Data Feed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center text-slate-100">
              <Briefcase className="w-5 h-5 mr-2 text-slate-400" /> 
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
            <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 bg-slate-900/20">
              <p className="mb-2">Awaiting data injection from scrapers...</p>
            </div>
          ) : (
            enrichedItems.map((item) => (
              <JobCard key={item.id} job={item} isMatch={item.isMatch} />
            ))
          )}
        </div>
        
      </div>
    </main>
  )
}
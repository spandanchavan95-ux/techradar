import JobCard from "@/components/JobCard";
import { Terminal, Code2, Rocket, Briefcase } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  
  // 1. Securely determine if the user is Premium
  let isPremium = false;
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single();
      
    if (profile?.is_premium) {
      isPremium = true;
    }
  }

  // 2. Build the dynamic database query
  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Enforce the 6-Hour Paywall Delay for Free Users
  if (!isPremium) {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    query = query.lt('created_at', sixHoursAgo);
  }

  const { data: jobs } = await query;

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
          <h2 className="text-xl font-semibold mb-4 flex items-center text-slate-100">
            <Briefcase className="w-5 h-5 mr-2 text-slate-400" /> 
            Live Opportunities
          </h2>
          
          {!jobs || jobs.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500">
              <p>No opportunities found in your access window.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
        
      </div>
    </main>
  );
}
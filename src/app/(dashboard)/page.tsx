import JobCard from "@/components/JobCard";
import { Terminal, Code2, Rocket, Briefcase } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

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
            <span className="text-slate-500 mb-2 flex items-center"><Rocket className="w-4 h-4 mr-2"/> Next Drop In</span>
            <span className="text-slate-300">14:02:59</span>
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
              <p>Awaiting Data Ingestion...</p>
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
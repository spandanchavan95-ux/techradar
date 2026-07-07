import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Briefcase, Plus, AlertCircle, Building2, MapPin, ExternalLink } from 'lucide-react'

export default async function TrackerPage() {
  const supabase = createClient()

  // 1. Securely verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // 2. Fetch ONLY the jobs that belong to this specific user's ID
  const { data: trackedJobs } = await supabase
    .from('user_tracked_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Calculate how many free slots they have used
  const slotsUsed = trackedJobs?.length || 0;

  return (
    <main className="p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
              <Briefcase className="w-8 h-8 mr-3 text-emerald-500" />
              Opportunity Tracker
            </h1>
            <p className="text-slate-400 mt-2">Manage your saved jobs and applications.</p>
          </div>
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center shadow-lg shadow-emerald-900/20">
            <Plus className="w-5 h-5 mr-2" />
            Add Manual Entry
          </button>
        </div>

        {/* Free Tier Limitation Banner */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
           <div className="flex items-center text-slate-300">
              <AlertCircle className="w-5 h-5 mr-3 text-emerald-500" />
              <span>Free Pipeline cap active for your opportunity tracking slots.</span>
           </div>
           <span className="text-slate-400 font-mono text-sm bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
             {slotsUsed} / 5 Slots
           </span>
        </div>

        {/* Saved Jobs Render Feed */}
        <div className="space-y-4 pt-4">
          {!trackedJobs || trackedJobs.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-xl p-16 text-center text-slate-500 flex flex-col items-center">
              <Briefcase className="w-12 h-12 mb-4 text-slate-700" />
              <p className="mb-2 text-lg font-medium text-slate-300">Your tracker is currently empty.</p>
              <p className="text-sm">Go to the Live Radar and save some opportunities.</p>
            </div>
          ) : (
            trackedJobs.map((job) => (
              <div key={job.id} className="p-6 border border-slate-800 rounded-xl bg-slate-900/30 flex justify-between items-center group hover:border-slate-700 transition-all">
                <div>
                  <h3 className="text-lg font-medium text-slate-100 group-hover:text-emerald-400 transition-colors">
                    {job.job_title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center"><Building2 className="w-4 h-4 mr-1"/> {job.company}</span>
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {job.location || 'Remote'}</span>
                    <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono text-xs uppercase tracking-wider">
                      {job.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  )
}
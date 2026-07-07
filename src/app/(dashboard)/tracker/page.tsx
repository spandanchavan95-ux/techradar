import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Briefcase, Plus, AlertCircle } from 'lucide-react'

export default async function TrackerPage() {
  const supabase = createClient()

  // 1. Securely check the server for an active, authenticated user session
  const { data: { user }, error } = await supabase.auth.getUser()

  // 2. If they bypass the login screen, kick them out
  if (error || !user) {
    redirect('/login')
  }

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
          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center">
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
             0 / 5 Slots
           </span>
        </div>

        {/* Secure User Verification Panel */}
        <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center">
          <p className="mb-4">Backend Connection Established.</p>
          <div className="bg-slate-950 border border-slate-800 px-6 py-4 rounded-lg font-mono text-sm flex flex-col items-center space-y-2">
            <span className="text-slate-400">Your secure Row Level Security (RLS) ID is:</span>
            <span className="text-emerald-400 font-bold tracking-wider">{user.id}</span>
          </div>
          <p className="mt-6 text-sm">Because we have this ID, you will only see database rows that belong to you.</p>
        </div>

      </div>
    </main>
  )
}
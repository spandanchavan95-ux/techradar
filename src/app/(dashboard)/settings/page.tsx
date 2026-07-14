import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Settings, Database, Cpu, Activity, CheckCircle2 } from 'lucide-react'
import SettingsForm from './SettingsForm'
import TaxonomyManager from './TaxonomyManager' // Import is here

export default async function SettingsPage() {
  const supabase = createClient()

  // 1. FIRST: Fetch the user from the database
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. SECOND: Now that we have the user, safely extract their tags
  const userTags = user.user_metadata?.target_tags || []

  // 3. Fetch their premium status profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium

  return (
    <main className="p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8 text-emerald-500" />
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Settings & Tags</h1>
              <p className="text-slate-400 mt-1">Configure your data pipeline, taxonomy filters, and AI Co-Pilot parameters.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            <span className="text-sm text-slate-400">Development Mode</span>
            <span className={`text-xs font-mono px-2 py-1 rounded ${isPremium ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
              {isPremium ? 'Premium Pro' : 'Free (Standard)'}
            </span>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Column 1: Developer Profile */}
          <div className="space-y-6">
            <SettingsForm 
              initialGithub={profile?.github_url} 
              initialLinkedin={profile?.linkedin_url} 
              userEmail={user.email || ''} 
            />

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
               <h2 className="text-lg font-semibold text-slate-100 mb-4">Context Vectorization File</h2>
               <div className={`p-4 border border-dashed rounded-lg text-center ${isPremium ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-950'}`}>
                 {isPremium ? (
                   <span className="text-sm text-emerald-400 flex flex-col items-center">
                     <CheckCircle2 className="w-6 h-6 mb-2" /> core_resume.pdf uploaded
                   </span>
                 ) : (
                   <span className="text-sm text-slate-500 flex flex-col items-center">
                     <LockIcon /> Premium required for resume vectorization
                   </span>
                 )}
               </div>
            </div>
          </div>

          {/* Column 2: Global Taxonomy Configuration (NOW LIVE) */}
          <TaxonomyManager initialTags={userTags} />

          {/* Column 3: System Ingestion Pipeline */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-emerald-500" /> System Pipeline
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium text-slate-300 flex items-center"><Database className="w-4 h-4 mr-2 text-emerald-500"/> Supabase Nodes</span>
                 <span className="text-xs text-emerald-500 font-mono">100%</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
               </div>
               <div className="text-xs text-slate-500 space-y-1 font-mono">
                 <p>Status: Connections: 1</p>
                 <p>Next run: 0h 20m</p>
               </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium text-slate-300 flex items-center"><Cpu className="w-4 h-4 mr-2 text-emerald-500"/> Groq Llama 3.1</span>
                 <span className="text-xs text-emerald-500 font-mono">Healthy</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[12%]"></div>
               </div>
               <div className="text-xs text-slate-500 space-y-1 font-mono">
                 <p>API calls: 410 / 14k daily limit</p>
                 <p>Latency: ~400ms</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-slate-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  )
}
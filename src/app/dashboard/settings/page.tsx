import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Settings } from 'lucide-react'
import SettingsForm from './SettingsForm'
import TaxonomyManager from './TaxonomyManager'
import SystemPipelineUI from './SystemPipelineUI' // Injecting the new component

export default async function SettingsPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userTags = user.user_metadata?.target_tags || []
  const savedResumeText = user.user_metadata?.resume_context || ''

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium || false

  // FETCH REAL API USAGE FOR TODAY
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { count: aiUsageCount } = await supabase
    .from('ai_usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', twentyFourHoursAgo)

  return (
    <main className="p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8 text-emerald-500" />
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Settings & Tags</h1>
              <p className="text-slate-400 mt-1">Configure your data pipeline, taxonomy filters, and system parameters.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            <span className="text-sm text-slate-400">Development Mode</span>
            <span className={`text-xs font-mono px-2 py-1 rounded ${isPremium ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
              {isPremium ? 'Premium Pro' : 'Free (Standard)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="space-y-6">
            <SettingsForm 
              initialGithub={profile?.github_url} 
              initialLinkedin={profile?.linkedin_url} 
              initialResumeText={savedResumeText}
              userEmail={user.email || ''} 
            />
          </div>

          <TaxonomyManager initialTags={userTags} />

          {/* THE NEW LIVE TELEMETRY MODULE */}
          <SystemPipelineUI aiUsageCount={aiUsageCount || 0} isPremium={isPremium} />
        </div>
      </div>
    </main>
  )
}
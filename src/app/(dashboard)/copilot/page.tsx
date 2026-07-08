import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Terminal, Lock } from 'lucide-react'
import Link from 'next/link'
import CopilotInterface from '@/components/CopilotInterface'

export default async function CopilotPage() {
  const supabase = createClient()

  // 1. Verify User Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Verify Premium Status securely from the database vault
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  // If they are not premium, show the hard paywall
  if (!profile?.is_premium) {
    return (
      <main className="p-10 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Premium Feature Locked</h2>
          <p className="text-slate-400 mb-8">
            The AI Co-Pilot requires a Premium Pro subscription to access the Llama 3.1 generation engine.
          </p>
          <Link 
            href="/premium"
            className="block w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors"
          >
            Upgrade to Unlock
          </Link>
        </div>
      </main>
    )
  }

  // If they are premium, show the AI Interface Shell
  return (
    <main className="p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <Terminal className="w-8 h-8 text-emerald-500" />
          <div>
            <h1 className="text-3xl font-bold text-slate-100">AI Co-Pilot</h1>
            <p className="text-slate-400 mt-1">Automated outreach drafting powered by Groq Llama 3.1.</p>
          </div>
        </div>

        {/* Active AI Terminal Component */}
        <CopilotInterface />

      </div>
    </main>
  )
}
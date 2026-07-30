import Link from 'next/link'
import { Radar, Briefcase, Settings, Zap } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  // 1. Authenticate the User
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: { user: _user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-950 grid grid-cols-[256px_1fr]">
      
      {/* CSS Grid Sidebar (Sticky instead of Fixed) */}
      <aside className="bg-[#0B0F19] border-r border-slate-800 flex flex-col sticky top-0 h-screen z-50">
        
        {/* App Branding */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center text-xl font-bold text-slate-100 hover:opacity-80 transition-opacity">
            <Radar className="w-6 h-6 text-emerald-500 mr-2" />
            TechRadar
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            href="/" 
            className="flex items-center px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-900/50 rounded-lg transition-all"
          >
            <Radar className="w-5 h-5 mr-3" />
            Live Radar
          </Link>
          
          <Link 
            href="/tracker" 
            className="flex items-center px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-900/50 rounded-lg transition-all"
          >
            <Briefcase className="w-5 h-5 mr-3" />
            Opportunity Tracker
          </Link>
          <Link 
            href="/settings" 
            className="flex items-center px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-900/50 rounded-lg transition-all"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings & Tags
          </Link>
        </nav>

        {/* Premium Hub CTA */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            href="/premium" 
            className="flex items-center justify-center w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
          >
            <Zap className="w-5 h-5 mr-2" />
            Premium Hub
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-full min-h-screen overflow-x-hidden">
        {children}
      </main>
      
    </div>
  )
}
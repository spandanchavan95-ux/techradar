import { Radar, Briefcase, Terminal, Settings, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Persistent Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col p-4 sticky top-0 h-screen">
        <div className="flex items-center space-x-3 mb-10 px-2 mt-4">
          <Radar className="w-7 h-7 text-emerald-500" />
          <span className="font-bold text-xl tracking-tight">TechRadar</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium">
            <Radar className="w-5 h-5" /> <span>Live Radar</span>
          </Link>
          <Link href="/tracker" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors">
            <Briefcase className="w-5 h-5" /> <span>Opportunity Tracker</span>
          </Link>
          <Link href="/copilot" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors">
            <Terminal className="w-5 h-5" /> <span>AI Co-Pilot</span>
          </Link>
          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors">
            <Settings className="w-5 h-5" /> <span>Settings & Tags</span>
          </Link>
        </nav>

        <div className="mt-auto mb-4">
          <Link href="/premium" className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-900/20">
            <Zap className="w-5 h-5 fill-slate-950" /> <span>Premium Hub</span>
          </Link>
        </div>
      </aside>

      {/* Dynamic Center Feed */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </>
  );
}
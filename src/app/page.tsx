import { Terminal, Radar, Code2, Rocket, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-24 p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-zinc-800 pb-6">
          <Radar className="w-8 h-8 text-emerald-500 animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tight">TechRadar</h1>
          <span className="px-2 py-1 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded text-zinc-400">v1.0.0-alpha</span>
        </div>

        {/* Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
          <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 flex flex-col">
            <span className="text-zinc-500 mb-2 flex items-center"><Terminal className="w-4 h-4 mr-2"/> System Status</span>
            <span className="text-emerald-400 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
              Online & Routing
            </span>
          </div>
          <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 flex flex-col">
            <span className="text-zinc-500 mb-2 flex items-center"><Rocket className="w-4 h-4 mr-2"/> Next Drop In</span>
            <span className="text-zinc-300">14:02:59</span>
          </div>
          <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 flex flex-col">
            <span className="text-zinc-500 mb-2 flex items-center"><Code2 className="w-4 h-4 mr-2"/> Active Scrapers</span>
            <span className="text-zinc-300">0 / 4 Engines</span>
          </div>
        </div>

        {/* Empty State Feed */}
        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center flex flex-col items-center justify-center text-zinc-500">
          <Briefcase className="w-12 h-12 mb-4 text-zinc-700" />
          <h3 className="text-lg font-medium text-zinc-300 mb-1">Awaiting Data Ingestion</h3>
          <p className="max-w-sm">The UI shell is mounted. Database hooks are ready. We need to build the API scrapers to populate this feed.</p>
        </div>
      </div>
    </main>
  );
}
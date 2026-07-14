'use client'

import { ExternalLink, BookmarkPlus, Sparkles } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  link: string
  source?: string
}

interface JobCardProps {
  job: Job
  isMatch?: boolean
}

export default function JobCard({ job, isMatch = false }: JobCardProps) {
  return (
    <div 
      className={`p-6 bg-[#0B0F19]/60 backdrop-blur-sm rounded-xl transition-all duration-300 border relative overflow-hidden group ${
        isMatch 
          ? 'border-emerald-500/60 bg-gradient-to-r from-slate-900 via-emerald-950/10 to-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
          : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/20'
      }`}
    >
      {/* Background radial accent for matched elements */}
      {isMatch && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex justify-between items-start gap-4">
        
        {/* Left Section: Job Metadata */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
              {job.title}
            </h3>
            
            {/* Highly visible Priority Badge for matches */}
            {isMatch && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" />
                MATCH
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center text-sm font-medium text-slate-400 gap-x-4 gap-y-1">
            <span className="text-slate-300 font-semibold">{job.company}</span>
            <span className="text-slate-500">•</span>
            <span>{job.location}</span>
            {job.source && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono bg-slate-800/50 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  {job.source}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Section: Action Elements */}
        <div className="flex items-center space-x-2 shrink-0">
          <a 
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-md"
            title="Open Original Listing"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Card Footer Integration */}
      <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-xs font-mono text-slate-500">
        <button className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors font-medium text-sm mt-1">
          <BookmarkPlus className="w-4 h-4 mr-1.5" />
          Save to Opportunity Tracker
        </button>
      </div>

    </div>
  )
}
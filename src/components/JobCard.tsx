'use client'

import { useState } from 'react'
import { ExternalLink, BookmarkPlus, Sparkles, Loader2, Check } from 'lucide-react'
import { saveJobToTracker } from '@/app/actions/tracker' 

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
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // 1. New function to open the job link when the card is clicked
  const handleCardClick = () => {
    window.open(job.link, '_blank', 'noopener,noreferrer')
  }

  const handleSave = async (e: React.MouseEvent) => {
    // 2. STOP PROPAGATION: Prevents the card's click event from firing when saving
    e.stopPropagation() 
    
    setIsSaving(true)
    const result = await saveJobToTracker({
      title: job.title,
      company: job.company,
      location: job.location,
      link: job.link
    })
    
    if (result.success) {
      setIsSaved(true)
    } else {
      alert("Failed to save opportunity.")
    }
    setIsSaving(false)
  }

  return (
    <div 
      onClick={handleCardClick} // 3. Added click handler to the root div
      className={`p-6 bg-[#0B0F19]/60 backdrop-blur-sm rounded-xl transition-all duration-300 border relative overflow-hidden group cursor-pointer ${
        isMatch 
          ? 'border-emerald-500/60 bg-gradient-to-r from-slate-900 via-emerald-950/10 to-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400' 
          : 'border-slate-800/80 hover:border-slate-600 bg-slate-900/20'
      }`}
    >
      {isMatch && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
              {job.title}
            </h3>
            
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
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }} // Stop propagation here too
            className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-xs font-mono text-slate-500">
        <button 
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`flex items-center transition-colors font-medium text-sm mt-1 disabled:opacity-80 ${
            isSaved ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400 z-10 relative'
          }`}
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : 
           isSaved ? <Check className="w-4 h-4 mr-1.5" /> : 
           <BookmarkPlus className="w-4 h-4 mr-1.5" />}
          {isSaved ? 'Saved to Tracker' : 'Save to Opportunity Tracker'}
        </button>
      </div>
    </div>
  )
}
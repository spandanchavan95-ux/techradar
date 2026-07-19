'use client'

import { useState } from 'react'
import { ExternalLink, BookmarkPlus, Sparkles, Loader2, Check, Clock, ChevronRight, Zap } from 'lucide-react'
import { saveJobToTracker } from '@/app/actions/tracker'

interface Job {
  id: string
  title: string
  company: string
  location: string
  link: string
  source?: string
  created_at?: string // Added timestamp
  description?: string // Added for summary
}

interface JobCardProps {
  job: Job
  isMatch?: boolean
}

// Helper function to format time (e.g., "2 hours ago")
function getRelativeTime(dateString?: string) {
  if (!dateString) return 'Just now'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 172800) return 'Yesterday'
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export default function JobCard({ job, isMatch = false }: JobCardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  // NEW: State for the in-app Modal and AI Analysis
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiImpact, setAiImpact] = useState('')

  const handleCardClick = () => {
    setIsModalOpen(true) // Opens the in-app reader instead of a new tab
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation() 
    setIsSaving(true)
    const result = await saveJobToTracker({
      title: job.title, company: job.company, location: job.location, link: job.link
    })
    if (result.success) setIsSaved(true)
    setIsSaving(false)
  }

  const handleAnalyzeImpact = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAnalyzing(true)
    // We will connect this to Groq Llama 3.1 in the next step!
    setTimeout(() => {
      setAiImpact("AI ANALYSIS: This technology shift heavily impacts modern web development. Based on your saved context, you should focus on learning how this integrates with your existing Python backend architecture to maintain a competitive edge.")
      setIsAnalyzing(false)
    }, 2000)
  }

  const timeAgo = getRelativeTime(job.created_at)
  const displaySummary = job.description || "A major update has been detected in the tech landscape regarding this topic. Read the full analysis or view the original source for complete technical details."

  return (
    <>
      {/* 1. THE RADAR CARD (Clicking this opens the modal) */}
      <div 
        onClick={handleCardClick}
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
                  <Sparkles className="w-3 h-3 mr-1" /> MATCH
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center text-sm font-medium text-slate-400 gap-x-4 gap-y-1">
              <span className="text-slate-300 font-semibold">{job.company}</span>
              <span className="text-slate-500">•</span>
              <span>{job.location}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center text-slate-500 text-xs font-mono">
                <Clock className="w-3 h-3 mr-1" /> {timeAgo}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all shadow-md">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-xs font-mono text-slate-500">
          <button 
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`flex items-center transition-colors font-medium text-sm mt-1 disabled:opacity-80 z-10 relative ${
              isSaved ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : 
             isSaved ? <Check className="w-4 h-4 mr-1.5" /> : 
             <BookmarkPlus className="w-4 h-4 mr-1.5" />}
            {isSaved ? 'Saved to Tracker' : 'Save Opportunity'}
          </button>
        </div>
      </div>

      {/* 2. THE IN-APP READER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-300 font-semibold text-sm">{job.company}</span>
                  <span className="text-slate-500 text-xs font-mono flex items-center"><Clock className="w-3 h-3 mr-1"/> {timeAgo}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-100 leading-tight">{job.title}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg transition-colors">
                ✕
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Summary Section */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Quick Summary</h3>
                <p className="text-slate-300 leading-relaxed text-sm">{displaySummary}</p>
              </div>

              {/* AI Impact Section */}
              <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                
                {!aiImpact && !isAnalyzing ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-400">
                      <strong className="text-slate-200 block mb-1">How does this affect you?</strong>
                      Use AI to synthesize this news against your saved career context.
                    </div>
                    <button onClick={handleAnalyzeImpact} className="shrink-0 flex items-center bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg font-mono text-xs transition-colors">
                      <Zap className="w-4 h-4 mr-2" /> Synthesize Impact
                    </button>
                  </div>
                ) : isAnalyzing ? (
                  <div className="flex items-center justify-center py-4 text-emerald-500 font-mono text-xs animate-pulse">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" /> Cross-referencing with your Resume Context...
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in">
                    <div className="flex items-center text-emerald-400 font-mono text-xs font-bold mb-3">
                      <Sparkles className="w-4 h-4 mr-2" /> AI IMPACT ANALYSIS
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{aiImpact}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center gap-4">
              <button onClick={handleSave} disabled={isSaving || isSaved} className={`flex items-center transition-colors font-medium text-sm disabled:opacity-50 ${isSaved ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>
                {isSaved ? <Check className="w-4 h-4 mr-2" /> : <BookmarkPlus className="w-4 h-4 mr-2" />}
                {isSaved ? 'Saved' : 'Save'}
              </button>
              
              <a 
                href={job.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center bg-slate-100 hover:bg-white text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors"
              >
                Read Full Original Source <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
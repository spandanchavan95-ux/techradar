'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, BookmarkPlus, Sparkles, Loader2, Check, Clock, ChevronRight, Zap } from 'lucide-react'
import { saveJobToTracker } from '@/app/actions/tracker'
import { synthesizeImpact } from '@/app/actions/ai'
import AdInterceptor from '@/components/AdInterceptor'

// 1. Updated Interface to accept the Python Scraper's column names
interface Job {
  id: string
  title?: string
  headline?: string
  company?: string
  source_platform?: string
  location?: string
  link?: string
  raw_url?: string
  created_at?: string
  description?: string
  summary?: string
}

interface JobCardProps {
  job: Job
  isMatch?: boolean
  isPremium?: boolean
}

// Time calculator
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

export default function JobCard({ job, isMatch = false, isPremium = false }: JobCardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiImpact, setAiImpact] = useState('')

  // NEW: Secure Client-Side Time State
  const [timeAgo, setTimeAgo] = useState<string>('Syncing time...')

  // NEW: Force time calculation into the local browser timezone & make it tick live
  useEffect(() => {
    // Run initial calculation
    setTimeAgo(getRelativeTime(job.created_at))
    
    // Set a live interval to refresh the time every 60 seconds
    const timer = setInterval(() => {
      setTimeAgo(getRelativeTime(job.created_at))
    }, 60000)
    
    return () => clearInterval(timer)
  }, [job.created_at])

  // Safely map the variables
  const displayTitle = job.title || job.headline || 'Incoming Radar Alert'
  const displayCompany = job.company || job.source_platform?.replace('_', ' ').toUpperCase() || 'System Feed'
  const displayLink = job.link || job.raw_url || '#'
  const displaySummary = job.description || job.summary || "A major update has been detected in the tech landscape. Read the full analysis or view the original source for complete technical details."
  const displayLocation = job.location || 'Remote / Global'

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation() 
    setIsSaving(true)
    const result = await saveJobToTracker({
      title: displayTitle, 
      company: displayCompany, 
      location: displayLocation, 
      link: displayLink
    })
    if (result.success) setIsSaved(true)
    setIsSaving(false)
  }

  const handleAnalyzeImpact = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAnalyzing(true)
    
    const result = await synthesizeImpact(displayTitle, displaySummary)
    
    if (result.success) {
      setAiImpact(result.analysis || '')
    } else {
      setAiImpact(`SYSTEM ERROR: ${result.error}`)
    }
    
    setIsAnalyzing(false)
  }

  return (
    <>
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
                {displayTitle}
              </h3>
              {isMatch && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" /> MATCH
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center text-sm font-medium text-slate-400 gap-x-4 gap-y-1">
              <span className="text-slate-300 font-semibold">{displayCompany}</span>
              <span className="text-slate-500">•</span>
              <span>{displayLocation}</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-300 font-semibold text-sm">{displayCompany}</span>
                  <span className="text-slate-500 text-xs font-mono flex items-center"><Clock className="w-3 h-3 mr-1"/> {timeAgo}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-100 leading-tight">{displayTitle}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Quick Summary</h3>
                <p className="text-slate-300 leading-relaxed text-sm">{displaySummary}</p>
              </div>

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

            <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center gap-4">
              <button onClick={handleSave} disabled={isSaving || isSaved} className={`flex items-center transition-colors font-medium text-sm disabled:opacity-50 ${isSaved ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>
                {isSaved ? <Check className="w-4 h-4 mr-2" /> : <BookmarkPlus className="w-4 h-4 mr-2" />}
                {isSaved ? 'Saved' : 'Save'}
              </button>
              
              <AdInterceptor url={displayLink} isPremium={isPremium}>
                <div className="flex items-center justify-center bg-slate-100 hover:bg-white text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors cursor-pointer w-full md:w-auto">
                  Read Full Original Source <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </AdInterceptor>
              
            </div>
          </div>
        </div>
      )}
    </>
  )
}
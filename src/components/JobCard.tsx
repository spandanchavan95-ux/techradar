'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Building2, MapPin, Loader2, BookmarkPlus, Check } from 'lucide-react'
import { checkAdRequirements, logAdCompleted } from '@/app/actions/ads'
import { saveJobToTracker } from '@/app/actions/tracker'

interface JobCardProps {
  job: { title: string; company: string; location: string; link: string }
}

export default function JobCard({ job }: JobCardProps) {
  const [isRouting, setIsRouting] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [countdown, setCountdown] = useState(5)
  
  // New state variables for the Tracker integration
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showAdModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [showAdModal, countdown])

  // Handles the Ad-Gated Routing
  const handleLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsRouting(true)

    const status = await checkAdRequirements()

    if (status.requireAd) {
      setIsRouting(false)
      setShowAdModal(true)
    } else {
      window.open(job.link, '_blank', 'noopener,noreferrer')
      setIsRouting(false)
    }
  }

  const handleSkipAd = async () => {
    await logAdCompleted() 
    setShowAdModal(false)
    setCountdown(5) 
    window.open(job.link, '_blank', 'noopener,noreferrer')
  }

  // Handles saving the job to the backend Supabase table
  const handleSaveToTracker = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Stops the click from triggering the ad-router
    
    setIsSaving(true)
    const result = await saveJobToTracker(job)
    
    if (result.success) {
      setIsSaved(true)
    } else {
      alert("Failed to save job. Ensure you are logged in.")
    }
    setIsSaving(false)
  }

  return (
    <>
      <div 
        onClick={handleLinkClick}
        className="block p-6 border border-slate-800 rounded-xl bg-slate-900/30 hover:bg-slate-900/80 transition-colors group relative cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-slate-100 group-hover:text-emerald-400 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center"><Building2 className="w-4 h-4 mr-1"/> {job.company}</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {job.location}</span>
            </div>
          </div>
          {isRouting ? (
             <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
          ) : (
             <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          )}
        </div>

        {/* New Action Bar matching the Blueprint UI */}
        <div className="flex items-center space-x-6 mt-5 pt-4 border-t border-slate-800/50 text-sm font-medium">
           <button 
             onClick={handleSaveToTracker} 
             disabled={isSaved || isSaving} 
             className="flex items-center text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
               isSaved ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : 
               <BookmarkPlus className="w-4 h-4 mr-2" />}
              {isSaved ? "Saved to Tracker" : "Save to Opportunity Tracker"}
           </button>
        </div>
      </div>

      {/* 5-Second Fullscreen Interstitial Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Sponsor Message</h2>
            <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-8 border border-slate-700">
              <span className="text-slate-500 font-mono">Premium Partner Ad Space</span>
            </div>
            
            {countdown > 0 ? (
              <div className="w-full py-3 px-4 bg-slate-800/50 text-slate-300 rounded-lg font-mono text-sm border border-slate-800">
                You can skip this ad in <span className="text-emerald-400 font-bold">{countdown}</span> seconds...
              </div>
            ) : (
              <button 
                onClick={handleSkipAd}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors"
              >
                Skip Ad & Continue →
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
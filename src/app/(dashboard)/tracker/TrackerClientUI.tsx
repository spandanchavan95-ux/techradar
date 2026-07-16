'use client'

import { useState } from 'react'
import { Briefcase, AlertCircle, ExternalLink, Plus, Loader2 } from 'lucide-react'
import { saveJobToTracker } from '@/app/actions/tracker'
import { useRouter } from 'next/navigation'

export default function TrackerClientUI({ initialJobs, isCapped, currentCount, limit }: any) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Modal Form State
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [link, setLink] = useState('')

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const result = await saveJobToTracker({ title, company, location, link })
    
    if (result.success) {
      setIsModalOpen(false)
      setTitle(''); setCompany(''); setLocation(''); setLink('');
      router.refresh() // Instantly updates the list with the new job
    } else {
      alert("Failed to add entry: " + result.error)
    }
    setIsSaving(false)
  }

  const handleCardClick = (url: string) => {
    if(url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Header Area */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-emerald-500" />
            Opportunity Tracker
          </h1>
          <p className="text-slate-400 mt-2">Manage your saved jobs and applications.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={isCapped}
          className="flex items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Add Manual Entry
        </button>
      </div>

      {/* Quota Alert */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center text-slate-300">
          <AlertCircle className="w-5 h-5 mr-3 text-emerald-500" />
          <span>Free Pipeline cap active for your opportunity tracking slots.</span>
        </div>
        <div className="text-xs font-mono bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md text-slate-400">
          {currentCount} / {limit} Slots
        </div>
      </div>

      {/* Tracked Jobs List */}
      <div className="space-y-4 pt-4">
        {initialJobs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Your tracker is currently empty.
          </div>
        ) : (
          initialJobs.map((job: any) => (
            <div 
              key={job.id} 
              onClick={() => handleCardClick(job.link)}
              className="bg-[#0B0F19]/60 border border-slate-800 hover:border-slate-600 rounded-xl p-6 flex justify-between items-center group cursor-pointer transition-colors"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {job.job_title}
                </h3>
                <div className="flex items-center text-sm font-medium text-slate-400 gap-3">
                  <span>{job.company}</span>
                  <span className="text-slate-600">•</span>
                  <span>{job.location}</span>
                  <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 ml-2">
                    SAVED
                  </span>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleCardClick(job.link); }}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Add Manual Entry</h2>
            
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Job Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 outline-none" placeholder="e.g. Frontend Developer" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Company</label>
                <input required value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 outline-none" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Location</label>
                <input required value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 outline-none" placeholder="e.g. Remote" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Job URL</label>
                <input required type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 outline-none" placeholder="https://..." />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-400 bg-slate-900 hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors flex justify-center items-center">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
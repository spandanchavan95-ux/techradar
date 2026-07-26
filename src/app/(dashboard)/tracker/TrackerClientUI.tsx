'use client'

import { useState } from 'react'
import { Briefcase, AlertCircle, ExternalLink, Plus, Loader2, Zap, Copy, Check, X } from 'lucide-react'
import { saveJobToTracker, updateItemStatus } from '@/app/actions/tracker'
import { generateActionPlan } from '@/app/actions/ai'
import { useRouter } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TrackerClientUI({ initialJobs, isCapped, currentCount, limit }: any) {
  const router = useRouter()
  
  // Modals & Saving State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  
  // AI Strategy Panel State
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [actionPlan, setActionPlan] = useState<string>('')
  const [isCopied, setIsCopied] = useState(false)
  
  // Dropdown State
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
  
  // Form State
  const [title, setTitle] = useState(''); const [company, setCompany] = useState('')
  const [location, setLocation] = useState(''); const [link, setLink] = useState('')

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const result = await saveJobToTracker({ title, company, location, link })
    if (result.success) {
      setIsModalOpen(false)
      setTitle(''); setCompany(''); setLocation(''); setLink('');
      router.refresh() 
    }
    setIsSaving(false)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    await updateItemStatus(id, newStatus)
    setUpdatingId(null)
    router.refresh()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGenerateStrategy = async (job: any) => {
    setAiGeneratingId(job.id)
    
    // Call the newly minted Backend AI function
    const result = await generateActionPlan(job.job_title, job.company, job.location)
    
    if (result.success) {
      setActionPlan(result.plan || '')
    } else {
      setActionPlan(`SYSTEM ERROR: ${result.error}`)
    }
    
    setIsPanelOpen(true) // Open the panel even if there is an error
    setAiGeneratingId(null)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(actionPlan)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return 'text-sky-400 bg-sky-500/10 border-sky-500/20 hover:border-sky-400/40'
      case 'Interviewing': return 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-400/40'
      case 'Offered': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-400/40'
      case 'Rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:border-rose-400/40'
      default: return 'text-slate-400 bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
    }
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-emerald-500" />
            Execution Pipeline
          </h1>
          <p className="text-slate-400 mt-2">Manage applications and generate AI outreach strategies.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={isCapped}
          className="flex items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus className="w-5 h-5 mr-1.5" />
          Add Manual Entry
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex justify-between items-center mt-6">
        <div className="flex items-center text-slate-300">
          <AlertCircle className="w-5 h-5 mr-3 text-emerald-500" />
          <span>Active pipeline capacity for tracking opportunities.</span>
        </div>
        <div className="text-xs font-mono bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md text-slate-400">
          {currentCount} / {limit} Slots Used
        </div>
      </div>

      {/* The Execution Funnel List - FIXED PADDING */}
      <div className="space-y-4 pt-4 pb-48">
        {initialJobs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Your pipeline is empty. Save opportunities from the Live Radar.
          </div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialJobs.map((job: any) => (
            <div key={job.id} className="bg-[#0B0F19]/60 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors hover:border-slate-700">
              
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold text-slate-100">{job.job_title}</h3>
                <div className="flex items-center text-sm font-medium text-slate-400 gap-3">
                  <span>{job.company}</span>
                  <span className="text-slate-600">•</span>
                  <span>{job.location}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap relative">
                
                {/* AI Strategy Trigger */}
                <button 
                  onClick={() => handleGenerateStrategy(job)}
                  disabled={aiGeneratingId === job.id}
                  className="flex items-center bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-mono text-xs transition-colors"
                >
                  {aiGeneratingId === job.id ? <Loader2 className="w-3 h-3 mr-2 animate-spin text-emerald-500"/> : <Zap className="w-3 h-3 mr-2 text-emerald-500"/>}
                  AI Action Plan
                </button>

                <div className="relative">
                  {updatingId === job.id && (
                    <div className="absolute -left-6 top-2"><Loader2 className="w-4 h-4 animate-spin text-slate-500"/></div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdownId(activeDropdownId === job.id ? null : job.id);
                    }}
                    disabled={updatingId === job.id}
                    className={`px-3 py-1.5 rounded border text-xs font-bold font-mono transition-all duration-200 flex items-center gap-2 min-w-[110px] justify-between shadow-sm ${getStatusColor(job.status || 'Saved')}`}
                  >
                    <span>{job.status || 'Saved'}</span>
                    <span className="text-[9px] opacity-50 select-none">▼</span>
                  </button>

                  {/* FIXED POSITIONING: top-full and z-50 */}
                  {activeDropdownId === job.id && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setActiveDropdownId(null)} />
                      <div className="absolute right-0 top-full mt-1.5 w-36 bg-[#0E1322] border border-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-100">
                        {['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'].map((statusOption) => (
                          <button
                            key={statusOption}
                            onClick={() => {
                              handleStatusChange(job.id, statusOption);
                              setActiveDropdownId(null);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors hover:bg-slate-800 ${
                              (job.status || 'Saved') === statusOption 
                                ? 'text-emerald-400 font-bold bg-emerald-500/5' 
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {statusOption}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <a href={job.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
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
              <div><label className="block text-xs font-mono text-slate-500 mb-1">Job Title</label><input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none" /></div>
              <div><label className="block text-xs font-mono text-slate-500 mb-1">Company</label><input required value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none" /></div>
              <div><label className="block text-xs font-mono text-slate-500 mb-1">Location</label><input required value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none" /></div>
              <div><label className="block text-xs font-mono text-slate-500 mb-1">URL</label><input required type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none" /></div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-slate-900">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2 rounded-lg text-sm font-bold text-slate-950 bg-emerald-500">{isSaving ? 'Saving...' : 'Save Entry'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Action Plan Sliding Panel */}
      {isPanelOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsPanelOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0B0F19] border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
              <div className="flex items-center text-emerald-400 font-bold font-mono">
                <Zap className="w-5 h-5 mr-2" />
                AI Outreach Strategy
              </div>
              <button onClick={() => setIsPanelOpen(false)} className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {actionPlan}
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <button 
                onClick={copyToClipboard}
                className="w-full flex justify-center items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg transition-colors"
              >
                {isCopied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                {isCopied ? 'Copied to Clipboard!' : 'Copy Strategy'}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  )
}
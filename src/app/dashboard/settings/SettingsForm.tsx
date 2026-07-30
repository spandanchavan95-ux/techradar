'use client'

import { useState } from 'react'
import { Loader2, Check, User, FileText } from 'lucide-react'
import { updateProfile } from '@/app/actions/settings'

interface SettingsFormProps {
  initialGithub: string
  initialLinkedin: string
  initialResumeText?: string
  userEmail: string
}

export default function SettingsForm({ initialGithub, initialLinkedin, initialResumeText = '', userEmail }: SettingsFormProps) {
  const [github, setGithub] = useState(initialGithub || '')
  const [linkedin, setLinkedin] = useState(initialLinkedin || '')
  const [resumeText, setResumeText] = useState(initialResumeText || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setIsSaved(false)
    
    // Save Github, Linkedin, and user metadata content via Server Action execution
    const result = await updateProfile(github, linkedin, resumeText)
    
    if (result.success) {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } else {
      alert("Failed to save settings configurations.")
    }
    
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Identity Configuration Panel */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center">
            <User className="w-5 h-5 mr-2 text-emerald-500" /> Developer Profile
          </h2>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-1.5 rounded flex items-center transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : 
             isSaved ? <Check className="w-3 h-3 mr-1" /> : null}
            {isSaved ? "Saved" : "Save Changes"}
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">Account Email</label>
            <input disabled value={userEmail} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed border-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">GitHub Profile</label>
            <input 
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="github.com/username" 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-emerald-500/50 outline-none transition-colors" 
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">LinkedIn URL</label>
            <input 
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="linkedin.com/in/username" 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-emerald-500/50 outline-none transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Lean Context Integration Module */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-2 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-emerald-500" /> Context AI Ingestion
        </h2>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Paste your raw text resume below. The AI extraction pipeline automatically references this text data to generate personalized outreach drafts inside the Co-Pilot suite.
        </p>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="PASTE RESUME CONTENT: e.g., Full Stack Engineer specialized in Next.js, Python scrapers, and automated workflows..."
          className="w-full h-44 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:border-emerald-500/50 outline-none resize-none placeholder-slate-600 leading-relaxed"
        />
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Loader2, Check, User } from 'lucide-react'
import { updateProfile } from '@/app/actions/settings'

export default function SettingsForm({ initialGithub, initialLinkedin, userEmail }: { initialGithub: string, initialLinkedin: string, userEmail: string }) {
  const [github, setGithub] = useState(initialGithub || '')
  const [linkedin, setLinkedin] = useState(initialLinkedin || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    setIsSaved(false)
    
    // Call the backend Server Action
    const result = await updateProfile(github, linkedin)
    
    if (result.success) {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } else {
      alert("Failed to save settings.")
    }
    
    setIsSaving(false)
  }

  return (
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
          <input disabled value={userEmail} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 mb-1">GitHub Profile</label>
          <input 
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="github.com/username" 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-emerald-500 outline-none transition-colors" 
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 mb-1">LinkedIn URL</label>
          <input 
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="linkedin.com/in/username" 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-emerald-500 outline-none transition-colors" 
          />
        </div>
      </div>
    </div>
  )
}
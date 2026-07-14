'use client'

import { useState } from 'react'
import { Tag, Loader2 } from 'lucide-react'
import { updateTags } from '@/app/actions/settings'

const TARGET_TECH = ['Python', 'Linux', 'Generative AI', 'React', 'TypeScript']
const OPP_TYPES = ['Internship', 'Free Certificate', 'Remote', 'Hackathon']

export default function TaxonomyManager({ initialTags = [] }: { initialTags: string[] }) {
  const [activeTags, setActiveTags] = useState<string[]>(initialTags)
  const [isSaving, setIsSaving] = useState(false)

  const toggleTag = async (tag: string) => {
    // 1. Calculate the new array of tags
    const newTags = activeTags.includes(tag) 
      ? activeTags.filter(t => t !== tag) 
      : [...activeTags, tag]
    
    // 2. Instantly update the UI so it feels "buttery smooth"
    setActiveTags(newTags)
    setIsSaving(true)

    // 3. Save silently to the Supabase backend
    await updateTags(newTags)
    setIsSaving(false)
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center">
          <Tag className="w-5 h-5 mr-2 text-emerald-500" /> Global Taxonomy
        </h2>
        <div className="flex items-center space-x-3">
          {isSaving && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-mono">
            {activeTags.length} Active Tags
          </span>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Technologies */}
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3">Target Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {TARGET_TECH.map((tag) => {
              const isActive = activeTags.includes(tag)
              return (
                <button 
                  key={tag} 
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 border ${
                    isActive 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* Opportunity Types */}
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3">Opportunity Types</h3>
          <div className="flex flex-wrap gap-2">
            {OPP_TYPES.map((tag) => {
              const isActive = activeTags.includes(tag)
              return (
                <button 
                  key={tag} 
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 border ${
                    isActive 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Send, Loader2, Copy, Check, Sparkles } from 'lucide-react'
import { generateOutreach } from '@/app/actions/ai'

export default function CopilotInterface() {
  const [jobContext, setJobContext] = useState('')
  const [draft, setDraft] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerate = async () => {
    if (!jobContext.trim()) {
      setError("Please paste the job details first.")
      return
    }

    setIsGenerating(true)
    setError('')
    setDraft('')

    // Call the secure Server Action
    const result = await generateOutreach(jobContext)

    if (result.success && result.draft) {
      setDraft(result.draft)
    } else {
      setError(result.error || "Generation failed. Please try again.")
    }

    setIsGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(draft)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Input Terminal */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-emerald-500 flex items-center">
            <Sparkles className="w-3 h-3 mr-2" />
            Llama 3.1 8B Engine Ready
          </span>
        </div>
        <div className="p-4">
          <textarea
            value={jobContext}
            onChange={(e) => setJobContext(e.target.value)}
            placeholder="Paste the job title, company, and key requirements here..."
            className="w-full h-32 bg-transparent text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
            disabled={isGenerating}
          />
        </div>
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jobContext.trim()}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Draft
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Output Terminal */}
      {draft && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl overflow-hidden shadow-lg shadow-emerald-900/10 transition-all">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Generated Output</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center text-xs font-mono"
            >
              {isCopied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          <div className="p-6">
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
              {draft}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
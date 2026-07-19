'use client'

import { useState } from 'react'
import { Send, Bot, User, Sparkles, Loader2, Search, FileText } from 'lucide-react'
import Link from 'next/link' // 1. Added Link import for native routing

export default function CoPilotUI({ resumeContext }: { resumeContext: string }) {
  const [prompt, setPrompt] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [response, setResponse] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsSearching(true)
    setResponse('')
    
    // TEMPORARY: Simulating the backend Agentic Search delay
    setTimeout(() => {
      setResponse("System architecture ready. Awaiting backend web search and Groq API integration to synthesize real-time data against your profile.")
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-6">
      
      {/* Header & Context Status */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Bot className="w-8 h-8 mr-3 text-emerald-500" />
            AI Synthesis Engine
          </h1>
          <p className="text-slate-400 mt-2">Real-time market research tailored to your career stack.</p>
        </div>
        
        {/* 2. Upgraded to a clickable Next.js Link with hover effects */}
        <Link 
          href="/settings"
          title="Click to update your Resume Context"
          className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Context Vector</span>
          <span className={`text-xs font-mono px-2 py-1 rounded flex items-center transition-colors ${
            resumeContext 
              ? 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:bg-amber-500/20'
          }`}>
            <FileText className="w-3 h-3 mr-1.5" />
            {resumeContext ? 'Resume Active' : 'No Resume Found'}
          </span>
        </Link>
      </div>

      {/* Output / Analysis Window */}
      <div className="flex-1 bg-[#0B0F19]/60 border border-slate-800 rounded-2xl p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 shadow-inner">
        {!response && !isSearching ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <Sparkles className="w-10 h-10 text-slate-700" />
            <p>Enter a company, technology, or news topic to synthesize.</p>
            <p className="text-xs">Example: "Find the latest news on Next.js 15 and tell me how it affects my background."</p>
          </div>
        ) : isSearching ? (
          <div className="h-full flex flex-col items-center justify-center text-emerald-500 space-y-4 animate-pulse">
            <Search className="w-8 h-8 animate-bounce" />
            <p>Agentic Web Search Initiated...</p>
            <p className="text-xs text-slate-500">Cross-referencing live market data with your resume context.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-start gap-3 text-slate-400 border-b border-slate-800/50 pb-4">
              <User className="w-5 h-5 shrink-0 text-slate-500" />
              <p>{prompt}</p>
            </div>
            <div className="flex items-start gap-3 text-slate-200 pt-2">
              <Bot className="w-5 h-5 shrink-0 text-emerald-500" />
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className="relative shrink-0">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleGenerate()
            }
          }}
          placeholder="Issue a research command..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-14 py-4 text-sm text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none shadow-lg"
          rows={1}
        />
        <button 
          onClick={handleGenerate}
          disabled={isSearching || !prompt.trim()}
          className="absolute right-2 top-2 p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
      
    </div>
  )
}
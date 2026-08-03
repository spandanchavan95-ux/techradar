'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

// 1. We strictly define the browser event interface to eliminate the 'any' type
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWA() {
  // 2. We explicitly tell TypeScript what kind of data this state will hold
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      // 3. We cast the generic Event to our strict interface
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true) 
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false) 
    }
    setDeferredPrompt(null)
  }

  if (!isInstallable) return null

  return (
    <button 
      onClick={handleInstallClick} 
      className="flex items-center text-xs font-mono bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors shadow-sm ml-4"
    >
      <Download className="w-3 h-3 mr-2" /> 
      Install Desktop App
    </button>
  )
}
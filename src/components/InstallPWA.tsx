'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Listen for the browser's native install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true) // Only show our button if the app is actually installable
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    // Trigger the native browser install modal
    deferredPrompt.prompt()
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false) // Hide button after successful install
    }
    setDeferredPrompt(null)
  }

  // If the app is already installed, or not supported, render nothing
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
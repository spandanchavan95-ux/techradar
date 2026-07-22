'use client'

import { useState, useEffect } from 'react'
import { Zap, ShieldAlert, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdGateway({ isPremium, children }: { isPremium: boolean, children: React.ReactNode }) {
  const [showAd, setShowAd] = useState(false)
  const [timeLeft, setTimeLeft] = useState(5)
  const router = useRouter()

  useEffect(() => {
    // If they are premium, bypass entirely
    if (isPremium) return

    // Check if they already watched the ad this session
    const hasSeenAd = sessionStorage.getItem('hasSeenLaunchAd')
    if (!hasSeenAd) {
      setShowAd(true)
    }
  }, [isPremium])

  useEffect(() => {
    // Handle the 5-second countdown
    if (!showAd || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [showAd, timeLeft])

  const handleClose = () => {
    sessionStorage.setItem('hasSeenLaunchAd', 'true')
    setShowAd(false)
  }

  // If no ad should show, render the app normally
  if (!showAd) return <>{children}</>

  return (
    <div className="fixed inset-0 z-[100] bg-[#050810] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      
      <div className="max-w-md w-full bg-[#0B0F19] border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl">
        
        {/* Progress Bar Background */}
        <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
          />
        </div>

        <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Standard License Delay</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          You are currently using the free core tier. Premium users get instant, ad-free access to zero-delay data feeds.
        </p>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <div className="font-mono text-sm text-slate-300 mb-4">Unlock The Unfair Advantage</div>
          <button 
            onClick={() => {
              handleClose();
              router.push('/premium');
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors text-sm"
          >
            Upgrade for ₹50 / month
          </button>
        </div>

        {/* The 5-Second Gate */}
        <button
          disabled={timeLeft > 0}
          onClick={handleClose}
          className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
            timeLeft > 0 
              ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          {timeLeft > 0 ? (
            <><Lock className="w-4 h-4 mr-2" /> Continue to App in {timeLeft}s...</>
          ) : (
            'Continue to App'
          )}
        </button>

      </div>
    </div>
  )
}
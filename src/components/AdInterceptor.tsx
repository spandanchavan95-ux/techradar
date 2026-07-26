'use client'

import { useState, useEffect } from 'react'
import { checkAdEligibility, logAdImpression } from '@/app/actions/ads'
import { ExternalLink, } from 'lucide-react'

export default function AdInterceptor({ 
  url, 
  isPremium, 
  children 
}: { 
  url: string, 
  isPremium: boolean,
  children: React.ReactNode 
}) {
  const [showModal, setShowModal] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const handleLinkClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    // Premium users instantly bypass the ad system
    if (isPremium) {
      window.open(url, '_blank')
      return
    }

    // Check secure cookies for Free users
    const { showAd } = await checkAdEligibility()

    if (showAd) {
      setShowModal(true)
      setCountdown(5)
    } else {
      window.open(url, '_blank')
    }
  }

  // Handle the 5-second countdown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [showModal, countdown])

  const handleSkipAd = async () => {
    await logAdImpression() // Update secure cookies
    setShowModal(false)
    window.open(url, '_blank') // Continue to target
  }

  return (
    <>
      <div onClick={handleLinkClick} className="cursor-pointer w-full">
        {children}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-[#0B0F19] border border-slate-800 p-8 rounded-2xl max-w-lg w-full text-center shadow-2xl relative">
            <div className="text-slate-400 text-sm font-mono mb-4">Advertisement</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              Unlock Instant Access with Premium Pro
            </h2>
            <p className="text-slate-500 mb-8">
              Free tier data routing is processing. Upgrade to remove all delays and ads from your workspace.
            </p>
            
            {countdown > 0 ? (
              <button disabled className="w-full py-4 rounded-xl bg-slate-800 text-slate-400 font-bold cursor-not-allowed">
                Wait {countdown} seconds to skip...
              </button>
            ) : (
              <button 
                onClick={handleSkipAd}
                className="w-full py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold flex items-center justify-center transition-colors"
              >
                Skip Ad & Continue <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
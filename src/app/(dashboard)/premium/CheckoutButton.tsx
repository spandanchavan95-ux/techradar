'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { upgradeToPremium } from '@/app/actions/premium'

export default function CheckoutButton() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)
    const result = await upgradeToPremium()
    
    if (result.success) {
      setIsSuccess(true)
      // The server action revalidates the page, so Next.js will automatically 
      // refresh the layout to show the VIP dashboard!
    } else {
      alert("Checkout failed.")
      setIsProcessing(false)
    }
  }

  return (
    <button 
      onClick={handleCheckout}
      disabled={isProcessing || isSuccess}
      className={`w-fit px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center ${
        isSuccess 
          ? 'bg-emerald-500 text-slate-950' 
          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-900/20'
      }`}
    >
      {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 
       isSuccess ? <Check className="w-5 h-5 mr-2"/> : null}
       {isSuccess ? "Activated" : "Initiate Subscription →"}
    </button>
  )
}
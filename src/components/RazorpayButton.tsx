'use client'

import { useState } from 'react'
import Script from 'next/script'
import { createRazorpayOrder, verifyPayment } from '@/app/actions/razorpay'
import { Zap, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RazorpayButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)

    // 1. Create order on backend
    const { success, order, error } = await createRazorpayOrder()
    
    if (!success || !order) {
      alert(error || 'Failed to initialize payment')
      setIsLoading(false)
      return
    }

    // 2. Configure Razorpay Popup
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure you add NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local too
      amount: order.amount,
      currency: order.currency,
      name: 'TechRadar',
      description: 'Premium Pro Subscription (1 Month)',
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify payment on success
        const verification = await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        )

        if (verification.success) {
          alert('Payment Successful! Welcome to Premium Pro.')
          router.refresh() // Refresh the page to unlock Premium features
        } else {
          alert('Payment verification failed.')
        }
      },
      theme: {
        color: '#10B981', // Emerald green to match your app
      },
    }

    // Open Razorpay Popup
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
    setIsLoading(false)
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="w-full py-4 mt-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            <Zap className="w-5 h-5 mr-2" />
            Pay ₹50 & Upgrade
          </>
        )}
      </button>
    </>
  )
}
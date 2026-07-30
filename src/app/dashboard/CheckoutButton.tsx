'use client'

import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    // 1. Inject the Razorpay secure script into the browser
    const loadScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })
    }
    
    const res = await loadScript()
    if (!res) {
      alert('Razorpay SDK failed to load. Check your connection.')
      setLoading(false)
      return
    }

    // 2. Configure the payment pop-up
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your public test key
      amount: "5000", // Razorpay calculates in paise (5000 paise = ₹50)
      currency: "INR",
      name: "TechRadar Premium Pro",
      description: "Monthly Automation Power",
      handler: function (response: any) {
        // This runs when the test payment succeeds
        alert("Test Payment Successful! Payment ID: " + response.razorpay_payment_id)
        setLoading(false)
      },
      prefill: {
        name: "Razorpay Reviewer",
        email: "reviewer@techradar.com",
      },
      theme: {
        color: "#10B981" // TechRadar Emerald Green
      }
    }

    // 3. Open the modal
    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
    
    paymentObject.on('payment.failed', function (response: any) {
      alert("Payment Failed: " + response.error.description)
      setLoading(false)
    })
  }

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
    >
      {loading ? 'Loading Gateway...' : 'Upgrade to Premium (₹50/mo)'}
    </button>
  )
}
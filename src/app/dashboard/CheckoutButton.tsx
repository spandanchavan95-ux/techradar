'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // 1. Inject the Razorpay script
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

      // 2. Ask your secure Next.js backend to create an official Order ID
      const orderResponse = await fetch('/api/create-order', { method: 'POST' })
      const orderData = await orderResponse.json()

      if (!orderData.orderId) {
        throw new Error('Failed to create backend order')
      }

      // 3. Configure the physical checkout window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: "5000", 
        currency: "INR",
        name: "Techpulse Premium Pro",
        description: "Monthly Automation Power",
        order_id: orderData.orderId, // Crucial: Links the UI to your backend order
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          
          // 4. The user paid! Now we ask the backend to verify the cryptographic signature
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          })

          const verifyResult = await verifyResponse.json()

          if (verifyResult.success) {
            alert("Payment Verified! Welcome to Premium Pro.")
            // This instantly refreshes the page to hide the checkout button and unlock the app
            router.refresh() 
          } else {
            alert("Payment verification failed. Please contact support.")
          }
          setLoading(false)
        },
        prefill: {
          name: "Razorpay Reviewer",
          email: "reviewer@techpulse.com",
        },
        theme: {
          color: "#10B981" 
        }
      }

      // 4. Open the modal
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment Failed: " + response.error.description)
        setLoading(false)
      })

    } catch (error) {
      console.error(error)
      alert("System failed to initialize payment gateway.")
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
    >
      {loading ? 'Connecting to Bank...' : 'Upgrade to Premium (₹50/mo)'}
    </button>
  )
}
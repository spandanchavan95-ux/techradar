'use server'

import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
})

export async function createRazorpayOrder() {
  try {
    // ₹50 is 5000 paise (Razorpay expects the lowest currency unit)
    const options = {
      amount: 5000, 
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    return { success: true, order }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create payment order' }
  }
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized' }

  // Verify the signature securely on the backend
  const body = razorpay_order_id + "|" + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    .update(body.toString())
    .digest('hex')

  if (expectedSignature === razorpay_signature) {
    // Payment is legit! Upgrade the user in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', user.id)

    if (error) {
      console.error('Database upgrade error:', error)
      return { success: false, error: 'Payment verified, but database update failed.' }
    }

    return { success: true }
  } else {
    return { success: false, error: 'Invalid payment signature' }
  }
}
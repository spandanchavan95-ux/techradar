import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST() {
  try {
    const order = await razorpay.orders.create({
      amount: 5000, // ₹50 is equal to 5000 paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    })
    
    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error("Order creation failed:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
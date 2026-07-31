import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    // 1. Recreate the signature using your hyper-classified secret key
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    // 2. Challenge the signature
    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Fraudulent signature detected" }, { status: 400 })
    }

    // 3. Signature is authentic. Fetch the current logged-in user.
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 4. Unlock the database! Flip the user to Premium Pro.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error("Verification failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
import Link from 'next/link'
import { Radar } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-8 pb-6 border-b border-slate-800">
          <Radar className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl font-bold text-slate-100">Terms of Service</h1>
        </div>
        <div className="space-y-6 text-sm leading-relaxed">
          <p><strong>Last Updated:</strong> July 2026</p>
          <h2 className="text-xl font-semibold text-slate-200 mt-6">1. Acceptance of Terms</h2>
          <p>By accessing and using TechRadar, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
          <h2 className="text-xl font-semibold text-slate-200 mt-6">2. Subscription and Payments</h2>
          <p>TechRadar Premium Pro is billed at ₹50 per month. Payments are processed securely via Razorpay. Subscriptions automatically renew unless canceled before the billing cycle ends. Refunds are handled on a case-by-case basis per our strict refund policy.</p>
          <h2 className="text-xl font-semibold text-slate-200 mt-6">3. User Responsibilities</h2>
          <p>You are responsible for maintaining the security of your Google OAuth login and any data you track within the TechRadar application. We reserve the right to terminate accounts that violate our usage policies.</p>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-800 text-center">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-medium">← Return to Home</Link>
        </div>
      </div>
    </div>
  )
}
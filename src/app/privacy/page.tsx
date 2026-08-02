import Link from 'next/link'
import { Radar } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-8 pb-6 border-b border-slate-800">
          <Radar className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl font-bold text-slate-100">Privacy Policy</h1>
        </div>
        <div className="space-y-6 text-sm leading-relaxed">
          <p><strong>Last Updated:</strong> July 2026</p>
          <h2 className="text-xl font-semibold text-slate-200 mt-6">1. Data Collection</h2>
          <p>We collect your email address and profile information via Google OAuth strictly for authentication purposes. We securely store the career opportunities and notes you manually or automatically log within our Supabase database infrastructure.</p>
          <h2 className="text-xl font-semibold text-slate-200 mt-6">2. Data Usage</h2>
          <p>Your data is used solely to provide the Techpulse service, including generating AI outreach drafts. We do not sell your personal data or career tracking history to third-party data brokers.</p>
          <h2 className="text-xl font-semibold text-slate-200 mt-6">3. Payment Information</h2>
          <p>All payment processing is handled securely by Razorpay. Techpulse does not store your credit card numbers or raw financial data on our servers at any time.</p>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-800 text-center">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-medium">← Return to Home</Link>
        </div>
      </div>
    </div>
  )
}
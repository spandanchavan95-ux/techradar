import Link from 'next/link'
import { Radar, CheckCircle2, XCircle, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Navigation */}
      <header className="w-full py-6 px-8 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Radar className="w-8 h-8 text-emerald-500" />
          <span className="text-xl font-bold tracking-tight">Techpulse</span>
        </div>
        <Link 
          href="/login" 
          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Automate your career <span className="text-emerald-500">pipeline.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-10">
          Stop tracking jobs in spreadsheets. Techpulse uses AI to track your target roles, alert you to market shifts, and draft hyper-targeted outreach in seconds.
        </p>
        <Link 
          href="/login" 
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-lg transition-colors"
        >
          Start Tracking Now
        </Link>
      </main>

      {/* Pricing Section (Razorpay Requirement) */}
      <section className="w-full max-w-5xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Free Core Tier */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Free Core</h3>
            <p className="text-slate-400 mb-6">Standard baseline access.</p>
            <div className="text-4xl font-bold mb-6">₹0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-slate-300">
              <li className="flex items-center gap-3"><XCircle className="w-5 h-5 text-slate-600" /> 6-Hour Data Access Delay</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-700" /> Manual Opportunity Logging</li>
              <li className="flex items-center gap-3 text-slate-500"><XCircle className="w-5 h-5 text-red-900/50" /> AI Outreach Locked</li>
            </ul>
            <Link href="/login" className="w-full block text-center py-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-lg transition-colors">
              Get Started
            </Link>
          </div>

          {/* Premium Pro Tier */}
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2 text-emerald-400">Premium Pro</h3>
            <p className="text-slate-400 mb-6">Full automation power.</p>
            <div className="text-4xl font-bold mb-6">₹50<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-yellow-500" /> Instant Real-Time Data</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Automated Status Sync</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 15 AI Drafts / Day</li>
            </ul>
            <Link href="/login" className="w-full block text-center py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors">
              Upgrade to Premium
            </Link>
          </div>

        </div>
      </section>

      {/* Compliance Footer (Razorpay Requirement) */}
      <footer className="w-full py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>© 2026 Techpulse. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <a href="mailto:support@techpulse.com" className="hover:text-slate-300 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
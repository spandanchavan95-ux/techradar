import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Check, X, Zap, ShieldCheck, Calendar } from 'lucide-react'
import CheckoutButton from './CheckoutButton'

export default async function PremiumHub() {
  const supabase = createClient()
  
  // 1. Get the user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Check their subscription status
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium

  // 3. Calculate the renewal date (30 days from purchase)
  const subDate = new Date(profile?.subscription_date || Date.now())
  subDate.setDate(subDate.getDate() + 30)
  const renewalDate = subDate.toLocaleDateString('en-IN', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  })

  return (
    <main className="p-10 flex flex-col items-center min-h-[80vh]">
      <div className="max-w-5xl w-full space-y-8">
        
        {/* Dynamic Hero Section */}
        {isPremium ? (
          // VIP ACTIVE STATE
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-emerald-900/20 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="z-10 flex flex-col">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheck className="w-10 h-10 text-emerald-500" />
                <h1 className="text-3xl font-bold text-slate-100">Premium Active</h1>
              </div>
              <p className="text-slate-400 max-w-md mb-6">
                Your workspace is completely unlocked. You have zero-delay data feeds, ad-free routing, and full AI Co-Pilot access.
              </p>
              
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-sm bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 w-fit">
                <Calendar className="w-4 h-4 mr-2" />
                Next Billing Cycle: {renewalDate}
              </div>
            </div>

            <div className="z-10 bg-slate-950 border border-slate-800 p-6 rounded-xl text-center min-w-[250px]">
               <span className="block text-slate-400 text-sm mb-2">Current Plan</span>
               <span className="block text-2xl font-bold text-slate-100 mb-4">Premium Pro</span>
               <button disabled className="w-full py-2 bg-slate-800 text-slate-500 font-bold rounded-lg cursor-not-allowed">
                 Active Subscription
               </button>
            </div>
          </div>
        ) : (
          // SALES PITCH STATE (Free Users)
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1 z-10 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-wider rounded-full mb-4 w-max">
                Premium Pro
              </div>
              <h1 className="text-4xl font-bold text-slate-100 mb-4">Gain An Unfair Advantage.</h1>
              <p className="text-slate-400 mb-8 max-w-md">
                Unlock an ad-free workspace, zero-delay data feeds, automated tracking, and your personal AI outreach writer.
              </p>
              
              <div className="flex items-end space-x-2 mb-2">
                <span className="text-5xl font-bold text-slate-100">₹50</span>
                <span className="text-slate-500 mb-1">/ month</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">Cancel anytime. Billed monthly.</p>

              <CheckoutButton />
            </div>

            <div className="w-full md:w-96 bg-slate-950/80 border border-slate-800 rounded-xl p-6 z-10 relative">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl"></div>
               <h3 className="text-slate-300 font-mono text-sm uppercase tracking-wider mb-6">What you unlock instantly</h3>
               <ul className="space-y-4">
                {['100% Ad-Free Experience', 'Instant Access (Zero-Delay)', 'Automated Kanban Tracking', 'Automated Saved Search Alerts', 'AI Co-Pilot (15 Drafts/Day)'].map((feature, i) => (
                  <li key={i} className="flex items-center text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Section: Comparison Table */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="p-5 text-slate-300 font-semibold w-1/3">Clear Product Value</th>
                <th className="p-5 text-slate-300 font-semibold text-center border-l border-slate-800 w-1/3">Free Core</th>
                <th className="p-5 text-emerald-400 font-semibold text-center border-l border-slate-800 w-1/3">
                  <div className="flex flex-col items-center">
                    <span>Premium Pro</span>
                    <span className="text-xs text-emerald-500/60 font-normal mt-1">₹50 / month</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              <tr className="hover:bg-slate-950/30 transition-colors">
                <td className="p-5 text-slate-300">App Launch Experience</td>
                <td className="p-5 text-slate-400 text-center border-l border-slate-800">5-Second Ad</td>
                <td className="p-5 text-slate-300 text-center border-l border-slate-800">Ad-Free</td>
              </tr>
              <tr className="hover:bg-slate-950/30 transition-colors">
                <td className="p-5 text-slate-300">Data Access Latency</td>
                <td className="p-5 text-slate-400 text-center border-l border-slate-800">6-Hour Delay</td>
                <td className="p-5 text-amber-400 text-center border-l border-slate-800 flex items-center justify-center">
                  <Zap className="w-4 h-4 mr-1.5 fill-amber-400" /> Instant Real-Time
                </td>
              </tr>
              <tr className="hover:bg-slate-950/30 transition-colors">
                <td className="p-5 text-slate-300">Opportunity Tracker</td>
                <td className="p-5 text-slate-400 text-center border-l border-slate-800">Manual Logging</td>
                <td className="p-5 text-slate-300 text-center border-l border-slate-800">Automated Status Sync</td>
              </tr>
              <tr className="hover:bg-slate-950/30 transition-colors">
                <td className="p-5 text-slate-300">AI Outreach Assistant</td>
                <td className="p-5 text-red-400 text-center border-l border-slate-800 flex items-center justify-center">
                  <X className="w-4 h-4 mr-1.5" /> Locked
                </td>
                <td className="p-5 text-slate-300 text-center border-l border-slate-800">15 Drafts / Day</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </main>
  )
}
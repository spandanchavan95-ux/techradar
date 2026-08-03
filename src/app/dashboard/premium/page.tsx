import CheckoutButton from './CheckoutButton'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { 
  Shield, Zap, Check, Crosshair, 
  Sparkles, Clock, ShieldCheck, Calendar, X 
} from 'lucide-react'

export default async function PremiumHubPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium || false

  // Set next billing date text
  const billingDate = new Date()
  billingDate.setMonth(billingDate.getMonth() + 1)
  const formattedDate = billingDate.toLocaleDateString('en-GB', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  })

  return (
    <main className="p-4 md:p-10 min-h-[calc(100vh-4rem)] flex flex-col items-center">
      
      {!isPremium && (
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 flex items-center justify-center">
            <Zap className="w-8 h-8 mr-3 text-emerald-500" />
            The Unfair Advantage
          </h1>
          <p className="text-slate-400 text-lg">
            Stop competing with thousands of developers in the slow lane. Unlock zero-delay data feeds and full AI access.
          </p>
        </div>
      )}

      {isPremium ? (
        <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">
          
          <div className="border border-emerald-500/50 rounded-2xl p-8 bg-[#0B0F19] relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
             <div className="space-y-4 max-w-xl">
               <h2 className="text-3xl font-bold text-slate-100 flex items-center">
                 <ShieldCheck className="w-8 h-8 text-emerald-500 mr-3" />
                 Premium Active
               </h2>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Your workspace is completely unlocked. You have zero-delay data feeds, ad-free routing, and full AI Co-Pilot access.
               </p>
               <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-mono font-bold mt-2">
                 <Calendar className="w-4 h-4 mr-2" />
                 Next Billing Cycle: {formattedDate}
               </div>
             </div>

             <div className="bg-[#050810] border border-slate-800 rounded-xl p-6 min-w-[240px] text-center flex flex-col items-center">
               <span className="text-slate-500 text-sm mb-1">Current Plan</span>
               <span className="text-2xl font-bold text-slate-100 mb-4">Premium Pro</span>
               <div className="bg-slate-800/50 text-slate-400 border border-slate-700 px-4 py-2 rounded-lg text-sm font-bold w-full">
                 Active Subscription
               </div>
             </div>
          </div>

          <div className="border border-slate-800 rounded-2xl bg-[#0B0F19] overflow-hidden shadow-xl text-sm md:text-base">
            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900/50 p-6">
               <div className="font-bold text-slate-100">Clear Product Value</div>
               <div className="font-bold text-slate-100 text-center">Free Core</div>
               <div className="font-bold text-emerald-400 text-center flex flex-col items-center">
                  Premium Pro
                  <span className="text-emerald-500/50 text-xs font-normal mt-1">₹50 / month</span>
               </div>
            </div>
            
            <div className="grid grid-cols-3 border-b border-slate-800 p-6 items-center">
               <div className="text-slate-300">App Launch Experience</div>
               <div className="text-slate-500 text-center">5-Second Ad</div>
               <div className="text-slate-200 text-center">Ad-Free</div>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-800 p-6 items-center">
               <div className="text-slate-300">Data Access Latency</div>
               <div className="text-slate-500 text-center">6-Hour Delay</div>
               <div className="text-amber-400 text-center flex justify-center items-center font-medium">
                 <Zap className="w-4 h-4 mr-1.5 fill-amber-400"/> Instant Real-Time
               </div>
            </div>
            
            <div className="grid grid-cols-3 border-b border-slate-800 p-6 items-center">
               <div className="text-slate-300">Opportunity Tracker</div>
               <div className="text-slate-500 text-center">Manual Logging</div>
               <div className="text-slate-200 text-center">Automated Status Sync</div>
            </div>
            
            <div className="grid grid-cols-3 p-6 items-center">
               <div className="text-slate-300">AI Outreach Assistant</div>
               <div className="text-rose-400 text-center flex justify-center items-center">
                 <X className="w-4 h-4 mr-1.5"/> Locked
               </div>
               <div className="text-slate-200 text-center">15 Drafts / Day</div>
            </div>
          </div>
          
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full animate-in fade-in duration-500">
          
          <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-8 flex flex-col relative">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-300">Standard License</h2>
              <div className="mt-2 flex items-baseline text-4xl font-extrabold text-slate-100">
                ₹0<span className="text-lg text-slate-500 font-medium ml-1">/mo</span>
              </div>
            </div>
            
            <ul className="space-y-4 flex-1 mb-8">
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-slate-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-400">6-Hour Delayed Radar Feed</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-5 h-5 text-slate-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-400">Standard Industry Tag Filtering</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-emerald-500/50 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-400">5 Execution Pipeline Slots</span>
              </li>
              <li className="flex items-start">
                <X className="w-5 h-5 text-rose-500/50 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-400">AI Outreach Assistant Locked</span>
              </li>
            </ul>

            <button disabled className="w-full py-3 px-4 bg-slate-800/50 text-slate-500 border border-slate-700 rounded-lg font-bold cursor-not-allowed">
              Downgrade to Standard
            </button>
          </div>

          <div className="bg-[#0B0F19] border-2 border-emerald-500/50 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.05)]">
            
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="mb-6 z-10">
              <h2 className="text-xl font-bold text-emerald-400">Premium Pro</h2>
              <div className="mt-2 flex items-baseline text-4xl font-extrabold text-slate-100">
                ₹50<span className="text-lg text-slate-500 font-medium ml-1">/mo</span>
              </div>
            </div>
            
            <ul className="space-y-4 flex-1 mb-8 z-10">
              <li className="flex items-start">
                <Zap className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-200 font-medium">Instant Real-Time Data Feed</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-200">Ad-Free App Experience</span>
              </li>
              <li className="flex items-start">
                <Crosshair className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-200">Automated Status Sync</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-200">15 AI Outreach Drafts / Day</span>
              </li>
            </ul>

            <div className="z-10">
              {/* This is the crucial line that was causing your crash. 
                  It is now safely pointed to the CheckoutButton wrapper. */}
              <CheckoutButton />
            </div>
            
          </div>

        </div>
      )}

    </main>
  )
}
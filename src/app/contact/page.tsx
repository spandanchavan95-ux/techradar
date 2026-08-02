import Link from 'next/link'
import { Radar, Mail, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-8 pb-6 border-b border-slate-800">
          <Radar className="w-8 h-8 text-emerald-500" />
          <h1 className="text-3xl font-bold text-slate-100">Contact Us</h1>
        </div>
        <div className="space-y-8 text-sm leading-relaxed">
          <p>If you have any questions about your subscription, require technical support, or need to inquire about data privacy, please reach out to our team.</p>
          
          <div className="flex flex-col space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-emerald-500" />
              <div>
                <h3 className="text-slate-100 font-bold text-base">Email Support</h3>
                <a href="mailto:support@techpulse.com" className="text-emerald-400 hover:underline">support@techpulse.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <MapPin className="w-6 h-6 text-emerald-500" />
              <div>
                <h3 className="text-slate-100 font-bold text-base">Registered Address</h3>
                <p className="text-slate-400">Techpulse Inc.<br/>[Insert Your Street Address Here]<br/>[Insert Your City/State/Zip Here]</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-slate-800 text-center">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-medium">← Return to Home</Link>
        </div>
      </div>
    </div>
  )
}
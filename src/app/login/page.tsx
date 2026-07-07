import { login, signup } from '@/app/actions/auth'
import { Radar } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
      <div className="w-full max-w-sm flex flex-col space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-4">
          <Radar className="w-10 h-10 text-emerald-500 mb-2" />
          <h1 className="text-2xl font-bold text-slate-100">Welcome to TechRadar</h1>
          <p className="text-sm text-slate-400">Sign in to track your opportunities.</p>
        </div>

        <form className="flex flex-col w-full space-y-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-100"
              name="email"
              placeholder="developer@example.com"
              required
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-100"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <button
              formAction={login}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              formAction={signup}
              className="w-full py-2.5 bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-colors"
            >
              Create Account
            </button>
          </div>
          
          {searchParams?.message && (
            <p className="mt-4 p-3 bg-red-900/30 border border-red-900 rounded-lg text-red-400 text-center text-sm">
              {searchParams.message}
            </p>
          )}
        </form>

      </div>
    </main>
  )
}
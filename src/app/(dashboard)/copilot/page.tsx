import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CoPilotUI from './CoPilotUI'

export default async function CoPilotPage() {
  const supabase = createClient()

  // 1. Authenticate the User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Extract their secure context vector (The Resume)
  const resumeContext = user.user_metadata?.resume_context || ''

  return (
    <main className="min-h-screen p-10">
      <CoPilotUI resumeContext={resumeContext} />
    </main>
  )
}
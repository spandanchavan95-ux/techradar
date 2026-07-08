'use server'

import { createClient } from '@/utils/supabase/server'
import Groq from 'groq-sdk'

// Initialize the Groq client securely on the backend
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateOutreach(jobContext: string) {
  const supabase = createClient()
  
  // 1. Verify the user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized. Please log in.' }

  // 2. Verify Premium Status (The absolute paywall)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()
    
  if (!profile?.is_premium) {
    return { success: false, error: 'Premium Pro subscription required.' }
  }

  // 3. Enforce the 15-Request Daily Limit securely via the database vault
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to midnight this morning
  
  const { count } = await supabase
    .from('ai_usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('executed_at', today.toISOString()) // Only count logs from today

  if (count !== null && count >= 15) {
    return { success: false, error: 'Daily AI generation limit (15 drafts) reached. Resets at midnight.' }
  }

  // 4. If all security checks pass, fire the LLM
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert technical recruiter and career coach. Draft a professional, highly concise outreach message or cover letter based on the provided job details. Focus on impact and modern software engineering practices. Keep it under 150 words.' 
        },
        { 
          role: 'user', 
          content: jobContext 
        }
      ],
      model: 'llama-3.1-8b-instant', // Targeting the fast Llama 3.1 model
      temperature: 0.7,
    })

    const draft = completion.choices[0]?.message?.content || ''

    // 5. Log the successful usage to Supabase to increment their daily count
    await supabase.from('ai_usage_logs').insert({ user_id: user.id })

    return { success: true, draft }
  } catch (error: any) {
    console.error('Groq API Engine Error:', error)
    return { success: false, error: 'AI generation engine failed to respond.' }
  }
}
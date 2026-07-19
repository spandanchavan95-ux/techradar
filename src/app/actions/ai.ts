'use server'

import { createClient } from '@/utils/supabase/server'
import Groq from 'groq-sdk'

// Initialize the Groq client securely on the backend
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function synthesizeImpact(articleTitle: string, articleSummary: string) {
  const supabase = createClient()
  
  // 1. Verify User Authenticity
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 2. Extract Context Vector (Resume) - NO LONGER BLOCKS IF MISSING
  const resumeContext = user.user_metadata?.resume_context || ''

  // 3. Security: Enforce API Quotas against the ledger
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count: aiUsageCount } = await supabase
    .from('ai_usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', twentyFourHoursAgo)

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium || false
  const dailyLimit = isPremium ? 100 : 15

  if (aiUsageCount !== null && aiUsageCount >= dailyLimit) {
    return { success: false, error: 'Daily AI limit reached. Please upgrade to Premium.' }
  }

  // 4. The Upgraded Macro/Micro Super-Prompt
  const systemPrompt = `You are a visionary tech analyst and career strategist. 
Analyze the provided tech industry update (news, job trend, or technology change) and output a punchy, 2-part analysis:

**🌍 MACRO IMPACT (Industry Level)**
Explain how this news changes the tech ecosystem, what systems or architectures it disrupts, and where the industry is heading because of it.

**🎯 MICRO IMPACT (Personal Level)**
${resumeContext 
  ? "Analyze exactly how the user should adapt based on their specific background provided below. What should they learn? How does it affect their current stack?" 
  : "The user has not provided a resume context. Provide general advice on what a modern developer should learn to leverage this shift."}

Keep the output highly technical, concise, and format it cleanly using the bold headers above. Do not use markdown outside of the headers.`

  const userPrompt = `
INDUSTRY UPDATE:
Title: ${articleTitle}
Summary: ${articleSummary}

${resumeContext ? `USER BACKGROUND:\n${resumeContext}` : ''}`

  try {
    // 5. Fire the Groq API Request
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-8b-instant', 
      temperature: 0.7,
      max_tokens: 600,
    })

    const analysis = completion.choices[0]?.message?.content || 'Analysis failed to generate.'
    
    // 6. Log the usage to enforce the backend paywall limit
    await supabase.from('ai_usage_logs').insert({ user_id: user.id })
    
    return { success: true, analysis }
  } catch (error: any) {
    console.error("Groq Pipeline Error:", error)
    return { success: false, error: 'System failed to connect to the AI Engine.' }
  }
}
'use server'

import { createClient } from '@/utils/supabase/server'
import Groq from 'groq-sdk'

// Initialize the Groq client securely on the backend
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// ==========================================
// FUNCTION 1: LIVE RADAR NEWS SYNTHESIS
// ==========================================
export async function synthesizeImpact(articleTitle: string, articleSummary: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const resumeContext = user.user_metadata?.resume_context || ''

  // Security: Enforce API Quotas against the ledger
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

  const dailyLimit = profile?.is_premium ? 100 : 15

  if (aiUsageCount !== null && aiUsageCount >= dailyLimit) {
    return { success: false, error: 'Daily AI limit reached. Please upgrade to Premium.' }
  }

  const systemPrompt = `You are a visionary tech analyst and career strategist. 
Analyze the provided tech industry update (news, job trend, or technology change) and output a punchy, 2-part analysis:

**🌍 MACRO IMPACT (Industry Level)**
Explain how this news changes the tech ecosystem, what systems or architectures it disrupts, and where the industry is heading because of it.

**🎯 MICRO IMPACT (Personal Level)**
${resumeContext 
  ? "Analyze exactly how the user should adapt based on their specific background provided below. What should they learn? How does it affect their current stack?" 
  : "The user has not provided a resume context. Provide general advice on what a modern developer should learn to leverage this shift."}

Keep the output highly technical, concise, and format it cleanly using the bold headers above. Do not use markdown outside of the headers.`

  const userPrompt = `INDUSTRY UPDATE:\nTitle: ${articleTitle}\nSummary: ${articleSummary}\n\n${resumeContext ? `USER BACKGROUND:\n${resumeContext}` : ''}`

  try {
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
    await supabase.from('ai_usage_logs').insert({ user_id: user.id })
    return { success: true, analysis }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Groq Pipeline Error:", error)
    return { success: false, error: 'System failed to connect to the AI Engine.' }
  }
}
// ==========================================
// FUNCTION 2: TRACKER ACTION PLAN (THE "DRAFTS")
// ==========================================
export async function generateActionPlan(jobTitle: string, company: string, location: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const resumeContext = user.user_metadata?.resume_context || ''

  // 1. Fetch Premium Status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', user.id)
    .single()

  const isPremium = profile?.is_premium || false

  // 2. BLUEPRINT RULE: Lock AI completely for Free Core users
  if (!isPremium) {
    return { success: false, error: 'AI Outreach Assistant is locked on the Free Core tier. Upgrade to Premium Pro to unlock.' }
  }

  // 3. BLUEPRINT RULE: Cap Premium users at 15 Drafts / Day
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count: aiUsageCount } = await supabase
    .from('ai_usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', twentyFourHoursAgo)

  if (aiUsageCount !== null && aiUsageCount >= 15) {
    return { success: false, error: 'Maximum daily limit of 15 AI drafts reached. Resets in 24 hours.' }
  }

  const systemPrompt = `You are a ruthless, highly technical career strategist. 
The user is targeting an opportunity and needs a tactical outreach strategy. 
Write a highly targeted, cold outreach message (for LinkedIn or Email) they can send to a recruiter or hiring manager at the target company. 
Rules:
1. Do not use generic filler (e.g., "I hope this email finds you well").
2. Keep it under 150 words.
3. Output ONLY the email/message text. No conversational filler from the AI.`

  const userPrompt = `
TARGET OPPORTUNITY:
Role/Item: ${jobTitle}
Company: ${company}
Location/Type: ${location}

${resumeContext 
  ? `USER BACKGROUND:\n${resumeContext}\nConnect their specific tech stack to the target opportunity.` 
  : `The user has not provided a resume context. Write a clean, professional, generic outreach email asking for an initial chat to learn more about the role.`}`

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-8b-instant', 
      temperature: 0.6,
      max_tokens: 300,
    })

    const plan = completion.choices[0]?.message?.content || 'Action Plan failed to generate.'
    
    // Log the usage to track the 15/day limit
    await supabase.from('ai_usage_logs').insert({ user_id: user.id })
    
    return { success: true, plan }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Groq Pipeline Error:", error)
    return { success: false, error: 'System failed to connect to the AI Engine.' }
  }
}
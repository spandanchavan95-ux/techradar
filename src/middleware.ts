import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Run the Supabase Auth database guard
  const response = await updateSession(request)

  // 2. Ad-Gating Security: Stamp the initial visit time if it doesn't exist
  if (!request.cookies.has('app_init_time')) {
    // Record the exact millisecond they arrived
    response.cookies.set('app_init_time', Date.now().toString(), {
      httpOnly: true, // Hides it from browser DevTools
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // Expires in 24 hours
    })
    
    // Initialize their session ad count to 0
    response.cookies.set('session_ad_count', '0', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24
    })
    
    // Initialize the last ad shown timer to 0
    response.cookies.set('last_ad_time', '0', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
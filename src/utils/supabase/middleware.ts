import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Fetch the user
  const { data: { user } } = await supabase.auth.getUser()

  // SECURITY GUARD:
  // If there is no user, and they are trying to access ANY route EXCEPT 
  // the public landing page (/), the login page (/login), or legal pages
  if (
    !user &&
    request.nextUrl.pathname !== '/' &&
    request.nextUrl.pathname !== '/login' &&
    request.nextUrl.pathname !== '/terms' &&
    request.nextUrl.pathname !== '/privacy' &&
    request.nextUrl.pathname !== '/contact' &&
    !request.nextUrl.pathname.startsWith('/auth') // Allow auth callbacks to process
  ) {
    // Kick them to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If there IS a user, and they try to go to the login page or landing page, 
  // route them directly into the app so they don't have to log in again.
  if (user && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // Assuming your main app is at /dashboard
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
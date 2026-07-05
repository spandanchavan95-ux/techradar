import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Database check temporarily bypassed so we can build the UI
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
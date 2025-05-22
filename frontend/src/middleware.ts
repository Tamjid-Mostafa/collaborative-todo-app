import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Secret must match what you used in NestJS backend
const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  console.log({req});
  console.log({token});
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    console.log({payload});
    // Optional: You could add payload data to request headers
    return NextResponse.next()
  } catch (error) {
    console.log({error});
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
}

export const config = {
  matcher: ['/todos/:path*', '/dashboard/:path*'], // protect any route you want
}

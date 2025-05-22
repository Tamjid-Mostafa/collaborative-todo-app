'use server'

import { cookies } from 'next/headers'

const ACCESS_TOKEN_KEY = 'access_token'

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: ACCESS_TOKEN_KEY,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value || null
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY)
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/require-auth'
import { LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

const BodySchema = z.object({
  locale: z.enum(SUPPORTED_LOCALES),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const locale: Locale = parsed.data.locale

  // If authenticated, persist to user_preferences
  try {
    const auth = await requireAuth()
    if (auth.user && auth.supabase) {
      await auth.supabase
        .from('user_preferences')
        .upsert({ user_id: auth.user.id, locale }, { onConflict: 'user_id' })
    }
  } catch {
    // Cookie setting still succeeds below for unauthenticated users
  }

  const response = NextResponse.json({ data: { locale } })
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  })
  return response
}

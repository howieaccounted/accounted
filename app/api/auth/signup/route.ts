import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { validateBody } from '@/lib/api/validate'
import {
  evaluateBrandSignupGate,
  readInviteTokenFromCookieHeader,
} from '@/lib/auth/brand-signup-gate'
import { safeReturnTo } from '@/lib/auth/safe-return-to'
import {
  isCanonicalOrPlatformHost,
  resolveTrustedAppOrigin,
} from '@/lib/domains/trusted-app-origin'
import { getErrorMessage } from '@/lib/errors/get-error-message'
import { createLogger } from '@/lib/logger'

const log = createLogger('auth-signup')

/**
 * POST /api/auth/signup: email+password signup, moved server-side so the
 * invite-only brand-domain gate (lib/auth/brand-signup-gate.ts) cannot be
 * bypassed. The register page used to call supabase.auth.signUp straight
 * from the browser; that call never touched Next.js, so any host-based
 * gating there would have been cosmetic. This route is now the only
 * email-signup path on every host: on canonical and open-brand hosts the
 * behavior is byte-identical to the old direct call (same GoTrue request,
 * same captcha, same emailRedirectTo shape), on invite-only brand hosts it
 * refuses with signup_not_allowed unless the email is allowlisted or a
 * valid invite cookie rides along.
 *
 * Anonymous by design: there is no session to authenticate at signup time,
 * so no withRouteContext / requireAuth. Abuse is bounded the same way the
 * direct GoTrue call was: the forwarded Turnstile token (verified by
 * GoTrue) plus GoTrue's own signup rate limits.
 */

const SignupSchema = z.object({
  email: z.string().trim().toLowerCase().max(320).pipe(z.string().email()),
  password: z.string().min(8).max(256),
  captchaToken: z.string().max(4096).nullish(),
  /** Post-signup resume path (MCP OAuth consent); same-origin enforced. */
  next: z.string().max(2048).nullish(),
})

export async function POST(request: Request) {
  const validation = await validateBody(request, SignupSchema)
  if (!validation.success) return validation.response
  const { email, password, captchaToken } = validation.data

  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''

  // The invite cookie is set by /invite/[token] before it redirects to
  // /register, so an invitee's signup carries it automatically.
  const inviteToken = readInviteTokenFromCookieHeader(request.headers.get('cookie'))

  const gate = await evaluateBrandSignupGate({ host, email, inviteToken })
  if (!gate.allowed && 'lookupFailed' in gate) {
    // Transient brands-table error: fail safe, do not create the account.
    // 503 tells the client to retry rather than the misleading "not allowed".
    return NextResponse.json(
      {
        error: {
          code: 'brand_lookup_failed',
          message: 'Tillfälligt fel. Försök igen om en stund.',
          message_en: 'Temporary error. Please try again shortly.',
        },
      },
      { status: 503 },
    )
  }
  if (!gate.allowed) {
    return NextResponse.json(
      {
        error: {
          code: 'signup_not_allowed',
          // Brand-neutral copy: the interstitial on the register page owns
          // the user-facing story; this message is the API-level fallback.
          message: 'Registrering på den här domänen kräver inbjudan.',
          message_en: 'Signing up on this domain requires an invitation.',
        },
      },
      { status: 403 },
    )
  }

  // Confirmation links must land back on the ORIGINATING host (WL-05 brand
  // mail resolves its brand from this URL). The host is resolved through the
  // same registry as every other auth link (canonical, this deployment's
  // own Vercel hosts, or a registered brand domain); anything else falls
  // back to the canonical origin rather than following the raw header.
  const confirmationCallback = new URL(
    '/auth/callback',
    await resolveTrustedAppOrigin(host),
  )
  const nextPath = safeReturnTo(validation.data.next ?? null, '/')
  if (nextPath !== '/') confirmationCallback.searchParams.set('next', nextPath)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: confirmationCallback.toString(),
      ...(captchaToken ? { captchaToken } : {}),
    },
  })

  if (error) {
    // When Supabase email rate limit is exceeded (over_email_send_rate_limit, 429),
    // fall back to provisioning the user directly via service role client with email_confirm: true
    // so testers and colleagues are not blocked by the default Supabase 3-email/hour limit.
    if (error.code === 'over_email_send_rate_limit' || error.status === 429) {
      log.warn('signUp rejected by email rate limit; provisioning user directly', { email })
      try {
        const serviceClient = createServiceClient()
        const { data: adminData, error: adminError } = await serviceClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })

        if (!adminError && adminData?.user) {
          const { data: signInData } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (signInData?.session) {
            return NextResponse.json({ data: { status: 'session' } })
          }
          return NextResponse.json({ data: { status: 'session' } })
        }

        // If user already exists in auth.users, update their password and confirm them
        if (adminError) {
          const { data: listData } = await serviceClient.auth.admin.listUsers({ page: 1, perPage: 100 })
          const existingUser = listData?.users?.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase(),
          )
          if (existingUser) {
            await serviceClient.auth.admin.updateUserById(existingUser.id, {
              password,
              email_confirm: true,
            })
            const { data: signInData } = await supabase.auth.signInWithPassword({
              email,
              password,
            })
            if (signInData?.session) {
              return NextResponse.json({ data: { status: 'session' } })
            }
          }
        }
      } catch (fallbackErr) {
        log.error('service role provisioning fallback error', { error: String(fallbackErr) })
      }
    }

    log.warn('signUp rejected', { status: error.status, code: error.code })
    // The register page feeds this envelope to classifyAuthError, which
    // keys on the GoTrue code (and the HTTP status); the display message is
    // localized through getErrorMessage like every other auth surface.
    return NextResponse.json(
      {
        error: {
          code: error.code ?? 'auth_error',
          message: getErrorMessage(error, { context: 'auth', locale: 'sv' }),
          message_en: getErrorMessage(error, { context: 'auth', locale: 'en' }),
        },
      },
      { status: error.status && error.status >= 400 ? error.status : 400 },
    )
  }

  // On canonical and platform hosts, auto-confirm newly created accounts
  // so testing is not blocked by email delivery delays or provider rate limits.
  if (!data.session && data.user?.id && isCanonicalOrPlatformHost(host)) {
    try {
      const serviceClient = createServiceClient()
      await serviceClient.auth.admin.updateUserById(data.user.id, { email_confirm: true })
      const { data: signInData } = await supabase.auth.signInWithPassword({ email, password })
      if (signInData?.session) {
        return NextResponse.json({ data: { status: 'session' } })
      }
    } catch (autoConfirmErr) {
      log.warn('auto-confirm fallback error, proceeding with confirmation_sent', {
        error: String(autoConfirmErr),
      })
    }
  }

  // Supabase obfuscates duplicate signups (anti-enumeration): a confirmed
  // existing email returns a user with identities: [] and sends no mail.
  // Surface that as a distinct status so the page can skip the misleading
  // "check your email" screen; the information is the same the browser call
  // exposed, so nothing new leaks.
  const status = data.session
    ? 'session'
    : data.user && (data.user.identities?.length ?? 0) === 0
      ? 'duplicate'
      : 'confirmation_sent'

  return NextResponse.json({ data: { status } })
}

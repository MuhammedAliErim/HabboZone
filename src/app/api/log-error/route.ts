import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const { allowed, resetIn } = checkRateLimit(getRateLimitKey(request), 60)
  if (!allowed) {
    return NextResponse.json({ error: 'Çok fazla istek. Lütfen bekleyin.' }, {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(resetIn / 1000)) },
    })
  }

  try {
    const body = await request.json()
    const { action, level, message, details, user_id } = body

    if (!action || !message) {
      return NextResponse.json({ error: 'action and message are required' }, { status: 400 })
    }

    const supabase = await createClient()
    await supabase.from('logs').insert({
      action,
      details: { level: level || 'error', message, ...(details || {}) },
      user_id: user_id || null,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    await logger.error('api_log_error', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

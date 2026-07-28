import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
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
    console.error('log-error route failed:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

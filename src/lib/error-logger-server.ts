import { createClient } from '@/utils/supabase/server'

export async function logError(action: string, message: string, details?: Record<string, unknown>): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from('logs').insert({
      action,
      details: { level: 'error', message, ...(details || {}) },
    })
  } catch {
    // fail silently
  }
}

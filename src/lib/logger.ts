import { createClient } from '@/utils/supabase/server'

type LogLevel = 'info' | 'warn' | 'error'

export interface LogEntry {
  action: string
  level: LogLevel
  message: string
  details?: Record<string, unknown>
  user_id?: string | null
}

function format(level: LogLevel, entry: LogEntry): string {
  return JSON.stringify({
    ts: new Date().toISOString(),
    level,
    action: entry.action,
    message: entry.message,
    ...(entry.details ? { details: entry.details } : {}),
  })
}

export function logConsole(entry: LogEntry): void {
  const line = format(entry.level, entry)
  if (entry.level === 'error') console.error(line)
  else if (entry.level === 'warn') console.warn(line)
  else console.log(line)
}

export async function log(entry: LogEntry): Promise<void> {
  logConsole(entry)

  if (process.env.NODE_ENV !== 'production') return

  try {
    const supabase = await createClient()
    await supabase.from('logs').insert({
      action: entry.action,
      details: { level: entry.level, message: entry.message, ...(entry.details || {}) },
      user_id: entry.user_id || null,
    })
  } catch {
    // never let logging crash the app
  }
}

export const logger = {
  info: (action: string, message: string, details?: Record<string, unknown>) =>
    log({ action, level: 'info', message, details }),
  warn: (action: string, message: string, details?: Record<string, unknown>) =>
    log({ action, level: 'warn', message, details }),
  error: (action: string, message: string, details?: Record<string, unknown>) =>
    log({ action, level: 'error', message, details }),
}

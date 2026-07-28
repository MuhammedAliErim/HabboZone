const isDev = process.env.NODE_ENV === 'development'

export function logErrorClient(action: string, message: string, details?: Record<string, unknown>): void {
  if (isDev) {
    console.error(`[client] ${action}:`, message, details || '')
    return
  }

  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, message, details }),
  }).catch(() => {})
}

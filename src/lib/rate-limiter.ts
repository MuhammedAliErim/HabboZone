type Window = { count: number; resetAt: number }

const store = new Map<string, Window>()

const FIFTEEN_MIN_MS = 15 * 60 * 1000

export function checkRateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = FIFTEEN_MIN_MS,
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: record.resetAt - now }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count, resetIn: record.resetAt - now }
}

interface HeaderContainer {
  headers: { get: (key: string) => string | null }
}

export function getRateLimitKey(request: HeaderContainer): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return ip
}

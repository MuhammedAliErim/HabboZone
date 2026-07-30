import { checkRateLimit, getRateLimitKey } from '../rate-limiter';

describe('checkRateLimit', () => {
  it('allows first request', () => {
    const result = checkRateLimit('test-ip', 3, 1000)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('blocks after max requests', () => {
    const key = `block-test-${Date.now()}`
    checkRateLimit(key, 2, 5000)
    checkRateLimit(key, 2, 5000)
    const result = checkRateLimit(key, 2, 5000)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('resets after window expires', async () => {
    const key = `reset-test-${Date.now()}`
    checkRateLimit(key, 1, 100)
    expect(checkRateLimit(key, 1, 100).allowed).toBe(false)
    await new Promise(r => setTimeout(r, 150))
    expect(checkRateLimit(key, 1, 100).allowed).toBe(true)
  })

  it('tracks remaining count', () => {
    const key = `remaining-test-${Date.now()}`
    expect(checkRateLimit(key, 5, 5000).remaining).toBe(4)
    expect(checkRateLimit(key, 5, 5000).remaining).toBe(3)
    expect(checkRateLimit(key, 5, 5000).remaining).toBe(2)
  })
})

describe('getRateLimitKey', () => {
  it('extracts IP from x-forwarded-for', () => {
    const headers = new Map([['x-forwarded-for', '192.168.1.1, 10.0.0.1']])
    const req = { headers: { get: (k: string) => headers.get(k) ?? null } } as unknown as Request
    expect(getRateLimitKey(req)).toBe('192.168.1.1')
  })

  it('returns unknown when no header', () => {
    const req = { headers: { get: () => null } } as unknown as Request
    expect(getRateLimitKey(req)).toBe('unknown')
  })
})

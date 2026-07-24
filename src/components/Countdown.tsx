'use client'

import { useState, useEffect } from 'react'

export default function Countdown({ 
  targetDate, 
  onExpire 
}: { 
  targetDate: string
  onExpire?: () => void 
}) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (onExpire) {
          onExpire()
        }
        return true // expired
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      })
      return false // not expired
    }

    // Run immediately once
    const isExpired = updateTimer()
    
    if (isExpired) return

    const interval = setInterval(() => {
      const expired = updateTimer()
      if (expired) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onExpire])

  if (!timeLeft) {
    return <span className="opacity-0">Yükleniyor...</span>
  }

  // If expired, maybe return nothing or a "00:00" state
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span>Şimdi! Lütfen sayfayı yenileyin.</span>
  }

  return (
    <span className="font-mono tabular-nums tracking-tight">
      {timeLeft.days > 0 && `${timeLeft.days}g `}
      {timeLeft.hours.toString().padStart(2, '0')}:
      {timeLeft.minutes.toString().padStart(2, '0')}:
      {timeLeft.seconds.toString().padStart(2, '0')}
    </span>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

interface NumberTickerProps {
  value: number
  className?: string
  delay?: number
}

/** Animates a number counting up from 0 to `value` once it scrolls into view. */
export function NumberTicker({ value, className, delay = 0 }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => motionValue.set(value), delay * 1000)
    return () => clearTimeout(timeout)
  }, [isInView, value, delay, motionValue])

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(Math.round(latest))
      }
    })
  }, [springValue])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      0
    </span>
  )
}

'use client'

import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
}

/**
 * A thin light beam that travels around the border of a `relative` parent.
 * Parent needs `position: relative` and `overflow-hidden` (rounded corners optional).
 */
export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = '#c9a84c',
  colorTo = '#f5e6b8',
}: BorderBeamProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={cn(
          'absolute aspect-square animate-border-beam rounded-full',
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--beam-duration': `${duration}s`,
            '--beam-delay': `${-delay}s`,
            background: `linear-gradient(90deg, transparent, ${colorFrom}, ${colorTo}, transparent)`,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

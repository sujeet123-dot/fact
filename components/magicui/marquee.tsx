import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  duration?: number
}

/** Infinite horizontal scroller — duplicates children so the loop is seamless. */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = 30,
}: MarqueeProps) {
  return (
    <div
      className={cn('group flex overflow-hidden', className)}
      style={{ '--marquee-duration': `${duration}s`, '--marquee-gap': '3rem' } as React.CSSProperties}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            'flex shrink-0 items-center gap-12 pr-12 animate-marquee',
            reverse && 'direction-reverse',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
          style={reverse ? { animationDirection: 'reverse' } : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
  once?: boolean
}

/** Reveals children with a blur+fade+rise as they scroll into view. */
export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.5,
  yOffset = 12,
  once = true,
}: BlurFadeProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ y: yOffset, opacity: 0, filter: 'blur(6px)' }}
      animate={inView ? { y: 0, opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

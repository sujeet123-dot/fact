'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface TextGenerateEffectProps {
  words: string
  className?: string
  wordClassName?: string
}

/** Reveals a sentence word-by-word as it scrolls into view. */
export function TextGenerateEffect({ words, className, wordClassName }: TextGenerateEffectProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const wordList = words.split(' ')

  return (
    <span ref={ref} className={cn(className)}>
      {wordList.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
          className={cn('inline-block', wordClassName)}
        >
          {word}
          {i < wordList.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  )
}

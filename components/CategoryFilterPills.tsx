'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'

const VERDICTS = ['true', 'false', 'mixture', 'unproven', 'satire', 'outdated']

export default function CategoryFilterPills({ cat, activeVerdict }: { cat: string; activeVerdict?: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(activeVerdict)

  const go = (verdict?: string) => {
    setPending(verdict)
    router.push(verdict ? `/category/${cat}?verdict=${verdict}` : `/category/${cat}`)
  }

  const options = [{ value: undefined, label: 'All' }, ...VERDICTS.map((v) => ({ value: v, label: v }))]

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 mr-2">Filter:</span>
      {options.map((opt) => {
        const isActive = pending === opt.value
        return (
          <button
            key={opt.label}
            onClick={() => go(opt.value)}
            className={`relative px-3 py-1 text-xs font-semibold uppercase tracking-wide capitalize transition-colors ${
              isActive ? 'text-white' : 'border border-stone-300 text-stone-500 hover:border-stone-600 hover:text-stone-700'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="verdict-pill"
                className="absolute inset-0 bg-[#0c0c0b]"
                transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

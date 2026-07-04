'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { motion } from 'motion/react'
import VerdictBadge from './VerdictBadge'
import { BorderBeam } from './magicui/border-beam'
import { Verdict } from '@/lib/models/Fact'

interface FactCardProps {
  fact: {
    _id: string
    title: string
    slug: string
    claim: string
    verdict: Verdict
    summary: string
    category: string
    author: string
    viewCount: number
    createdAt: string
    imageUrl?: string
  }
  variant?: 'default' | 'featured' | 'compact' | 'lead'
}

export default function FactCard({ fact, variant = 'default' }: FactCardProps) {
  const meta = (
    <p className="text-[11px] text-stone-400 mt-2 uppercase tracking-wide">
      {fact.author} &nbsp;·&nbsp; {format(new Date(fact.createdAt), 'MMM d, yyyy')}
    </p>
  )

  /* ── Compact: sidebar list item ── */
  if (variant === 'compact') {
    return (
      <Link href={`/fact/${fact.slug}`} className="flex items-start gap-2.5 py-3 border-b border-stone-100 hover:bg-stone-50 px-2 rounded transition-colors group last:border-0">
        <VerdictBadge verdict={fact.verdict} size="sm" />
        <p className="text-sm text-stone-800 group-hover:text-[#c9a84c] line-clamp-2 leading-snug transition-colors">{fact.title}</p>
      </Link>
    )
  }

  /* ── Lead: full-width hero story ── */
  if (variant === 'lead') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="relative border-t-2 border-[#0c0c0b] pt-4"
      >
        <BorderBeam size={160} duration={10} />
        <Link href={`/fact/${fact.slug}`} className="group block">
          <div className="flex items-center gap-2 mb-3">
            <VerdictBadge verdict={fact.verdict} size="md" />
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">{fact.category}</span>
          </div>
          <h2 className="font-serif font-black text-[#0c0c0b] text-3xl md:text-4xl leading-tight group-hover:text-[#c9a84c] transition-colors line-clamp-3">
            {fact.title}
          </h2>
          <p className="mt-3 text-stone-600 text-base leading-relaxed line-clamp-3 max-w-2xl">{fact.summary}</p>
          {meta}
        </Link>
      </motion.div>
    )
  }

  /* ── Featured: dark editorial card ── */
  if (variant === 'featured') {
    return (
      <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="relative h-full bg-[#0c0c0b] overflow-hidden">
        <BorderBeam size={120} duration={9} colorFrom="#c9a84c" colorTo="#f5e6b8" />
        <Link href={`/fact/${fact.slug}`} className="group block p-6 h-full hover:bg-stone-900/60 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <VerdictBadge verdict={fact.verdict} size="sm" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{fact.category}</span>
          </div>
          <h3 className="font-serif font-bold text-white text-xl leading-snug group-hover:text-stone-200 transition-colors line-clamp-3">
            {fact.title}
          </h3>
          <p className="mt-2 text-stone-400 text-sm leading-relaxed line-clamp-2">{fact.summary}</p>
          <p className="text-[11px] text-stone-600 mt-3 uppercase tracking-wide">
            {fact.author} · {format(new Date(fact.createdAt), 'MMM d, yyyy')}
          </p>
        </Link>
      </motion.div>
    )
  }

  /* ── Default: standard story card ── */
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link href={`/fact/${fact.slug}`} className="group block border-t border-[#ddd9d2] pt-4 pb-4 hover:bg-stone-50 px-1 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <VerdictBadge verdict={fact.verdict} size="sm" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{fact.category}</span>
        </div>
        <h3 className="font-serif font-bold text-[#0c0c0b] text-base leading-snug group-hover:text-[#c9a84c] transition-colors line-clamp-2">
          {fact.title}
        </h3>
        <p className="text-sm text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">{fact.summary}</p>
        {meta}
      </Link>
    </motion.div>
  )
}

import Link from 'next/link'
import VerdictBadge from './VerdictBadge'
import { Verdict } from '@/lib/models/Fact'

interface TrendingFact {
  _id: string
  title: string
  slug: string
  verdict: Verdict
  viewCount: number
  category: string
}

export default function TrendingSidebar({ facts }: { facts: TrendingFact[] }) {
  return (
    <aside>
      <div className="section-rule mb-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#0c0c0b] whitespace-nowrap">
          Trending
        </h2>
      </div>
      <div className="border-t-2 border-[#0c0c0b]">
        {facts.map((fact, i) => (
          <Link
            key={fact._id}
            href={`/fact/${fact.slug}`}
            className="flex items-start gap-3 py-4 border-b border-[#ddd9d2] hover:bg-stone-50 group transition-colors px-1"
          >
            <span className="font-serif font-black text-2xl text-stone-200 leading-none w-6 shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0c0c0b] group-hover:text-[#c9a84c] line-clamp-2 leading-snug transition-colors">
                {fact.title}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <VerdictBadge verdict={fact.verdict} size="sm" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link href="/search" className="block mt-4 text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-[#0c0c0b] transition-colors">
        All fact checks →
      </Link>
    </aside>
  )
}

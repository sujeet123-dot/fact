import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import FactCard from '@/components/FactCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ cat: string }>
  searchParams: Promise<{ page?: string; verdict?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params
  const name = cat.charAt(0).toUpperCase() + cat.slice(1)
  return { title: `${name} Fact Checks`, description: `All fact checks in ${name}.` }
}

const VERDICTS = ['true', 'false', 'mixture', 'unproven', 'satire', 'outdated']
const CATEGORY_ICONS: Record<string, string> = {
  politics: '🏛️', health: '🏥', science: '🔬',
  technology: '💻', entertainment: '🎬', environment: '🌍',
}

async function getData(cat: string, page: number, verdict?: string) {
  await connectDB()
  const query: Record<string, unknown> = { category: cat.toLowerCase() }
  if (verdict) query.verdict = verdict
  const limit = 12
  const skip = (page - 1) * limit
  const [facts, total] = await Promise.all([
    Fact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-content').lean(),
    Fact.countDocuments(query),
  ])
  return { facts, total, pages: Math.ceil(total / limit) }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { cat } = await params
  const { page: pageStr, verdict } = await searchParams
  const page = parseInt(pageStr || '1')
  const { facts, total, pages } = await getData(cat, page, verdict)
  const catName = cat.charAt(0).toUpperCase() + cat.slice(1)
  const icon = CATEGORY_ICONS[cat.toLowerCase()] || '📋'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="border-b-2 border-[#0c0c0b] pb-5 mb-8">
        <nav className="flex items-center gap-2 text-xs text-stone-400 uppercase tracking-wide font-semibold mb-4">
          <Link href="/" className="hover:text-[#c0392b] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-stone-600">{catName}</span>
        </nav>
        <div className="flex items-end gap-4">
          <span className="text-4xl">{icon}</span>
          <div>
            <h1 className="font-serif font-black text-[#0c0c0b] text-4xl leading-none">{catName}</h1>
            <p className="text-stone-400 text-sm mt-1">{total} fact check{total !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Verdict filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 mr-2">Filter:</span>
        <Link
          href={`/category/${cat}`}
          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide border transition-colors ${!verdict ? 'bg-[#0c0c0b] text-white border-[#0c0c0b]' : 'border-stone-300 text-stone-500 hover:border-stone-600 hover:text-stone-700'}`}
        >
          All
        </Link>
        {VERDICTS.map((v) => (
          <Link
            key={v}
            href={`/category/${cat}?verdict=${v}`}
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide border capitalize transition-colors ${verdict === v ? 'bg-[#0c0c0b] text-white border-[#0c0c0b]' : 'border-stone-300 text-stone-500 hover:border-stone-600 hover:text-stone-700'}`}
          >
            {v}
          </Link>
        ))}
      </div>

      {facts.length === 0 ? (
        <div className="text-center py-24 border-t-2 border-[#0c0c0b]">
          <p className="font-serif text-2xl text-stone-400 mb-2">No results</p>
          <p className="text-sm text-stone-400">Try a different filter or check back later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
            {facts.map((fact) => (
              <FactCard
                key={String(fact._id)}
                fact={{ ...fact, _id: String(fact._id), createdAt: fact.createdAt.toISOString() } as any}
              />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12 border-t border-[#ddd9d2] pt-8">
              {page > 1 && (
                <Link
                  href={`/category/${cat}?page=${page - 1}${verdict ? `&verdict=${verdict}` : ''}`}
                  className="px-4 py-2 border border-stone-300 text-sm text-stone-600 hover:border-stone-600 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-stone-400">Page {page} of {pages}</span>
              {page < pages && (
                <Link
                  href={`/category/${cat}?page=${page + 1}${verdict ? `&verdict=${verdict}` : ''}`}
                  className="px-4 py-2 border border-stone-300 text-sm text-stone-600 hover:border-stone-600 transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

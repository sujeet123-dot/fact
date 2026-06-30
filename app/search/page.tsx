import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import FactCard from '@/components/FactCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export const metadata: Metadata = {
  title: 'Search Fact Checks',
  description: 'Search through fact-checked claims on FactBrief.',
}

async function search(q: string, page: number) {
  await connectDB()
  const limit = 12
  const skip = (page - 1) * limit

  if (!q.trim()) {
    const [facts, total] = await Promise.all([
      Fact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-content').lean(),
      Fact.countDocuments(),
    ])
    return { facts, total }
  }

  const query = { $text: { $search: q } }
  const [facts, total] = await Promise.all([
    Fact.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip).limit(limit).select('-content').lean(),
    Fact.countDocuments(query),
  ])
  return { facts, total }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1')
  const { facts, total } = await search(q, page)
  const pages = Math.ceil(total / 12)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b-2 border-[#0c0c0b] pb-6 mb-8">
        <h1 className="font-serif font-black text-[#0c0c0b] text-3xl mb-5">
          {q ? `Results for "${q}"` : 'All Fact Checks'}
        </h1>
        <form method="GET" action="/search" className="flex gap-0 max-w-xl">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search claims, topics, people..."
            className="flex-1 px-4 py-2.5 border border-stone-300 border-r-0 text-sm focus:outline-none focus:border-stone-600 bg-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0c0c0b] text-white text-sm font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </form>
        {q && (
          <p className="mt-3 text-xs text-stone-400 uppercase tracking-wide">
            {total} result{total !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {facts.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-stone-400 mb-2">No results for "{q}"</p>
          <p className="text-sm text-stone-400 mb-6">Try different keywords or browse by topic.</p>
          <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-[#c0392b] transition-colors">
            ← Back to homepage
          </Link>
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
                <Link href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="px-4 py-2 border border-stone-300 text-sm text-stone-600 hover:border-stone-600 transition-colors">
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-stone-400">Page {page} of {pages}</span>
              {page < pages && (
                <Link href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="px-4 py-2 border border-stone-300 text-sm text-stone-600 hover:border-stone-600 transition-colors">
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

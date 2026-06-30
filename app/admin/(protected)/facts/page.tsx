import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import VerdictBadge from '@/components/VerdictBadge'
import DeleteButton from '@/components/admin/DeleteButton'
import Link from 'next/link'
import { format } from 'date-fns'
import { Verdict } from '@/lib/models/Fact'

interface PageProps {
  searchParams: Promise<{ page?: string; verdict?: string; category?: string }>
}

async function getData(page: number, verdict?: string, category?: string) {
  await connectDB()
  const limit = 15
  const skip = (page - 1) * limit
  const query: Record<string, unknown> = {}
  if (verdict) query.verdict = verdict
  if (category) query.category = category
  const [facts, total] = await Promise.all([
    Fact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-content').lean(),
    Fact.countDocuments(query),
  ])
  return { facts, total, pages: Math.ceil(total / limit) }
}

export default async function AdminFactsPage({ searchParams }: PageProps) {
  const { page: pageStr, verdict, category } = await searchParams
  const page = parseInt(pageStr || '1')
  const { facts, total, pages } = await getData(page, verdict, category)

  const buildUrl = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v) })
    const s = sp.toString()
    return `/admin/facts${s ? `?${s}` : ''}`
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Fact Checks</h1>
          <p className="text-gray-500 text-sm">{total} total</p>
        </div>
        <Link href="/admin/facts/new" className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
          + New Fact Check
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {['true', 'false', 'mixture', 'unproven', 'satire', 'outdated'].map((v) => (
          <Link
            key={v}
            href={buildUrl({ verdict: verdict === v ? undefined : v, category })}
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-colors ${verdict === v ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
          >
            {v}
          </Link>
        ))}
        {verdict && (
          <Link href={buildUrl({ category })} className="px-3 py-1 rounded-full text-xs text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
            Clear ✕
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide">Verdict</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Views</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {facts.map((fact) => (
              <tr key={String(fact._id)} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {fact.isFeatured && <span title="Featured" className="text-yellow-400 text-xs">⭐</span>}
                    {fact.isTrending && <span title="Trending" className="text-orange-400 text-xs">🔥</span>}
                    <span className="font-medium text-gray-900 line-clamp-1 max-w-xs">{fact.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <VerdictBadge verdict={fact.verdict as Verdict} size="sm" />
                </td>
                <td className="px-4 py-3 hidden md:table-cell capitalize text-gray-600">{fact.category}</td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell whitespace-nowrap">
                  {format(new Date(fact.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{fact.viewCount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/fact/${fact.slug}`} target="_blank" className="text-xs text-gray-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors">View</Link>
                    <Link href={`/admin/facts/${fact.slug}/edit`} className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors font-medium">Edit</Link>
                    <DeleteButton slug={fact.slug} title={fact.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {facts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📋</p>
            <p>No fact checks yet. <Link href="/admin/facts/new" className="text-blue-700 hover:underline">Create one.</Link></p>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {page > 1 && <Link href={buildUrl({ page: String(page - 1), verdict, category })} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-blue-400">← Prev</Link>}
          <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {pages}</span>
          {page < pages && <Link href={buildUrl({ page: String(page + 1), verdict, category })} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-blue-400">Next →</Link>}
        </div>
      )}
    </div>
  )
}

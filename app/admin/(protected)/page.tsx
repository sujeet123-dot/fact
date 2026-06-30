import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import Category from '@/lib/models/Category'
import VerdictBadge from '@/components/VerdictBadge'
import Link from 'next/link'
import { format } from 'date-fns'
import { Verdict } from '@/lib/models/Fact'

async function getStats() {
  await connectDB()
  const [totalFacts, totalCategories, verdictCounts, recentFacts] = await Promise.all([
    Fact.countDocuments(),
    Category.countDocuments(),
    Fact.aggregate([{ $group: { _id: '$verdict', count: { $sum: 1 } } }]),
    Fact.find().sort({ createdAt: -1 }).limit(5).select('title slug verdict category createdAt viewCount').lean(),
  ])
  return { totalFacts, totalCategories, verdictCounts, recentFacts }
}

const VERDICT_COLORS: Record<string, string> = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-red-100 text-red-700',
  mixture: 'bg-amber-100 text-amber-700',
  unproven: 'bg-gray-100 text-gray-600',
  satire: 'bg-purple-100 text-purple-700',
  outdated: 'bg-blue-100 text-blue-700',
}

export default async function AdminDashboard() {
  const { totalFacts, totalCategories, verdictCounts, recentFacts } = await getStats()
  const totalViews = recentFacts.reduce((sum: number, f: any) => sum + (f.viewCount || 0), 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Overview of your fact-checking operation</p>
        </div>
        <Link href="/admin/facts/new" className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
          + New Fact Check
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Fact Checks', value: totalFacts, icon: '✅', color: 'border-blue-200 bg-blue-50' },
          { label: 'Categories', value: totalCategories, icon: '🗂️', color: 'border-purple-200 bg-purple-50' },
          { label: 'Views (recent 5)', value: totalViews.toLocaleString(), icon: '👁️', color: 'border-green-200 bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl border p-5 ${stat.color}`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-black text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Verdict Breakdown</h2>
          <div className="space-y-2.5">
            {verdictCounts.map((v: { _id: string; count: number }) => (
              <div key={v._id} className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${VERDICT_COLORS[v._id] || 'bg-gray-100 text-gray-600'}`}>
                  {v._id.toUpperCase()}
                </span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.round((v.count / totalFacts) * 100)}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700 w-6 text-right">{v.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Fact Checks</h2>
            <Link href="/admin/facts" className="text-xs text-blue-700 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentFacts.map((fact: any) => (
              <div key={String(fact._id)} className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium truncate">{fact.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{format(new Date(fact.createdAt), 'MMM d, yyyy')}</p>
                </div>
                <VerdictBadge verdict={fact.verdict as Verdict} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

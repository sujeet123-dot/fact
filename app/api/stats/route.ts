import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import Category from '@/lib/models/Category'

export async function GET() {
  try {
    await connectDB()
    const [totalFacts, totalCategories, verdictCounts, recentFacts] = await Promise.all([
      Fact.countDocuments(),
      Category.countDocuments(),
      Fact.aggregate([{ $group: { _id: '$verdict', count: { $sum: 1 } } }]),
      Fact.find().sort({ createdAt: -1 }).limit(5).select('title slug verdict category createdAt').lean(),
    ])
    return NextResponse.json({ totalFacts, totalCategories, verdictCounts, recentFacts })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

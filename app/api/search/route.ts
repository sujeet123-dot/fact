import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!q) return NextResponse.json({ facts: [], total: 0 })

    const skip = (page - 1) * limit
    const query = { $text: { $search: q } }

    const [facts, total] = await Promise.all([
      Fact.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      Fact.countDocuments(query),
    ])

    return NextResponse.json({ facts, total, query: q })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

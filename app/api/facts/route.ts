import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const verdict = searchParams.get('verdict')
    const trending = searchParams.get('trending')
    const featured = searchParams.get('featured')
    const skip = (page - 1) * limit

    const query: Record<string, unknown> = {}
    if (category) query.category = category.toLowerCase()
    if (verdict) query.verdict = verdict
    if (trending === 'true') query.isTrending = true
    if (featured === 'true') query.isFeatured = true

    const [facts, total] = await Promise.all([
      Fact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      Fact.countDocuments(query),
    ])

    return NextResponse.json({
      facts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch facts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const fact = await Fact.create(body)
    return NextResponse.json(fact, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

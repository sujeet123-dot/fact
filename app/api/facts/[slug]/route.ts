import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()
    const { slug } = await params
    const fact = await Fact.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean()

    if (!fact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(fact)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch fact' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()
    const { slug } = await params
    const body = await req.json()
    const fact = await Fact.findOneAndUpdate({ slug }, body, { new: true, runValidators: true })
    if (!fact) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(fact)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()
    const { slug } = await params
    await Fact.findOneAndDelete({ slug })
    return NextResponse.json({ message: 'Deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

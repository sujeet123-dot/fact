import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/lib/models/Category'
import Fact from '@/lib/models/Fact'

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find().sort({ name: 1 }).lean()
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const category = await Category.create(body)
    return NextResponse.json(category, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

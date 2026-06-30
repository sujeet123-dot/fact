import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, GIF are allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
    }

    // Convert file to base64 data URI for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'factbrief',
      resource_type: 'image',
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

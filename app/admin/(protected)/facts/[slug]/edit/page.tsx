import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import FactForm from '@/components/admin/FactForm'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  return { title: `Edit: ${slug}` }
}

export default async function EditFactPage({ params }: PageProps) {
  await connectDB()
  const { slug } = await params
  const fact = await Fact.findOne({ slug }).lean()
  if (!fact) notFound()

  const initialData = {
    slug: fact.slug,
    title: fact.title,
    claim: fact.claim,
    verdict: fact.verdict,
    category: fact.category,
    summary: fact.summary,
    content: fact.content,
    tags: fact.tags,
    author: fact.author,
    sources: fact.sources,
    imageUrl: fact.imageUrl || '',
    isTrending: fact.isTrending,
    isFeatured: fact.isFeatured,
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/facts" className="text-sm text-gray-500 hover:text-blue-700">← Back to Facts</Link>
        <h1 className="text-2xl font-black text-gray-900 mt-2">Edit Fact Check</h1>
        <p className="text-gray-500 text-sm truncate">{fact.title}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <FactForm mode="edit" initialData={initialData as any} />
      </div>
    </div>
  )
}
